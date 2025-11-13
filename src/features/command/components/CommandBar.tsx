// src/features/command/components/CommandBar.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CommandBarProps = {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
};

export function CommandBar({ onSubmit, isLoading }: CommandBarProps) {
  const [prompt, setPrompt] = useState("Swap 0.0001 WETH for USDC");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a command, e.g., 'swap 1 ETH for USDC'"
        className="flex-grow"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Send Command"}
      </Button>
    </form>
  );
}
