import { useState, useEffect } from "react";

export default function QuantumStatusBar() {
  const [qubits, setQubits] = useState(2048);
  const [entanglementRate, setEntanglementRate] = useState(99.7);
  const [qflops, setQflops] = useState(1.24);
  const [agents, setAgents] = useState(7);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setQubits(prev => prev + Math.floor((Math.random() - 0.3) * 10));
      setEntanglementRate(prev => Math.max(98, Math.min(99.99, prev + (Math.random() - 0.5) * 0.1)));
      setQflops(prev => Math.max(1.0, Math.min(2.0, prev + (Math.random() - 0.5) * 0.05)));
      setAgents(prev => Math.max(5, Math.min(12, prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0))));
      setTime(new Date());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-cyan-500/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block"></span>
          <span className="text-cyan-400 text-xs font-mono font-bold tracking-wider">VERITAS QUANTUM ENGINE</span>
          <span className="text-cyan-400/50 text-xs font-mono ml-2">v4.2.1-AGQIS</span>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <StatusItem label="QUBITS" value={qubits.toLocaleString()} unit="" color="cyan" />
          <StatusItem label="ENTANGLEMENT" value={entanglementRate.toFixed(2)} unit="%" color="green" />
          <StatusItem label="PROCESSING" value={qflops.toFixed(2)} unit=" QFLOPS" color="blue" />
          <StatusItem label="AGENTS" value={agents.toString()} unit=" ACTIVE" color="purple" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 font-mono">SYS TIME</span>
            <span className="text-xs text-white/60 font-mono">{time.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-cyan-400 rounded-full"
                style={{
                  height: `${8 + Math.random() * 12}px`,
                  animation: `quantum-pulse ${0.8 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          <span className="text-xs text-cyan-400/70 font-mono">LIVE</span>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-white/30 text-xs font-mono">{label}</span>
      <span className={`text-xs font-mono font-bold ${colorMap[color] || "text-white"}`}>
        {value}{unit}
      </span>
    </div>
  );
}
