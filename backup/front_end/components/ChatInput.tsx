import React, { useEffect, useState, useRef } from "react";
import { LinkIcon, ChevronDownIcon, ArrowUpIcon, Slack } from "lucide-react";
import { motion } from "framer-motion";
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  DSStatus: boolean;
  getDeepSearchStatus: (val: boolean) => void;
}
export function ChatInput({
  value,
  onChange,
  onSubmit,
  DSStatus,
  getDeepSearchStatus,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [deepSearch, setDeepSearch] = useState(DSStatus);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleDS = (DSStatus: boolean) => {
    console.log(DSStatus);
    getDeepSearchStatus(DSStatus);
    setDeepSearch(!deepSearch);
  };

  return (
    <motion.div
      className="w-full max-w-4xl"
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.9,
        duration: 0.6,
      }}
    >
      <form onSubmit={onSubmit}>
        <div
          className={`bg-[#0d1026] border ${
            isFocused ? "border-blue-500" : "border-[#252a47]"
          } rounded-2xl p-4 transition-colors`}
        >
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as any);
              }
            }}
            rows={1}
            placeholder="Type your message here..."
            className="w-full bg-transparent text-white outline-none resize-none min-h-[24px] max-h-[200px]"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#252a47]">
            <div className="flex items-center gap-2">
              {/* <motion.button
                type="button"
                className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-4 py-1 rounded-full text-sm"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                Deep Search
              </motion.button> */}
              <motion.button
                type="button"
                onClick={() => handleDS(!deepSearch)}
                className={` px-4 py-2 flex items-center gap-2 justify-center rounded-full text-sm font-medium border transition cursor-pointer ${
                  deepSearch
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border border-gray-500 text-white"
                }`}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <Slack className="w-5 h-5" />
                {deepSearch ? "Deep Search Enabled" : "Enable Deep Search"}
              </motion.button>
              <motion.button
                type="button"
                className="text-gray-400 p-2 hover:bg-[#252a47] rounded-full"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <LinkIcon size={18} />
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                className="text-gray-400 p-2 hover:bg-[#252a47] rounded-full"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <ChevronDownIcon size={18} />
              </motion.button>
              <motion.button
                type="submit"
                className="bg-[#1a1e35] text-gray-300 p-2 rounded-full hover:bg-[#252a47]"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <ArrowUpIcon size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
