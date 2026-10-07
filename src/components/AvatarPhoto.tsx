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
  md: "w-11 h-11 text-sm font-bold",
  lg: "w-16 h-16 text-lg font-bold",
  xl: "w-24 h-24 text-2xl font-black",
  "2xl": "w-32 h-32 text-3xl font-black",
};

const medalRingClasses = {
  gold: "ring-4 ring-[#F0C828] ring-offset-2 ring-offset-[#1E281E] shadow-[0_0_20px_rgba(240,200,40,0.5)]",
  silver: "ring-4 ring-[#C8D2C8] ring-offset-2 ring-offset-[#1E281E] shadow-[0_0_15px_rgba(200,210,200,0.4)]",
  bronze: "ring-4 ring-[#FF8232] ring-offset-2 ring-offset-[#1E281E] shadow-[0_0_15px_rgba(255,130,50,0.35)]",
  none: "ring-2 ring-[#007D00]/50",
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

  // Gera uma cor de gradiente consistente baseada no nome usando a paleta Stone
  const generateGradient = (str: string) => {
    const gradients = [
      "from-[#00D700] to-[#00461E]",
      "from-[#008267] to-[#00461E]",
      "from-[#217D91] to-[#00461E]",
      "from-[#87FF4B] to-[#007D00]",
      "from-[#A5FA00] to-[#00461E]",
      "from-[#235096] to-[#00461E]",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const gradient = generateGradient(name || fallbackInitials);

  if (src && !imgError) {
    return (
      <div
        className={`relative inline-block rounded-stone-pill overflow-hidden shrink-0 select-none ${sizeStyle} ${ringStyle} ${className}`}
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
      className={`relative inline-flex items-center justify-center rounded-stone-pill bg-gradient-to-br ${gradient} text-[#F5FFF5] shrink-0 select-none tracking-wider ${sizeStyle} ${ringStyle} ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
      title={name}
    >
      <span>{fallbackInitials}</span>
    </div>
  );
};

