"use client"

import { useState } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import imageCompression from "browser-image-compression"
import { useUploadThing } from "@/lib/uploadthing-hooks"
import { getAdminPreviewUrl } from "@/lib/imagekit"
import { deleteFileAction } from "@/app/actions/file-actions"

interface FileUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
}

export function FileUpload({ value, onChange }: FileUploadProps) {
    const [uploading, setUploading] = useState(false)

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            if (res) {
                const urls = res.map((file) => file.ufsUrl)
                onChange([...value, ...urls])
                toast.success(`${res.length} image(s) uploaded successfully`)
            }
            setUploading(false)
        },
        onUploadError: (error) => {
            console.error("Upload error:", error)
            toast.error(error.message || "Upload failed")
            setUploading(false)
        },
    })

    const handleRemove = async (url: string) => {
        onChange(value.filter((current) => current !== url))
        
        try {
            const result = await deleteFileAction(url)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Image deleted from storage")
            }
        } catch (error) {
            console.error("Failed to delete file from storage", error)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // Validate files
        const validFiles = Array.from(files).filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`)
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 5MB)`)
                return false
            }
            return true
        })

        if (validFiles.length === 0) return

        setUploading(true)

        try {
            // Compress images before upload
            const compressedFiles = await Promise.all(
                validFiles.map(async (file) => {
                    const options = {
                        maxSizeMB: 0.5, // Target size max 500KB
                        maxWidthOrHeight: 1200, // 1200px is enough for product images
                        useWebWorker: true,
                        fileType: 'image/webp' as const, // Convert to WebP (25-35% smaller)
                    }
                    try {
                        const compressed = await imageCompression(file, options)
                        // Convert back to File with .webp extension for UploadThing
                        const webpName = file.name.replace(/\.[^.]+$/, '.webp')
                        return new File([compressed], webpName, { type: 'image/webp' })
                    } catch (error) {
                        console.error('Error compressing image:', error)
                        return file // Fallback to original
                    }
                })
            )

            await startUpload(compressedFiles)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : 'Upload failed')
            setUploading(false)
        } finally {
            // Reset input
            e.target.value = ''
        }
    }

    return (
        <div className="space-y-4 w-full">
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {value.map((url) => (
                        <div key={url} className="relative aspect-square rounded-md overflow-hidden border">
                            <div className="absolute right-1 top-1 z-10">
                                <Button
                                    type="button"
                                    onClick={() => handleRemove(url)}
                                    variant="destructive"
                                    size="icon"
                                    className="h-6 w-6"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <Image
                                fill
                                src={getAdminPreviewUrl(url)}
                                alt="Upload"
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            <div className="w-full">
                <label
                    htmlFor="file-upload"
                    className={cn(
                        "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors",
                        uploading
                            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    )}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-3" />
                        ) : (
                            <Upload className="h-10 w-10 text-gray-400 mb-3" />
                        )}
                        <p className="mb-2 text-sm text-gray-700 font-medium">
                            {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB (max 5 files)
                        </p>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>
        </div>
    )
}
