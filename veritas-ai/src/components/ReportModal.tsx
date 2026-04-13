import { useRef } from "react";
import { DetectionReport } from "../types/detection";
import QuantumRadarChart from "./QuantumRadarChart";

interface ReportModalProps {
  report: DetectionReport;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: ReportModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const isReal = report.status === "real";
      const primaryColor = isReal ? [34, 197, 94] : [239, 68, 68];
      const accentColor = [0, 200, 180];

      // Header
      doc.setFillColor(10, 20, 30);
      doc.rect(0, 0, 210, 297, "F");

      doc.setFillColor(0, 20, 25);
      doc.rect(0, 0, 210, 50, "F");

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("VeritasAI", 20, 22);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 200, 180);
      doc.text("AGQIS Deepfake Detection Report", 20, 30);

      doc.setFontSize(8);
      doc.setTextColor(100, 140, 130);
      doc.text(`Report ID: ${report.id}`, 20, 38);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 44);

      // Status Badge
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(140, 15, 55, 22, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(report.status.toUpperCase(), 167.5, 25, { align: "center" });
      doc.setFontSize(9);
      doc.text(`${report.confidence.toFixed(1)}% confidence`, 167.5, 33, { align: "center" });

      // File Info Section
      let y = 60;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("FILE INFORMATION", 20, y);

      y += 8;
      doc.setFillColor(20, 35, 40);
      doc.rect(15, y, 180, 28, "F");

      const infoItems = [
        ["File Name", report.fileName],
        ["File Size", report.fileSize],
        ["Media Type", report.mediaType.toUpperCase()],
        ["Analysis Time", report.timestamp.toLocaleString()],
      ];

      doc.setFontSize(8);
      infoItems.forEach(([label, value], i) => {
        const col = i % 2 === 0 ? 20 : 110;
        const row = y + 8 + Math.floor(i / 2) * 10;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 140, 130);
        doc.text(label + ":", col, row);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 240, 230);
        doc.text(value, col + 30, row);
      });

      if (report.sourceUrl) {
        y += 30;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 140, 130);
        doc.text("Source URL:", 20, y + 5);
        doc.setTextColor(0, 200, 180);
        doc.text(report.sourceUrl.substring(0, 80), 60, y + 5);
      }

      // Quantum Metrics
      y += 38;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("QUANTUM ANALYSIS METRICS", 20, y);

      y += 6;
      const metrics = [
        ["Quantum Coherence", report.quantumMetrics.quantumCoherence],
        ["Neural Entanglement", report.quantumMetrics.neuralEntanglement],
        ["Manipulation Score", report.quantumMetrics.manipulationScore],
        ["Deepfake Probability", report.quantumMetrics.deepfakeProbability],
        ["Spectral Signature", report.quantumMetrics.spectralSignature],
        ["Noise Pattern", report.quantumMetrics.noisePattern],
        ["Color Distribution", report.quantumMetrics.colorDistribution],
        ["Temporal Consistency", report.quantumMetrics.temporalConsistency],
      ];

      metrics.forEach(([label, value]) => {
        y += 9;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 180, 170);
        doc.text(label as string, 20, y);

        const numVal = value as number;
        const barWidth = (numVal / 100) * 100;
        doc.setFillColor(30, 50, 55);
        doc.rect(80, y - 4, 100, 5, "F");
        const barColor = numVal > 60
          ? [239, 68, 68]
          : numVal > 30
            ? [245, 158, 11]
            : [34, 197, 94];
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.rect(80, y - 4, barWidth, 5, "F");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 240, 230);
        doc.text(`${numVal.toFixed(1)}%`, 185, y, { align: "right" });
      });

      // AI Model Detection
      y += 15;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("AI MODEL IDENTIFICATION", 20, y);

      y += 6;
      report.aiModelScores.slice(0, 6).forEach((model) => {
        y += 8;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 180, 170);
        doc.text(model.model, 20, y);

        const barW = (model.probability / 100) * 100;
        doc.setFillColor(30, 50, 55);
        doc.rect(80, y - 4, 100, 5, "F");
        doc.setFillColor(0, 150, 130);
        doc.rect(80, y - 4, barW, 5, "F");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 240, 230);
        doc.text(`${model.probability.toFixed(1)}%`, 185, y, { align: "right" });
      });

      // Quantum State
      y += 15;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text("QUANTUM STATE MEASUREMENTS", 20, y);

      y += 6;
      const qMetrics = [
        ["Qubit Stability", report.quantumState.qubitStability],
        ["Gate Fidelity", report.quantumState.gateFidelity],
        ["Entanglement Rate", report.quantumState.entanglementRate],
        ["Coherence Time", report.quantumState.coherenceTime],
      ];

      qMetrics.forEach(([label, value]) => {
        y += 9;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 180, 170);
        doc.text(label as string, 20, y);

        const numVal = value as number;
        const barW = (numVal / 100) * 100;
        doc.setFillColor(30, 50, 55);
        doc.rect(80, y - 4, 100, 5, "F");
        doc.setFillColor(0, 150, 130);
        doc.rect(80, y - 4, barW, 5, "F");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 240, 230);
        doc.text(`${numVal.toFixed(2)}%`, 185, y, { align: "right" });
      });

      // Footer
      doc.setFillColor(0, 20, 25);
      doc.rect(0, 280, 210, 17, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 120, 110);
      doc.text("VeritasAI — Artificial Generative Quantum Intelligent System (AGQIS)", 105, 288, { align: "center" });
      doc.text("This report is generated by quantum-enhanced AI. Results are probabilistic estimates.", 105, 293, { align: "center" });

      doc.save(`VeritasAI_Report_${report.id}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isReal = report.status === "real";
  const statusColor = isReal ? "text-green-400 badge-real" : "text-red-400 badge-fake";
  const borderColor = isReal ? "border-green-400/30" : "border-red-400/30";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={reportRef}
        className="relative z-10 glass-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{ border: `1px solid ${isReal ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}` }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 glass-card rounded-t-2xl p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isReal ? "bg-green-400/10" : "bg-red-400/10"}`}>
                {report.mediaType === "image" ? "🖼" : report.mediaType === "video" ? "🎬" : "🎵"}
              </div>
              <div>
                <div className="font-bold text-white truncate max-w-xs">{report.fileName}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-white/40">{report.fileSize}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-white/40 capitalize">{report.mediaType}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-white/40">{report.timestamp.toLocaleString()}</span>
                </div>
                {report.sourceUrl && (
                  <div className="mt-1 text-xs text-cyan-400/70 truncate max-w-xs">
                    Source: {report.sourceUrl}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-lg text-sm font-bold ${statusColor}`}>
                {report.status.toUpperCase()} — {report.confidence.toFixed(1)}%
              </div>
              <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Quantum Analysis + Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quantum Metrics */}
            <div>
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Quantum Analysis</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Quantum Coherence", value: report.quantumMetrics.quantumCoherence },
                  { label: "Neural Entanglement", value: report.quantumMetrics.neuralEntanglement },
                  { label: "Manipulation Score", value: report.quantumMetrics.manipulationScore },
                  { label: "Deepfake Probability", value: report.quantumMetrics.deepfakeProbability },
                ].map(({ label, value }) => (
                  <MetricBar key={label} label={label} value={value} />
                ))}
              </div>
            </div>

            {/* Radar Chart */}
            <div>
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Quantum Radar</h3>
              <div className="h-52">
                <QuantumRadarChart data={report.radarData} animated={false} />
              </div>
            </div>
          </div>

          {/* Media-Specific Analysis */}
          <div>
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
              Media Analysis ({report.mediaType})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(report.mediaAnalysis).map(([key, value]) => (
                <div key={key} className="glass-card rounded-xl p-3">
                  <div className="text-xs text-white/40 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-xl font-bold font-mono text-white">{(value as number).toFixed(1)}%</div>
                  <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full progress-bar-quantum"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Model Detection */}
          <div>
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">AI Model Identification</h3>
            <div className="space-y-2">
              {report.aiModelScores.map((model) => (
                <div key={model.model} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: model.color + "40", border: `1px solid ${model.color}50` }}
                  >
                    {model.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/80 truncate">{model.model}</span>
                      <span className="text-xs font-mono text-white/60 ml-2">{model.probability.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${model.probability}%`, backgroundColor: model.color }}
                      />
                    </div>
                  </div>
                  {report.detectedAiModel === model.model && (
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-400 border border-cyan-400/20 shrink-0">
                      DETECTED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quantum State */}
          <div>
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Quantum State Measurements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Qubit Stability", value: report.quantumState.qubitStability },
                { label: "Gate Fidelity", value: report.quantumState.gateFidelity },
                { label: "Entanglement Rate", value: report.quantumState.entanglementRate },
                { label: "Coherence Time", value: report.quantumState.coherenceTime },
              ].map(({ label, value }) => (
                <div key={label} className="glass-card rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold font-mono quantum-text">{value.toFixed(1)}%</div>
                  <div className="text-xs text-white/40 mt-1">{label}</div>
                  <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full progress-bar-quantum"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-400/15 text-cyan-400 border border-cyan-400/25 hover:bg-cyan-400/25 transition-all font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white transition-all font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const getColor = (v: number) => {
    if (label.includes("Probability") || label.includes("Manipulation")) {
      return v > 60 ? "bg-red-400" : v > 30 ? "bg-yellow-400" : "bg-green-400";
    }
    return v > 60 ? "bg-green-400" : v > 30 ? "bg-yellow-400" : "bg-red-400";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-mono text-white font-bold">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor(value)} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
