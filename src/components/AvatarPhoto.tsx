import React, { useState } from "react";

interface AvatarPhotoProps {
  src?: string;
  name: string;
  fallbackInitials: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  medalRing?: "gold" | "silver" | "bronze" | "none";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm font-semibold",
  lg: "w-14 h-14 text-base font-bold",
  xl: "w-20 h-20 text-xl font-bold",
  "2xl": "w-28 h-28 text-2xl font-bold",
};

const medalRingClasses = {
  gold: "border-2 border-[#d4af37] shadow-[0_2px_8px_rgba(212,175,55,0.25)]",
  silver: "border-2 border-[#b0b0b0] shadow-[0_2px_8px_rgba(176,176,176,0.2)]",
  bronze: "border-2 border-[#c87d55] shadow-[0_2px_8px_rgba(200,125,85,0.2)]",
  none: "border border-[#3a434d]",
};

export const AvatarPhoto: React.FC<AvatarPhotoProps> = ({
  src,
  name,
  fallbackInitials,
  size = "md",
  className = "",
  medalRing = "none",
}) => {
  const [imgError, setImgError] = useState(false);

  const ringStyle = medalRingClasses[medalRing];
  const sizeStyle = sizeClasses[size];

  if (src && !imgError) {
    return (
      <div
        className={`relative inline-block rounded-full overflow-hidden shrink-0 select-none bg-[#1a1f26] ${sizeStyle} ${ringStyle} ${className}`}
      >
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#242b33] text-[#e8e8e8] shrink-0 select-none tracking-normal ${sizeStyle} ${ringStyle} ${className}`}
      style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}
      title={name}
    >
      <span>{fallbackInitials}</span>
    </div>
  );
};
