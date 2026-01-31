import Link from "next/link";
import { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  href,
  children,
  className = "",
  onClick,
}: ButtonProps) {
  const baseStyles = `
    inline-block px-6 py-3
    bg-[#EE2737] text-white
    font-semibold
    rounded-[20px]
    shadow-lg
    hover:bg-[#d81f2e]
    transition-all duration-300 cursor-pointer
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
    <button onClick={onClick} className={baseStyles}>
      {children}
    </button>
  );
}
