"use client";

import React, { useState } from "react";  // Added React import for JSX
import { MiniKit } from "@worldcoin/minikit-js";
import { useSession } from "next-auth/react";
import { WST } from "@/abi/WST";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

// Create an extended user interface that includes address
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  address?: string | null;
}

// Extend the session interface to use our custom user type
interface ExtendedSession {
  user?: ExtendedUser;
  expires: string;
}

// Define our API response interface
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;  // This is the nested data
  error?: string;
}

// Define the claim status structure
interface ClaimStatus {
  signature: string;
}

interface ClaimButtonProps {
  className?: string;
  onClaim: (txId: string) => void;
}

export function ClaimButton({ className, onClaim }: ClaimButtonProps): React.ReactElement {  // Changed JSX.Element to React.ReactElement
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const { data: session } = useSession() as { data: ExtendedSession | null };

  const checkClaimStatus = async () => {
    try {
      // Change the type to match the actual structure of your API response
      const response = await apiRequest<ApiResponse<ClaimStatus>>('/tokens/daily/status');
      
      if (response.status === 'error') {
        throw new Error(response.error || 'Failed to check claim status');
      }
      
      if (!response.data) {
        throw new Error('Invalid response format');
      }
      
      // Access signature directly from data
      setSignature(response.data.signature);

      // Reset retry count on successful request
      setRetryCount(0);
    } catch (error) {
      console.error('Error checking claim status:', error);
      
      // Increment retry count
      setRetryCount((prev) => prev + 1);
      
      // If we've tried less than 3 times, try again in 5 seconds
      if (retryCount < 3) {
        setTimeout(checkClaimStatus, 5000);
      } else {
        toast.error('Unable to check claim status. Please try again later.');
      }
    }
  };

  async function handleMint() {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    if (!session?.user?.address) {
      console.error("User not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      // Send transaction to mint tokens
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0xF552c9d5Cb9F6Df6590479d43c4929b69458e4e1" as `0x${string}`,
            abi: WST,
            functionName: "mint",
            args: [
              localStorage.getItem("root") as `0x${string}`,
              localStorage.getItem("nullifierHash") as `0x${string}`,
              localStorage.getItem("proof") as `0x${string}`,
              signature as `0x${string}`,
            ],
          },
        ],
      });

      if (finalPayload.status === "error") {
        console.error("Error minting tokens:", finalPayload);
        return;
      }

      console.log("Minting successful:", finalPayload);
      onClaim(finalPayload.transaction_id);
    } catch (error) {
      console.error("Error minting tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleMint}
      disabled={isLoading}
      className={`w-full max-w-xs px-8 py-4 bg-purple-500 text-white font-medium text-lg rounded-xl shadow-sm hover:bg-purple-600 active:bg-purple-700 transition-colors touch-manipulation disabled:bg-purple-300 disabled:cursor-not-allowed ${className || ""}`}
    >
      {isLoading ? "Minting..." : "Claim Your rewards"}
    </button>
  );
}