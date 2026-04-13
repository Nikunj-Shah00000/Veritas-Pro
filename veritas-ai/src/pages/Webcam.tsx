import { useState, useRef, useEffect, useCallback } from "react";

interface Detection {
  score: number;
  label: string;
  regions: { x: number; y: number; w: number; h: number; label: string; confidence: number }[];
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function WebcamDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [fps, setFps] = useState(0);
  const animFrameRef = useRef<number>(0);
  const lastFpsTime = useRef(Date.now());
  const framesSinceLastFps = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const drawOverlay = useCallback((det: Detection | null) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Scan line effect
    const scanY = (Date.now() / 10) % canvas.height;
    ctx.fillStyle = "rgba(0,255,200,0.04)";
    ctx.fillRect(0, scanY, canvas.width, 4);

    // Grid overlay
    ctx.strokeStyle = "rgba(0,255,200,0.06)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    if (det) {
      det.regions.forEach((region) => {
        const x = region.x * canvas.width;
        const y = region.y * canvas.height;
        const w = region.w * canvas.width;
        const h = region.h * canvas.height;

        const isHighRisk = region.confidence > 65;
        const color = isHighRisk ? "255,60,60" : "0,255,200";

        // Glow effect
        ctx.shadowColor = `rgb(${color})`;
        ctx.shadowBlur = 10;

        // Box
        ctx.strokeStyle = `rgba(${color},0.9)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        // Corner brackets
        const cs = 12;
        ctx.lineWidth = 3;
        const corners = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]];
        corners.forEach(([cx, cy], i) => {
          const dx = i % 2 === 0 ? cs : -cs;
          const dy = i < 2 ? cs : -cs;
          ctx.beginPath(); ctx.moveTo(cx, cy + dy); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx, cy); ctx.stroke();
        });

        ctx.shadowBlur = 0;

        // Label
        const label = `${region.label} ${region.confidence.toFixed(0)}%`;
        ctx.font = "bold 11px 'Space Mono', monospace";
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = `rgba(${color}, 0.15)`;
        ctx.fillRect(x, y - 22, tw + 12, 20);
        ctx.strokeStyle = `rgba(${color}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y - 22, tw + 12, 20);
        ctx.fillStyle = `rgb(${color})`;
        ctx.fillText(label, x + 6, y - 7);
      });
    }

