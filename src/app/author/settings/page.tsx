"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FloatingHearts } from "@/components/FloatingHearts";
import Link from "next/link";

interface SettingsFormData {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timelineFooter: string;
  extraDaysBefore: number;
  extraDaysAfter: number;
}

export default function TripSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<SettingsFormData>({
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "23:59",
    timelineFooter: "",
    extraDaysBefore: 14,
    extraDaysAfter: 7,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in as author
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "author") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load current settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (status === "authenticated" && session?.user?.role === "author") {
        try {
          const response = await fetch("/api/trip-settings");
          if (!response.ok) {
            throw new Error("Failed to fetch settings");
          }
          const data = await response.json();

          // Split datetime into date and time parts
          const startDateTime = new Date(data.startDateTime);
          const endDateTime = new Date(data.endDateTime);

          const formatDateLocal = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          };

          const formatTimeLocal = (date: Date) => {
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
          };

          setFormData({
            startDate: formatDateLocal(startDateTime),
            startTime: formatTimeLocal(startDateTime),
            endDate: formatDateLocal(endDateTime),
            endTime: formatTimeLocal(endDateTime),
            timelineFooter: data.timelineFooter || "",
            extraDaysBefore: data.extraDaysBefore || 14,
            extraDaysAfter: data.extraDaysAfter || 7,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSettings();
  }, [status, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      // Combine date and time
      const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
      const endDateTime = `${formData.endDate}T${formData.endTime}:00`;

      const response = await fetch("/api/author/update-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDateTime,
          endDate: endDateTime,
          timelineFooter: formData.timelineFooter,
          extraDaysBefore: formData.extraDaysBefore,
          extraDaysAfter: formData.extraDaysAfter,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccessMessage("Trip settings updated successfully!");
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
                Trip Settings
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

          {successMessage && (
            <div className="bg-green-500/20 border border-green-400 text-green-200 px-4 py-3 rounded-lg text-sm mb-6">
              {successMessage}
            </div>
          )}

          <div className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl text-pink-300 mb-4">Trip Start</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-pink-300 mb-2">Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                      />
                    </div>
                    <div>
                      <label className="block text-pink-300 mb-2">Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl text-pink-300 mb-4">Trip End</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-pink-300 mb-2">Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                      />
                    </div>
                    <div>
                      <label className="block text-pink-300 mb-2">Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-pink-300 mb-2">
                  Timeline Footer Message
                </label>
                <textarea
                  name="timelineFooter"
                  value={formData.timelineFooter}
                  onChange={handleChange}
                  placeholder="Custom message to show at the bottom of the timeline..."
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                />
                <p className="text-pink-400 text-xs mt-1">
                  This message will appear at the bottom of the timeline page
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-pink-300 mb-2">
                    Extra Days Before Trip
                  </label>
                  <input
                    type="number"
                    name="extraDaysBefore"
                    value={formData.extraDaysBefore}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        extraDaysBefore: parseInt(e.target.value) || 0,
                      }))
                    }
                    min="0"
                    max="90"
                    className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                  />
                  <p className="text-pink-400 text-xs mt-1">
                    Number of days before trip start that are allowed for
                    entries
                  </p>
                </div>

                <div>
                  <label className="block text-pink-300 mb-2">
                    Extra Days After Trip
                  </label>
                  <input
                    type="number"
                    name="extraDaysAfter"
                    value={formData.extraDaysAfter}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        extraDaysAfter: parseInt(e.target.value) || 0,
                      }))
                    }
                    min="0"
                    max="90"
                    className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                  />
                  <p className="text-pink-400 text-xs mt-1">
                    Number of days after trip end that are allowed for entries
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all ${
                    saving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
