import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X as CloseIcon } from "lucide-react";
interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}
export function SignUpModal({ isOpen, onClose, onSignIn }: SignUpModalProps) {
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative w-full max-w-md mx-4 overflow-hidden bg-[#0a0d1c] border border-[#252a47] rounded-2xl"
            initial={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          >
            {/* Background animation */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 left-0 w-[600px] h-[600px] opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 30%, transparent 70%)",
                  transform: "translate(-50%, -50%)",
                  filter: "blur(50px)",
                }}
              />
            </div>
            {/* Close button */}
            <button
              className="absolute top-4 cursor-pointer right-4 p-1 text-gray-400 hover:text-white transition-colors z-10"
              onClick={onClose}
            >
              <CloseIcon size={20} />
            </button>
            {/* Content */}
            <div className="relative p-8">
              <h2 className="mb-6 text-2xl font-bold text-center text-white">
                Join Y Assistant
              </h2>
              <div className="space-y-4">
                {/* Google button */}
                <motion.button
                  className="flex items-center justify-center w-full gap-3 px-6 py-3 font-medium text-white bg-[#1a1e35] rounded-lg hover:bg-[#252a47] transition-colors"
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={onSignIn}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  Continue with Google
                </motion.button>
                {/* Facebook button */}
                <motion.button
                  className="flex items-center justify-center w-full gap-3 px-6 py-3 font-medium text-white bg-[#1a1e35] rounded-lg hover:bg-[#252a47] transition-colors"
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={onSignIn}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M20.9 2H3.1A1.1 1.1 0 0 0 2 3.1v17.8A1.1 1.1 0 0 0 3.1 22h9.58v-7.75h-2.6v-3h2.6V9a3.64 3.64 0 0 1 3.88-4 20.26 20.26 0 0 1 2.33.12v2.7H17.3c-1.26 0-1.5.6-1.5 1.47v1.93h3l-.39 3H15.8V22h5.1a1.1 1.1 0 0 0 1.1-1.1V3.1A1.1 1.1 0 0 0 20.9 2Z"
                    />
                  </svg>
                  Continue with Facebook
                </motion.button>
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-[#252a47]"></div>
                  <span className="px-4 text-sm text-gray-400">or</span>
                  <div className="flex-1 h-px bg-[#252a47]"></div>
                </div>
                {/* Sign up button */}
                <motion.button
                  className="w-full px-6 py-3 font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg"
                  whileHover={{
                    scale: 1.02,
                    backgroundPosition: ["0% 50%", "100% 50%"],
                    transition: {
                      duration: 0.3,
                      backgroundPosition: {
                        repeat: Infinity,
                        duration: 1.5,
                      },
                    },
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                  onClick={onSignIn}
                >
                  Sign Up with Email
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
