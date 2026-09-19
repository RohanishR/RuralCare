import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-surface-variant flex items-center justify-center shrink-0 ${sizes[size]} ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <User className="w-1/2 h-1/2 text-on-surface-variant" />
      )}
    </div>
  );
};
