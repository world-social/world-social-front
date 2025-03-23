"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import { uploadVideo } from "@/lib/video-service"

interface UploadVideoProps {
  onUploadComplete: (videoId: string) => void
  onCancel: () => void
}

export function UploadVideo({ onUploadComplete, onCancel }: UploadVideoProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if file is a video
    if (!selectedFile.type.startsWith("video/")) {
      alert("Please select a video file")
      return
    }

    setFile(selectedFile)

    // Create a preview URL
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Clean up the preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 500)

      // Upload the video
      const { videoId } = await uploadVideo(file)

      // Clear the interval
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Notify parent component
      onUploadComplete(videoId)
    } catch (error) {
      console.error("Error uploading video:", error)
      alert("Failed to upload video. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    onCancel()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!preview ? (
            <div
              className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to select a video or drag and drop</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
            </div>
          ) : (
            <div className="relative">
              <video src={preview} className="w-full aspect-[9/16] object-cover rounded-md" controls />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => {
                  URL.revokeObjectURL(preview)
                  setPreview(null)
                  setFile(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a description to your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="trending, viral, etc."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={uploading}
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

