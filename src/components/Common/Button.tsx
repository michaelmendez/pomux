import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  isActive?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const styles = (baseClassName: string, isActive: boolean, disabled: boolean) => {
  let className = baseClassName;
  className += isActive ? " bg-gray-200 text-black" : " bg-transparent text-white border-2";
  className += disabled
    ? " opacity-50 cursor-not-allowed"
    : " hover:bg-gray-200 hover:text-black transition-colors duration-200";
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
}: Readonly<ButtonProps>) {
  return (
    <button
      className={styles(className, isActive, disabled)}
      onClick={onClick}
      title={title}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
