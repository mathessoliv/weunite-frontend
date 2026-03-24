import { useState, useEffect, useRef } from "react";
import { Play, Pause, Trash2, Send } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  variant?: "sender" | "receiver" | "input";
  onDelete?: () => void;
  onSend?: () => void;
}

export const AudioPlayer = ({
  src,
  variant = "receiver",
  onDelete,
  onSend,
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Styles based on variant
  const getContainerStyles = () => {
    const base =
      "flex items-center gap-3 rounded-full px-3 py-2 backdrop-blur-sm";
    switch (variant) {
      case "sender":
        return `${base} bg-black/5 dark:bg-white/10 min-w-[220px]`;
      case "receiver":
        return `${base} bg-black/5 dark:bg-white/10 min-w-[220px]`;
      case "input":
        return `${base} w-full max-w-[350px] border shadow-sm bg-background border-border`;
      default:
        return `${base} min-w-[220px]`;
    }
  };

  const getButtonStyles = () => {
    return "bg-background/80 hover:bg-background text-foreground shadow-sm";
  };

  const getSliderStyles = () => {
    return "bg-background/50 accent-foreground";
  };

  const getTextStyles = () => {
    return "text-muted-foreground font-medium";
  };

  return (
    <div className={`flex items-center gap-3 ${getContainerStyles()}`}>
      <button
        onClick={handlePlayPause}
        className={`p-2 rounded-full transition-colors flex-shrink-0 ${getButtonStyles()}`}
      >
        {isPlaying ? (
          <Pause size={18} className="fill-current" />
        ) : (
          <Play size={18} className="fill-current ml-0.5" />
        )}
      </button>

      <div className="flex flex-col flex-1 gap-1 min-w-0 justify-center -mb-3">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${getSliderStyles()}`}
        />
        <div
          className={`flex justify-between text-[10px] font-medium ${getTextStyles()}`}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {variant === "input" && (
        <div className="flex items-center gap-1 ml-1 border-l pl-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-destructive"
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          )}
          {onSend && (
            <button
              onClick={onSend}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
              title="Enviar"
            >
              <Send size={18} />
            </button>
          )}
        </div>
      )}

      <audio ref={audioRef} src={src} className="hidden" />
    </div>
  );
};
