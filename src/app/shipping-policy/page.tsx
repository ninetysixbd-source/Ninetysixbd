import { Truck, MapPin, Clock, CreditCard, ShieldCheck } from "lucide-react"

export default function ShippingPolicyPage() {
    return (
        <div className="container py-12 md:py-20 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-center uppercase tracking-wide">Shipping Policy</h1>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                <div className="bg-muted/30 p-8 rounded-xl border border-border">
                    <p className="lead text-xl text-center font-medium">
                        At <span className="font-bold text-black dark:text-white">NinetysixBD</span>, we are committed to delivering your products safely and on time anywhere in Bangladesh.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xl font-bold text-black dark:text-white">
                            <MapPin className="h-6 w-6 text-red-600" />
                            <h3>Delivery Coverage</h3>
                        </div>
                        <p className="text-muted-foreground">
                            We deliver to all districts across Bangladesh. Wherever you are, we've got you covered.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xl font-bold text-black dark:text-white">
                            <Truck className="h-6 w-6 text-red-600" />
                            <h3>Delivery Partner</h3>
                        </div>
                        <p className="text-muted-foreground">
                            All our products are mainly shipped through <span className="font-semibold text-foreground">Pathao Courier Service</span>, ensuring fast and reliable delivery.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold border-b pb-2">
                        <Clock className="h-6 w-6" />
                        <h2>Delivery Time</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-card p-6 rounded-lg shadow-sm border">
                            <h4 className="font-bold text-lg mb-2">Inside Dhaka</h4>
                            <p className="text-3xl font-bold text-red-600">1-2 <span className="text-sm font-normal text-muted-foreground">working days</span></p>
                        </div>
                        <div className="bg-white dark:bg-card p-6 rounded-lg shadow-sm border">
                            <h4 className="font-bold text-lg mb-2">Outside Dhaka</h4>
                            <p className="text-3xl font-bold text-red-600">2-3 <span className="text-sm font-normal text-muted-foreground">working days</span></p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold border-b pb-2">
                        <CreditCard className="h-6 w-6" />
                        <h2>Delivery Charge</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg">
                            <span className="font-medium text-lg">Inside Dhaka</span>
                            <span className="font-bold text-2xl">৳80</span>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg">
                            <span className="font-medium text-lg">Outside Dhaka</span>
                            <span className="font-bold text-2xl">৳130</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded">
                        * Delivery charges may vary depending on product size, weight, or location.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-2xl font-bold border-b pb-2">
                        <ShieldCheck className="h-6 w-6" />
                        <h2>Important Information</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="border-l-4 border-black pl-4 py-2">
                            <h4 className="font-bold mb-1">Order Processing</h4>
                            <p className="text-muted-foreground">Orders are processed and dispatched within 24 hours after confirmation.</p>
                        </div>
                        <div className="border-l-4 border-black pl-4 py-2">
                            <h4 className="font-bold mb-1">Tracking</h4>
                            <p className="text-muted-foreground">Once your order is shipped, you will receive a tracking ID to check the status of your delivery.</p>
                        </div>
                        <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/10">
                            <h4 className="font-bold mb-1 text-red-700 dark:text-red-400">Delivery Responsibility</h4>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80">
                                Customers are requested to provide accurate address and contact details. NinetysixBD will not be responsible for delayed delivery due to incorrect information or unavoidable courier issues.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
