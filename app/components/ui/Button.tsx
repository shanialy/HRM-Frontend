import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
    href?: string;
    children: ReactNode;
    className?: string;
}

export default function Button({
    href = "#",
    children,
    className = "",
}: ButtonProps) {
    return (
        <Link
            href={href}
            className={`
        inline-block px-6 py-3
        bg-blue-600 text-white
        font-semibold
        rounded-[20px]
        shadow-lg
        hover:bg-blue-700
        transition-all duration-300
        ${className}
      `}
        >
            {children}
        </Link>
    );
}
