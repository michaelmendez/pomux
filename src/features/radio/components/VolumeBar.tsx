import { AUDIO_VOLUME } from "@/constants/consts";
import Slider from "@/shared/ui/Slider";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
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

  let VolumeIcon = SpeakerWaveIcon;
  if (volume === AUDIO_VOLUME.MIN) VolumeIcon = SpeakerXMarkIcon;
  else if (volume < AUDIO_VOLUME.LOW_THRESHOLD) VolumeIcon = SpeakerWaveIcon; // low and normal uses same icon for now

  return (
    <div className="flex items-end gap-2.5">
      <button
        onClick={handleMuteToggle}
        title={volume === AUDIO_VOLUME.MIN ? "Unmute" : "Mute"}
        className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer shrink-0 leading-none"
      >
        <VolumeIcon className="h-5 w-5" />
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
