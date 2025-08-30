import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { motion } from "framer-motion";

interface Resource {
  id: string;
  type: "website" | "image" | "pdf" | "video";
  title: string;
  url: string;
  previewUrl?: string;
}

interface ChatInterfaceProps {
  messages: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
    resources?: Resource[];
  }[];
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  chatInputStatus: boolean;
  dsStatus: boolean;
  getChildDeepSearchStatus: (val: boolean) => void;
}

export function ChatInterface({
  messages,
  inputValue,
  setInputValue,
  handleSubmit,
  chatInputStatus,
  getChildDeepSearchStatus,
  dsStatus,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  const getChildDeepSS = (DSStatus: boolean) => {
    getChildDeepSearchStatus(DSStatus);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl">
      {/*h-[calc(100vh-4rem)]*/}
      {/* Chat Header */}
      <motion.div
        className="flex items-center p-4 mb-4"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <div className="w-10 h-10 bg-[#1a1e35] rounded-full flex items-center justify-center mr-3">
          <span className="text-xl">👋</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Our Assistant</h2>
          <p className="text-sm text-gray-400">
            Deep Search Agentic AI Project
          </p>
        </div>
      </motion.div>
      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto px-2 mb-4 custom-scrollbar">
        <div className="py-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-center">
                Start a conversation by sending a message
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Chat Input at Bottom */}
      <div className="mt-auto">
        {chatInputStatus && (
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            DSStatus={dsStatus}
            getDeepSearchStatus={getChildDeepSS}
          />
        )}
      </div>
    </div>
  );
}
