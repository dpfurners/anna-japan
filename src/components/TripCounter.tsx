"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchTripSettings = async () => {
      try {
        const response = await fetch("/api/trip-settings");
        if (response.ok) {
          const settings = await response.json();
          setTripSettings({
            startDateTime: settings.startDateTime,
            endDateTime: settings.endDateTime,
          });
        }
      } catch (error) {
        console.error("Failed to load trip settings");
      }
    };

    fetchTripSettings();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // If we have settings from the API, use those, otherwise fallback to env or hardcoded
      const startDateStr =
        tripSettings.startDateTime ||
        `${process.env.NEXT_PUBLIC_TRIP_START_DATE}T00:00:00` ||
        "2025-07-24T00:00:00";

      const endDateStr =
        tripSettings.endDateTime ||
        `${process.env.NEXT_PUBLIC_TRIP_END_DATE}T23:59:59` ||
        "2025-10-24T23:59:59";

      const now = new Date();
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // Check if trip has started
      const hasStarted = now >= startDate;
      setTripStarted(hasStarted);

      // Only calculate countdown if trip has started
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

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!tripStarted) {
    // Don't show the counter if the trip hasn't started yet
    return (
      <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-pink-500/20">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-pink-300 mb-3 md:mb-4 romantic-glow">
            Daniel's Trip to Japan 🇯🇵
          </h2>
          <p className="text-pink-300 text-sm md:text-base romantic-glow">
            The journey hasn't begun yet! Stay tuned...
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
            Until Daniel Returns Home ✈️
          </h2>
          <div className="text-pink-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-pink-500/20">
      <div className="text-center">
        <h2 className="text-lg md:text-xl font-semibold text-pink-300 mb-3 md:mb-4 romantic-glow">
          Until Daniel Returns Home ✈️
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
        {timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0 ? (
          <p className="text-pink-300 mt-3 md:mt-4 text-sm md:text-base font-medium romantic-glow">
            🎉 Daniel is finally coming home to you! 🎉
          </p>
        ) : (
          <p className="text-pink-300 mt-3 md:mt-4 text-sm md:text-base romantic-glow">
            Daniel misses you every single moment 💕
          </p>
        )}
      </div>
    </div>
  );
}
