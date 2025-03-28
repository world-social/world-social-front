"use client"
import { MiniKit } from "@worldcoin/minikit-js"
import { useEffect, useState } from "react"
import { Login } from "../components/auth/login"
import { WorldcoinLogo } from "@/components/ui/worldcoin-logo"
export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    try {
      const installed = MiniKit?.isInstalled?.()
      setIsInstalled(installed || false)
    } catch (error) {
      console.error("Error checking MiniKit:", error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-purple-100">Sign in with your Worldcoin wallet</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
            <WorldcoinLogo size={48} />
          </div>
          {/* <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
            </div>
          </div> */}

          <Login />
        </div>
      </div>
    </div>
  )
}

