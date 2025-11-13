"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type RusdCommandBarProps = {
  onSubmitAction: (prompt: string) => void;
  isLoading: boolean;
};

export function RusdCommandBar({ onSubmitAction, isLoading }: RusdCommandBarProps) {
  const [prompt, setPrompt] = useState("Swap 1 RUSD to Fuji");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmitAction(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'Bridge 0.5 RUSD to Base Sepolia'"
        className="flex-grow"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Executing..." : "Send Command"}
      </Button>
    </form>
  );
}
