import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLinkIcon } from "lucide-react";
interface Resource {
  id: string;
  type: "website" | "image" | "pdf" | "video";
  title: string;
  url: string;
  previewUrl?: string;
}
interface ResourceSectionProps {
  resources?: Resource[];
}
export function ResourceSection({ resources }: ResourceSectionProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  // Function to get icon color based on resource type

  console.log(resources);

  const getIconColor = (type: string) => {
    switch (type) {
      case "website":
        return "bg-red-500";
      case "image":
        return "bg-green-500";
      case "pdf":
        return "bg-blue-500";
      case "video":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };
  // Function to get icon content based on resource type
  const getIconContent = (type: string) => {
    switch (type) {
      case "website":
        return "W";
      case "image":
        return "I";
      case "pdf":
        return "P";
      case "video":
        return "V";
      default:
        return "?";
    }
  };
  return (
    <div className="bg-[#1a1e35] rounded-2xl p-4">
      <h3 className="text-white font-medium mb-2">Related Sources</h3>
      <div className="h-px bg-[#252a47] mb-3"></div>
      <div className="flex flex-wrap gap-2">
        {resources?.map((resource: any) => (
          <div
            key={resource.id}
            className="relative"
            onMouseEnter={() => setActiveTooltip(resource.id)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <motion.a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 ${getIconColor(
                resource.type
              )} rounded-full flex items-center justify-center text-white font-medium cursor-pointer`}
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              {resource.favicon ? (
                <img
                  src={resource.favicon}
                  alt={resource.title}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getIconContent(resource.type)
              )}
              {/* {getIconContent(resource.type)} */}
            </motion.a>
            <AnimatePresence>
              {activeTooltip === resource.id && (
                <motion.div
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 z-50"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="bg-[#0d1026] border border-[#252a47] rounded-lg shadow-lg overflow-hidden">
                    {resource.previewUrl && (
                      <div className="w-full h-24 overflow-hidden">
                        <img
                          src={resource.previewUrl}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-2">
                      <h4 className="text-white text-sm font-medium truncate">
                        {resource.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400 truncate flex-1">
                          {
                            resource.url
                              .replace(/^https?:\/\//, "")
                              .split("/")[0]
                          }
                        </span>
                        <motion.a
                          href={resource.url}
                          target="_blank"
                          className="cursor-pointer"
                        >
                          <ExternalLinkIcon
                            size={12}
                            className="text-gray-400"
                          />
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
