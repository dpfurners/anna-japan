"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { FloatingHearts } from "@/components/FloatingHearts";
import Link from "next/link";
import { Message } from "@/components/Message";

export default function EditMessage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { slug } = params;

  const [formData, setFormData] = useState({
    date: "",
    title: "",
    content: "",
    songTitle: "",
    songArtist: "",
    spotifyTrackId: "",
    songLyrics: "",
    published: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in as author
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "author") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch the current day data
  useEffect(() => {
    const fetchDay = async () => {
      try {
        if (!slug) return;

        const response = await fetch(`/api/author/day/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch day data");
        }

        const data = await response.json();
        setFormData({
          date: data.date,
          title: data.title,
          content: data.content,
          songTitle: data.songTitle,
          songArtist: data.songArtist,
          spotifyTrackId: data.spotifyTrackId || "",
          songLyrics: data.songLyrics || "",
          published: data.published,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "author" && slug) {
      fetchDay();
    }
  }, [session, slug]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle Spotify URL extraction
    if (name === "spotifyTrackId") {
      // Check if it's a Spotify URL and extract ID
      const spotifyUrlRegex =
        /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
      const match = value.match(spotifyUrlRegex);

      if (match && match[1]) {
        // Extract the ID from the URL
        setFormData((prev) => ({ ...prev, [name]: match[1] }));
      } else {
        // Not a URL, use as-is
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Normal handling for other fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const response = await fetch(`/api/author/update-day/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update message");
      }

      // Redirect to the dashboard on success
      router.push("/author");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-pink-300 text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "authenticated" && session.user.role === "author") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <FloatingHearts />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-4xl font-bold text-pink-300 drop-shadow-lg">
                Edit Message
              </h1>

              <Link
                href="/author"
                className="px-4 py-2 bg-black/40 text-pink-300 rounded-lg hover:bg-black/60 transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </header>

          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-pink-300 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      disabled // Date should not be editable as it's the slug
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100 opacity-70"
                    />
                    <p className="text-pink-400 text-xs mt-1">
                      Date cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-pink-300 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Message Title"
                      required
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pink-300 mb-2">
                    Message Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Your message to Anna..."
                    required
                    rows={8}
                    className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100 font-mono"
                  />
                  <p className="text-pink-400 text-xs mt-1">
                    Supports markdown formatting
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Song Title
                    </label>
                    <input
                      type="text"
                      name="songTitle"
                      value={formData.songTitle}
                      onChange={handleChange}
                      placeholder="Song Title"
                      required
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>

                  <div>
                    <label className="block text-pink-300 mb-2">
                      Song Artist
                    </label>
                    <input
                      type="text"
                      name="songArtist"
                      value={formData.songArtist}
                      onChange={handleChange}
                      placeholder="Artist Name"
                      required
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pink-300 mb-2">
                    Spotify Track Link or ID
                  </label>
                  <input
                    type="text"
                    name="spotifyTrackId"
                    value={formData.spotifyTrackId}
                    onChange={handleChange}
                    placeholder="https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a or just the ID"
                    className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                  />
                  <p className="text-pink-400 text-xs mt-1">
                    Paste the full Spotify share link or just the track ID
                  </p>
                </div>

                <div>
                  <label className="block text-pink-300 mb-2">
                    Song Lyrics
                  </label>
                  <textarea
                    name="songLyrics"
                    value={formData.songLyrics}
                    onChange={handleChange}
                    placeholder="Add a few lines of lyrics here..."
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100 font-mono"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-pink-500 rounded focus:ring-pink-400"
                  />
                  <label htmlFor="published" className="ml-2 text-pink-300">
                    Published
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all ${
                      saving ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview */}
            <div>
              <h2 className="text-xl text-pink-300 mb-4">Message Preview</h2>
              <Message
                content={formData.content}
                title={formData.title}
                date={formData.date}
                songTitle={formData.songTitle}
                songArtist={formData.songArtist}
                spotifyTrackId={formData.spotifyTrackId}
                songLyrics={formData.songLyrics}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
