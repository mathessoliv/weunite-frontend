import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  title?: string;
  className?: string;
  isVertical?: boolean;
}

export default function VideoPlayer({
  src,
  thumbnail,
  title,
  className = "",
  isVertical = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = async () => {
    try {
      if (containerRef.current) {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          await containerRef.current.requestFullscreen();

          // ✅ CORRIGIDO: Asserção de tipo para lock
          if (
            isVertical &&
            typeof screen !== "undefined" &&
            screen.orientation &&
            typeof (screen.orientation as any).lock === "function"
          ) {
            try {
              await (screen.orientation as any).lock("portrait");
            } catch (e) {
              console.log("Screen orientation lock não disponível");
            }
          }
          setIsFullscreen(true);
        }
      }
    } catch (error) {
      console.error("Erro ao entrar em fullscreen:", error);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.currentTarget;
    setCurrentTime(target.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.currentTarget;
    setDuration(target.duration);
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime + seconds,
      );
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const maxHeightClass = isVertical ? "max-h-[500px]" : "max-h-[400px]";

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black/90 rounded-xl overflow-hidden group ${maxHeightClass} ${className} ${
        isFullscreen && isVertical
          ? "!fixed !inset-0 !rounded-none !max-h-none !z-50"
          : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
    >
      {/* ✅ Vídeo */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className={`w-full h-full object-contain ${
          isVertical ? "max-h-[500px]" : "max-h-[400px]"
        } ${isFullscreen ? "!max-h-none" : ""}`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={handlePlayPause}
      />

      {/* ✅ Gradient overlay topo (título) */}
      {title && !isFullscreen && (
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent flex items-center px-4">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      )}

      {/* ✅ Large play button - Center */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
          onClick={handlePlayPause}
        >
          <div className="absolute inset-0 bg-black/20 group-hover/play:bg-black/40 transition-colors duration-300" />
          <div className="relative">
            {/* ✅ CORRIGIDO: Aura branca */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
            {/* ✅ Play button branco */}
            <button
              className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 hover:from-white/40 hover:to-white/20 backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110 border border-white/40"
              aria-label="Play"
            >
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Controles Bottom - Design Limpo */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ✅ Barra de progresso - VERDE */}
        <div className="relative h-1 bg-white/10 group cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-600"
            style={{ width: `${progressPercentage}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressBarChange}
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 w-full opacity-0 cursor-pointer appearance-none"
          />
          {/* Indicator on hover - VERDE */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-green-500/50"
            style={{
              left: `${progressPercentage}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        {/* ✅ Controles */}
        <div className="bg-gradient-to-t from-black/95 via-black/80 to-black/0 px-4 py-3 flex items-center justify-between gap-3">
          {/* ✅ Esquerda: Skip Back + Play + Skip Forward + Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSkip(-15)}
              className="p-2.5 hover:bg-white/15 rounded-lg transition-all duration-200 text-white hover:text-green-400"
              title="Voltar 15s"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={handlePlayPause}
              className="p-2.5 hover:bg-white/15 rounded-lg transition-all duration-200 text-white hover:text-green-400"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>

            <button
              onClick={() => handleSkip(15)}
              className="p-2.5 hover:bg-white/15 rounded-lg transition-all duration-200 text-white hover:text-green-400"
              title="Avançar 15s"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* ✅ Volume com barra preenchida */}
            <div className="flex items-center gap-2 ml-2 group/vol">
              <button
                onClick={handleMuteToggle}
                className="p-2.5 hover:bg-white/15 rounded-lg transition-all duration-200 text-white hover:text-green-400"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : volume > 0.5 ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <Volume1 className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center gap-2 max-w-0 group-hover/vol:max-w-xs transition-all duration-300 overflow-hidden">
                {/* ✅ NOVO: Barra de volume com preenchimento visual */}
                <div className="relative h-1 w-16 bg-white/20 rounded-full group-hover/vol:h-1.5 transition-all duration-200 cursor-pointer overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-200"
                    style={{ width: `${volume * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 w-full opacity-0 cursor-pointer appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Direita: Tempo + Fullscreen */}
          <div className="flex items-center gap-3">
            {/* ✅ CORRIGIDO: Tempo ao lado do fullscreen */}
            <span className="text-xs text-white/60 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button
              onClick={handleFullscreen}
              className="p-2.5 hover:bg-white/15 rounded-lg transition-all duration-200 text-white hover:text-green-400"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Indicador de loading - VERDE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && !duration && (
          <div className="animate-spin">
            <div className="w-8 h-8 border-2 border-white/20 border-t-green-400 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
