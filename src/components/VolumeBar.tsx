import { Volume1, Volume2, VolumeX } from "lucide-react";
import React, { useState } from "react";

interface VolumeBarProps {
  onChange?: (volume: number) => void;
  initialVolume?: number;
}

const VolumeBar = ({ onChange, initialVolume = 100 }: VolumeBarProps) => {
  const [volume, setVolume] = useState(initialVolume);
  const [prevVolume, setPrevVolume] = useState(initialVolume);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
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
    <div className="flex items-center gap-2.5">
      <button
        onClick={handleMuteToggle}
        title={volume === 0 ? "Unmute" : "Mute"}
        className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer shrink-0"
      >
        <VolumeIcon size={20} strokeWidth={1.75} />
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
        style={{
          background: `linear-gradient(to right, #8b5cf6 ${volume}%, rgba(255,255,255,0.08) ${volume}%)`,
        }}
        aria-label="Volume control"
      />
      <span className="text-white/40 text-sm w-9 text-right tabular-nums font-medium shrink-0">
        {volume}%
      </span>
    </div>
  );
};

export default VolumeBar;
