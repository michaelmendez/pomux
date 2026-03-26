import type { ReactNode } from "react";

type ButtonVariant = "default" | "cta";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  isActive?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
};

const styles = (
  baseClassName: string,
  isActive: boolean,
  disabled: boolean,
  variant: ButtonVariant,
) => {
  let className = baseClassName;

  if (variant === "cta") {
    className += isActive
      ? " bg-white/10 border border-white/20 text-white"
      : " bg-violet-600 border-0 text-white shadow-lg shadow-violet-950/50";
    const ctaHover = isActive
      ? " hover:bg-white/15 transition-all duration-200"
      : " hover:bg-violet-500 transition-all duration-200";
    className += disabled ? " opacity-50 cursor-not-allowed" : ctaHover;
  } else {
    className += isActive
      ? " bg-white/90 text-zinc-900 border-transparent"
      : " bg-transparent text-white/90 border border-white/35";
    className += disabled
      ? " opacity-40 cursor-not-allowed"
      : " hover:bg-white/10 hover:text-white transition-colors duration-200";
  }

  return className;
};

export default function Button({
  onClick,
  children,
  title,
  isActive = false,
  className = "font-semibold rounded-full px-4 py-2 text-sm xs:px-3 xs:py-1.5 xs:text-xs",
  disabled = false,
  type = "button",
  variant = "default",
}: Readonly<ButtonProps>) {
  return (
    <button
      className={styles(className, isActive, disabled, variant)}
      onClick={onClick}
      title={title}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
