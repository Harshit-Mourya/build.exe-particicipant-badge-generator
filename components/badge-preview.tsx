"use client";

interface BadgePreviewProps {
  name: string;
  place: string;
  imageUrl: string;
}

export function BadgePreview({ name, place, imageUrl }: BadgePreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto relative overflow-hidden aspect-3/4">
      {/* ================= USER IMAGE (BACKGROUND) ================= */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="User background"
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}

      {/* ================= SVG (FOREGROUND) ================= */}
      <svg
        id="badge-svg"
        width="1080"
        height="1440"
        viewBox="0 0 1080 1440"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* SVG TEMPLATE */}
        <image
          href="/images/main-20svg.svg"
          x="0"
          y="0"
          width="1080"
          height="1440"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ================= NAME (WHITE BOX) ================= */}
        <text
          x="365"
          y="1265"
          textAnchor="middle"
          fill="#000"
          fontSize="36"
          fontWeight="600"
        >
          {name || "Your Name"}
        </text>

        {/* ================= PLACE (AFTER I'm From) ================= */}
        <text x="320" y="1362" fill="#000" fontSize="40" fontWeight="700">
          {place || ""}
        </text>
      </svg>
    </div>
  );
}
