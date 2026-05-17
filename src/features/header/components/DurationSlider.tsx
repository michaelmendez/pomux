import { SETTINGS_LIMITS } from "@/constants/consts";
import Slider from "@/shared/ui/Slider";

export default function DurationSlider({
  label,
  value,
  min = SETTINGS_LIMITS.MIN_MINUTES,
  max = SETTINGS_LIMITS.MAX_MINUTES,
  unit = "min",
  midValue,
  onChange,
}: Readonly<{
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  midValue?: number;
  onChange: (value: number) => void;
}>) {
  return (
    <div className="space-y-2 rounded-xl bg-white/2 p-5">
      <label className="block text-base text-white/90 font-medium">{label}</label>
      <Slider
        value={value}
        min={min}
        max={max}
        step={1}
        onChange={onChange}
        valueFormatter={(v) => `${v} ${unit}`}
        minLabel={`${min} ${unit}`}
        midLabel={`${midValue ?? Math.floor((min + max) / 2)} ${unit}`}
        maxLabel={`${max} ${unit}`}
      />
    </div>
  );
}
