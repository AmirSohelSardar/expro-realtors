"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import { getYouTubeId } from "@/lib/utils";

export default function PropertyVideo({ youtubeUrl }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(youtubeUrl);

  if (!videoId) return null;

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl text-ink-950">Property Video</h2>

      <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-sm border border-ink-800/10 bg-ink-900">
        {playing ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Property video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
            <button
              onClick={() => setPlaying(false)}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/80 text-paper-50 shadow-md transition-colors hover:bg-rust-500"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play property video"
            className="group absolute inset-0 h-full w-full"
          >
            <img
              src={thumbnail}
              alt="Property video thumbnail"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-ink-950/25 transition-colors group-hover:bg-ink-950/40" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-50/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Play size={26} className="ml-1 text-brass-600" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}