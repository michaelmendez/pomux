import React, { useEffect, useRef } from "react";
import styles from "./Slider.module.css";

const DEFAULT_SLIDER_VALUE = 100;
const DEFAULT_SLIDER_MIN = 0;
const DEFAULT_SLIDER_MAX = 100;
const DEFAULT_SLIDER_STEP = 1;
const MIDPOINT_DIVISOR = 2;

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
  value = DEFAULT_SLIDER_VALUE,
  onChange,
  min = DEFAULT_SLIDER_MIN,
  max = DEFAULT_SLIDER_MAX,
  step = DEFAULT_SLIDER_STEP,
  label,
  minLabel,
  midLabel,
  maxLabel,
  showTicks = true,
  showValueBubble = true,
  valueFormatter = (v) => `${v}`,
  className,
}: SliderProps) => {
  const sliderRef = useRef<HTMLInputElement | null>(null);

  const range = max - min;
  const pct = range <= 0 ? 0 : ((value - min) / range) * 100;

  useEffect(() => {
    sliderRef.current?.style.setProperty("--value", `${pct}%`);
  }, [pct]);

  const handleSliderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    onChange?.(next);
  };

  const midTick = midLabel ?? `${Math.round((min + max) / MIDPOINT_DIVISOR)}`;

  return (
    <div className={className ?? "w-full"}>
      {label && <p className="text-sm text-white/75 mb-1 font-medium">{label}</p>}
      <div className="relative">
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderInput}
          className={`${styles.slider} w-full`}
          aria-label={label ?? "slider"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={valueFormatter(value)}
        />
        {showValueBubble && (
          <div className="absolute -top-7 right-0 text-sm font-medium text-white bg-white/10 px-2 py-0.5 rounded">
            {valueFormatter(value)}
          </div>
        )}
      </div>
      {showTicks && (
        <div className="mt-2.5 flex justify-between text-sm font-medium text-white/75">
          <span>{minLabel ?? `${min}`}</span>
          <span>{midTick}</span>
          <span>{maxLabel ?? `${max}`}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;