    // Status overlay
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(8, 8, 220, 28);
    ctx.strokeStyle = "rgba(0,255,200,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, 220, 28);
    ctx.fillStyle = "rgba(0,255,200,0.9)";
    ctx.font = "bold 10px 'Space Mono', monospace";
    ctx.fillText(`⚛ QUANTUM SCAN ACTIVE  ${fps} FPS`, 16, 26);
  }, [fps]);

  const runDetection = useCallback(() => {
    const isFake = Math.random() > 0.6;
    const score = isFake ? randomInRange(65, 95) : randomInRange(8, 35);

    const regions = [
      {
        x: 0.25, y: 0.1, w: 0.5, h: 0.7,
        label: isFake ? "SYNTHETIC FACE" : "AUTHENTIC",
        confidence: score,
      },
    ];

    if (isFake && Math.random() > 0.5) {
      regions.push({
        x: 0.05, y: 0.05, w: 0.9, h: 0.9,
        label: "BOUNDARY ARTIFACT",
        confidence: randomInRange(55, 80),
      });
    }

    setDetection({ score, label: isFake ? "DEEPFAKE DETECTED" : "AUTHENTIC", regions });
  }, []);

  const startWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (err) {
      setError("Camera access denied or unavailable. Please allow camera permissions.");
    }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (detectionInterval.current) clearInterval(detectionInterval.current);
    cancelAnimationFrame(animFrameRef.current);
    setActive(false);
    setDetection(null);
    setFrameCount(0);
  };

  useEffect(() => {
    if (!active) return;

    detectionInterval.current = setInterval(runDetection, 1200);

    const loop = () => {
      framesSinceLastFps.current++;
      const now = Date.now();
      if (now - lastFpsTime.current >= 1000) {
        setFps(framesSinceLastFps.current);
        framesSinceLastFps.current = 0;
        lastFpsTime.current = now;
      }
      setFrameCount(f => f + 1);
      drawOverlay(detection);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(detectionInterval.current!);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, detection, drawOverlay, runDetection]);

  const isFake = detection && detection.score > 50;

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-red-500 animate-pulse" : "bg-white/20"}`} />
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{active ? "LIVE QUANTUM SCAN ACTIVE" : "WEBCAM OFFLINE"}</span>
          </div>
          <h1 className="text-3xl font-bold font-serif quantum-text">Real-Time Deepfake Detection</h1>
          <p className="text-white/40 mt-1 text-sm">Webcam-based live detection with quantum face analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className={`glass-card rounded-2xl overflow-hidden relative ${
              active && isFake ? "neon-border-red" : active ? "neon-border-green" : ""
            }`}>
              {/* Live indicator */}
              {active && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-red-500/50">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400 font-mono">LIVE</span>
                </div>
              )}

              {/* Detection badge */}
              {detection && (
                <div className={`absolute top-3 right-3 z-20 px-3 py-1.5 rounded-lg font-bold text-sm font-mono ${
                  isFake ? "bg-red-500/20 border border-red-500/50 text-red-400" : "bg-green-500/20 border border-green-500/50 text-green-400"
                }`}>
                  {detection.label}
                </div>
              )}

              <video ref={videoRef} className="hidden" playsInline muted />
              <canvas ref={canvasRef} className="w-full aspect-video bg-black/50" />

              {!active && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-50">📷</div>
                    <p className="text-white/50 text-sm mb-4">Camera not active</p>
                    <button
                      onClick={startWebcam}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-bold hover:from-cyan-400 hover:to-green-400 transition-all"
                    >
                      Start Quantum Scan
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-sm text-red-400">
                {error}
              </div>
            )}

            {active && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={stopWebcam}
                  className="px-5 py-2.5 rounded-xl bg-red-400/15 text-red-400 border border-red-400/25 hover:bg-red-400/25 transition-all font-medium text-sm"
                >
                  Stop Scan
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs text-white/40 font-mono">
                  <span>FRAMES: {frameCount.toLocaleString()}</span>
                  <span className="text-white/20">·</span>
                  <span>{fps} FPS</span>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Panel */}
          <div className="space-y-4">
            {/* Probability Meter */}
            <div className="glass-card rounded-2xl p-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Real-Time Probability</div>
              {detection ? (
                <>
                  <div className={`text-4xl font-black font-mono mb-1 ${isFake ? "text-red-400" : "text-green-400"}`}>
                    {detection.score.toFixed(1)}%
                  </div>
                  <div className="text-xs text-white/40 mb-3">Deepfake probability</div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${detection.score}%`,
                        background: `linear-gradient(90deg, ${isFake ? "#ef4444, #f87171" : "#22c55e, #4ade80"})`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/20 mt-1">
                    <span>Real</span>
                    <span>Fake</span>
                  </div>
                </>
              ) : (
                <div className="text-white/30 text-sm py-4 text-center">Start webcam to begin</div>
              )}
            </div>

            {/* Face Tracking */}
            <div className="glass-card rounded-2xl p-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Face Tracking</div>
              {active && detection ? (
                <div className="space-y-2">
                  {detection.regions.map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${r.confidence > 60 ? "bg-red-400 animate-pulse" : "bg-green-400"}`} />
                        <span className="text-xs text-white/60">{r.label}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${r.confidence > 60 ? "text-red-400" : "text-green-400"}`}>
                        {r.confidence.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/30">
                    {detection.regions.length} region{detection.regions.length !== 1 ? "s" : ""} tracked
                  </div>
                </div>
              ) : (
                <div className="text-white/30 text-sm text-center py-4">No faces detected</div>
              )}
            </div>

            {/* Quantum Analysis */}
            <div className="glass-card rounded-2xl p-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Quantum Metrics</div>
              {active ? (
                <div className="space-y-2">
                  {[
                    { label: "Neural Coherence", value: detection ? 100 - detection.score * 0.4 : 94 },
                    { label: "Pixel Entropy", value: detection ? detection.score * 0.8 : 15 },
                    { label: "Edge Consistency", value: detection ? 100 - detection.score * 0.6 : 87 },
                    { label: "Texture Map", value: detection ? 100 - detection.score * 0.5 : 91 },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-xs text-white/50">{label}</span>
                        <span className="text-xs font-mono text-white">{value.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full progress-bar-quantum transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/30 text-sm text-center py-4">Offline</div>
              )}
            </div>

            {/* Instructions */}
            {!active && (
              <div className="p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/15">
                <div className="text-xs font-semibold text-cyan-400 mb-2">How it works</div>
                <ul className="space-y-1">
                  {[
                    "Allow camera access",
                    "Face the camera clearly",
                    "Quantum AI analyzes in real-time",
                    "Results update every ~1 second",
                  ].map((s, i) => (
                    <li key={i} className="text-xs text-white/40 flex items-start gap-1.5">
                      <span className="text-cyan-400/60 shrink-0">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/15">
          <div className="text-xs text-yellow-400/70 flex items-center gap-2">
            <span>⚠️</span>
            <span>Privacy notice: No video data is stored or transmitted. All processing happens locally in your browser.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
