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
  sm: "size-8 text-xs font-semibold",
  md: "size-10 text-sm font-semibold",
  lg: "size-14 text-base font-bold",
  xl: "size-20 text-xl font-bold",
  "2xl": "size-28 text-2xl font-bold",
};

// Anel branco + halo da cor da medalha
const medalRingClasses = {
  gold: "border-[3px] border-white ring-2 ring-[#d9a512]",
  silver: "border-[3px] border-white ring-2 ring-[#a9a9b1]",
  bronze: "border-[3px] border-white ring-2 ring-[#c7794b]",
  none: "",
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
        className={`relative inline-block shrink-0 select-none overflow-hidden rounded-full bg-q-soft ${sizeStyle} ${ringStyle} ${className}`}
      >
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex shrink-0 select-none items-center justify-center rounded-full bg-q-green-tint text-q-green-deep ${sizeStyle} ${ringStyle} ${className}`}
      title={name}
    >
      <span>{fallbackInitials}</span>
    </div>
  );
};
