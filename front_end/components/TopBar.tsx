import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import { SignUpModal } from "./SignUpModal";
import { useUserContext } from "@/app/context/UserContext";
export function TopBar() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignOutTooltip, setShowSignOutTooltip] = useState(false);
  const { setUserInfo, isSignedEnable } = useUserContext();
  // User initials (would normally come from user data)
  const userInitials = "FH";
  const handleSignUpClick = () => {
    setUserInfo({
      username: "Fahad Hassan",
      email: "fahad@live.com",
    });
    isSignedEnable(true);
    setIsSignUpModalOpen(true);
  };
  const handleSignIn = () => {
    setIsSignedIn(true);
    setIsSignUpModalOpen(false);
  };
  const handleSignOut = () => {
    setIsSignedIn(false);
    setShowSignOutTooltip(false);
  };
  const toggleSignOutTooltip = () => {
    setShowSignOutTooltip((prev) => !prev);
  };
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0a0d1c]/80 backdrop-blur-md border-b border-[#252a47]/50">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-white">FH</span>
        </div>
        {isSignedIn ? (
          <div className="relative">
            <motion.button
              className="flex items-center justify-center w-10 h-10 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-full font-medium"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
              onClick={toggleSignOutTooltip}
            >
              {userInitials}
            </motion.button>
            {/* Sign out tooltip */}
            <AnimatePresence>
              {showSignOutTooltip && (
                <motion.div
                  className="absolute right-0 mt-2 w-40 bg-[#1a1e35] border border-[#252a47] rounded-lg shadow-lg overflow-hidden z-30"
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <button
                    className="flex items-center w-full gap-2 px-4 py-3 text-sm text-white hover:bg-[#252a47] transition-colors"
                    onClick={handleSignOut}
                  >
                    <LogOutIcon size={16} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-medium"
            whileHover={{
              scale: 1.05,
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
              scale: 0.95,
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
            onClick={handleSignUpClick}
          >
            Sign Up
          </motion.button>
        )}
      </div>
      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSignIn={handleSignIn}
      />
    </>
  );
}
