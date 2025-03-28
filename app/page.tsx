"use client"
import { MiniKit } from "@worldcoin/minikit-js"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { WorldcoinLogo } from "@/components/ui/worldcoin-logo"
import ConnectWallet from "./connect-wallet.tsx/page"
import VerifyWorldID from "./verify-world-id/page"
import { SignUpForm } from "@/components/auth/signup-form"
import HomePage from "./home-page/page"
export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [verified, setVerified] = useState(false)
  const [registered, setRegistered] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    try {
      const installed = MiniKit?.isInstalled?.()
      setIsInstalled(installed || false)
    } catch (error) {
      console.error("Error checking MiniKit:", error)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.address) {
      setWalletConnected(true);
      console.log("User authenticated:", session.user);
    }
  }, [session, status]);

  const handleWalletConnected = () => {
    setWalletConnected(true);
    console.log("Wallet connected");
  };

  const handleVerificationSuccess = () => {
    setVerified(true);
    console.log("Verification success callback triggered");
  };

  const handleRegistrationSuccess = () => {
    setRegistered(true);
    console.log("Registration success callback triggered");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* <div className="text-center mb-8">
          <h1 className="text-purple-100">Sign in with your Worldcoin wallet</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
            <WorldcoinLogo size={48} />
        </div> */}

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
    // </div>
  )
}

