"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  "data-cursor"?: string;
};

export function MagneticButton({
  children,
  onClick,
  className = "",
  href,
  type = "button",
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  "data-cursor": dataCursor = "cta",
}: Props) {
  const cls = `filament ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cls}
        aria-label={ariaLabel}
        data-cursor={dataCursor}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      data-cursor={dataCursor}
    >
      {children}
    </button>
  );
}
