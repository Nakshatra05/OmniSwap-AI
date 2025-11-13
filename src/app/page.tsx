"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Zap, Network, Brain, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/40 dark:to-green-950/30" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent dark:from-blue-600/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent dark:from-green-600/20" />

      <div className="relative">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg blur-md opacity-40" />
              <Image
                src="/logo.png"
                alt="OmniSwap AI"
                width={48}
                height={48}
                className="rounded-lg relative z-10"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                OmniSwap AI
              </h1>
              <p className="text-xs text-muted-foreground">All-Chain, All-Intent</p>
            </div>
          </div>
          <Link href="/app">
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold shadow-lg">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </header>

        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Powered by Gemini, OnlySwap & dcipher
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 dark:from-blue-400 dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                Transform Words
              </span>
              <br />
              <span className="text-foreground">Into DeFi Actions</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The first intelligent DeFi agent that understands natural language and executes cross-chain swaps automatically
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/app">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold shadow-xl h-14 px-8 text-lg">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
                View Demo
              </Button>
            </div>

            <div className="pt-16 pb-8">
              <div className="relative rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10" />
                <div className="relative p-8 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      AI
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">Natural Language Command</h3>
                      <p className="text-sm text-muted-foreground">Try it yourself</p>
                    </div>
                  </div>
                  <div className="text-left space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-muted-foreground mb-2">Example command:</p>
                      <p className="font-mono text-base">"Swap 20 USDC on Base to AVAX on Avalanche Fuji"</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>AI understands and executes automatically</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">OmniSwap AI</span>?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The future of DeFi is conversational, autonomous, and chain-agnostic
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Natural Language</h4>
                <p className="text-muted-foreground">
                  Just describe what you want in plain English. No complex interfaces or manual configuration needed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg">
                  <Network className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">All-Chain Compatible</h4>
                <p className="text-muted-foreground">
                  Seamlessly swap across multiple EVM chains without bridges or liquidity concerns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Decentralized Security</h4>
                <p className="text-muted-foreground">
                  BLS threshold signatures via dcipher ensure trust-minimized validation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">AI-Powered Routing</h4>
                <p className="text-muted-foreground">
                  Gemini analyzes your intent and finds optimal execution paths automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Autonomous Execution</h4>
                <p className="text-muted-foreground">
                  Set it and forget it. The agent monitors conditions and executes rebalancing automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Treasury Management</h4>
                <p className="text-muted-foreground">
                  Perfect for DAOs and protocols managing multi-chain treasuries with ease.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                Powered by <span className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">Best-in-Class</span> Technology
              </h3>
              <p className="text-xl text-muted-foreground">
                A unique architecture combining AI reasoning with decentralized execution
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-4 gap-8 items-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Intent Layer</div>
                      <div className="text-sm font-semibold">Gemini</div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Planning Layer</div>
                      <div className="text-sm font-semibold">OmniSwap Agent</div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 gap-8 items-center mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">Execution Layer</div>
                      <div className="text-sm font-semibold">OnlySwap SDK</div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">Verification Layer</div>
                      <div className="text-sm font-semibold">dcipher Network</div>
                    </div>
                    <div className="flex justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 overflow-hidden">
            <CardContent className="p-12 text-center">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your DeFi Experience?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the future of cross-chain swapping. No manual bridges, no complexity—just pure intent.
              </p>
              <Link href="/app">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold shadow-xl h-16 px-12 text-xl">
                  Launch OmniSwap AI
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <footer className="container mx-auto px-4 py-12 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="OmniSwap AI"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold">OmniSwap AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Intelligent DeFi Automation Agent
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
