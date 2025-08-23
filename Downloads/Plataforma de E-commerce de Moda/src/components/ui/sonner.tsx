"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner} from "sonner"; 

const Toaster = (props: PartialToasterProps) => { 
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as any}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      {...props}
    />
  );
};

type PartialToasterProps = {
  theme?: "light" | "dark" | "system";
  position?: string;
  closeButton?: boolean;
  richColors?: boolean;
  duration?: number;
  expand?: boolean;
  visibleToasts?: number;
  toastOptions?: unknown;
};


export { Toaster };
