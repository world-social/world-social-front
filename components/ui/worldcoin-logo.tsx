"use client";

import Image from "next/image";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface WorldcoinLogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function WorldcoinLogo({
  size = 40,
  className,
  animated = false,
  ...props
}: WorldcoinLogoProps) {
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center", 
        animated && "transition-transform hover:scale-105",
        className
      )} 
      {...props}
    >
      <Image
        src="/worldcoin-logo.svg"
        alt="Worldcoin Logo"
        width={size}
        height={size}
        priority
        className={cn(
          "object-contain",
          animated && "transition-all duration-300"
        )}
      />
    </div>
  );
}
