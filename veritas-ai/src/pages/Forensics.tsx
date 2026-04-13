import { useState, useEffect } from "react";
import { generateDetectionReport } from "../lib/detection";
import { DetectionReport } from "../types/detection";
import QuantumRadarChart from "../components/QuantumRadarChart";

type AttackType = "blur" | "noise" | "compression" | "brightness" | "rotation";

const ATTACKS: { id: AttackType; label: string; icon: string; desc: string }[] = [
  { id: "blur", label: "Gaussian Blur", icon: "🌫️", desc: "Soften the image to obscure GAN artifacts" },
  { id: "noise", label: "Random Noise", icon: "📡", desc: "Add pixel noise to confuse frequency analysis" },
  { id: "compression", label: "JPEG Compression", icon: "🗜️", desc: "Lossy compression to remove watermarks" },
  { id: "brightness", label: "Brightness/Contrast", icon: "🌟", desc: "Alter luminance to hide lighting inconsistencies" },
  { id: "rotation", label: "Micro-rotation", icon: "🔄", desc: "Slight rotation to defeat face landmark detection" },
];

export default function Forensics() {
  const [activeAttacks, setActiveAttacks] = useState<Set<AttackType>>(new Set());
  const [intensity, setIntensity] = useState(50);
  const [baseReport] = useState<DetectionReport>(() => {
    let rep: DetectionReport;
    do { rep = generateDetectionReport("deepfake_sample.mp4", "84.2 MB", "video"); }
    while (rep.status !== "fake");
    rep.status = "fake";
    rep.confidence = 96.4;
    return rep;
  });
  const [attackedReport, setAttackedReport] = useState<DetectionReport | null>(null);
  const [running, setRunning] = useState(false);
  const [resilience, setResilience] = useState<number | null>(null);

  const toggleAttack = (id: AttackType) => {
    setActiveAttacks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const simulateAttack = async () => {
    if (activeAttacks.size === 0) return;
    setRunning(true);
    await new Promise(r => setTimeout(r, 1500));

    // Calculate how much attacks affect the detection
    const attackCount = activeAttacks.size;
    const attackFactor = (intensity / 100) * attackCount * 0.12;
    const newConf = Math.max(55, baseReport.confidence - attackFactor * 100 * (1 + Math.random() * 0.3));
    const newProb = Math.max(45, baseReport.quantumMetrics.deepfakeProbability - attackFactor * 80);
    const systemResilience = Math.max(60, 100 - attackFactor * 100 * 0.4 + Math.random() * 5);

    const rep: DetectionReport = {
      ...baseReport,
      id: `VQR-${Date.now()}-ATK`,
      confidence: newConf,
      quantumMetrics: {
        ...baseReport.quantumMetrics,
        deepfakeProbability: newProb,
        quantumCoherence: Math.min(99, baseReport.quantumMetrics.quantumCoherence + attackFactor * 30),
      },
      radarData: baseReport.radarData.map(v => Math.max(10, v + (Math.random() - 0.7) * attackFactor * 40)),
    };

    setAttackedReport(rep);
    setResilience(systemResilience);
    setRunning(false);
  };

  const reset = () => {
    setAttackedReport(null);
    setResilience(null);
    setActiveAttacks(new Set());
    setIntensity(50);
  };

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif quantum-text">Adversarial Attack Simulator</h1>
          <p className="text-white/40 mt-1 text-sm">Test how well AGQIS resists evasion attempts — try to fool the detector</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attack Controls */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Select Attacks ({activeAttacks.size} selected)</h3>
              <div className="space-y-2">
                {ATTACKS.map(attack => (
                  <button
                    key={attack.id}
                    onClick={() => toggleAttack(attack.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      activeAttacks.has(attack.id)
                        ? "bg-orange-400/15 border border-orange-400/30"
                        : "glass-card hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg">{attack.icon}</span>
                      <span className="text-sm font-semibold text-white">{attack.label}</span>
                      {activeAttacks.has(attack.id) && (
                        <div className="ml-auto w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-gray-900" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-white/40 pl-7">{attack.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Attack Intensity</div>
                <span className="text-sm font-bold font-mono text-white">{intensity}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, hsl(30,100%,55%) 0%, hsl(30,100%,55%) ${intensity}%, rgba(255,255,255,0.1) ${intensity}%, rgba(255,255,255,0.1) 100%)` }}
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Mild</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={simulateAttack}
                disabled={activeAttacks.size === 0 || running}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-400 hover:to-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {running ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Attacking...
                  </span>
                ) : "⚡ Launch Attack"}
              </button>
              {attackedReport && (
                <button onClick={reset} className="px-4 py-3 rounded-xl glass-card text-white/50 text-sm hover:text-white transition-colors">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Before / After Results */}
          <div className="lg:col-span-2 space-y-4">
            {resilience !== null && (
              <div className={`glass-card rounded-2xl p-5 text-center ${resilience > 80 ? "neon-border-green" : resilience > 60 ? "border-yellow-400/30" : "neon-border-red"}`}>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">System Resilience Score</div>
                <div className={`text-6xl font-black font-mono mb-1 ${resilience > 80 ? "text-green-400" : resilience > 60 ? "text-yellow-400" : "text-red-400"}`}>
                  {resilience.toFixed(0)}%
                </div>
                <p className="text-white/50 text-sm">
                  {resilience > 85
                    ? "AGQIS resisted all attacks — deepfake still detected"
                    : resilience > 65
                    ? "AGQIS partially evaded — confidence reduced but detection maintained"
                    : "Attack partially effective — confidence significantly degraded"}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-xs font-mono text-red-400 uppercase tracking-widest">Original</div>
                  <div className="px-2 py-0.5 rounded text-xs bg-red-400/10 border border-red-400/20 text-red-400 font-bold">FAKE</div>
                </div>
                <div className="text-4xl font-black font-mono text-red-400 mb-3">
                  {baseReport.confidence.toFixed(1)}%
                </div>
                <div className="h-48">
                  <QuantumRadarChart data={baseReport.radarData} animated={false} />
                </div>
                <div className="mt-3 space-y-1">
                  {[
                    ["Deepfake Prob.", baseReport.quantumMetrics.deepfakeProbability],
                    ["Manipulation", baseReport.quantumMetrics.manipulationScore],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between text-xs">
                      <span className="text-white/40">{l}</span>
                      <span className="font-mono text-red-400">{(v as number).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After Attack */}
              <div className={`glass-card rounded-2xl p-5 ${!attackedReport ? "opacity-40" : ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-xs font-mono text-orange-400 uppercase tracking-widest">After Attack</div>
                  {attackedReport && (
                    <div className="px-2 py-0.5 rounded text-xs bg-red-400/10 border border-red-400/20 text-red-400 font-bold">
                      {attackedReport.confidence > 50 ? "STILL FAKE" : "DETECTION DEGRADED"}
                    </div>
                  )}
                </div>
                {attackedReport ? (
                  <>
                    <div className="text-4xl font-black font-mono text-orange-400 mb-3">
                      {attackedReport.confidence.toFixed(1)}%
                    </div>
                    <div className="h-48">
                      <QuantumRadarChart data={attackedReport.radarData} animated />
                    </div>
                    <div className="mt-3 space-y-1">
                      {[
                        ["Deepfake Prob.", attackedReport.quantumMetrics.deepfakeProbability, baseReport.quantumMetrics.deepfakeProbability],
                        ["Manipulation", attackedReport.quantumMetrics.manipulationScore, baseReport.quantumMetrics.manipulationScore],
                      ].map(([l, v, prev]) => {
                        const diff = (v as number) - (prev as number);
                        return (
                          <div key={l as string} className="flex justify-between text-xs">
                            <span className="text-white/40">{l}</span>
                            <span className="flex items-center gap-1 font-mono">
                              <span className="text-orange-400">{(v as number).toFixed(1)}%</span>
                              <span className={diff < 0 ? "text-green-400" : "text-white/30"}>
                                ({diff > 0 ? "+" : ""}{diff.toFixed(1)})
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-48 text-white/20 text-sm">
                    Apply attack to see results
                  </div>
                )}
              </div>
            </div>

            {attackedReport && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Attack Analysis</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-xl font-bold font-mono text-orange-400">
                      {(baseReport.confidence - attackedReport.confidence).toFixed(1)}%
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">Confidence Drop</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-xl font-bold font-mono text-cyan-400">
                      {activeAttacks.size}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">Attacks Applied</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className={`text-xl font-bold font-mono ${attackedReport.confidence > 70 ? "text-green-400" : "text-yellow-400"}`}>
                      {attackedReport.confidence > 50 ? "DETECTED" : "DEGRADED"}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">Final Status</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
