import { env } from "@/constants/env";
import useApi from "@/hooks/useApi";
import type { MotivationalQuote } from "@/types/types";

const MOTIVATIONAL_QUOTES_URL = env.quotesUrl;

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

function getRandomFallback(): MotivationalQuote {
  return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
}

export default function MotivationalQuote() {
  const { data, error, isLoading } = useApi<MotivationalQuote[]>(MOTIVATIONAL_QUOTES_URL);
  const [quote] = data ?? [];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const displayQuote = error ? getRandomFallback() : quote;

  return (
    <div className="flex flex-col items-center gap-1 w-full max-w-xs sm:max-w-md md:max-w-lg text-center px-4">
      <blockquote className="text-sm italic text-zinc-300 leading-relaxed">
        &ldquo;{displayQuote?.q}&rdquo;
      </blockquote>
      <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
        — {displayQuote?.a}
      </span>
    </div>
  );
}
