import { AUDIO_VOLUME, ICON_SIZE } from "@/constants/consts";
import Slider from "@/shared/ui/Slider";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface VolumeBarProps {
  onChange?: (volume: number) => void;
  initialVolume?: number;
}

const VolumeBar = ({ onChange, initialVolume = AUDIO_VOLUME.DEFAULT }: VolumeBarProps) => {
  const [volume, setVolume] = useState(initialVolume);
  const [prevVolume, setPrevVolume] = useState(initialVolume);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onChange?.(newVolume);
  };

  const handleMuteToggle = () => {
    if (volume > AUDIO_VOLUME.MIN) {
      setPrevVolume(volume);
      setVolume(AUDIO_VOLUME.MIN);
      onChange?.(AUDIO_VOLUME.MIN);
    } else {
      const restored = prevVolume > AUDIO_VOLUME.MIN ? prevVolume : AUDIO_VOLUME.RESTORE_FALLBACK;
      setVolume(restored);
      onChange?.(restored);
    }
  };

  let VolumeIcon = Volume2;
  if (volume === AUDIO_VOLUME.MIN) VolumeIcon = VolumeX;
  else if (volume < AUDIO_VOLUME.LOW_THRESHOLD) VolumeIcon = Volume1;

  return (
    <div className="flex items-end gap-2.5">
      <button
        onClick={handleMuteToggle}
        title={volume === AUDIO_VOLUME.MIN ? "Unmute" : "Mute"}
        className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer shrink-0 leading-none"
      >
        <VolumeIcon size={ICON_SIZE.MD} strokeWidth={1.75} />
      </button>
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        showValueBubble={false}
        showTicks={false}
        className="w-44"
      />
      <span className="text-white/40 text-sm w-9 text-right tabular-nums font-medium shrink-0 leading-none">
        {volume}%
      </span>
    </div>
  );
};

export default VolumeBar;
