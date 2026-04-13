import { useState } from "react";
import { DetectionReport } from "../types/detection";

interface XAIPanelProps {
  report: DetectionReport;
}

const REASONING_STEPS = (report: DetectionReport) => [
  {
    id: 1,
    agent: "Neural Inspector",
    icon: "🧠",
    finding: `Detected inconsistent lighting variance at ${(report.quantumMetrics.manipulationScore * 0.28).toFixed(1)}% above baseline`,
    severity: report.quantumMetrics.manipulationScore > 60 ? "high" : "low",
    region: "Facial region (top-left quadrant)",
    confidence: report.quantumMetrics.neuralEntanglement,
  },
  {
    id: 2,
    agent: "Spectral Fingerprinter",
    icon: "🔬",
    finding: report.detectedAiModel
      ? `Noise pattern matches ${report.detectedAiModel} signature (${report.aiModelScores[0].probability.toFixed(1)}%)`
      : `Noise pattern consistent with natural camera sensor (${(100 - report.quantumMetrics.noisePattern).toFixed(1)}% match)`,
    severity: report.quantumMetrics.noisePattern > 60 ? "high" : "low",
    region: "Background texture and edges",
    confidence: report.quantumMetrics.spectralSignature,
  },
  {
    id: 3,
    agent: "Entanglement Analyzer",
    icon: "⚛️",
    finding: `Quantum coherence score ${report.quantumMetrics.quantumCoherence.toFixed(1)}% — ${report.quantumMetrics.quantumCoherence > 60 ? "above" : "below"} authenticity threshold (60%)`,
    severity: report.quantumMetrics.quantumCoherence < 40 ? "high" : "low",
    region: "Full image quantum field",
    confidence: report.quantumState.qubitStability,
  },
  {
    id: 4,
    agent: "Temporal Coherence",
    icon: "⏱️",
    finding: `Color distribution anomaly: ${report.quantumMetrics.colorDistribution.toFixed(1)}% deviation from natural palette statistics`,
    severity: report.quantumMetrics.colorDistribution > 55 ? "medium" : "low",
    region: "Skin tones and shadow areas",
    confidence: report.quantumState.gateFidelity,
  },
];

const ELI5_EXPLANATIONS = {
  fake: [
    "Think of it like a robot drawing a picture — it looks really real but tiny details are wrong, like shadows going the wrong way or eyes that don't quite match.",
    "It's like when you copy a photo and print it — the copy looks good but if you zoom in very close, you can see it's not quite right.",
    "Our quantum computer is like a really smart magnifying glass that can see tiny mistakes the human eye misses.",
  ],
  real: [
    "This looks like a real photo! The shadows, lighting, and tiny details all match what a real camera would capture.",
    "Like how you can tell a real painting from a fake in a museum — our quantum AI checks thousands of tiny details that are only present in real media.",
    "All the fingerprints of natural physics — light bending, noise patterns, color gradients — are exactly where they should be.",
  ],
};

const REGION_BOXES = [
  { label: "Face", x: 30, y: 15, w: 40, h: 50, severity: "high" },
  { label: "Edge", x: 5, y: 5, w: 20, h: 25, severity: "medium" },
  { label: "Shadow", x: 60, y: 55, w: 35, h: 30, severity: "medium" },
  { label: "Hair", x: 28, y: 8, w: 44, h: 18, severity: "low" },
];

