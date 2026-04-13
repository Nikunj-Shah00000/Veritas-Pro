import { useState } from "react";
import { Link } from "wouter";
import { SAMPLE_REPORTS } from "../lib/detection";
import ReportModal from "../components/ReportModal";
import { DetectionReport } from "../types/detection";

const stats = [
  { label: "Total Detections", value: "1,284", sub: "+47 today", icon: "🔍", color: "cyan" },
  { label: "AI-Generated", value: "912", sub: "71% of total", icon: "🤖", color: "red" },
  { label: "Authentic Media", value: "372", sub: "29% of total", icon: "✅", color: "green" },
  { label: "Accuracy Rate", value: "98.7%", sub: "Quantum-verified", icon: "⚛️", color: "blue" },
];

const modelStats = [
  { name: "Midjourney", count: 287, color: "#FF6B35", percent: 31.5 },
  { name: "Stable Diffusion", count: 224, color: "#6B46C1", percent: 24.6 },
  { name: "DALL-E", count: 198, color: "#10A37F", percent: 21.7 },
  { name: "Google Gemini", count: 134, color: "#4285F4", percent: 14.7 },
  { name: "Adobe Firefly", count: 69, color: "#FF0000", percent: 7.5 },
];

export default function Dashboard() {
  const [selectedReport, setSelectedReport] = useState<DetectionReport | null>(null);

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400">QUANTUM DETECTION ENGINE ONLINE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif">
            <span className="quantum-text">VeritasAI</span>
          </h1>
          <p className="text-white/50 mt-2 text-lg max-w-xl mx-auto">
            Artificial Generative Quantum Intelligent System for Deepfake Detection & Authenticity Verification
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href="/detect"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-bold text-sm hover:from-cyan-400 hover:to-green-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              Analyze Media
            </Link>
            <Link
              href="/reports"
              className="px-6 py-3 rounded-xl glass-card border border-cyan-400/20 text-white/80 font-semibold text-sm hover:border-cyan-400/40 transition-all"
            >
              View Reports
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const colorMap: Record<string, string> = {
              cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
              red: "text-red-400 bg-red-400/10 border-red-400/20",
              green: "text-green-400 bg-green-400/10 border-green-400/20",
              blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            };
            return (
              <div key={stat.label} className="glass-card rounded-2xl p-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 border ${colorMap[stat.color]}`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold font-mono text-white">{stat.value}</div>
                <div className="text-sm text-white/60 mt-0.5">{stat.label}</div>
                <div className="text-xs text-white/30 mt-1">{stat.sub}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Model Detection Stats */}
          <div className="glass-card rounded-2xl p-5 lg:col-span-1">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-green-400 inline-block" />
              AI Model Detection
            </h2>
            <div className="space-y-3">
              {modelStats.map((model) => (
                <div key={model.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70">{model.name}</span>
                    <span className="text-xs font-mono text-white/60">{model.count} ({model.percent}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${model.percent}%`, backgroundColor: model.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/40 mb-1">Most Common Source</div>
              <div className="text-sm font-bold text-orange-400">Midjourney v6.1</div>
              <div className="text-xs text-white/30">31.5% of all AI-generated</div>
            </div>
          </div>

          {/* Recent Detections */}
          <div className="glass-card rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-green-400 inline-block" />
                Recent Detections
              </h2>
              <Link href="/reports" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                View all →
              </Link>
            </div>

            <div className="space-y-2">
              {SAMPLE_REPORTS.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/10"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    report.status === "real" ? "bg-green-400/10" : "bg-red-400/10"
                  }`}>
                    {report.mediaType === "image" ? "🖼" : report.mediaType === "video" ? "🎬" : "🎵"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-white truncate">{report.fileName}</div>
                    <div className="text-xs text-white/40 flex items-center gap-2">
                      <span>{report.fileSize}</span>
                      <span>·</span>
                      <span>{getRelativeTime(report.timestamp)}</span>
                      {report.detectedAiModel && (
                        <>
                          <span>·</span>
                          <span className="text-cyan-400/70">{report.detectedAiModel}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`flex flex-col items-end shrink-0`}>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      report.status === "real" ? "badge-real" : "badge-fake"
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-white/30 mt-1">{report.confidence.toFixed(1)}%</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                    className="opacity-0 group-hover:opacity-100 text-xs text-cyan-400 hover:text-cyan-300 transition-all shrink-0"
                  >
                    View →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Upload CTA */}
        <div className="glass-card rounded-2xl p-8 text-center neon-border">
          <div className="text-4xl mb-3">⚛️</div>
          <h2 className="text-2xl font-bold font-serif quantum-text">Ready to Detect Deepfakes?</h2>
          <p className="text-white/50 mt-2 mb-5">Upload any image, video, or audio file and let our quantum AI analyze it in seconds.</p>
          <Link
            href="/detect"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-bold hover:from-cyan-400 hover:to-green-400 transition-all shadow-lg"
          >
            Start Analysis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
