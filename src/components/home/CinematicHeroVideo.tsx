import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CinematicHeroVideo: React.FC = () => {
  const { settings } = useStore();
  const videoConfig = settings.heroVideo;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [autoplayFailed, setAutoplayFailed] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const videoUrl =
    videoConfig?.videoUrl ||
    '/assets/aistudio/Add_hero_video_to_homepage_0d586848_aa5d6908.mp4';
  const posterUrl =
    videoConfig?.posterUrl || '/assets/aistudio/hero_video_poster.jpg';
  const heading = videoConfig?.heading || 'Elegance in Every Thread.';
  const subtitle =
    videoConfig?.subtitle || 'Discover Premium Fashion & Timeless Style.';
  const buttonText = videoConfig?.buttonText || 'Explore Collection';
  const buttonLink = videoConfig?.buttonLink || '/shop';
  const overlayOpacity = (videoConfig?.overlayOpacity ?? 45) / 100;

  // Handle initial autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly set muted property to ensure browser allows autoplay
    video.muted = true;
    setIsMuted(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAutoplayFailed(false);
        })
        .catch((error) => {
          console.warn('Autoplay failed, awaiting user interaction:', error);
          setAutoplayFailed(true);
          setIsPlaying(false);
        });
    }
  }, [videoUrl]);

  const handleManualPlay = () => {
    if (!videoRef.current) return;
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setAutoplayFailed(false);
      })
      .catch((err) => {
        console.error('Manual play error:', err);
      });
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayFailed(false);
        })
        .catch((err) => console.error(err));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true));
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  };

  if (videoConfig && videoConfig.enabled === false) {
    return null;
  }

  return (
    <section
      className="relative w-full h-[80vh] sm:h-[85vh] lg:h-[90vh] min-h-[560px] overflow-hidden bg-stone-950 select-none"
      aria-label="Cinematic Brand Hero"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setIsVideoLoaded(true)}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          setIsPlaying(true);
          setAutoplayFailed(false);
        }}
        onPause={() => setIsPlaying(false)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-80'
        }`}
      />

      {/* Luxury Cinematic Gradient & Tint Overlays */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          backgroundColor: `rgba(12, 10, 9, ${overlayOpacity})`,
        }}
      />

      {/* Cinematic Vignette (darker at bottom for readable text and smooth blend) */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70 pointer-events-none" />

      {/* Subtle royal gold mesh pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      {/* Center Fallback / Autoplay Prompt */}
      {autoplayFailed && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-950/40 backdrop-blur-[2px]">
          <button
            onClick={handleManualPlay}
            className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
            aria-label="Play cinematic fashion film"
          >
            <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-stone-950" />
          </button>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-amber-200 drop-shadow">
            Click to Play Film
          </p>
        </div>
      )}

      {/* Foreground Brand & Cinematic Typography Content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-10 sm:py-14">
        {/* Top Floating Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-stone-900/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AL-HARAM CLOTH STORE • HAUTE COUTURE</span>
          </div>

          {/* Video Control Pills (Mute, Play/Pause, Restart) */}
          <div className="flex items-center gap-2 bg-stone-900/70 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition"
              title={isPlaying ? 'Pause film' : 'Play film'}
              aria-label={isPlaying ? 'Pause film' : 'Play film'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition"
              title={isMuted ? 'Unmute film' : 'Mute film'}
              aria-label={isMuted ? 'Unmute film' : 'Mute film'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
            <button
              onClick={handleRestart}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition hidden sm:block"
              title="Replay from start"
              aria-label="Replay from start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Main Content Block */}
        <div className="max-w-3xl space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {/* Brand Logo & Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase">
              <span className="w-8 h-px bg-amber-400/80" />
              <span>Royal Heritage Couture</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider text-amber-100/90 drop-shadow-md">
              AL-HARAM CLOTH STORE
            </h2>
          </div>

          {/* Primary Heading */}
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-xl">
            {heading}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-stone-200/90 font-light max-w-2xl leading-relaxed drop-shadow">
            {subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={buttonLink}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm tracking-widest uppercase transition-all shadow-xl shadow-amber-950/60 hover:shadow-amber-400/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-stone-900/60 hover:bg-stone-900/90 text-white font-medium px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm tracking-widest uppercase backdrop-blur-md border border-white/20 hover:border-amber-400/50 transition-all"
            >
              <span>View Collections</span>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Video Progress Bar & Scroll Indicator */}
        <div className="flex items-end justify-between pt-6 border-t border-white/10">
          <div className="w-48 sm:w-64 space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-stone-400 font-mono">
              <span>Cinematic Film</span>
              <span>{isPlaying ? 'Playing' : 'Paused'}</span>
            </div>
            <div className="w-full h-1 bg-stone-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={scrollToNextSection}
            className="flex items-center gap-2 text-stone-300 hover:text-amber-300 text-xs tracking-wider transition group"
            aria-label="Scroll to discover more"
          >
            <span className="hidden sm:inline font-light">Scroll to Discover</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-amber-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
