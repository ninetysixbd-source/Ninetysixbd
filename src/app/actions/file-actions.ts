"use server"

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase-client"
import { UTApi } from "uploadthing/server"

export async function deleteFileAction(url: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        if (url.includes("supabase.co")) {
            if (!supabase) return { error: "Supabase not configured" }
            const urlObj = new URL(url)
            // Example Supabase URL: https://[PROJECT_REF].supabase.co/storage/v1/object/public/product-images/products/filename.ext
            const pathParts = urlObj.pathname.split('/public/product-images/')
            if (pathParts.length === 2) {
                const filePath = pathParts[1]
                const { error } = await supabase.storage
                    .from('product-images')
                    .remove([filePath])
                
                if (error) throw error
                return { success: true }
            }
        } else if (url.includes("ufs.sh") || url.includes("utfs.io")) {
            const urlObj = new URL(url)
            const fileKey = urlObj.pathname.split('/').pop()
            if (fileKey) {
                const utapi = new UTApi()
                await utapi.deleteFiles(fileKey)
                return { success: true }
            }
        }
        
        return { success: true }
    } catch (error) {
        console.error("Error deleting file:", error)
        return { error: "Failed to delete file" }
    }
}
