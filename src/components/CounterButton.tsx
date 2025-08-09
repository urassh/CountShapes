import React from "react";

type Props = {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
};

export default function CounterButton({ onClick, ariaLabel, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
