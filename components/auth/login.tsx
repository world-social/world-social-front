"use client"
import { MiniKit, type WalletAuthInput } from "@worldcoin/minikit-js"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement: "This is my statement and here is a link https://worldcoin.com/apps",
  }
}

type User = {
  walletAddress: string
  username: string | null
  profilePictureUrl: string | null
}

export const Login = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const refreshUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }, [])

  useEffect(() => {
    refreshUserData()
  }, [refreshUserData])

  const handleLogin = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/nonce`)
      const { nonce } = await res.json()

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(walletAuthInput(nonce))

      if (finalPayload.status === "error") {
        setLoading(false)
        return
      } else {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload,
            nonce,
          }),
        })

        if (response.status === 200) {
          setUser(MiniKit.user)
          router.push("/verify-world-id")
        }
        setLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {!user ? (
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect with World Wallet"
          )}
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="bg-purple-50 text-purple-700 font-medium py-2 px-4 rounded-full flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Connected
          </div>
          <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-lg w-full">
            {user?.profilePictureUrl ? (
              <img
                src="../../assets/worldcoin-logo.svg"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-purple-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </div>
            )}
            <span className="font-medium text-gray-800">
              {user?.username || user?.walletAddress.slice(0, 6) + "..." + user?.walletAddress.slice(-4)}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-white border border-purple-300 hover:bg-purple-50 text-purple-700 font-medium rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      )}
    </div>
  )
}
