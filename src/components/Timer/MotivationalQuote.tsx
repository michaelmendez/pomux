import Skeleton from "@/components/Common/Skeleton";
import { env } from "@/constants/env";
import fallbackQuotesData from "@/data/motivationalQuotes.json";
import useApi from "@/hooks/useApi";
import type { MotivationalQuote } from "@/types/types";
import { useEffect, useRef, useState } from "react";

const MOTIVATIONAL_QUOTES_URL = env.quotesUrl;
const QUOTE_ROTATION_MS = 5 * 60 * 1000;
const QUOTE_TRANSITION_MS = 400;
const FALLBACK_QUOTES = fallbackQuotesData as MotivationalQuote[];

export default function MotivationalQuote() {
  const { data, error, isLoading } = useApi<MotivationalQuote[]>(MOTIVATIONAL_QUOTES_URL);
  const quotes = error || !data || data.length === 0 ? FALLBACK_QUOTES : data;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = 0;
    setActiveIndex(0);
    setIsVisible(true);
  }, [quotes.length]);

  useEffect(() => {
    if (quotes.length < 2) return;

    let switchTimeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;

    const intervalId = globalThis.setInterval(() => {
      setIsVisible(false);

      switchTimeoutId = globalThis.setTimeout(() => {
        const nextIndex = (activeIndexRef.current + 1) % quotes.length;
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setIsVisible(true);
      }, QUOTE_TRANSITION_MS);
    }, QUOTE_ROTATION_MS);

    return () => {
      globalThis.clearInterval(intervalId);
      if (switchTimeoutId) {
        globalThis.clearTimeout(switchTimeoutId);
      }
    };
  }, [quotes.length]);

  useEffect(() => {
    if (error) {
      console.error("[MotivationalQuote] Falling back to local quotes due to API error", {
        url: MOTIVATIONAL_QUOTES_URL,
        error,
      });
      return;
    }

    if (!isLoading && (!data || data.length === 0)) {
      console.warn(
        "[MotivationalQuote] Falling back to local quotes because API returned no data",
        {
          url: MOTIVATIONAL_QUOTES_URL,
        },
      );
    }
  }, [data, error, isLoading]);

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