export default function XAIPanel({ report }: XAIPanelProps) {
  const [eli5, setEli5] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const steps = REASONING_STEPS(report);
  const isReal = report.status === "real";
  const eli5Text = ELI5_EXPLANATIONS[isReal ? "real" : "fake"];

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-lg">🔍</span>
            Explainable AI — Why is it {isReal ? "Real?" : "Fake?"}
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Step-by-step quantum reasoning breakdown</p>
        </div>
        <button
          onClick={() => setEli5(!eli5)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            eli5
              ? "bg-yellow-400/15 text-yellow-400 border-yellow-400/30"
              : "text-white/40 border-white/10 hover:border-white/20 hover:text-white/60"
          }`}
        >
          {eli5 ? "🧒 ELI5 ON" : "🧒 Explain Simply"}
        </button>
      </div>

      {eli5 ? (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/15">
            <div className="text-yellow-400 text-sm font-bold mb-2">Explain Like I'm 5 🧒</div>
            {eli5Text.map((t, i) => (
              <p key={i} className="text-sm text-white/70 leading-relaxed mb-2 last:mb-0">{t}</p>
            ))}
          </div>
          <div className={`p-4 rounded-xl flex items-center gap-3 ${isReal ? "bg-green-400/10 border border-green-400/20" : "bg-red-400/10 border border-red-400/20"}`}>
            <span className="text-3xl">{isReal ? "✅" : "🚨"}</span>
            <div>
              <div className={`text-lg font-black font-mono ${isReal ? "text-green-400" : "text-red-400"}`}>
                {isReal ? "This is REAL!" : "This is FAKE!"}
              </div>
              <div className="text-xs text-white/50">Our computer is {report.confidence.toFixed(0)}% sure</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Heatmap Simulation */}
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Manipulation Heatmap</div>
            <div className="relative rounded-xl overflow-hidden bg-white/5 aspect-video border border-white/10">
              {/* Simulated heatmap background */}
              <div
                className="absolute inset-0"
                style={{
                  background: isReal
                    ? "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at 40% 35%, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.08) 40%, transparent 70%), radial-gradient(ellipse at 70% 65%, rgba(245,158,11,0.15) 0%, transparent 50%)",
                }}
              />
              {/* Region boxes */}
              {!isReal && REGION_BOXES.map((box) => (
                <div
                  key={box.label}
                  onMouseEnter={() => setActiveRegion(box.label)}
                  onMouseLeave={() => setActiveRegion(null)}
                  className={`absolute cursor-pointer transition-all duration-200 rounded border-2 ${
                    box.severity === "high"
                      ? "border-red-400/70 hover:border-red-400"
                      : box.severity === "medium"
                      ? "border-yellow-400/50 hover:border-yellow-400"
                      : "border-blue-400/30 hover:border-blue-400/60"
                  } ${activeRegion === box.label ? "bg-white/5" : ""}`}
                  style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
                >
                  <div className={`absolute -top-5 left-0 text-xs px-1.5 py-0.5 rounded font-mono whitespace-nowrap ${
                    activeRegion === box.label ? "opacity-100" : "opacity-0"
                  } transition-opacity ${
                    box.severity === "high" ? "bg-red-400/20 text-red-300" : box.severity === "medium" ? "bg-yellow-400/20 text-yellow-300" : "bg-blue-400/20 text-blue-300"
                  }`}>
                    {box.label}
                  </div>
                </div>
              ))}
              {isReal && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-1">✅</div>
                    <div className="text-xs text-green-400/80">No manipulations detected</div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex gap-1.5">
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <div className="w-3 h-3 rounded border-2 border-red-400/70" />
                  High
                </div>
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <div className="w-3 h-3 rounded border-2 border-yellow-400/50" />
                  Med
                </div>
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <div className="w-3 h-3 rounded border-2 border-blue-400/30" />
                  Low
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning Steps */}
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Reasoning Chain</div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all ${
                    step.severity === "high"
                      ? "bg-red-400/5 border-red-400/20"
                      : step.severity === "medium"
                      ? "bg-yellow-400/5 border-yellow-400/15"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-base">{step.icon}</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 ${
                        step.severity === "high" ? "bg-red-400" : step.severity === "medium" ? "bg-yellow-400" : "bg-green-400"
                      }`}>{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white/80">{step.agent}</div>
                      <div className="text-xs text-white/50 mt-0.5 leading-relaxed">{step.finding}</div>
                      <div className="text-xs text-white/25 mt-0.5">Region: {step.region}</div>
                    </div>
                    <div className="text-xs font-mono text-white/40 shrink-0">{step.confidence.toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
