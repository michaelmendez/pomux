import React, { useEffect, useState } from "react";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  minLabel?: string;
  midLabel?: string;
  maxLabel?: string;
  showTicks?: boolean;
  showValueBubble?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const Slider = ({
  value = 100,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  minLabel,
  midLabel,
  maxLabel,
  showTicks = true,
  showValueBubble = true,
  valueFormatter = (v) => `${v}`,
  className,
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setInternalValue(next);
    onChange?.(next);
  };

  const valuePct = ((internalValue - min) / (max - min)) * 100;
  const midTick = midLabel ?? `${Math.round((min + max) / 2)}`;

  return (
    <div className={className ?? "w-full"}>
      {label && <p className="text-sm text-white/75 mb-1 font-medium">{label}</p>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          className="volume-slider w-full"
          style={{
            background: `linear-gradient(to right, #8b5cf6 ${valuePct}%, rgba(255,255,255,0.08) ${valuePct}%)`,
          }}
          aria-label={label ?? "slider"}
        />
        {showValueBubble && (
          <div className="absolute -top-6 right-0 text-xs text-white bg-white/10 px-2 py-0.5 rounded">
            {valueFormatter(internalValue)}
          </div>
        )}
      </div>
      {showTicks && (
        <div className="mt-2 flex justify-between text-xs text-white/60">
          <span>{minLabel ?? `${min}`}</span>
          <span>{midTick}</span>
          <span>{maxLabel ?? `${max}`}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;
