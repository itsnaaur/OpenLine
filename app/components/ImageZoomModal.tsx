"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export default function ImageZoomModal({ isOpen, onClose, images, initialIndex = 0 }: ImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset when modal opens/closes or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, currentIndex, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 5)); // Max 5x zoom
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5)); // Min 0.5x zoom
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setScale(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }
            }}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              if (currentIndex < images.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setScale(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }
            }}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Controls Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-3 rounded-full bg-black/50 backdrop-blur-sm">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-full hover:bg-white/10 text-white text-sm font-medium transition-colors"
          aria-label="Reset zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-white/20 mx-1" />
        <button
          onClick={handleRotate}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          aria-label="Rotate"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        {images.length > 1 && (
          <>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <span className="px-3 py-2 text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          <Image
            src={currentImage}
            alt={`Evidence ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain"
            unoptimized
            priority
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs">
        <div>Use + / - to zoom, Arrow keys to navigate, ESC to close</div>
      </div>
    </div>
  );
}
