import { AUDIO_VOLUME } from "@/constants/consts";
import { env } from "@/constants/env";
import ProgressBar from "@/features/radio/components/ProgressBar";
import StationControls from "@/features/radio/components/StationControls";
import VolumeBar from "@/features/radio/components/VolumeBar";
import useApi from "@/hooks/useApi";
import Skeleton from "@/shared/ui/Skeleton";
import type { RadioStation } from "@/types/types";
import { toHttps } from "@/utils/toHttps";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

const RADIO_STATIONS_URL = env.radioStationsUrl;
const INITIAL_STATION_INDEX = 0;
const STATION_INDEX_STEP = 1;

export default function Station() {
  const { data, isLoading } = useApi<RadioStation[]>(RADIO_STATIONS_URL);
  const [currentStationIndex, setCurrentStationIndex] = useState(INITIAL_STATION_INDEX);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(AUDIO_VOLUME.DEFAULT);
  const stationName = data?.[currentStationIndex]?.name;

  useEffect(() => {
    audioRef.current = new Audio(toHttps(data?.at(INITIAL_STATION_INDEX)?.url));
  }, [data]);

  const handlePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextPrev = (type: "next" | "prev") => {
    const total = data?.length ?? INITIAL_STATION_INDEX;
    if (!total) return;

    let updatedStationIndex: number;
    if (type === "next") {
      updatedStationIndex =
        currentStationIndex + STATION_INDEX_STEP >= total
          ? INITIAL_STATION_INDEX
          : currentStationIndex + STATION_INDEX_STEP;
    } else {
      updatedStationIndex =
        currentStationIndex - STATION_INDEX_STEP < INITIAL_STATION_INDEX
          ? total - STATION_INDEX_STEP
          : currentStationIndex - STATION_INDEX_STEP;
    }

    audioRef.current?.pause();
    audioRef.current = new Audio(toHttps(data?.[updatedStationIndex].url));
    audioRef.current.volume = volumeRef.current / AUDIO_VOLUME.MAX;
    if (isPlaying) {
      audioRef.current.play();
    }
    setCurrentStationIndex(updatedStationIndex);
  };

  const handleVolume = (volume: number) => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume / AUDIO_VOLUME.MAX;
    }
  };

  return (
    <>
      <div className="sm:hidden w-full px-4 pt-2 pb-1">
        <button
          type="button"
          onClick={() => setIsMobileExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-left"
          aria-expanded={isMobileExpanded}
          aria-label="Toggle radio controls"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-indigo-300/90 font-semibold">
              Radio
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  isPlaying ? "bg-indigo-400 animate-pulse" : "bg-white/20"
                }`}
                aria-label={isPlaying ? "Playing" : "Stopped"}
              />
            </span>
            {isLoading ? (
              <Skeleton className="mt-1 h-4 w-28 rounded-md" />
            ) : (
              <span className="mt-0.5 block truncate text-sm font-semibold text-white/82">
                {stationName ?? "No Station"}
              </span>
            )}
          </span>
          <span className="inline-flex items-center gap-2 text-white/75">
            <span className="text-xs">{isMobileExpanded ? "Hide" : "Show"}</span>
            <span
              className={`transition-transform duration-300 ease-out ${
                isMobileExpanded ? "rotate-180" : "rotate-0"
              }`}
            >
              <ChevronDownIcon className="h-4 w-4" />
            </span>
          </span>
        </button>

        <div
          className={`grid transition-all duration-300 ease-out ${
            isMobileExpanded ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!isMobileExpanded}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col items-center gap-2 px-2 pb-1 pt-1">
              <StationControls
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPrev={() => handleNextPrev("prev")}
                onNext={() => handleNextPrev("next")}
              />
              <VolumeBar onChange={handleVolume} />
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden sm:flex items-center px-6 pt-3 pb-2">
        <div className="flex items-center w-1/3">
          <div className="flex flex-col items-start min-w-0">
            <p className="text-sm uppercase tracking-widest text-indigo-300 font-semibold">
              Radio Station
            </p>
            {isLoading ? (
              <Skeleton className="mt-2 h-5 w-48 rounded-md" />
            ) : (
              <p className="mt-1.5 text-base font-semibold text-white/80 truncate">
                {stationName ?? "No Station"}
              </p>
            )}
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <StationControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPrev={() => handleNextPrev("prev")}
            onNext={() => handleNextPrev("next")}
          />
        </div>
        <div className="flex items-center justify-end ml-auto w-1/3">
          <VolumeBar onChange={handleVolume} />
        </div>
      </div>
      <div className="hidden sm:flex justify-center px-6 pt-1 pb-2">
        <ProgressBar isPlaying={isPlaying} />
      </div>
    </>
  );
}
