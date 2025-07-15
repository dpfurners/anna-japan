"use client";

import { useEffect, useState } from "react";
import { markdownToHtml } from "@/lib/markdown";
import { Message } from "@/components/Message";

interface TripDay {
  id: number;
  date: string;
  title: string;
  content: string;
  contentHtml?: string;
  songTitle: string;
  songArtist: string;
  songLyrics: string;
  spotifyUrl: string | null;
}

interface TimelineText {
  empty: string;
  emptySubtext: string;
  upcoming: string;
  upcomingSubtext: string;
}

export function TripTimeline() {
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timelineFooter, setTimelineFooter] = useState<string | null>(null);
  const [timelineText, setTimelineText] = useState<TimelineText>({
    empty: "No messages from Daniel yet...",
    emptySubtext: "Check back soon for updates! 💕",
    upcoming: "More adventures and messages coming soon... 🌸",
    upcomingSubtext: "Anna, you're always in my heart ✨",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trip days
        const daysResponse = await fetch("/api/trip-days");
        if (!daysResponse.ok) {
          throw new Error("Failed to fetch trip days");
        }
        const data = await daysResponse.json();

        // Process markdown content to HTML
        for (const day of data) {
          day.contentHtml = await markdownToHtml(day.content);
        }

        setTripDays(data);

        // Fetch trip settings for footer
        const settingsResponse = await fetch("/api/trip-settings");
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          if (settings.timelineFooter) {
            setTimelineFooter(settings.timelineFooter);
          }
        }

        // Fetch site text settings
        const textResponse = await fetch("/api/site-text-settings");
        if (textResponse.ok) {
          const textSettings = await textResponse.json();
          if (textSettings.timeline) {
            setTimelineText(textSettings.timeline);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-pink-300 text-lg">
          Loading Daniel&apos;s messages for you... 💕
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-400 text-lg">
          Oops! Couldn&apos;t load the messages: {error}
        </div>
      </div>
    );
  }

  if (tripDays.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-pink-300 text-lg text-center">
          <p>{timelineText.empty}</p>
          <p className="text-sm text-pink-400 mt-2">
            {timelineText.emptySubtext}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {tripDays.map((day, index) => (
          <div key={day.id} className="relative">
            {/* Timeline line */}
            {index !== tripDays.length - 1 && (
              <div className="absolute left-4 md:left-8 top-16 w-0.5 h-full bg-gradient-to-b from-pink-400 to-transparent"></div>
            )}

            {/* Timeline dot */}
            <div className="absolute left-2 md:left-6 top-6 w-4 h-4 bg-pink-400 rounded-full border-4 border-slate-900 shadow-lg"></div>

            {/* Content card */}
            <div className="ml-8 md:ml-16">
              <Message
                title={day.title}
                date={day.date}
                content={day.content}
                contentHtml={day.contentHtml}
                songTitle={day.songTitle}
                songArtist={day.songArtist}
                songLyrics={day.songLyrics}
                spotifyUrl={day.spotifyUrl}
                isPreview={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* End message */}
      <div className="text-center mt-8 md:mt-12 py-6 md:py-8">
        <div className="inline-block bg-black/60 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-pink-500/30">
          <p className="text-pink-300 text-base md:text-lg romantic-glow">
            {timelineText.upcoming}
          </p>
          <p className="text-pink-400 text-xs md:text-sm mt-2">
            {timelineText.upcomingSubtext}
          </p>
        </div>
      </div>

      {/* Custom footer from settings */}
      {timelineFooter && (
        <div className="text-center mt-6 mb-10">
          <p className="text-pink-300/80 text-xs md:text-sm italic romantic-glow">
            {timelineFooter}
          </p>
        </div>
      )}
    </div>
  );
}
