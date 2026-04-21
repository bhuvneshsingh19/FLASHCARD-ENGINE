"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <SignUp 
          routing="path" 
          path="/signup" 
          signInUrl="/login"
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