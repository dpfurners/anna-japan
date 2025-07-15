"use client";

import { useState, useEffect } from "react";
import { markdownToHtml } from "@/lib/markdown";
import { Message } from "@/components/Message";

interface PreviewProps {
  content: string;
  title: string;
  date: string;
  songTitle: string;
  songArtist: string;
  spotifyTrackId: string;
  songLyrics: string;
}

export function MessagePreview({
  content,
  title,
  date,
  songTitle,
  songArtist,
  spotifyTrackId,
  songLyrics,
}: PreviewProps) {
  const [contentHtml, setContentHtml] = useState<string>("");

  useEffect(() => {
    const convertMarkdown = async () => {
      if (content) {
        const html = await markdownToHtml(content);
        setContentHtml(html);
      }
    };

    convertMarkdown();
  }, [content]);

  // If no content is provided, show a placeholder message
  if (!content && !title) {
    return (
      <div className="text-center py-6">
        <p className="text-pink-300">
          Fill in the form fields to see a preview
        </p>
      </div>
    );
  }

  return (
    <Message
      title={title}
      date={date}
      content={content}
      contentHtml={contentHtml}
      songTitle={songTitle}
      songArtist={songArtist}
      songLyrics={songLyrics}
      spotifyTrackId={spotifyTrackId}
      isPreview={true}
    />
  );
}
