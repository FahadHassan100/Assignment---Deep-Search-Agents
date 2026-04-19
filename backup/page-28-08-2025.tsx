"use client";
import React, { useEffect, useState } from "react";
import { ChatHeader } from "../components/ChatHeader";
import { ActionButtons } from "../components/ActionButton";
import { ChatInput } from "../components/ChatInput";
import { Background } from "../components/Background";
import { TopBar } from "../components/TopBar";
import { ChatInterface } from "../components/ChatInterface";
import { getWebsitePreview } from "@/services/getPreview";

interface Resource {
  id: string;
  type: "website" | "image" | "pdf" | "video";
  title: string;
  url: string;
  previewUrl?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  resources?: Resource[];
  timestamp: Date;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [showLight, setShowLight] = useState(false);
  const [inChatMode, setInChatMode] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatCompletionStatus, setChatCompletionStatus] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    /* const checking = async () => {
      const getUrlPreview = await getWebsitePreview(
        "https://www.deduxer.studio/blog/25-profitable-ai-business-ideas-best-ai-businesses-2024"
      );
      console.log(getUrlPreview);
    };

    checking(); */

    // Show light effect after 2.5 seconds
    const timer = setTimeout(() => {
      setShowLight(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: inputValue,
        role: "user" as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setInChatMode(true);

      try {
        // Simulate AI response after a short delay
        //setTimeout(async () => {
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage = {
          id: aiMessageId,
          role: "assistant" as const,
          content: "",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Use fetch for streaming instead of axios
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userMessage),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to get response from backend: ${response.status}`
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedContent = "";

        if (reader) {
          console.log("Start to read streaming");

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              setChatCompletionStatus(true);
              console.log("streaming is completed");
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            console.log("Buffer content:", buffer);

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            /* NOW FROM HERE EXTRATING STREAM DATA */
            for (const line of lines) {
              console.log("Processing line:", line);

              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                console.log("Extracted data:", data);

                if (data === "[DONE]") {
                  console.log("Stream marked as done");
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  console.log("Parsed data:", parsed);

                  /* if (parsed.content && parsed.content !== "[DONE]") {
                    accumulatedContent += parsed.content;
                    console.log("Accumulated content:", accumulatedContent);

                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === aiMessageId
                          ? { ...msg, content: accumulatedContent }
                          : msg
                      )
                    );Sir Hum structured output Runner.run_streamed main kesay karay gain
                  } */
                  const inner = parsed.content.replace(/^data:\s*/, "").trim();
                  console.log("[TESTING ABC]: ", parsed.content);

                  if (parsed.content && parsed.content !== "[DONE]") {
                    const inner = parsed.content
                      .replace(/^data:\s*/, "")
                      .trim();

                    try {
                      const innerJson = JSON.parse(inner); // <- this has type and delta
                      console.log("Inner JSON:", innerJson);

                      if (
                        innerJson.type === "resources" &&
                        innerJson.resources
                      ) {
                        console.log("[ALL RESOURCES]", innerJson.resources);
                        const sampleResources = getSampleResources();

                        const enrichReso = async (resources: any[]) => {
                          return Promise.all(
                            resources.map(async (resources, index) => {
                              const urlData: any = await getWebsitePreview(
                                resources.url
                              );
                              return {
                                id: String(index + 1),
                                type: "website",
                                url: resources.url, // from backend
                                previewUrl: urlData.image ?? null,
                                favicon: urlData.favicon ?? null, // add favicon if needed
                              };
                            })
                          );
                        };

                        const allResourcesWithImage: any = await enrichReso(
                          innerJson.resources
                        );
                        console.log(
                          "[RESOURCE CUSTOM DATE]:",
                          await enrichReso(innerJson.resources)
                        );

                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === aiMessageId
                              ? {
                                  ...msg,
                                  resources: allResourcesWithImage,
                                }
                              : msg
                          )
                        );
                      }

                      if (
                        innerJson.type === "content" &&
                        innerJson.delta &&
                        innerJson.delta !== "[DONE]"
                      ) {
                        accumulatedContent += innerJson.delta;
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === aiMessageId
                              ? {
                                  ...msg,
                                  content: accumulatedContent,
                                }
                              : msg
                          )
                        );
                      }
                    } catch (error) {
                      console.error(
                        "Failed to parse inner JSON:",
                        inner,
                        error
                      );
                    }

                    //accumulatedContent += parsed.content;

                    /* setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === aiMessageId
                          ? {
                              ...msg,
                              content: accumulatedContent,
                              resources:
                                parsed.resources || msg.resources || [],
                            }
                          : msg
                      )
                    ); */
                  } else if (parsed.content === "[DONE]") {
                    if (accumulatedContent === "") {
                      console.log(
                        "No content received, showing fallback message"
                      );
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === aiMessageId
                            ? {
                                ...msg,
                                content:
                                  "Sorry, I couldn't generate a response. Please try again.",
                              }
                            : msg
                        )
                      );
                    }
                  }
                } catch (e) {
                  console.error("Error parsing JSON:", e, "Data:", data);

                  if (data && data !== "[DONE]") {
                    accumulatedContent += data;
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === aiMessageId
                          ? { ...msg, aiResponse: accumulatedContent }
                          : msg
                      )
                    );
                  }
                }
              }
            }

            /* END FROM HERE EXTRATING STREAM DATA */
          }
        }

        //}, 1000);
      } catch (error) {
        throw new Error("No response body reader available");
      }

      //HARDCODED RESPONSE
      // Simulate AI response after a short delay
      /* setTimeout(() => {
        // Check if this should be a deep search response (for demo purposes)
        const shouldHaveResources =
          inputValue.toLowerCase().includes("search") ||
          inputValue.toLowerCase().includes("find") ||
          Math.random() > 0.7; // Randomly show resources sometimes
        //console.log(shouldHaveResources);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: getAIResponse(inputValue),
          role: "assistant" as const,
          timestamp: new Date(),
        };
        // Add resources if this is a deep search response
        if (shouldHaveResources) {
          aiMessage.resources = getSampleResources();
        }
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000); */
    }
  };

  /* const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return false;

    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setInChatMode(true);
    setIsStreaming(true);

    try {
      // Simulate AI response after a short delay
      //setTimeout(async () => {
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMessageId,
        role: "assistant" as const,
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Use fetch for streaming instead of axios
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get response from backend: ${response.status}`
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedContent = "";

      if (reader) {
        console.log("Start to read streaming");

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("streaming is completed");
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          console.log("Buffer content:", buffer);

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          /// NOW FROM HERE EXTRATING STREAM DATA 
          for (const line of lines) {
            console.log("Processing line:", line);

            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              console.log("Extracted data:", data);

              if (data === "[DONE]") {
                console.log("Stream marked as done");
                break;
              }

              try {
                const parsed = JSON.parse(data);
                console.log("Parsed data:", parsed);

                if (parsed.content && parsed.content !== "[DONE]") {
                  accumulatedContent += parsed.content;
                  console.log("Accumulated content:", accumulatedContent);

                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
                } else if (parsed.content === "[DONE]") {
                  if (accumulatedContent === "") {
                    console.log(
                      "No content received, showing fallback message"
                    );
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === aiMessageId
                          ? {
                              ...msg,
                              content:
                                "Sorry, I couldn't generate a response. Please try again.",
                            }
                          : msg
                      )
                    );
                  }
                }
              } catch (e) {
                console.error("Error parsing JSON:", e, "Data:", data);

                if (data && data !== "[DONE]") {
                  accumulatedContent += data;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, aiResponse: accumulatedContent }
                        : msg
                    )
                  );
                }
              }
            }
          }

          //// END FROM HERE EXTRATING STREAM DATA 
        }
      }

      //}, 1000);
    } catch (error) {
      throw new Error("No response body reader available");
    }

    // if (inputValue.trim()) {
    //   // Add user message
    //   const userMessage = {
    //     id: Date.now().toString(),
    //     text: inputValue,
    //     sender: "user" as const,
    //     timestamp: new Date(),
    //   };
    //   setMessages((prev) => [...prev, userMessage]);
    //   setInputValue("");
    //   setInChatMode(true);
    //   // Simulate AI response after a short delay
    //   setTimeout(() => {
    //     const aiMessage = {
    //       id: (Date.now() + 1).toString(),
    //       text: getAIResponse(inputValue),
    //       sender: "ai" as const,
    //       timestamp: new Date(),
    //     };
    //     setMessages((prev) => [...prev, aiMessage]);
    //   }, 1000);
    // } 
  }; */
  // Simple function to generate AI responses
  const getAIResponse = (query: string) => {
    const responses = [
      "I'm Y, your cryptocurrency assistant. How can I help you today?",
      "That's an interesting question about crypto. Let me explain...",
      "Based on the current market trends, I would suggest considering various factors before making any investment decisions.",
      "The blockchain technology behind this cryptocurrency uses advanced consensus mechanisms to ensure security and efficiency.",
      "I can help you understand more about DeFi, NFTs, or any other crypto topic you're interested in.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Generate sample resources for demonstration
  const getSampleResources = (): Resource[] => {
    return [
      {
        id: "1",
        type: "website",
        title: "DiceDB: Modern Reactive Database",
        url: "https://example.com/dicedb",
        previewUrl:
          "https://uploadthingy.s3.us-west-1.amazonaws.com/d6rjo4jiQ7BkzNskWRWChS/ai_resource_response.jpg",
      },
      {
        id: "2",
        type: "image",
        title: "Cryptocurrency Market Analysis",
        url: "https://example.com/crypto-analysis",
        previewUrl:
          "https://uploadthingy.s3.us-west-1.amazonaws.com/hNqEXwbja9VvZrQDqwL9fx/ai_response_tooltip.jpg",
      },
      {
        id: "3",
        type: "pdf",
        title: "Blockchain Technology Whitepaper",
        url: "https://example.com/blockchain-whitepaper",
      },
      {
        id: "4",
        type: "video",
        title: "Understanding Cryptocurrency",
        url: "https://example.com/crypto-video",
      },
      {
        id: "5",
        type: "website",
        title: "Y Finance: Crypto News",
        url: "https://example.com/y-finance",
      },
    ];
  };
  return (
    <div className="relative w-full min-h-screen bg-[#0a0d1c] overflow-hidden">
      <Background showLight={showLight} />
      {/* Top Navigation Bar */}
      <TopBar />
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 pt-16 pb-4">
        {!inChatMode ? (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center flex-grow w-full max-w-4xl">
            <ChatHeader />
            {/* <ActionButtons /> */}
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          // Chat Interface
          <ChatInterface
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            chatInputStatus={chatCompletionStatus}
          />
        )}
      </div>
    </div>
  );
}
