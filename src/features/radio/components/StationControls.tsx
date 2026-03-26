import Button from "@/shared/ui/Button";
import { ICON_SIZE } from "@/constants/consts";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Props = {
  isPlaying: boolean;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function StationControls({ isPlaying, onPlay, onPrev, onNext }: Readonly<Props>) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button onClick={onPrev} title="Previous">
        <ChevronLeft size={ICON_SIZE.SM} />
      </Button>
      <Button onClick={onPlay} title={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <Pause size={ICON_SIZE.MD} /> : <Play size={ICON_SIZE.MD} />}
      </Button>
      <Button onClick={onNext} title="Next">
        <ChevronRight size={ICON_SIZE.SM} />
      </Button>
    </div>
  );
}
