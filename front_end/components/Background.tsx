import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
interface BackgroundProps {
  showLight: boolean;
}
export function Background({ showLight }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    // Stars/particles
    const stars: {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speed: number;
    }[] = [];
    // Create stars
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.05,
      });
    }
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        // Move star
        star.y += star.speed;
        // Reset if off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <AnimatePresence>
        {showLight && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 0.8,
            }}
            transition={{
              duration: 3,
              ease: "easeOut",
            }}
            className="absolute top-0 left-0 w-[1000px] h-[1000px]"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 30%, transparent 70%)",
              transform: "translate(-30%, -30%)",
              filter: "blur(70px)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
