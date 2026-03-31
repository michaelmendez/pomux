import Button from "@/shared/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

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
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <Button onClick={onPlay} title={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
      </Button>
      <Button onClick={onNext} title="Next">
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
