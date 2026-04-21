"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignIn 
          routing="path" 
          path="/login" 
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm font-bold rounded-xl",
              card: "shadow-2xl border-none rounded-3xl",
              headerTitle: "text-2xl font-black tracking-tight",
            }
          }}
        />
      </motion.div>
    </div>
  );
}