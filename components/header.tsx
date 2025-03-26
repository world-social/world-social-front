import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm border-b border-border/40">
      <div className="container flex items-center justify-between h-12 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/icon.svg" alt="WorldSocial" width={24} height={24} />
          <span className="font-bold text-lg">WorldSocial</span>
        </Link>
      </div>
    </header>
  )
} 