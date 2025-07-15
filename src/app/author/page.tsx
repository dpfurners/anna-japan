"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Calendar } from "@/components/Calendar";

interface DayItem {
  date: string;
  title: string;
  published: boolean;
  slug: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [days, setDays] = useState<DayItem[]>([]);
  const [tripSettings, setTripSettings] = useState({
    startDateTime: "",
    endDateTime: "",
    extraDaysBefore: 14,
    extraDaysAfter: 7,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in as author
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "author") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch days
        const daysResponse = await fetch("/api/author/days");
        if (!daysResponse.ok) {
          throw new Error("Failed to fetch days");
        }
        const daysData = await daysResponse.json();
        setDays(daysData);

        // Fetch trip settings
        const settingsResponse = await fetch("/api/trip-settings");
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setTripSettings(settingsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "author") {
      fetchData();
    }
  }, [session]);

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
          <header className="mb-12">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-4xl font-bold text-pink-300 drop-shadow-lg">
                Daniel's Dashboard
              </h1>

              <div className="flex space-x-4">
                <Link
                  href="/author/new"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  New Message
                </Link>
                <Link
                  href="/author/settings"
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-lg hover:from-pink-700 hover:to-orange-600 transition-all shadow-lg"
                >
                  Trip Settings
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all shadow-lg"
                >
                  View Main Page
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="px-4 py-2 bg-black/40 text-pink-300 rounded-lg hover:bg-black/60 transition-all"
                >
                  Logout
                </Link>
              </div>
            </div>

            <p className="text-pink-200 mt-2">
              Manage your messages for Anna here
            </p>
          </header>

          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <Calendar
            days={days}
            tripStartDate={tripSettings.startDateTime}
            tripEndDate={tripSettings.endDateTime}
            extraDaysBefore={tripSettings.extraDaysBefore}
            extraDaysAfter={tripSettings.extraDaysAfter}
          />

          {/* Message list for quick reference */}
          <div className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 shadow-xl mt-8">
            <h2 className="text-xl font-semibold text-pink-300 mb-4">
              Message List
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-pink-500/20">
                    <th className="py-3 px-4 text-pink-300">Date</th>
                    <th className="py-3 px-4 text-pink-300">Title</th>
                    <th className="py-3 px-4 text-pink-300">Status</th>
                    <th className="py-3 px-4 text-pink-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {days.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-pink-200"
                      >
                        No messages yet. Create your first one!
                      </td>
                    </tr>
                  ) : (
                    days.map((day) => (
                      <tr
                        key={day.slug}
                        className="border-b border-pink-500/10 hover:bg-pink-500/5"
                      >
                        <td className="py-3 px-4 text-pink-200">{day.date}</td>
                        <td className="py-3 px-4 text-pink-200">{day.title}</td>
                        <td className="py-3 px-4">
                          {day.published ? (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Link
                              href={`/author/edit/${day.slug}`}
                              className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-md text-sm hover:bg-blue-600/50 transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Are you sure you want to toggle the published status?"
                                  )
                                ) {
                                  try {
                                    const response = await fetch(
                                      `/api/author/toggle-publish/${day.slug}`,
                                      {
                                        method: "PUT",
                                      }
                                    );

                                    if (!response.ok) {
                                      throw new Error(
                                        "Failed to toggle publish status"
                                      );
                                    }

                                    // Refresh the data
                                    const updatedDays = days.map((d) =>
                                      d.slug === day.slug
                                        ? { ...d, published: !d.published }
                                        : d
                                    );
                                    setDays(updatedDays);
                                  } catch (err) {
                                    alert("Error updating publish status");
                                    console.error(err);
                                  }
                                }
                              }}
                              className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-md text-sm hover:bg-purple-600/50 transition-colors"
                            >
                              {day.published ? "Unpublish" : "Publish"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
