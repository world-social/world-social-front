"use client"
import { MiniKit } from "@worldcoin/minikit-js"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { WorldcoinLogo } from "@/components/ui/worldcoin-logo"
import ConnectWallet from "./connect-wallet.tsx/page"
import VerifyWorldID from "./verify-world-id/page"
import { SignUpForm } from "@/components/auth/signup-form"
import HomePage from "./home-page/page"

// Create an extended user interface that includes address
interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  address?: string | null
}

// Extend the session interface to use our custom user type
interface ExtendedSession {
  user?: ExtendedUser
  expires: string
}

export default function Home() {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null) // null = loading
  const [isInstallingMiniKit, setIsInstallingMiniKit] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [verified, setVerified] = useState(false)
  const [registered, setRegistered] = useState(false)
  const { data: session, status } = useSession() as { data: ExtendedSession | null, status: string }

  useEffect(() => {
    let mounted = true
    let checkInterval: NodeJS.Timeout | null = null

    const initializeMiniKit = async () => {
      setIsInstallingMiniKit(true)

      try {
        // Attempt to install MiniKit if needed
        if (typeof MiniKit?.install === "function") {
          MiniKit.install(process.env.NEXT_PUBLIC_MINIKIT_APP_ID)
          console.log("MiniKit installation initiated")
        }

        // Wait a bit for installation to complete
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check if MiniKit is installed in intervals
        let attempts = 0
        const maxAttempts = 10

        const checkInstallation = () => {
          attempts++
          console.log(`Checking MiniKit installation (attempt ${attempts})`)

          try {
            const installed = MiniKit?.isInstalled?.()
            if (mounted) {
              if (installed) {
                console.log("MiniKit successfully installed")
                setIsInstalled(true)
                setIsInstallingMiniKit(false)
                if (checkInterval) clearInterval(checkInterval)
              } else if (attempts >= maxAttempts) {
                console.warn(`MiniKit not installed after ${maxAttempts} attempts`)
                setIsInstalled(false)
                setIsInstallingMiniKit(false)
                if (checkInterval) clearInterval(checkInterval)
              }
            }
          } catch (error) {
            console.error("Error checking MiniKit:", error)
            if (attempts >= maxAttempts && mounted) {
              setIsInstalled(false)
              setIsInstallingMiniKit(false)
              if (checkInterval) clearInterval(checkInterval)
            }
          }
        }

        // Start periodic checking
        checkInstallation() // Check immediately
        checkInterval = setInterval(checkInstallation, 1000) // Then check every second
      } catch (error) {
        console.error("Error during MiniKit initialization:", error)
        if (mounted) {
          setIsInstalled(false)
          setIsInstallingMiniKit(false)
        }
      }
    }

    initializeMiniKit()

    return () => {
      mounted = false
      if (checkInterval) clearInterval(checkInterval)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.address) {
      setWalletConnected(true)
      console.log("User authenticated:", session.user)
    }
  }, [session, status])

  const handleWalletConnected = () => {
    setWalletConnected(true)
    console.log("Wallet connected")
  }

  const handleVerificationSuccess = () => {
    setVerified(true)
    console.log("Verification success callback triggered")
  }

  const handleRegistrationSuccess = () => {
    setRegistered(true)
    console.log("Registration success callback triggered")
  }

  // Loading state while checking MiniKit installation
  if (isInstalled === null || isInstallingMiniKit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <WorldcoinLogo size={48} />
            </div>
            <h2 className="text-xl font-semibold mb-4">Initializing Worldcoin</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
            <p className="mt-4 text-gray-600">Please wait while we connect to Worldcoin...</p>
          </div>
        </div>
      </div>
    )
  }

  // MiniKit failed to install
  if (isInstalled === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <WorldcoinLogo size={48} />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Connection Error</h2>
            <p className="mb-4 text-gray-600">
              Could not connect to Worldcoin. Please ensure you're using the Worldcoin app or refresh the page to try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {!walletConnected ? (
          <ConnectWallet connectWalletCallback={handleWalletConnected} />
        ) : !verified ? (
          <VerifyWorldID onVerificationSuccess={handleVerificationSuccess} />
        ) : !registered ? (
          <SignUpForm onRegistered={handleRegistrationSuccess} />
        ) : (
          <HomePage />
        )}
      </div>
    </div>
  )
}