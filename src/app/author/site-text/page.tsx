"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FloatingHearts } from "@/components/FloatingHearts";
import Link from "next/link";

interface SiteTextFormData {
  siteTitle: string;
  siteSubtitle: string;
  siteThought: string;
  counterTitle: {
    before: string;
    during: string;
    after: string;
  };
  counterMessage: {
    before: string;
    during: string;
    after: string;
  };
  timeline: {
    empty: string;
    emptySubtext: string;
    upcoming: string;
    upcomingSubtext: string;
  };
  login: {
    title: string;
    subtitle: string;
    footer: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    button: string;
    buttonLoading: string;
  };
  dashboard: {
    title: string;
    newButton: string;
    settingsButton: string;
    siteTextButton: string;
  };
}

export default function SiteTextSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<SiteTextFormData>({
    siteTitle: "",
    siteSubtitle: "",
    siteThought: "",
    counterTitle: {
      before: "",
      during: "",
      after: "",
    },
    counterMessage: {
      before: "",
      during: "",
      after: "",
    },
    timeline: {
      empty: "",
      emptySubtext: "",
      upcoming: "",
      upcomingSubtext: "",
    },
    login: {
      title: "",
      subtitle: "",
      footer: "",
      usernamePlaceholder: "",
      passwordPlaceholder: "",
      button: "",
      buttonLoading: "",
    },
    dashboard: {
      title: "",
      newButton: "",
      settingsButton: "",
      siteTextButton: "",
    },
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
          const response = await fetch("/api/site-text-settings");
          if (!response.ok) {
            throw new Error("Failed to fetch settings");
          }
          const data = await response.json();
          setFormData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSettings();
  }, [status, session]);

  // Handle nested form field changes
  const handleNestedChange = (
    section: keyof SiteTextFormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      // Type safety check - ensure section exists
      const sectionObj = prev[section] as Record<string, string>;
      return {
        ...prev,
        [section]: {
          ...sectionObj,
          [field]: value,
        },
      };
    });
  };

  // Handle top-level form field changes
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
      const response = await fetch("/api/author/update-site-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccessMessage("Site text settings updated successfully!");
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
                Site Text Settings
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
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Main Site Text */}
              <div>
                <h2 className="text-xl text-pink-300 mb-4 pb-2 border-b border-pink-500/20">
                  Main Site Text
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      name="siteTitle"
                      value={formData.siteTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Site Subtitle
                    </label>
                    <input
                      type="text"
                      name="siteSubtitle"
                      value={formData.siteSubtitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Site Thought
                    </label>
                    <input
                      type="text"
                      name="siteThought"
                      value={formData.siteThought}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                </div>
              </div>

              {/* Counter Text */}
              <div>
                <h2 className="text-xl text-pink-300 mb-4 pb-2 border-b border-pink-500/20">
                  Counter Text
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-md text-pink-300 mb-3">
                      Counter Titles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-pink-300 mb-2">
                          Before Trip
                        </label>
                        <input
                          type="text"
                          value={formData.counterTitle.before}
                          onChange={(e) =>
                            handleNestedChange(
                              "counterTitle",
                              "before",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                        />
                      </div>
                      <div>
                        <label className="block text-pink-300 mb-2">
                          During Trip
                        </label>
                        <input
                          type="text"
                          value={formData.counterTitle.during}
                          onChange={(e) =>
                            handleNestedChange(
                              "counterTitle",
                              "during",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                        />
                      </div>
                      <div>
                        <label className="block text-pink-300 mb-2">
                          After Trip
                        </label>
                        <input
                          type="text"
                          value={formData.counterTitle.after}
                          onChange={(e) =>
                            handleNestedChange(
                              "counterTitle",
                              "after",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md text-pink-300 mb-3">
                      Counter Messages
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-pink-300 mb-2">
                          Before Trip
                        </label>
                        <input
                          type="text"
                          value={formData.counterMessage.before}
                          onChange={(e) =>
                            handleNestedChange(
                              "counterMessage",
                              "before",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                        />
                      </div>
                      <div>
                        <label className="block text-pink-300 mb-2">
                          During Trip
                        </label>
                        <input
                          type="text"
                          value={formData.counterMessage.during}
                          onChange={(e) =>
                            handleNestedChange(
                              "counterMessage",
                              "during",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                        />
                      </div>
                      <div>
                        <label className="block text-pink-300 mb-2">
                          After Trip
                        </label>
                        <input
                          type="text"
                          value={formData.counterMessage.after}
                          onChange={(e) =>
                            handleNestedChange(
                              "counterMessage",
                              "after",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Text */}
              <div>
                <h2 className="text-xl text-pink-300 mb-4 pb-2 border-b border-pink-500/20">
                  Timeline Text
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Empty Timeline Message
                    </label>
                    <input
                      type="text"
                      value={formData.timeline.empty}
                      onChange={(e) =>
                        handleNestedChange("timeline", "empty", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Empty Timeline Subtext
                    </label>
                    <input
                      type="text"
                      value={formData.timeline.emptySubtext}
                      onChange={(e) =>
                        handleNestedChange(
                          "timeline",
                          "emptySubtext",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Timeline Footer
                    </label>
                    <input
                      type="text"
                      value={formData.timeline.upcoming}
                      onChange={(e) =>
                        handleNestedChange(
                          "timeline",
                          "upcoming",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Timeline Footer Subtext
                    </label>
                    <input
                      type="text"
                      value={formData.timeline.upcomingSubtext}
                      onChange={(e) =>
                        handleNestedChange(
                          "timeline",
                          "upcomingSubtext",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                </div>
              </div>

              {/* Login Page Text */}
              <div>
                <h2 className="text-xl text-pink-300 mb-4 pb-2 border-b border-pink-500/20">
                  Login Page Text
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Login Title
                    </label>
                    <input
                      type="text"
                      value={formData.login.title}
                      onChange={(e) =>
                        handleNestedChange("login", "title", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Login Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.login.subtitle}
                      onChange={(e) =>
                        handleNestedChange("login", "subtitle", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Login Footer
                    </label>
                    <input
                      type="text"
                      value={formData.login.footer}
                      onChange={(e) =>
                        handleNestedChange("login", "footer", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Login Button
                    </label>
                    <input
                      type="text"
                      value={formData.login.button}
                      onChange={(e) =>
                        handleNestedChange("login", "button", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                </div>
              </div>

              {/* Dashboard Text */}
              <div>
                <h2 className="text-xl text-pink-300 mb-4 pb-2 border-b border-pink-500/20">
                  Dashboard Text
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Dashboard Title
                    </label>
                    <input
                      type="text"
                      value={formData.dashboard.title}
                      onChange={(e) =>
                        handleNestedChange("dashboard", "title", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      New Message Button
                    </label>
                    <input
                      type="text"
                      value={formData.dashboard.newButton}
                      onChange={(e) =>
                        handleNestedChange(
                          "dashboard",
                          "newButton",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Trip Settings Button
                    </label>
                    <input
                      type="text"
                      value={formData.dashboard.settingsButton}
                      onChange={(e) =>
                        handleNestedChange(
                          "dashboard",
                          "settingsButton",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-pink-300 mb-2">
                      Site Text Button
                    </label>
                    <input
                      type="text"
                      value={formData.dashboard.siteTextButton}
                      onChange={(e) =>
                        handleNestedChange(
                          "dashboard",
                          "siteTextButton",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
                    />
                  </div>
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
                  {saving ? "Saving..." : "Save Site Text Settings"}
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
