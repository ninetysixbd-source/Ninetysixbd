import { z } from "zod"

export const checkoutSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(11, "Phone number must be at least 11 digits"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    district: z.string().min(2, "District is required"),
    upazila: z.string().min(2, "Area/Thana is required"),
    zipCode: z.string().min(4, "Zip code is required"),
    paymentMethod: z.enum(["COD", "BKASH", "CARD"]),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
