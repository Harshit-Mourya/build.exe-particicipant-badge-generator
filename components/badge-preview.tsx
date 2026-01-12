"use client";

interface BadgePreviewProps {
  name: string;
  place: string;
  imageUrl: string;
}

export function BadgePreview({ name, place, imageUrl }: BadgePreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        id="badge-svg"
        width="1080"
        height="1440"
        viewBox="0 0 1080 1440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* ===== 1:1 PHOTO FRAME ===== */}
        <defs>
          <clipPath id="photoClip">
            {/* exact 1:1 box */}
            <rect x="125" y="188" width="795" height="660" />
          </clipPath>
        </defs>

        {/* ===== USER IMAGE ===== */}
        {imageUrl && (
          <image
            href={imageUrl}
            x="125"
            y="188"
            width="795"
            height="660"
            clipPath="url(#photoClip)"
            preserveAspectRatio="xMidYMid slice"
          />
        )}

        {/* ===== SVG TEMPLATE ON TOP ===== */}
        <image
          href="/images/main-20svg.svg"
          x="0"
          y="0"
          width="1080"
          height="1440"
        />

        {/* ===== NAME ===== */}
        <text
          x="390"
          y="1265"
          textAnchor="middle"
          fill="#000"
          fontSize="60"
          fontWeight="600"
          fontFamily="VT323"
        >
          {name || "John Doe"}
        </text>

        {/* ===== PLACE ===== */}
        <text
          x="360"
          y="1362"
          textAnchor="middle"
          fill="#000"
          fontSize="56"
          fontWeight="700"
          fontFamily="VT323"
        >
          {place || "Earth"}
        </text>
      </svg>
    </div>
  );
}
