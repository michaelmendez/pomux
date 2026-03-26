import Slider from "@/components/Common/Slider";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface VolumeBarProps {
  onChange?: (volume: number) => void;
  initialVolume?: number;
}

const VolumeBar = ({ onChange, initialVolume = 100 }: VolumeBarProps) => {
  const [volume, setVolume] = useState(initialVolume);
  const [prevVolume, setPrevVolume] = useState(initialVolume);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onChange?.(newVolume);
  };

  const handleMuteToggle = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
      onChange?.(0);
    } else {
      const restored = prevVolume > 0 ? prevVolume : 50;
      setVolume(restored);
      onChange?.(restored);
    }
  };

  let VolumeIcon = Volume2;
  if (volume === 0) VolumeIcon = VolumeX;
  else if (volume < 50) VolumeIcon = Volume1;

  return (
    <div className="flex items-end gap-2.5">
      <button
        onClick={handleMuteToggle}
        title={volume === 0 ? "Unmute" : "Mute"}
        className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer shrink-0 leading-none"
      >
        <VolumeIcon size={20} strokeWidth={1.75} />
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
