"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const goNext = useCallback(() => {
    setZoom(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setZoom(1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [goNext, goPrev, onClose]);

  function handleWheel(e) {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.001)));
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-ink-950/95" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-4 text-paper-50">
        <span className="font-mono text-xs uppercase tracking-widest text-paper-100/60">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            className="rounded-full border border-paper-100/20 p-2 hover:border-brass-400"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
            className="rounded-full border border-paper-100/20 p-2 hover:border-brass-400"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-paper-100/20 p-2 hover:border-rust-500"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 z-10 rounded-full bg-ink-950/60 p-2 text-paper-50 hover:bg-ink-900 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="relative h-full w-full max-w-5xl overflow-hidden">
          <div
            className="relative h-full w-full transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          >
            <Image src={images[index]} alt="" fill sizes="100vw" className="object-contain" priority />
          </div>
        </div>

        {images.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 z-10 rounded-full bg-ink-950/60 p-2 text-paper-50 hover:bg-ink-900 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto pb-4" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => {
                setZoom(1);
                setIndex(i);
              }}
              className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-sm border-2 ${
                i === index ? "border-brass-400" : "border-transparent opacity-60"
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}