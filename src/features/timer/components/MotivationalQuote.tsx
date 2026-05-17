import fallbackQuotesData from "@/data/motivationalQuotes.json";
import type { MotivationalQuote } from "@/types/types";
import { useEffect, useRef, useReducer } from "react";

const QUOTE_ROTATION_MS = 5 * 60 * 1000;
const QUOTE_TRANSITION_MS = 400;
const quotes = fallbackQuotesData as MotivationalQuote[];

type QuoteState = {
  activeIndex: number;
  isVisible: boolean;
};

type QuoteAction =
  | { type: "FADE_OUT" }
  | { type: "FADE_IN"; index: number };

function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case "FADE_OUT":
      return { ...state, isVisible: false };
    case "FADE_IN":
      return { activeIndex: action.index, isVisible: true };
    default:
      return state;
  }
}

export default function MotivationalQuote() {
  const [state, dispatch] = useReducer(quoteReducer, {
    activeIndex: 0,
    isVisible: true,
  });
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (quotes.length < 2) return;

    let switchTimeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;

    const intervalId = globalThis.setInterval(() => {
      dispatch({ type: "FADE_OUT" });

      switchTimeoutId = globalThis.setTimeout(() => {
        const nextIndex = (activeIndexRef.current + 1) % quotes.length;
        activeIndexRef.current = nextIndex;
        dispatch({ type: "FADE_IN", index: nextIndex });
      }, QUOTE_TRANSITION_MS);
    }, QUOTE_ROTATION_MS);

    return () => {
      globalThis.clearInterval(intervalId);
      if (switchTimeoutId) {
        globalThis.clearTimeout(switchTimeoutId);
      }
    };
  }, []);

  const displayQuote = quotes[state.activeIndex % quotes.length];

  return (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-xs sm:max-w-md md:max-w-lg text-center px-4 xs:px-2">
      <div
        className={`xs:min-h-[3.9rem] transition-all duration-500 ease-out motion-reduce:transition-none ${
          state.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        <blockquote className="quote-clamp italic text-white/75 font-light">
          &ldquo;{displayQuote?.q}&rdquo;
        </blockquote>
        <cite className="mt-1.5 block text-[11px] xs:text-[10px] not-italic font-medium text-white/65 tracking-widest uppercase">
          &mdash; {displayQuote?.a}
        </cite>
      </div>
    </div>
  );
}
