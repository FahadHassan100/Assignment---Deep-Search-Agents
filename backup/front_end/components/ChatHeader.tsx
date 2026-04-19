import React from "react";
import { motion } from "framer-motion";
export function ChatHeader() {
  return (
    <motion.div
      className="flex flex-col items-center mb-12"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
    >
      <div className="w-20 h-20 bg-[#1a1e35] rounded-2xl flex items-center justify-center mb-6">
        <span className="text-4xl">👋</span>
      </div>
      <motion.h1
        className="text-4xl font-bold text-white mb-2 text-center"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.3,
          duration: 0.6,
        }}
      >
        Ask you want to know.
      </motion.h1>
      <motion.p
        className="text-gray-400 text-lg text-center"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.5,
          duration: 0.6,
        }}
      >
        AI Deep Search Agent for Conversation
      </motion.p>
    </motion.div>
  );
}
