"use client";

import { useEffect, useRef, useState } from "react";

interface HeartbeatMonitorProps {
  messagesCount?: number; // Number of messages to influence animation
  isActive?: boolean; // Whether the report is active
}

export default function HeartbeatMonitor({ messagesCount = 0, isActive = true }: HeartbeatMonitorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [pulseIntensity, setPulseIntensity] = useState(1);

  // Pulse intensity based on message count (more messages = stronger pulse)
  useEffect(() => {
    if (messagesCount > 0) {
      setPulseIntensity(Math.min(1 + messagesCount * 0.1, 2.5));
      // Reset after animation
      const timeout = setTimeout(() => setPulseIntensity(1), 1000);
      return () => clearTimeout(timeout);
    }
  }, [messagesCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation variables
    let time = 0;
    const baseSpeed = 0.5; // Base scroll speed
    const lineHeight = 60; // Vertical spacing between lines
    const numLines = Math.ceil(canvas.height / lineHeight) + 2;

    const draw = () => {
      if (!ctx) return;

      // Clear with slight transparency for trail effect
      ctx.fillStyle = "rgba(240, 249, 252, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isActive) {
        // If inactive, draw flat lines
        ctx.strokeStyle = "rgba(200, 200, 200, 0.2)";
        ctx.lineWidth = 2;
        for (let i = 0; i < numLines; i++) {
          const y = (i * lineHeight - (time * baseSpeed) % lineHeight) % canvas.height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      // Draw multiple heartbeat monitor lines
      ctx.strokeStyle = "rgba(13, 162, 203, 0.15)"; // Subtle blue-green color
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      for (let i = 0; i < numLines; i++) {
        const y = (i * lineHeight - (time * baseSpeed) % lineHeight) % canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(0, y);

        // Draw heartbeat pattern
        const segmentLength = canvas.width / 80; // Number of segments
        for (let x = 0; x < canvas.width; x += segmentLength) {
          const segmentTime = (time + x / segmentLength) * 0.02;
          const segmentProgress = (x % segmentLength) / segmentLength;
          
          // Heartbeat pattern: flat line, spike up, spike down, flat, repeat
          let amplitude = 0;
          const cyclePos = (segmentTime * 2) % 4; // 4-phase cycle
          
          if (cyclePos < 0.3) {
            // Flat baseline
            amplitude = 0;
          } else if (cyclePos < 0.5) {
            // Upward spike (P-wave)
            amplitude = (cyclePos - 0.3) / 0.2 * pulseIntensity * 15;
          } else if (cyclePos < 0.7) {
            // Downward dip
            amplitude = (0.7 - cyclePos) / 0.2 * pulseIntensity * 15;
          } else if (cyclePos < 0.9) {
            // Big spike up (QRS complex)
            amplitude = ((cyclePos - 0.7) / 0.2) * pulseIntensity * 25;
          } else if (cyclePos < 1.1) {
            // Big spike down
            amplitude = ((1.1 - cyclePos) / 0.2) * pulseIntensity * 25;
          } else {
            // Flat baseline before next cycle
            amplitude = 0;
          }

          // Add subtle wave variation
          const waveVariation = Math.sin(segmentTime * 0.5) * 2;
          const finalY = y + amplitude + waveVariation;

          ctx.lineTo(x, finalY);
        }

        ctx.stroke();
      }

      time += 1;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, pulseIntensity, messagesCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
