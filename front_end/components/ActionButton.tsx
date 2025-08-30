import React, { Children } from "react";
import {
  ImageIcon,
  FileTextIcon,
  ListTodoIcon,
  CodeIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { motion } from "framer-motion";
export function ActionButtons() {
  const buttons = [
    {
      icon: <ImageIcon size={18} />,
      text: "Create image",
    },
    {
      icon: <FileTextIcon size={18} />,
      text: "Summarize text",
    },
    {
      icon: <ListTodoIcon size={18} />,
      text: "Make a plan",
    },
    {
      icon: <CodeIcon size={18} />,
      text: "Code",
    },
    {
      icon: <MoreHorizontalIcon size={18} />,
      text: "More",
    },
  ];
  const container = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <motion.div
      className="flex flex-wrap gap-3 mb-12 justify-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {buttons.map((button, index) => (
        <motion.button
          key={index}
          className="flex items-center gap-2 px-5 py-3 bg-[#1a1e35] text-gray-300 rounded-full hover:bg-[#252a47] transition-colors"
          variants={item}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          {button.icon}
          <span>{button.text}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
