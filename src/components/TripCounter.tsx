"use client";

import { useEffect, useState } from "react";

interface SiteTextSettings {
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
}

export function TripCounter() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [tripSettings, setTripSettings] = useState<{
    startDateTime: string;
    endDateTime: string;
  }>({
    startDateTime: "",
    endDateTime: "",
  });
  const [tripStarted, setTripStarted] = useState<boolean>(false);
  const [tripEnded, setTripEnded] = useState<boolean>(false);
  const [siteText, setSiteText] = useState<SiteTextSettings>({
    counterTitle: {
      before: "Daniel's Trip to Japan 🇯🇵",
      during: "Until Daniel Returns Home ✈️",
      after: "Daniel is Home! 🎉",
    },
    counterMessage: {
      before: "The journey hasn't begun yet! Stay tuned...",
      during: "Daniel misses you every single moment 💕",
      after: "🎉 Daniel is finally home with you! 🎉",
    },
  });

  // Define calculateTimeLeft outside useEffect so it can access current state
  const calculateTimeLeft = (settings?: {
    startDateTime: string;
    endDateTime: string;
  }) => {
    const currentSettings = settings || tripSettings;
    console.log("Current tripSettings:", currentSettings);

    // If we have settings from the API, use those, otherwise fallback to env or hardcoded
    const startDateStr =
      currentSettings.startDateTime ||
      `${process.env.NEXT_PUBLIC_TRIP_START_DATE}T00:00:00` ||
      "2025-07-24T00:00:00";

    console.log("Trip start date:", startDateStr);

    const endDateStr =
      currentSettings.endDateTime ||
      `${process.env.NEXT_PUBLIC_TRIP_END_DATE}T23:59:59` ||
      "2025-10-24T23:59:59";

    const now = new Date();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    console.log("Current time:", now);
    console.log("Trip start time:", startDate);

    // Check if trip has started
    const hasStarted = now >= startDate;
    setTripStarted(hasStarted);

    console.log("Trip has started:", hasStarted);

    // Check if trip has ended
    const hasEnded = now >= endDate;
    setTripEnded(hasEnded);

    // Only calculate countdown if trip has started but not ended
    if (hasStarted) {
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch trip settings
        const tripResponse = await fetch("/api/trip-settings");
        if (tripResponse.ok) {
          const settings = await tripResponse.json();
          // Set trip settings and trigger recalculation
          const newTripSettings = {
            startDateTime: settings.startDateTime,
            endDateTime: settings.endDateTime,
          };
          setTripSettings(newTripSettings);

          // Calculate time immediately after setting new values
          calculateTimeLeft(newTripSettings);
        }

        // Fetch site text settings
        const textResponse = await fetch("/api/site-text-settings");
        if (textResponse.ok) {
          const textSettings = await textResponse.json();
          if (textSettings.counterTitle && textSettings.counterMessage) {
            setSiteText({
              counterTitle: textSettings.counterTitle,
              counterMessage: textSettings.counterMessage,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load settings");
      }
    };

    fetchSettings();
  }, []);

  // Separate useEffect for the timer that depends on tripSettings
  useEffect(() => {
    const timer = setInterval(() => calculateTimeLeft(), 1000);
    return () => clearInterval(timer);
  }, [tripSettings]); // Now it depends on tripSettings so it recreates when settings change

  if (!tripStarted) {
    // Don't show the counter if the trip hasn't started yet
    return (
      <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-pink-500/20">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-pink-300 mb-3 md:mb-4 romantic-glow">
            {siteText.counterTitle.before}
          </h2>
          <p className="text-pink-300 text-sm md:text-base romantic-glow">
            {siteText.counterMessage.before}
          </p>
        </div>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-pink-500/20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-pink-300 mb-4">
            {siteText.counterTitle.during}
          </h2>
          <div className="text-pink-400">Loading...</div>
        </div>
      </div>
    );
  }

  // If trip has ended completely
  if (tripEnded) {
    return (
      <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-pink-500/20">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-pink-300 mb-3 md:mb-4 romantic-glow">
            {siteText.counterTitle.after}
          </h2>
          <p className="text-pink-300 text-sm md:text-base romantic-glow">
            {siteText.counterMessage.after}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-pink-500/20">
      <div className="text-center">
        <h2 className="text-lg md:text-xl font-semibold text-pink-300 mb-3 md:mb-4 romantic-glow">
          {siteText.counterTitle.during}
        </h2>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          <div className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 rounded-lg md:rounded-xl p-2 md:p-4 border border-pink-400/30">
            <div className="text-lg md:text-2xl font-bold text-pink-300">
              {timeLeft.days}
            </div>
            <div className="text-xs md:text-sm text-pink-400">Days</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-lg md:rounded-xl p-2 md:p-4 border border-purple-400/30">
            <div className="text-lg md:text-2xl font-bold text-purple-300">
              {timeLeft.hours}
            </div>
            <div className="text-xs md:text-sm text-purple-400">Hours</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-900/80 to-blue-900/80 rounded-lg md:rounded-xl p-2 md:p-4 border border-blue-400/30">
            <div className="text-lg md:text-2xl font-bold text-blue-300">
              {timeLeft.minutes}
            </div>
            <div className="text-xs md:text-sm text-blue-400">Mins</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/80 to-teal-900/80 rounded-lg md:rounded-xl p-2 md:p-4 border border-teal-400/30">
            <div className="text-lg md:text-2xl font-bold text-teal-300">
              {timeLeft.seconds}
            </div>
            <div className="text-xs md:text-sm text-teal-400">Secs</div>
          </div>
        </div>
        <p className="text-pink-300 mt-3 md:mt-4 text-sm md:text-base romantic-glow">
          {siteText.counterMessage.during}
        </p>
      </div>
    </div>
  );
}
