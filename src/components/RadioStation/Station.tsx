import Skeleton from "@/components/Common/Skeleton";
import ProgressBar from "@/components/RadioStation/ProgressBar";
import StationControls from "@/components/RadioStation/StationControls";
import VolumeBar from "@/components/RadioStation/VolumeBar";
import { env } from "@/constants/env";
import useApi from "@/hooks/useApi";
import type { RadioStation } from "@/types/types";
import { toHttps } from "@/utils/toHttps";
import { useEffect, useRef, useState } from "react";

const RADIO_STATIONS_URL = env.radioStationsUrl;

export default function Station() {
  const { data, isLoading } = useApi<RadioStation[]>(RADIO_STATIONS_URL);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(toHttps(data?.at(0)?.url));
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
    const total = data?.length ?? 0;
    if (!total) return;

    let updatedStationIndex: number;
    if (type === "next") {
      updatedStationIndex = currentStationIndex + 1 >= total ? 0 : currentStationIndex + 1;
    } else {
      updatedStationIndex = currentStationIndex - 1 < 0 ? total - 1 : currentStationIndex - 1;
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
      audioRef.current.volume = volume / 100;
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
      <div className="hidden sm:flex justify-center px-6 pt-1 pb-2">
        <ProgressBar isPlaying={isPlaying} />
      </div>
    </>
  );
}
