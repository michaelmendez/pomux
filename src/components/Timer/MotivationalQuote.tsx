import Skeleton from "@/components/Common/Skeleton";
import { env } from "@/constants/env";
import useApi from "@/hooks/useApi";
import type { MotivationalQuote } from "@/types/types";
import { useEffect, useState } from "react";

const MOTIVATIONAL_QUOTES_URL = env.quotesUrl;
const QUOTE_ROTATION_MS = 30000;
const QUOTE_TRANSITION_MS = 400;

const FALLBACK_QUOTES: MotivationalQuote[] = [
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain", h: "" },
  { q: "Focus on being productive instead of busy.", a: "Tim Ferriss", h: "" },
  {
    q: "You don't have to be great to start, but you have to start to be great.",
    a: "Zig Ziglar",
    h: "",
  },
  { q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson", h: "" },
  { q: "Either you run the day or the day runs you.", a: "Jim Rohn", h: "" },
];

export default function MotivationalQuote() {
  const { data, error, isLoading } = useApi<MotivationalQuote[]>(MOTIVATIONAL_QUOTES_URL);
  const quotes = error || !data || data.length === 0 ? FALLBACK_QUOTES : data;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setActiveIndex(0);
    setIsVisible(true);
  }, [quotes.length]);

  useEffect(() => {
    if (quotes.length < 2) return;

    let switchTimeoutId: ReturnType<typeof window.setTimeout> | undefined;

    const intervalId = window.setInterval(() => {
      setIsVisible(false);

      switchTimeoutId = window.setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, QUOTE_TRANSITION_MS);
    }, QUOTE_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
      if (switchTimeoutId) {
        window.clearTimeout(switchTimeoutId);
      }
    };
  }, [quotes.length]);

  const displayQuote = quotes[activeIndex % quotes.length];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 w-full max-w-xs sm:max-w-md md:max-w-lg text-center px-4">
        <Skeleton className="h-4 w-11/12 rounded-md" />
        <Skeleton className="h-4 w-8/12 rounded-md" />
        <Skeleton className="mt-1 h-3 w-28 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 w-full max-w-xs sm:max-w-md md:max-w-lg text-center px-4">
      <div
        className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        <blockquote className="text-sm italic text-zinc-300 leading-relaxed">
          &ldquo;{displayQuote?.q}&rdquo;
        </blockquote>
        <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
          — {displayQuote?.a}
        </span>
      </div>
    </div>
  );
}
