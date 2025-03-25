"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2 } from "lucide-react"
import { uploadVideo } from "@/lib/video-service"
import { toast } from "sonner"

interface UploadVideoDialogProps {
  onUploadComplete: () => Promise<void>
  onFeedRefresh?: () => Promise<void>
}

export function UploadVideoDialog({ onUploadComplete, onFeedRefresh }: UploadVideoDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if file is a video
    if (!selectedFile.type.startsWith("video/")) {
      toast.error("Please select a video file")
      return
    }

    // Check file size (2GB limit)
    if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
      toast.error("File size must be less than 2GB")
      return
    }

    setFile(selectedFile)

    // Create a preview URL
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Get video duration
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      setDuration(video.duration)
      
      if (video.duration > 30) {
        toast.info("Only the first 30 seconds of the video will be uploaded")
      }
    }
    video.src = objectUrl

    // Clean up the preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setUploading(true)

    try {
      // Upload the video
      const { videoId } = await uploadVideo(file, title, description)
      
      toast.success("Video uploaded successfully!")
      setOpen(false)
      
      // Reset form
      setFile(null)
      setPreview(null)
      setTitle("")
      setDescription("")
      setDuration(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Refresh profile
      await onUploadComplete()
      
      // Refresh feed if callback is provided
      if (onFeedRefresh) {
        await onFeedRefresh()
      }
    } catch (error) {
      console.error("Error uploading video:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload video. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Upload a video to share with your followers. Videos longer than 30 seconds will be trimmed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="video" className="text-sm font-medium">
              Video File
            </label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {preview && (
              <video
                src={preview}
                className="w-full rounded-md"
                controls
                style={{ maxHeight: "200px" }}
              />
            )}
            {duration && duration > 30 && (
              <p className="text-sm text-yellow-600">
                Note: Only the first 30 seconds of this video will be uploaded
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 