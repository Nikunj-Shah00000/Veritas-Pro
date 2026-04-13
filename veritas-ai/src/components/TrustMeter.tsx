import { DetectionReport } from "../types/detection";

interface TrustMeterProps {
  report: DetectionReport;
}

export default function TrustMeter({ report }: TrustMeterProps) {
  const isReal = report.status === "real";

  const authenticity = isReal
    ? report.quantumMetrics.quantumCoherence * 0.6 + report.quantumMetrics.neuralEntanglement * 0.4
    : 100 - report.quantumMetrics.deepfakeProbability;

  const reliability = report.quantumState.qubitStability * 0.5 + report.quantumState.gateFidelity * 0.5;

  const riskLevel = isReal
    ? Math.max(2, 100 - authenticity)
    : report.quantumMetrics.deepfakeProbability;

  const overallTrust = isReal
    ? (authenticity * 0.5 + reliability * 0.3 + (100 - riskLevel) * 0.2)
    : (authenticity * 0.5 + reliability * 0.3 + (100 - riskLevel) * 0.2);

  const getTrustLabel = (score: number) => {
    if (score >= 85) return { label: "HIGH TRUST", color: "text-green-400", bg: "bg-green-400/15", border: "border-green-400/25" };
    if (score >= 60) return { label: "MODERATE TRUST", color: "text-yellow-400", bg: "bg-yellow-400/15", border: "border-yellow-400/25" };
    if (score >= 35) return { label: "LOW TRUST", color: "text-orange-400", bg: "bg-orange-400/15", border: "border-orange-400/25" };
    return { label: "UNTRUSTED", color: "text-red-400", bg: "bg-red-400/15", border: "border-red-400/25" };
  };

  const trust = getTrustLabel(overallTrust);

  const dimensions = [
    { label: "Authenticity", value: authenticity, icon: "🛡️", desc: "Origin verification" },
    { label: "Reliability", value: reliability, icon: "⚛️", desc: "Quantum measurement quality" },
    { label: "Risk Level", value: riskLevel, icon: "⚠️", desc: "Threat severity", invert: true },
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧲</span>
        <div>
          <div className="text-sm font-bold text-white">Trust Meter</div>
          <div className="text-xs text-white/40">Multi-dimensional content authenticity score</div>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`p-4 rounded-xl mb-4 border ${trust.bg} ${trust.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/40 mb-0.5">Overall Trust Score</div>
            <div className={`text-4xl font-black font-mono ${trust.color}`}>
              {overallTrust.toFixed(0)}
              <span className="text-lg text-white/30">/100</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${trust.bg} ${trust.border} ${trust.color}`}>
              {trust.label}
            </div>
            <div className="text-xs text-white/30 mt-1">{report.confidence.toFixed(1)}% confidence</div>
          </div>
        </div>

        {/* Dial visualization */}
        <div className="mt-3 relative h-3 bg-black/30 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
            style={{
              width: `${overallTrust}%`,
              background: `linear-gradient(90deg, ${overallTrust > 70 ? "#22c55e" : overallTrust > 45 ? "#eab308" : "#ef4444"}, ${overallTrust > 70 ? "#4ade80" : overallTrust > 45 ? "#fbbf24" : "#f87171"})`,
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-full shadow-lg"
            style={{ left: `calc(${overallTrust}% - 2px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/20 mt-1">
          <span>Untrusted</span>
          <span>Low</span>
          <span>Moderate</span>
          <span>High Trust</span>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {dimensions.map(({ label, value, icon, desc, invert }) => {
          const displayVal = invert ? value : value;
          const color = invert
            ? (value > 60 ? "text-red-400" : value > 30 ? "text-yellow-400" : "text-green-400")
            : (value > 60 ? "text-green-400" : value > 30 ? "text-yellow-400" : "text-red-400");
          const barColor = invert
            ? (value > 60 ? "#ef4444" : value > 30 ? "#eab308" : "#22c55e")
            : (value > 60 ? "#22c55e" : value > 30 ? "#eab308" : "#ef4444");

          return (
            <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/8 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className={`text-xl font-bold font-mono ${color}`}>{displayVal.toFixed(0)}</div>
              <div className="text-xs text-white/60 font-medium mt-0.5">{label}</div>
              <div className="text-xs text-white/25 mt-0.5">{desc}</div>
              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${displayVal}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
