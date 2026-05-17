import { AUDIO_VOLUME } from "@/constants/consts";
import Slider from "@/shared/ui/Slider";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";

interface VolumeBarProps {
  onChange?: (volume: number) => void;
  volume?: number;
}

const VolumeBar = ({ onChange, volume = AUDIO_VOLUME.DEFAULT }: VolumeBarProps) => {
  const previousVolumeRef = useRef<number>(volume);

  const handleVolumeChange = (newVolume: number) => {
    previousVolumeRef.current = newVolume;
    onChange?.(newVolume);
  };

  const handleMuteToggle = () => {
    if (volume === AUDIO_VOLUME.MIN) {
      onChange?.(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      onChange?.(AUDIO_VOLUME.MIN);
    }
  };

  const VolumeIcon = volume === AUDIO_VOLUME.MIN ? SpeakerXMarkIcon : SpeakerWaveIcon;

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={handleMuteToggle}
        title={volume === AUDIO_VOLUME.MIN ? "Unmute" : "Mute"}
        className="inline-flex size-5 items-center justify-center text-white/40 hover:text-white transition-colors duration-200 cursor-pointer shrink-0 leading-none"
      >
        <VolumeIcon className="size-5" />
      </button>
      <div className="w-44 flex items-center">
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          showValueBubble={false}
          showTicks={false}
          className="w-44"
        />
      </div>
      <span className="text-white/40 text-sm w-9 h-5 inline-flex items-center justify-end tabular-nums font-medium shrink-0 leading-none">
        {volume}%
      </span>
    </div>
  );
};

export default VolumeBar;
