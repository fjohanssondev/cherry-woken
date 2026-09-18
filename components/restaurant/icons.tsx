import { cn } from "@/lib/utils";

/** Small chili glyph used to flag hot dishes and in the legend. */
export function Chili({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5 text-primary", className)}
    >
      <path
        d="M5 20.5c6.5 1 12.8-3 13.4-9.9.2-2.4-1-4-2.6-4-1.3 0-2.1 1-2.1 2.4 0 3-2.4 6.6-6.4 8-1.5.5-2.9.7-3.9.6-.7 0-1 .9-.4 1.4.5.5 1.4 1 2 1.5Z"
        fill="currentColor"
      />
      <path
        d="M16 6.6c.3-1.4 1.1-2.5 2.6-3"
        fill="none"
        className="stroke-emerald-600 dark:stroke-emerald-400"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn arrow that points at the review button. */
export function ScribbleArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      aria-hidden="true"
      fill="none"
      className={cn("text-gold", className)}
    >
      <path
        d="M6 20c34-14 74-6 96 22M102 42c1-9 1-16 0-21m0 0c-5 2-11 4-18 5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Stylised hanging Chinese lantern for the header. */
export function Lantern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 170"
      aria-hidden="true"
      className={cn("text-primary", className)}
    >
      {/* cord + hook */}
      <path
        d="M55 2v16"
        className="stroke-gold"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* top cap */}
      <rect x="40" y="16" width="30" height="10" rx="3" className="fill-gold" />
      {/* body */}
      <ellipse cx="55" cy="78" rx="44" ry="54" fill="currentColor" />
      {/* highlight */}
      <ellipse
        cx="44"
        cy="62"
        rx="14"
        ry="26"
        className="fill-white/15"
      />
      {/* ribs */}
      <g
        className="stroke-black/25 dark:stroke-black/35"
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M55 25C30 40 30 116 55 131" />
        <path d="M55 25C41 40 41 116 55 131" />
        <path d="M55 25C69 40 69 116 55 131" />
        <path d="M55 25C80 40 80 116 55 131" />
      </g>
      <ellipse
        cx="55"
        cy="78"
        rx="44"
        ry="54"
        fill="none"
        className="stroke-black/20"
        strokeWidth="1.5"
      />
      {/* bottom cap */}
      <rect x="40" y="130" width="30" height="10" rx="3" className="fill-gold" />
      {/* tassels */}
      <g className="stroke-primary" strokeWidth="2.5" strokeLinecap="round">
        <path d="M48 140v22" />
        <path d="M55 140v26" />
        <path d="M62 140v22" />
      </g>
      <path d="M55 166l-4 -4h8Z" className="fill-gold" />
    </svg>
  );
}
