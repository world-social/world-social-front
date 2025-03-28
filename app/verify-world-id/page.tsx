"use client";

import { useState } from "react";
import { VerifyButton } from "@/components/auth/verify-world-id";
import { useRouter } from "next/navigation";
export default function VerifyWorldIdPage() {
    const [verified, setVerified] = useState(false);
    const router = useRouter();
    const handleVerificationSuccess = () => {
        console.log("Verification success callback");
        setVerified(true);
        router.push('/signup')
      };

    return (
        <VerifyButton onVerificationSuccess={handleVerificationSuccess} />
    )
}