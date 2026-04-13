import { useState } from "react";
import { SAMPLE_REPORTS } from "../lib/detection";
import { DetectionReport } from "../types/detection";
import ReportModal from "../components/ReportModal";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<DetectionReport | null>(null);
  const [filter, setFilter] = useState<"all" | "real" | "fake">("all");
  const [mediaFilter, setMediaFilter] = useState<"all" | "image" | "video" | "audio">("all");

  const filtered = SAMPLE_REPORTS.filter(r => {
    if (filter !== "all" && r.status !== filter) return false;
    if (mediaFilter !== "all" && r.mediaType !== mediaFilter) return false;
    return true;
  });

  const totalFake = SAMPLE_REPORTS.filter(r => r.status === "fake").length;
  const totalReal = SAMPLE_REPORTS.filter(r => r.status === "real").length;

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif quantum-text">Detection Reports</h1>
            <p className="text-white/40 mt-1 text-sm">{SAMPLE_REPORTS.length} total analyses — click any report to view details</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-400/10 border border-red-400/20">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs text-red-400 font-mono">{totalFake} FAKE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-green-400 font-mono">{totalReal} REAL</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 glass-card rounded-xl p-1">
            {(["all", "fake", "real"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${
                  filter === f ? "bg-cyan-400/20 text-cyan-400" : "text-white/40 hover:text-white/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1 glass-card rounded-xl p-1">
            {(["all", "image", "video", "audio"] as const).map(f => (
              <button
                key={f}
                onClick={() => setMediaFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${
                  mediaFilter === f ? "bg-cyan-400/20 text-cyan-400" : "text-white/40 hover:text-white/70"
                }`}
              >
                {f === "all" ? "All Types" : f === "image" ? "🖼 Image" : f === "video" ? "🎬 Video" : "🎵 Audio"}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3 opacity-40">📭</div>
            <p className="text-white/40">No reports match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((report) => (
              <ReportCard key={report.id} report={report} onViewReport={() => setSelectedReport(report)} />
            ))}
          </div>
        )}
      </div>

      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

function ReportCard({ report, onViewReport }: { report: DetectionReport; onViewReport: () => void }) {
  const isReal = report.status === "real";

  return (
    <div
      className="glass-card rounded-2xl p-5 cursor-pointer group transition-all duration-200 hover:border-cyan-400/20"
      onClick={onViewReport}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isReal ? "bg-green-400/10" : "bg-red-400/10"}`}>
            {report.mediaType === "image" ? "🖼" : report.mediaType === "video" ? "🎬" : "🎵"}
          </div>
          <div>
            <div className="font-semibold text-white text-sm truncate max-w-[200px]">{report.fileName}</div>
            <div className="text-xs text-white/40 mt-0.5">{report.fileSize} · {report.mediaType}</div>
            <div className="text-xs text-white/30 mt-0.5">{report.timestamp.toLocaleString()}</div>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-sm font-bold shrink-0 ${isReal ? "badge-real" : "badge-fake"}`}>
          {report.status.toUpperCase()}
        </div>
      </div>

      {/* Source URL if present */}
      {report.sourceUrl && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-cyan-400/5 border border-cyan-400/10">
          <span className="text-xs text-cyan-400/60">Source: </span>
          <span className="text-xs text-cyan-400/80 truncate">{report.sourceUrl}</span>
        </div>
      )}

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-white/40">Confidence</span>
          <span className="text-xs font-mono font-bold text-white">{report.confidence.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isReal ? "bg-gradient-to-r from-green-600 to-green-400" : "bg-gradient-to-r from-red-600 to-red-400"}`}
            style={{ width: `${report.confidence}%` }}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Q.Coh", value: report.quantumMetrics.quantumCoherence },
          { label: "N.Ent", value: report.quantumMetrics.neuralEntanglement },
          { label: "Manip", value: report.quantumMetrics.manipulationScore },
          { label: "DFake", value: report.quantumMetrics.deepfakeProbability },
        ].map(({ label, value }) => (
          <div key={label} className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-bold font-mono text-white">{value.toFixed(0)}</div>
            <div className="text-xs text-white/30">{label}</div>
          </div>
        ))}
      </div>

      {/* AI Model (if fake) */}
      {report.detectedAiModel && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-white/30">Identified as:</span>
          <span className="text-xs font-semibold text-cyan-400">{report.detectedAiModel}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/20 font-mono">{report.id}</div>
        <button
          onClick={(e) => { e.stopPropagation(); onViewReport(); }}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/20 transition-all"
        >
          View Report
        </button>
      </div>
    </div>
  );
}
