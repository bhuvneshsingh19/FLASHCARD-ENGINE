"use client";

import Link from "next/link";
import { ArrowRight, Brain, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* 1. Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Brain className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            FlashcardEngine
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard">
            <Button className="bg-slate-900 text-white rounded-full px-6 hover:bg-slate-800 transition-all font-bold">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-8 animate-fade-in">
          <Sparkles className="text-blue-600" size={16} />
          <span className="text-blue-700 text-xs font-black uppercase tracking-widest">
            AI-Powered Spaced Repetition
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8">
          Stop Cramming. <br />
          <span className="text-blue-600">Start Retaining.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          Upload any PDF and transform them into smart flashcards optimized for long-term memory through the SM-2 algorithm.
        </p>

        {/* SINGLE PRIMARY BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-16 rounded-2xl shadow-2xl shadow-blue-200 transition-all active:scale-95 font-bold text-xl gap-3">
              Go to Dashboard <ArrowRight size={22} />
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="bg-slate-50 py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="text-blue-600" size={32} />}
              title="Instant AI Generation"
              description="Convert complex medical, law, or engineering PDFs into structured flashcards in seconds."
            />
            <FeatureCard 
              icon={<Brain className="text-blue-600" size={32} />}
              title="SM-2 Algorithm"
              description="Our adaptive engine tracks your recall speed and schedules reviews at the perfect moment."
            />
            <FeatureCard 
              icon={<Shield className="text-blue-600" size={32} />}
              title="Secure Storage"
              description="Your academic data is encrypted and synced across all your devices via Clerk Auth."
            />
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
          Developed by Bhuvnesh Singh • GLA University
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group">
      <div className="mb-6 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}