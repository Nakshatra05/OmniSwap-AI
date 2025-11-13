"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MasterCommandBarProps = {
  onSubmitAction: (prompt: string) => void;
  isLoading: boolean;
};

export function MasterCommandBar({ onSubmitAction, isLoading }: MasterCommandBarProps) {
  const [prompt, setPrompt] = useState("Bridge 1 RUSD to Fuji if ETH is greater than 2000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmitAction(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-grow">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Swap 1 ETH for USDC' or 'Bridge 0.5 RUSD to Fuji'"
          className="flex-grow h-11 pr-4 text-base"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 px-6 font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Executing
          </span>
        ) : (
          "Execute"
        )}
      </Button>
    </form>
  );
}
