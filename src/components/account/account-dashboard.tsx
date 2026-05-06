"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { User, Package, MapPin, Settings, LogOut, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateUserAddress, updateUserProfile } from "@/app/actions/user-actions"
import { cancelOrder } from "@/app/actions/order-actions"

interface AccountDashboardProps {
    user: any // Typed properly in real app
    orders: any[]
}

export function AccountDashboard({ user, orders }: AccountDashboardProps) {
    const [activeTab, setActiveTab] = useState("dashboard")
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Address Form State
    const [presentAddress, setPresentAddress] = useState(user.presentAddress || "")
    const [permanentAddress, setPermanentAddress] = useState(user.permanentAddress || "")

    // Profile Form State
    const [name, setName] = useState(user.name || "")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleLogout = async () => {
        await signOut({ redirect: false })
        router.push("/")
        router.refresh()
    }

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const res = await updateUserAddress(user.id, { presentAddress, permanentAddress })
        setIsLoading(false)
        if (res.success) {
            toast.success("Addresses updated successfully")
        } else {
            toast.error("Failed to update addresses")
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        setIsLoading(true)
        const res = await updateUserProfile(user.id, { name, password })
        setIsLoading(false)
        if (res.success) {
            toast.success("Profile updated successfully")
            setPassword("")
            setConfirmPassword("")
        } else {
            toast.error("Failed to update profile")
        }
    }

    const MenuItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors rounded-md",
                activeTab === id
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-black"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    )

    return (
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
                <div className="p-4 mb-4 border rounded-md bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                            {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    <MenuItem id="dashboard" icon={Home} label="Dashboard" />
                    <MenuItem id="orders" icon={Package} label="Orders" />
                    <MenuItem id="addresses" icon={MapPin} label="Addresses" />
                    <MenuItem id="account" icon={Settings} label="Account Details" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 transition-colors rounded-md hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeTab === "dashboard" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                            <p className="text-muted-foreground">
                                Hello <span className="font-semibold text-black">{user.name}</span> (not {user.name}? <button onClick={handleLogout} className="underline hover:text-black">Log out</button>)
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                From your account dashboard you can view your <button onClick={() => setActiveTab("orders")} className="underline text-black">recent orders</button>, manage your <button onClick={() => setActiveTab("addresses")} className="underline text-black">shipping and billing addresses</button>, and <button onClick={() => setActiveTab("account")} className="underline text-black">edit your password and account details</button>.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="p-6 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="text-2xl font-bold">{orders.length}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="p-6 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Recent Order</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="text-2xl font-bold">
                                        {orders[0] ? `#${orders[0].orderNumber || orders[0].id.slice(0, 8)}` : "N/A"}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                            <p className="text-muted-foreground">View your order history.</p>
                        </div>
                        <div className="border rounded-md">
                            {orders.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    You haven't placed any orders yet.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <p className="font-semibold text-sm">Order #{order.orderNumber || order.id.slice(0, 8)}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                <p className="text-sm mt-1">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                        order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                                            order.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                                                                order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                                                    "bg-yellow-100 text-yellow-700"
                                                    )}>
                                                        {order.status === "PENDING" ? "NOT CONFIRMED" : order.status}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">Tk. {Number(order.totalAmount).toFixed(2)}</p>
                                                <p className="text-xs text-muted-foreground">{order.items?.length || 0} items</p>
                                                {order.status === "PENDING" && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="mt-2 h-7 text-xs"
                                                        onClick={async () => {
                                                            if (confirm("Are you sure you want to cancel this order?")) {
                                                                const res = await cancelOrder(order.id)
                                                                if (res.success) toast.success("Order cancelled")
                                                                else toast.error("Failed to cancel")
                                                            }
                                                        }}
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "addresses" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Addresses</h2>
                            <p className="text-muted-foreground">Manage your billing and shipping addresses.</p>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Address Book</CardTitle>
                                <CardDescription>Update your present and permanent addresses.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateAddress} className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="present-address">Present Address</Label>
                                            <Textarea
                                                id="present-address"
                                                placeholder="Enter your present address..."
                                                value={presentAddress}
                                                onChange={(e) => setPresentAddress(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="permanent-address">Permanent Address</Label>
                                            <Textarea
                                                id="permanent-address"
                                                placeholder="Enter your permanent address..."
                                                value={permanentAddress}
                                                onChange={(e) => setPermanentAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Saving..." : "Save Addresses"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "account" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Account Details</h2>
                            <p className="text-muted-foreground">Update your personal information and password.</p>
                        </div>
                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                value={user.email}
                                                disabled
                                                className="bg-muted"
                                            />
                                            <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium">Password Change</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    )
}
