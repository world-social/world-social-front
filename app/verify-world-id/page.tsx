"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js"
import { WorldcoinLogo } from "../../components/ui/worldcoin-logo"
import { Loader2, ShieldCheck } from "lucide-react"

export default function VerifyWorldID() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const router = useRouter()

  const handleVerificationSuccess = async () => {
    if (isVerifying) return

    if (!MiniKit.isInstalled()) {
      setVerificationError("World App is not installed")
      return
    }

    try {
      setIsVerifying(true)
      setVerificationError(null)

      const verifyPayload: VerifyCommandInput = {
        action: process.env.NEXT_PUBLIC_WLD_ACTION_ID || "web3-template",
        signal: "",
        verification_level: VerificationLevel.Device,
      }

      if (!MiniKit.commandsAsync || typeof MiniKit.commandsAsync.verify !== "function") {
        throw new Error(
          "MiniKit.commandsAsync.verify is not available. Make sure you're using the latest version of the MiniKit library.",
        )
      }

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

      if (finalPayload.status === "error") {
        console.log("Error payload", finalPayload)
        setVerificationError(`Verification failed: Please try again`)
        setIsVerifying(false)
        return
      }

      try {
        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload as ISuccessResult,
            action: process.env.NEXT_PUBLIC_WLD_ACTION_ID || "web3-template",
            signal: "",
          }),
        })

        setVerified(true)
        router.push("/home-page")
      } catch (error) {
        console.error("Verification error:", error)
        setVerificationError(
          error instanceof Error ? `Verification error: ${error.message}` : "Unknown verification error occurred",
        )
      }
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationError(
        error instanceof Error ? `Verification error: ${error.message}` : "Unknown verification error occurred",
      )
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <WorldcoinLogo size={60} animated />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Identity</h1>
          <p className="text-purple-100">Complete verification to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">One Last Step</h2>
            <p className="text-gray-600">Verify your identity with World ID to access your account</p>
          </div>

          {verificationError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{verificationError}</div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleVerificationSuccess}
              disabled={isVerifying}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <WorldcoinLogo size={20} className="mr-2" />
                  Verify with World ID
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>This verification helps protect your account and data</p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-purple-100">
          <p>
            Having trouble?{" "}
            <a href="#" className="text-white hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

