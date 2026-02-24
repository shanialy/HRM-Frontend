import Link from "next/link";
import { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export default function Button({
  href,
  children,
  className = "",
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles = `
    inline-block px-6 py-3
    bg-[#EE2737] text-white
    hover:bg-[#d81f2e]
    font-semibold
    rounded-[20px]
    shadow-lg
    transition-all duration-300 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={baseStyles}>
      {children}
    </button>
  );
}
