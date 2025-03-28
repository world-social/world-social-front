"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import { Login } from "./auth/login";

export const ClientContent = () => {
  const [isI, setIsI] = useState(false);

  useEffect(() => {
    try {
      const installed = MiniKit?.isInstalled?.();
      setIsI(installed || false);
    } catch (error) {
      console.error("Erro ao verificar MiniKit:", error);
    }
  }, []);

  return <Login />;
};