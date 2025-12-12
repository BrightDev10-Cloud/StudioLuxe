"use client";

import { useEffect, useRef } from "react";

export default function HalftoneWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    const spacing = 30; // Grid spacing
    
    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      const rows = Math.ceil(height / spacing);
      const cols = Math.ceil(width / spacing);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const xPos = x * spacing;
          const yPos = y * spacing;

          // Wave calculation
          const dist = Math.sqrt((x - cols / 2) ** 2 + (y - rows / 2) ** 2);
          const baseWave = Math.sin(dist * 0.1 - time) + Math.sin(x * 0.05 + time) + Math.sin(y * 0.05 + time);
          
          // Mouse interaction (Physics-like repulsion/attraction)
          const dx = xPos - mouseRef.current.x;
          const dy = yPos - mouseRef.current.y;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          const interactionRadius = 300;
          let mouseFactor = 0;
          
          if (mouseDist < interactionRadius) {
              // Calculate influence based on distance (closer = stronger)
              const force = (interactionRadius - mouseDist) / interactionRadius;
              // Add a ripple/wave effect based on mouse distance
              mouseFactor = Math.sin(mouseDist * 0.05 - time * 5) * force * 4;
          }

          // Combine base wave and mouse influence
          const totalWave = baseWave + mouseFactor;
          
          // Map wave to radius (1 to spacing/1.5)
          const radius = Math.max(0, (totalWave + 3) * 2.5);

          // Monochrome / Grayscale logic
          // Normalize wave roughly between -3 and 3 for color mapping
          // Add mouseFactor to make the interacted area brighter/darker
          const normalizedVal = (totalWave + 4) / 8; // approx 0-1
          const intensity = Math.min(255, Math.max(50, Math.floor((normalizedVal * 200) + 50)));
          
          // Reduced opacity for better text legibility
          ctx.fillStyle = `rgba(${intensity}, ${intensity}, ${intensity}, 0.15)`;

          ctx.beginPath();
          ctx.arc(xPos, yPos, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(render);
    };

    const animFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -1 }} />;
}
