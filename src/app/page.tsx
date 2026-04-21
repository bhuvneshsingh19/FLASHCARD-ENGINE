"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Brain, Clock, ArrowRight, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

// OVERLAY BUBBLE COMPONENT
const Bubble = ({ size, delay, x, duration }: { size: number; delay: number; x: string; duration: number }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0 }}
    animate={{ 
      y: "-20vh", 
      opacity: [0, 0.3, 0.3, 0], 
      x: ["0%", "5%", "-5%", "0%"] 
    }}
    transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
    className="absolute rounded-full pointer-events-none"
    style={{ 
      width: size, height: size, left: x, 
      backgroundColor: "#3b82f6", filter: "blur(100px)", zIndex: 5 
    }}
  />
);

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] overflow-hidden font-sans selection:bg-blue-100">
      
      {/* 1. ANIMATION LAYER */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
        <Bubble size={500} delay={0} x="5%" duration={18} />
        <Bubble size={400} delay={5} x="75%" duration={25} />
        <Bubble size={300} delay={2} x="45%" duration={20} />
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-20 w-full">
        <main className="max-w-7xl mx-auto px-8 pt-32 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] mb-12 border border-white bg-white/40 rounded-[56px] shadow-2xl shadow-blue-100 flex items-center justify-center overflow-hidden p-6 backdrop-blur-2xl transition-transform hover:scale-[1.02] duration-500">
              <img src="/logo.jpg" alt="Logo" className="max-w-full h-auto rounded-3xl shadow-lg" />
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-100/60 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-8 backdrop-blur-md border border-blue-200">
              <Sparkles size={16} />
              <span>AI-Powered Spaced Repetition</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
              Stop Cramming. <br /><span className="text-blue-600">Start Retaining.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Upload any PDF and transform them into smart flashcards optimized for long-term memory.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* PRIMARY BUTTON: Toggle between Get Started and Dashboard */}
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                <Button size="lg" className="h-16 px-10 text-lg gap-3 rounded-2xl shadow-xl shadow-blue-200 transition-transform hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSignedIn ? "Go to Dashboard" : "Get Started for Free"} <ArrowRight size={20} />
                </Button>
              </Link>
              
              {/* SECONDARY BUTTON: Only shows "View My Library" if signed in */}
              {isSignedIn && (
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg" className="h-16 px-10 text-lg rounded-2xl bg-white/60 backdrop-blur-md hover:bg-white border border-gray-200 text-gray-700 shadow-sm transition-all font-bold">
                    View My Library
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-40 text-left pb-20">
            <FeatureCard icon={<Brain className="text-blue-600" size={28} />} title="Active Recall" desc="Test yourself with AI-generated challenges." />
            <FeatureCard icon={<Clock className="text-blue-600" size={28} />} title="Spaced Repetition" desc="Based on the scientifically proven SM-2 algorithm." />
            <FeatureCard icon={<BookOpenText className="text-blue-600" size={28} />} title="Global Support" desc="Handles any document type with ease." />
          </div>
        </main>

        <footer className="border-t border-gray-200/50 py-16 text-center bg-white/20 backdrop-blur-xl">
          <p className="text-gray-900 font-bold text-base">Bhuvnesh Singh</p>
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">B.Tech AIML Student • GLA University</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white/40 backdrop-blur-md rounded-[32px] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative z-30">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}