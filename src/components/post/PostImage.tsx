import { useState } from "react";

interface PostImageProps {
  src: string;
  alt: string;
  isVertical?: boolean;
}

export default function PostImage({
  src,
  alt,
  isVertical: initialIsVertical = false,
}: PostImageProps) {
  const [isVertical, setIsVertical] = useState(initialIsVertical);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsVertical(naturalHeight > naturalWidth);
  };

  return (
    <div
      className={`w-full rounded-sm overflow-hidden flex items-center justify-center ${
        isVertical ? "h-[500px]" : "max-h-[500px]"
      }`}
    >
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={`w-full ${
          isVertical ? "h-full object-contain" : "object-cover"
        }`}
      />
    </div>
  );
}
