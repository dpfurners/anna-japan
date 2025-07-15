"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  getDay,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface CalendarProps {
  days: {
    date: string;
    title: string;
    published: boolean;
    slug: string;
  }[];
  tripStartDate: string;
  tripEndDate: string;
  extraDaysBefore: number;
  extraDaysAfter: number;
}

export function Calendar({
  days,
  tripStartDate,
  tripEndDate,
  extraDaysBefore = 0,
  extraDaysAfter = 0,
}: CalendarProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const tripStart = new Date(tripStartDate);
  const tripEnd = new Date(tripEndDate);

  // Calculate actual allowed range with extra days
  const allowedStart = new Date(tripStart);
  allowedStart.setDate(allowedStart.getDate() - extraDaysBefore);

  const allowedEnd = new Date(tripEnd);
  allowedEnd.setDate(allowedEnd.getDate() + extraDaysAfter);

  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day entries for this month
  const dayMap = new Map(days.map((day) => [day.date.split("T")[0], day]));

  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Check if a date is inside the allowed range (trip dates + extra days)
  const isDateAllowed = (date: Date) => {
    const startTime = allowedStart.getTime();
    const endTime = allowedEnd.getTime();
    const dateTime = date.getTime();
    return dateTime >= startTime && dateTime <= endTime;
  };

  // Check if a date has an entry
  const hasEntry = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return dayMap.has(dateStr);
  };

  // Get entry details if exists
  const getEntry = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return dayMap.get(dateStr);
  };

  // Get the appropriate styling and behavior based on date status
  const getDayStyle = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isCurrentMonth = isSameMonth(date, currentMonth);

    // Base classes for the day
    let classes =
      "relative flex flex-col items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-lg ";

    // Different states:
    // 1. Not current month - dimmed
    if (!isCurrentMonth) {
      classes += "opacity-30 bg-slate-800/20 text-slate-500 cursor-not-allowed";
      return { classes, onClick: null, hasEntry: false, isAllowed: false };
    }

    // 2. Current date - highlight
    if (isToday(date)) {
      classes += "ring-2 ring-pink-400 ";
    }

    // 3. Has an entry - show indicator
    const entry = getEntry(date);
    if (entry) {
      classes +=
        "bg-gradient-to-br from-purple-800/60 to-pink-800/60 hover:from-purple-700/60 hover:to-pink-700/60 cursor-pointer ";
    }
    // 4. Allowed date (in trip range + extras) but no entry yet
    else if (isDateAllowed(date)) {
      classes +=
        "bg-black/40 hover:bg-black/60 cursor-pointer transition-colors ";
    }
    // 5. Outside trip range (blurred)
    else {
      classes +=
        "bg-slate-800/20 text-slate-500 blur-[0.5px] cursor-not-allowed ";
      return { classes, onClick: null, hasEntry: false, isAllowed: false };
    }

    // Text color based on entry status
    classes += entry ? "text-pink-300" : "text-pink-200";

    // Action function
    const handleClick = () => {
      if (entry) {
        // Navigate to edit page
        router.push(`/author/edit/${dateStr}`);
      } else if (isDateAllowed(date)) {
        // Navigate to new page with date pre-filled
        router.push(`/author/new?date=${dateStr}`);
      }
    };

    return {
      classes,
      onClick: handleClick,
      hasEntry: !!entry,
      isAllowed: isDateAllowed(date),
      entry,
    };
  };

  return (
    <div className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 shadow-xl">
      {/* Calendar header with month/year and navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-pink-300">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg bg-black/40 text-pink-300 hover:bg-black/60 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg bg-black/40 text-pink-300 hover:bg-black/60 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-xs md:text-sm text-pink-400 font-semibold"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Empty cells for days before the month starts */}
        {Array.from({ length: getDay(monthStart) }).map((_, index) => (
          <div
            key={`empty-start-${index}`}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        ))}

        {/* Days of the month */}
        {calendarDays.map((day) => {
          const { classes, onClick, hasEntry, isAllowed, entry } =
            getDayStyle(day);

          return (
            <div
              key={day.toString()}
              className={classes}
              onClick={onClick || undefined}
              title={
                hasEntry
                  ? `${format(day, "MMM d")}: ${entry?.title}`
                  : isAllowed
                  ? `Add entry for ${format(day, "MMM d")}`
                  : `Outside trip range`
              }
            >
              <span className="text-sm md:text-base">{format(day, "d")}</span>

              {/* Indicators */}
              {hasEntry && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-pink-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-gradient-to-br from-purple-800/60 to-pink-800/60 rounded-sm mr-2"></div>
          <span className="text-pink-200">Has entry</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-black/40 rounded-sm mr-2"></div>
          <span className="text-pink-200">Available date</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-slate-800/20 blur-[0.5px] rounded-sm mr-2"></div>
          <span className="text-slate-500">Outside trip range</span>
        </div>
      </div>
    </div>
  );
}
