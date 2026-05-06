import * as Toggle from "@radix-ui/react-toggle"
import { cn } from "@/lib/utils"
import * as React from "react"

const TogglePrimitive = React.forwardRef<
    React.ElementRef<typeof Toggle.Root>,
    React.ComponentPropsWithoutRef<typeof Toggle.Root> & {
        variant?: "default" | "outline"
        size?: "default" | "sm" | "lg"
    }
>(({ className, variant, size, ...props }, ref) => (
    <Toggle.Root
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
            {
                "bg-transparent": variant === "outline",
                "h-10 px-3": size === "default",
                "h-9 px-2.5": size === "sm",
                "h-11 px-5": size === "lg",
            },
            className
        )}
        {...props}
    />
))

TogglePrimitive.displayName = Toggle.Root.displayName

export { TogglePrimitive as Toggle }
