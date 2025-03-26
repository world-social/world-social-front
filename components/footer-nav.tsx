import { Home, User, Upload } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UploadVideoDialog } from "./upload-video-dialog"

export function FooterNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t">
      <div className="flex items-center justify-around p-2">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-colors",
            pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>

        <UploadVideoDialog>
          <button className="flex flex-col items-center p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors">
            <Upload className="h-6 w-6" />
            <span className="text-xs">Upload</span>
          </button>
        </UploadVideoDialog>

        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-colors",
            pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
} 