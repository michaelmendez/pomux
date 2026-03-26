import { AUDIO_VOLUME } from "@/constants/consts";
import { env } from "@/constants/env";
import { useSettings } from "@/contexts/useSettings";
import ProgressBar from "@/features/radio/components/ProgressBar";
import StationControls from "@/features/radio/components/StationControls";
import VolumeBar from "@/features/radio/components/VolumeBar";
import useApi from "@/hooks/useApi";
import Skeleton from "@/shared/ui/Skeleton";
import type { RadioStation } from "@/types/types";
import { toHttps } from "@/utils/toHttps";
import { useEffect, useRef, useState } from "react";

const RADIO_STATIONS_URL = env.radioStationsUrl;
const INITIAL_STATION_INDEX = 0;
const STATION_INDEX_STEP = 1;

export default function Station() {
  const { data, isLoading } = useApi<RadioStation[]>(RADIO_STATIONS_URL);
  const { settings } = useSettings();
  const [currentStationIndex, setCurrentStationIndex] = useState(INITIAL_STATION_INDEX);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (isPlaying) {
      audioRef.current.play();
    }
    setCurrentStationIndex(updatedStationIndex);
  };

  const handleVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / AUDIO_VOLUME.MAX;
    }
  };

  return (
    <>
      <div className="flex sm:hidden flex-col items-center gap-2 px-6 pt-3 pb-1">
        <p className="text-sm uppercase tracking-widest text-indigo-300 font-semibold">
          Radio Station
        </p>
        {isLoading ? (
          <Skeleton className="mt-1 h-5 w-44 rounded-md" />
        ) : (
          <p className="mt-1 text-base font-semibold text-white/80 truncate">
            {data?.[currentStationIndex]?.name ?? "Unknown Station"}
          </p>
        )}
        <StationControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPrev={() => handleNextPrev("prev")}
          onNext={() => handleNextPrev("next")}
        />
        <VolumeBar onChange={handleVolume} />
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
                {data?.[currentStationIndex]?.name ?? "Unknown Station"}
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
      {settings.isWaveEnabled && (
        <div className="hidden sm:flex justify-center px-6 pt-1 pb-2">
          <ProgressBar isPlaying={isPlaying} />
        </div>
      )}
    </>
  );
}
