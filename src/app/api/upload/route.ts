import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { supabase } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!supabase) {
            console.error("Supabase client not initialized. Missing environment variables.")
            return NextResponse.json({ error: "Storage configuration missing" }, { status: 500 })
        }

        const formData = await request.formData()
        const files = formData.getAll("files") as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 })
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `products/${fileName}`

            // Convert File to ArrayBuffer then to Buffer
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, buffer, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.error('Upload error:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            uploadedUrls.push(publicUrl)
        }

        return NextResponse.json({ urls: uploadedUrls })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Upload failed" },
            { status: 500 }
        )
    }
}
