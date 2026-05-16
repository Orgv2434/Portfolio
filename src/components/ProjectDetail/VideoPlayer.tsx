import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  videoPath: string;
  colors: string[];
  title: string;
}

export const VideoPlayer = ({ videoPath, colors, title }: VideoPlayerProps) => {
  // 判断是否是外部链接（http/https 或 b23.tv 等视频网站链接）
  const isExternalLink = videoPath.startsWith('http://') || videoPath.startsWith('https://') || videoPath.includes('b23.tv');

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (controlTimerRef.current) clearTimeout(controlTimerRef.current);
    controlTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    return () => {
      if (controlTimerRef.current) clearTimeout(controlTimerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isDraggingProgress) return;

    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!progressRef.current || !videoRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = Math.max(0, Math.min(percent * duration, duration));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };

    const handleDocumentMouseUp = () => {
      setIsDraggingProgress(false);
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [isDraggingProgress, duration]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlTimerRef.current) clearTimeout(controlTimerRef.current);
    controlTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDraggingProgress) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(newTime);
  };

  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 从 URL 提取 bilibili BV 号
  const extractBvid = (url: string): string | null => {
    const match = url.match(/(?:BV|bv)[a-zA-Z0-9]+/) ?? url.match(/b23\.tv\/([a-zA-Z0-9]+)/);
    return match ? match[0] : null;
  };

  // 如果是外部链接，显示 bilibili iframe 或链接按钮
  if (isExternalLink) {
    const bvid = extractBvid(videoPath);
    const embedUrl = bvid
      ? `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&autoplay=0`
      : null;

    return (
      <motion.div
        ref={containerRef}
        className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ background: `linear-gradient(135deg, ${colors[0]}80, ${colors[1]}80)` }}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="fullscreen"
            title={title}
          />
        ) : (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-8 text-center px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {title}
            </motion.h1>
            <motion.a
              href={videoPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              点击打开视频
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[500px] overflow-hidden cursor-pointer rounded-2xl shadow-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={togglePlay}
      onMouseMove={handleMouseMove}
      style={{
        background: `linear-gradient(135deg, ${colors[0]}80, ${colors[1]}80)`,
      }}
    >
      {/* 背景渐变层 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)`,
        }}
      />

      {/* 视频 */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster=""
        loop
        muted={isMuted}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
      >
        <source src={videoPath} type="video/mp4" />
      </video>

      {/* 加载状态 */}
      {isLoading && !hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      )}

      {/* 错误提示 */}
      {hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-white">
            <p className="text-lg">视频加载失败</p>
            <p className="text-sm text-white/60 mt-2">请刷新页面重试</p>
          </div>
        </motion.div>
      )}

      {/* 标题覆盖层 */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
        animate={{ scale: isPlaying ? 0 : 1, opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 text-center px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.h1>
        
      </motion.div>

      {/* 播放按钮 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: isPlaying ? 0 : 1, opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
          style={{
            background: `rgba(255,255,255,0.2)`,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.5)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <Play size={40} className="text-white ml-1" fill="white" />
        </motion.button>
      </motion.div>

      {/* 进度条 */}
      <div
        ref={progressRef}
        className="absolute bottom-16 left-0 right-0 py-2 cursor-pointer group flex items-center"
        onClick={handleProgressClick}
        onMouseDown={handleProgressMouseDown}
        style={{ height: '20px' }}
      >
        <div className="relative w-full h-1 bg-white/30">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -ml-1.5"
            style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 时间显示 */}
      {showControls && (
        <motion.div
          className="absolute bottom-20 right-4 text-white text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </motion.div>
      )}

      {/* 控制栏 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between"
        initial={{ y: 100 }}
        animate={{ y: showControls ? 0 : 100, opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass rounded-full px-4 py-2 flex items-center gap-4">
          <button
            className="text-white hover:text-opacity-80 transition"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            className="text-white hover:text-opacity-80 transition"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        <button
          className="glass rounded-full p-2 text-white hover:text-opacity-80 transition"
          onClick={(e) => {
            e.stopPropagation();
            handleFullscreen();
          }}
        >
          <Maximize size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};
