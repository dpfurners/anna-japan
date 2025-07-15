import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TripTimeline } from "@/components/TripTimeline";
import { TripCounter } from "@/components/TripCounter";
import { FloatingHearts } from "@/components/FloatingHearts";
import Link from "next/link";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { getSiteTextSettings } from "@/lib/settings";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const siteText = await getSiteTextSettings();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <FloatingHearts />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-300 mb-4 drop-shadow-lg">
            {siteText.siteTitle}
          </h1>
          <p className="text-lg text-pink-200 mb-4">{siteText.siteSubtitle}</p>
          <p className="text-sm text-pink-300 mb-8 italic">
            {siteText.siteThought}
          </p>
          <TripCounter />

          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex space-x-2">
            {session.user.role === "author" && (
              <Link
                href="/author"
                className="flex items-center px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-pink-200 rounded-full text-sm transition-colors duration-200"
              >
                <FaTachometerAlt className="mr-1" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link
              href="/api/auth/signout"
              className="flex items-center px-3 py-2 bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 rounded-full text-sm transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-1" />
              <span>Logout</span>
            </Link>
          </div>
        </header>

        <main>
          <TripTimeline />
        </main>
      </div>
    </div>
  );
}
