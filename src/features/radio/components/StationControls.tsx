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
        <ChevronLeftIcon className="size-4" />
      </Button>
      <Button onClick={onPlay} title={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
      </Button>
      <Button onClick={onNext} title="Next">
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
