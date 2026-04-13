import { useState, useEffect } from "react";
import QuantumRadarChart from "../components/QuantumRadarChart";
import { generateDetectionReport } from "../lib/detection";
import { DetectionReport } from "../types/detection";

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * ease);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <>{display.toFixed(1)}</>;
}

export default function Analysis() {
  const [activeDemo, setActiveDemo] = useState<"real" | "fake">("fake");
  const [demoReport, setDemoReport] = useState<DetectionReport | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDemo = async (type: "real" | "fake") => {
    setLoading(true);
    setActiveDemo(type);
    await new Promise(r => setTimeout(r, 800));
    // Run multiple reports to get one with right status
    let rep: DetectionReport;
    let attempts = 0;
    do {
      rep = generateDetectionReport(
        type === "fake" ? "synthetic_portrait.jpg" : "authentic_photo.jpg",
        "4.2 MB",
        "image"
      );
      attempts++;
    } while (rep.status !== type && attempts < 10);
    // Force the right status for demo purposes
    rep.status = type;
    rep.confidence = type === "fake" ? 94.7 : 96.2;
    setDemoReport(rep);
    setLoading(false);
  };

  useEffect(() => { loadDemo("fake"); }, []);

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif quantum-text">Quantum Analysis Engine</h1>
          <p className="text-white/40 mt-1 text-sm">Explore how AGQIS analyzes media for deepfake signatures</p>
        </div>

        {/* Demo Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => loadDemo("fake")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeDemo === "fake"
                ? "bg-red-400/15 text-red-400 border border-red-400/30"
                : "glass-card text-white/50 hover:text-white/80"
            }`}
          >
            Fake Media Demo
          </button>
          <button
            onClick={() => loadDemo("real")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeDemo === "real"
                ? "bg-green-400/15 text-green-400 border border-green-400/30"
                : "glass-card text-white/50 hover:text-white/80"
            }`}
          >
            Real Media Demo
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40" style={{ animation: "spin-slow 2s linear infinite" }} />
                <div className="absolute inset-2 rounded-full border border-green-400/30" style={{ animation: "spin-reverse 1.5s linear infinite" }} />
                <div className="absolute inset-4 rounded-full bg-cyan-400/10 animate-pulse" />
              </div>
              <p className="text-cyan-400 font-mono text-sm">Loading quantum analysis...</p>
            </div>
          </div>
        ) : demoReport ? (
          <div className="space-y-6">
            {/* Main Verdict Card */}
            <div className={`glass-card rounded-2xl p-6 ${demoReport.status === "fake" ? "neon-border-red" : "neon-border-green"}`}>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div>
                  <div className={`text-6xl font-black font-mono ${demoReport.status === "fake" ? "text-red-400" : "text-green-400"}`}>
                    {demoReport.status.toUpperCase()}
                  </div>
                  <div className="text-white/40 text-sm mt-1 font-mono">{demoReport.fileName}</div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold font-mono text-white">
                    <AnimatedNumber value={demoReport.confidence} />
                    <span className="text-xl text-white/40">%</span>
                  </div>
                  <div className="text-xs text-white/30 font-mono">QUANTUM CONFIDENCE</div>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${demoReport.status === "fake" ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-green-600 to-green-400"}`}
                  style={{ width: `${demoReport.confidence}%` }}
                />
              </div>
            </div>

            {/* 4-Column Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Quantum Coherence", value: demoReport.quantumMetrics.quantumCoherence, desc: "Phase alignment of quantum states" },
                { label: "Neural Entanglement", value: demoReport.quantumMetrics.neuralEntanglement, desc: "Cross-layer neural coupling" },
                { label: "Manipulation Score", value: demoReport.quantumMetrics.manipulationScore, desc: "Evidence of synthetic generation" },
                { label: "Deepfake Probability", value: demoReport.quantumMetrics.deepfakeProbability, desc: "Final quantum verdict score" },
              ].map(({ label, value, desc }) => (
                <div key={label} className="glass-card rounded-2xl p-5">
                  <div className="text-3xl font-bold font-mono quantum-text mb-1">
                    <AnimatedNumber value={value} />%
                  </div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-white/30 mt-1">{desc}</div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full progress-bar-quantum"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Radar + Extended Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">Quantum Superposition Radar</h3>
                <QuantumRadarChart data={demoReport.radarData} />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Coherence", value: demoReport.radarData[0] },
                    { label: "Entanglement", value: demoReport.radarData[1] },
                    { label: "Spectral", value: demoReport.radarData[2] },
                    { label: "Noise", value: demoReport.radarData[3] },
                    { label: "Color", value: demoReport.radarData[4] },
                    { label: "Temporal", value: demoReport.radarData[5] },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <div className="text-xs font-mono font-bold text-white">{value.toFixed(0)}%</div>
                      <div className="text-xs text-white/30">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">Quantum State</h3>
                  {[
                    { label: "Qubit Stability", value: demoReport.quantumState.qubitStability },
                    { label: "Gate Fidelity", value: demoReport.quantumState.gateFidelity },
                    { label: "Entanglement Rate", value: demoReport.quantumState.entanglementRate },
                    { label: "Coherence Time", value: demoReport.quantumState.coherenceTime },
                  ].map(({ label, value }) => (
                    <div key={label} className="mb-3 last:mb-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-white/60">{label}</span>
                        <span className="text-xs font-mono text-white">{value.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full progress-bar-quantum"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">AI Model Fingerprint</h3>
                  {demoReport.aiModelScores.slice(0, 4).map(model => (
                    <div key={model.model} className="flex items-center gap-3 mb-2.5 last:mb-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: model.color + "40" }}
                      >
                        {model.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs text-white/60 truncate">{model.model}</span>
                          <span className="text-xs font-mono text-white/50">{model.probability.toFixed(0)}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div style={{ width: `${model.probability}%`, backgroundColor: model.color }} className="h-full rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold font-serif text-white mb-4">How AGQIS Detection Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: "01", title: "Quantum Field Extraction", desc: "The system initializes a quantum computing array to extract multi-dimensional features from the input media, going beyond classical pixel-level analysis." },
                  { step: "02", title: "Neural Entanglement Analysis", desc: "Quantum-entangled neural networks evaluate cross-layer dependencies and identify non-natural patterns that emerge from generative AI processes." },
                  { step: "03", title: "Spectral Fingerprinting", desc: "Each AI model (Midjourney, DALL-E, etc.) leaves unique frequency-domain signatures which our quantum processor identifies with high precision." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-black font-mono quantum-text mb-2">{step}</div>
                    <div className="text-sm font-semibold text-white mb-2">{title}</div>
                    <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
