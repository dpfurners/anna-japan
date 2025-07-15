"use client";

import { useState, useEffect } from "react";

interface MessageProps {
  title: string;
  date: string;
  content: string;
  contentHtml?: string;
  songTitle: string;
  songArtist: string;
  songLyrics: string;
  spotifyUrl?: string | null;
  spotifyTrackId?: string;
  isPreview?: boolean;
}

export function Message({
  title,
  date,
  content,
  contentHtml,
  songTitle,
  songArtist,
  songLyrics,
  spotifyUrl,
  spotifyTrackId,
  isPreview = false,
}: MessageProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate spotify embed URL from either direct URL or track ID
  const getSpotifyEmbedUrl = () => {
    if (spotifyUrl && spotifyUrl.includes("embed")) {
      return spotifyUrl;
    } else if (spotifyTrackId) {
      return `https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`;
    }
    return null;
  };

  const embedUrl = getSpotifyEmbedUrl();

  return (
    <div
      className={`bg-black/60 backdrop-blur-lg rounded-xl ${
        !isPreview ? "p-4 md:p-6" : "p-0"
      } shadow-xl border border-pink-500/30 ${
        isPreview
          ? "overflow-hidden"
          : "hover:border-pink-400/50 transition-all duration-300"
      }`}
    >
      <div
        className={`${
          isPreview
            ? "px-6 py-5 border-b border-pink-500/20"
            : "flex justify-between items-start mb-4"
        }`}
      >
        <div>
          <h3
            className={`${
              isPreview
                ? "text-xl font-bold text-pink-300 mb-1"
                : "text-lg md:text-xl font-bold text-pink-300 romantic-glow"
            }`}
          >
            {title || "Message Title"}
          </h3>
          <p
            className={`${
              isPreview
                ? "text-sm text-pink-200 opacity-80"
                : "text-pink-400 text-xs md:text-sm"
            }`}
          >
            {formatDate(date) || "Date"}
          </p>
        </div>
        {!isPreview && <div className="text-xl md:text-2xl">🌸</div>}
      </div>

      <div className={isPreview ? "p-6 space-y-4" : ""}>
        {/* Content */}
        {contentHtml ? (
          <div
            className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 prose prose-invert prose-pink max-w-none"
            dangerouslySetInnerHTML={{
              __html: contentHtml,
            }}
          />
        ) : (
          <p className="text-pink-200 italic mb-6">
            {isPreview ? "Message content will appear here..." : content}
          </p>
        )}

        {/* Song section */}
        <div
          className={`${
            isPreview
              ? "pt-4 border-t border-pink-500/20"
              : "bg-purple-900/30 rounded-lg p-3 md:p-4 mb-4 border border-purple-500/20"
          }`}
        >
          {!isPreview ? (
            <div className="flex items-center mb-3">
              <span className="text-base md:text-lg mr-2">🎵</span>
              <div>
                <h4 className="text-purple-300 text-sm md:text-base font-semibold">
                  {songTitle || "Song Title"}
                </h4>
                <p className="text-purple-400 text-xs md:text-sm">
                  by {songArtist || "Artist"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-pink-300 font-semibold mb-1">
              {songTitle || "Song Title"} - {songArtist || "Artist"}
            </p>
          )}

          {/* Song lyrics */}
          {songLyrics && (
            <blockquote
              className={`${
                isPreview
                  ? "text-purple-200 italic text-xs leading-relaxed mb-4 pl-4 border-l-2 border-purple-400/50"
                  : "text-purple-200 italic text-xs md:text-sm leading-relaxed mb-4 pl-2 md:pl-4 border-l-2 border-purple-400/50"
              }`}
            >
              {songLyrics.split("\n").map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line}
                  {lineIndex < songLyrics.split("\n").length - 1 && <br />}
                </span>
              ))}
            </blockquote>
          )}

          {/* Spotify embed */}
          {embedUrl && (
            <div className="rounded-lg overflow-hidden w-full mt-2">
              <iframe
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg max-w-full"
                style={{ maxWidth: "100%" }}
              ></iframe>
            </div>
          )}
          {!embedUrl && songTitle && !isPreview && (
            <div className="text-center py-2 text-purple-300 text-xs md:text-sm italic">
              <p>No Spotify embed available</p>
              <p className="text-purple-400 text-xs mt-1">
                Listen to &quot;{songTitle}&quot; by {songArtist}
              </p>
            </div>
          )}
        </div>

        {/* Sweet message footer - only in timeline view, not in preview */}
        {!isPreview && (
          <div className="text-center pt-3 md:pt-4 border-t border-pink-500/20">
            <p className="text-pink-300 text-xs md:text-sm italic">
              With all my love, Daniel 💕
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
