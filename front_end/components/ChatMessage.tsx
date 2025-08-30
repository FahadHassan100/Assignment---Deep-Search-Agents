import React, { useState } from "react";
import { motion } from "framer-motion";
import { ResourceSection } from "./ResourceSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
/* interface Resource {
  id: string;
  type: "website" | "image" | "pdf" | "video";
  title: string;
  url: string;
  previewUrl?: string;
} */

interface Resource {
  id: string;
  type: "website" | "image" | "pdf" | "video";
  title: string;
  url: string;
  previewUrl?: string;
}

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
    resources?: Resource[];
  };
}
export function ChatMessage({ message }: ChatMessageProps) {
  console.log(`[CONTENT MESSAGE]: ${message.content}`);

  const isUser = message.role === "user";
  const hasResources =
    !isUser && message.resources && message.resources.length > 0;
  return (
    <motion.div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {!isUser && hasResources ? (
        <div className="flex w-full gap-4">
          {/* AI Response Section */}
          <div className="flex-1">
            <div className="bg-[#1a1e35] text-white rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                    A
                  </div>
                  <span className="text-sm font-medium text-blue-400">
                    Assistant
                  </span>
                </div>
                <div>
                  <p>Resource</p>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* <p className="text-sm md:text-base">{message.content}</p> */}
              <div className="text-xs mt-1 text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
          {/* Resource Section */}
          <div className="w-64">
            <ResourceSection resources={message.resources} />
          </div>
        </div>
      ) : (
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none"
              : "bg-[#1a1e35] text-white rounded-tl-none"
          }`}
        >
          {!isUser && (
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                A
              </div>
              <span className="text-sm font-medium text-blue-400">
                Assistant
              </span>
            </div>
          )}
          {/* <p className="text-sm md:text-base">{message.content}</p> */}
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          <div
            className={`text-xs mt-1 ${
              isUser ? "text-blue-200" : "text-gray-400"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
