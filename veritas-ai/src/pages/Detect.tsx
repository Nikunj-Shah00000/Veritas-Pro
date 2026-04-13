import { useState, useRef, useCallback } from "react";
import { generateDetectionReport, formatFileSize, detectMediaType } from "../lib/detection";
import { DetectionReport } from "../types/detection";
import QuantumRadarChart from "../components/QuantumRadarChart";
import ReportModal from "../components/ReportModal";
import AgentModal from "../components/AgentModal";

type UploadSource = "local" | "url" | "cloud";

const PROCESSING_STEPS = [
  "Initializing quantum field...",
  "Calibrating qubit array...",
  "Extracting neural signatures...",
  "Running entanglement analysis...",
  "Computing spectral fingerprint...",
  "Analyzing noise patterns...",
  "Evaluating temporal coherence...",
  "Synthesizing quantum results...",
];

export default function Detect() {
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [report, setReport] = useState<DetectionReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [uploadSource, setUploadSource] = useState<UploadSource>("local");
  const [urlInput, setUrlInput] = useState("");
  const [agentsActive, setAgentsActive] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);

  const runAnalysis = useCallback(async (fileName: string, fileSize: string, sourceUrl?: string) => {
    const mediaType = detectMediaType(fileName);
    setAnalyzing(true);
    setReport(null);
    setProgress(0);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentStep(PROCESSING_STEPS[i]);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      setProgress(((i + 1) / PROCESSING_STEPS.length) * 100);
    }

    const newReport = generateDetectionReport(fileName, fileSize, mediaType, sourceUrl);
    setReport(newReport);
    setAnalyzing(false);
  }, []);

  const handleFileChange = async (file: File) => {
    const sizeStr = formatFileSize(file.size);
    setFileInfo({ name: file.name, size: sizeStr, type: file.type || "Unknown" });

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    await runAnalysis(file.name, sizeStr);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) await handleFileChange(file);
    },
    [runAnalysis]
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFileChange(file);
  };

  const handleUrlAnalysis = async () => {
    if (!urlInput.trim()) return;
    const parts = urlInput.split("/");
    const fileName = parts[parts.length - 1] || "media_file";
    setFileInfo({ name: fileName, size: "Remote file", type: "URL" });
    setPreviewUrl(null);
    await runAnalysis(fileName, "Remote", urlInput);
  };

  const handleAgentLaunch = (agents: string[], _depth: number) => {
    setAgentsActive(agents);
  };

  const handleReset = () => {
    setReport(null);
    setFileInfo(null);
    setPreviewUrl(null);
    setProgress(0);
    setUrlInput("");
    setAgentsActive([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold font-serif quantum-text">Deepfake Detection</h1>
              <p className="text-white/40 mt-1 text-sm">Upload media and let quantum AI verify authenticity</p>
            </div>
            <div className="flex gap-3">
              {agentsActive.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-400/10 border border-purple-400/20">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs text-purple-400 font-mono">{agentsActive.length} AGENT{agentsActive.length !== 1 ? "S" : ""} ACTIVE</span>
                </div>
              )}
              <button
                onClick={() => setShowAgentModal(true)}
                className="px-4 py-2 rounded-xl glass-card border border-purple-400/20 text-purple-400 text-sm font-medium hover:border-purple-400/40 transition-all"
              >
                ⚡ Launch Agents
              </button>
              {report && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl glass-card border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white/80 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Upload Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Source Selector */}
            <div className="glass-card rounded-2xl p-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Upload Source</div>
              <div className="flex gap-2">
                {(["local", "url", "cloud"] as UploadSource[]).map(src => (
                  <button
                    key={src}
                    onClick={() => setUploadSource(src)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      uploadSource === src
                        ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {src === "local" ? "📁 Local" : src === "url" ? "🔗 URL" : "☁️ Cloud"}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Zone or URL Input */}
            {uploadSource === "local" ? (
              <div
                className={`glass-card rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 border-2 border-dashed scan-overlay ${
                  dragging ? "border-cyan-400/60 bg-cyan-400/5" : "border-white/15 hover:border-cyan-400/30"
                }`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,video/*,audio/*"
                  onChange={handleInputChange}
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-xl object-contain mb-3" />
                ) : (
                  <div className="text-5xl mb-3">
                    {dragging ? "⚡" : "📤"}
                  </div>
                )}
                <p className="text-white/60 text-sm font-medium">
                  {dragging ? "Release to analyze" : "Drop your file here"}
                </p>
                <p className="text-white/30 text-xs mt-1">or click to browse</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {["JPG", "PNG", "MP4", "MP3", "WAV", "WebM"].map(ext => (
                    <span key={ext} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/30">{ext}</span>
                  ))}
                </div>
              </div>
            ) : uploadSource === "url" ? (
              <div className="glass-card rounded-2xl p-4 space-y-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Media URL</div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com/media.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-400/40 transition-colors"
                />
                <button
                  onClick={handleUrlAnalysis}
                  disabled={!urlInput.trim() || analyzing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-bold text-sm hover:from-cyan-400 hover:to-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? "Analyzing..." : "Analyze URL"}
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-4 space-y-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Cloud Source</div>
                <div className="grid grid-cols-2 gap-2">
                  {["Google Drive", "Dropbox", "OneDrive", "AWS S3"].map(src => (
                    <button
                      key={src}
                      onClick={() => {
                        const name = `cloud_file_${src.replace(" ", "_").toLowerCase()}.mp4`;
                        setFileInfo({ name, size: "Cloud file", type: "Remote" });
                        runAnalysis(name, "Cloud");
                      }}
                      className="py-3 rounded-xl glass-card text-sm text-white/60 hover:text-white hover:border-cyan-400/20 transition-all"
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* File Info */}
            {fileInfo && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">File Information</div>
                <div className="space-y-2">
                  {[
                    ["Name", fileInfo.name],
                    ["Size", fileInfo.size],
                    ["Type", fileInfo.type],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-xs text-white/40">{k}</span>
                      <span className="text-xs font-mono text-white/80 max-w-[180px] truncate text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Agents */}
            {agentsActive.length > 0 && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3">Active Agents</div>
                <div className="space-y-1.5">
                  {agentsActive.map(id => (
                    <div key={id} className="flex items-center gap-2 text-xs text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      {id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Progress */}
            {analyzing && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30" style={{ animation: "spin-slow 2s linear infinite" }} />
                    <div className="absolute inset-1 rounded-full border border-green-400/20" style={{ animation: "spin-reverse 1.5s linear infinite" }} />
                    <div className="absolute inset-3 rounded-full bg-cyan-400/20 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Quantum Analysis in Progress</div>
                    <div className="text-xs text-cyan-400/70 font-mono mt-0.5">{currentStep}</div>
                  </div>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full progress-bar-quantum transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/30">
                  <span>Processing</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
              </div>
            )}

            {/* Result */}
            {report && !analyzing && (
              <>
                {/* Verdict */}
                <div className={`glass-card rounded-2xl p-6 ${report.status === "fake" ? "neon-border-red" : "neon-border-green"}`}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl font-black font-mono ${report.status === "fake" ? "text-red-400" : "text-green-400"}`}>
                        {report.status === "fake" ? "FAKE" : "REAL"}
                      </div>
                      <div>
                        <div className="text-4xl font-bold font-mono text-white">
                          {report.confidence.toFixed(1)}<span className="text-lg text-white/40">%</span>
                        </div>
                        <div className="text-xs text-white/40 font-mono">CONFIDENCE</div>
                      </div>
                    </div>
                    {report.detectedAiModel && (
                      <div className="px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                        <div className="text-xs text-white/40 mb-0.5">Identified as</div>
                        <div className="text-sm font-bold text-cyan-400">{report.detectedAiModel}</div>
                      </div>
                    )}
                  </div>

                  {/* Confidence Meter */}
                  <div className="mt-4">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${report.status === "fake" ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-green-600 to-green-400"}`}
                        style={{ width: `${report.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-white/30">
                    <span>Report ID: {report.id}</span>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                    >
                      View Full Report →
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Quantum Coherence", value: report.quantumMetrics.quantumCoherence, good: true },
                    { label: "Neural Entanglement", value: report.quantumMetrics.neuralEntanglement, good: true },
                    { label: "Manipulation Score", value: report.quantumMetrics.manipulationScore, good: false },
                    { label: "Deepfake Probability", value: report.quantumMetrics.deepfakeProbability, good: false },
                  ].map(({ label, value, good }) => {
                    const isHigh = value > 60;
                    const color = good
                      ? isHigh ? "text-green-400" : "text-red-400"
                      : isHigh ? "text-red-400" : "text-green-400";
                    return (
                      <div key={label} className="glass-card rounded-xl p-3 text-center">
                        <div className={`text-2xl font-bold font-mono ${color}`}>{value.toFixed(0)}%</div>
                        <div className="text-xs text-white/40 mt-1 leading-tight">{label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Radar + AI Models */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Quantum Radar</div>
                    <QuantumRadarChart data={report.radarData} />
                  </div>

                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">AI Model Fingerprinting</div>
                    <div className="space-y-2">
                      {report.aiModelScores.slice(0, 6).map(model => (
                        <div key={model.model} className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ backgroundColor: model.color + "50" }}
                          >
                            {model.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between mb-0.5">
                              <span className="text-xs text-white/60 truncate">{model.model}</span>
                              <span className="text-xs font-mono text-white/50 ml-1">{model.probability.toFixed(0)}%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${model.probability}%`, backgroundColor: model.color }}
                              />
                            </div>
                          </div>
                          {report.detectedAiModel === model.model && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {!report && !analyzing && (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">⚛️</div>
                <p className="text-white/40 text-lg">Upload a file to begin quantum analysis</p>
                <p className="text-white/20 text-sm mt-2">Supports images, videos, and audio files</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReportModal && report && (
        <ReportModal report={report} onClose={() => setShowReportModal(false)} />
      )}

      {showAgentModal && (
        <AgentModal onClose={() => setShowAgentModal(false)} onLaunch={handleAgentLaunch} />
      )}
    </div>
  );
}
