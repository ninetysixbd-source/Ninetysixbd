"use client"

import { useState } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FileUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
}

export function FileUpload({ value, onChange }: FileUploadProps) {
    const [uploading, setUploading] = useState(false)

    const handleRemove = (url: string) => {
        onChange(value.filter((current) => current !== url))
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
            const formData = new FormData()
            validFiles.forEach(file => {
                formData.append('files', file)
            })

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const text = await response.text()
            let data
            try {
                data = JSON.parse(text)
            } catch (e) {
                console.error("Failed to parse response:", text)
                throw new Error("Server returned invalid response (possibly 500/404)")
            }

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            const { urls } = data
            onChange([...value, ...urls])
            toast.success(`${validFiles.length} image(s) uploaded successfully`)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : 'Upload failed')
        } finally {
            setUploading(false)
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
                                src={url}
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
