import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState, useEffect } from "react";

interface SafeLottieProps {
  src: string;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function SafeLottie({
  src,
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
  className = "",
}: SafeLottieProps) {
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false);
    setKey((prev) => prev + 1);
  }, [src]);

  if (hasError) {
    // Fallback UI when Lottie fails to load
    return (
      <div
        style={{ width, height }}
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
      >
        <div className="text-center text-muted-foreground">
          <svg
            className="w-16 h-16 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  try {
    return (
      <DotLottieReact
        key={key}
        src={src}
        loop={loop}
        autoplay={autoplay}
        style={{ width, height }}
        className={className}
      />
    );
  } catch (error) {
    console.error("Lottie render error:", error);
    setHasError(true);
    return null;
  }
}
