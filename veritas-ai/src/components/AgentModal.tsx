import { useState } from "react";

const AGENT_TYPES = [
  { id: "neural-inspector", name: "Neural Inspector", icon: "🧠", description: "Deep neural pattern analysis across all layers", specialization: "Image/Video" },
  { id: "entanglement-analyzer", name: "Entanglement Analyzer", icon: "⚛️", description: "Quantum entanglement signature extraction", specialization: "All Media" },
  { id: "spectral-fingerprinter", name: "Spectral Fingerprinter", icon: "🔬", description: "Frequency domain AI model fingerprinting", specialization: "Audio/Image" },
  { id: "temporal-coherence", name: "Temporal Coherence Agent", icon: "⏱️", description: "Frame-by-frame temporal consistency analysis", specialization: "Video" },
  { id: "quantum-forge", name: "Quantum Forge Agent", icon: "🔮", description: "Multi-dimensional quantum state analysis", specialization: "All Media" },
  { id: "adversarial-detector", name: "Adversarial Detector", icon: "🛡️", description: "Detects adversarial perturbations and GAN artifacts", specialization: "Image" },
];

interface AgentModalProps {
  onClose: () => void;
  onLaunch: (agents: string[], depth: number) => void;
}

export default function AgentModal({ onClose, onLaunch }: AgentModalProps) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [depth, setDepth] = useState(5);
  const [launching, setLaunching] = useState(false);

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleLaunch = async () => {
    if (selectedAgents.length === 0) return;
    setLaunching(true);
    await new Promise(r => setTimeout(r, 1500));
    onLaunch(selectedAgents, depth);
    setLaunching(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 glass-card rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-cyan-500/20">
        {/* Header */}
        <div className="sticky top-0 glass-card rounded-t-2xl p-5 border-b border-cyan-500/15 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold quantum-text font-serif">Quantum Agent Launcher</h2>
            <p className="text-sm text-white/40 mt-1">Deploy specialized AI agents for deep analysis</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Agent Selection */}
          <div>
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Select Agents ({selectedAgents.length} selected)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AGENT_TYPES.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedAgents.includes(agent.id)
                      ? "bg-cyan-400/15 border border-cyan-400/40 shadow-lg shadow-cyan-400/10"
                      : "glass-card hover:border-cyan-400/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{agent.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{agent.name}</span>
                        {selectedAgents.includes(agent.id) && (
                          <span className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 text-gray-900" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">{agent.description}</p>
                      <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded bg-white/5 text-white/30 border border-white/10">
                        {agent.specialization}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Processing Depth */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Processing Depth</h3>
              <span className="text-sm font-bold font-mono text-white">{depth} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={depth}
              onChange={e => setDepth(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(180,100%,42%) 0%, hsl(180,100%,42%) ${depth * 10}%, rgba(255,255,255,0.1) ${depth * 10}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>Fast Scan</span>
              <span>Deep Analysis</span>
            </div>
            <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-white/50">
                Depth {depth}: ~{(depth * 8).toFixed(0)}s processing time · {depth * 128} qubit layers · {depth * 1.2}x accuracy
              </p>
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleLaunch}
            disabled={selectedAgents.length === 0 || launching}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 ${
              selectedAgents.length > 0 && !launching
                ? "bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 hover:from-cyan-400 hover:to-green-400 shadow-lg shadow-cyan-500/20"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            {launching ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Initializing Quantum Agents...
              </span>
            ) : (
              `Launch ${selectedAgents.length} Agent${selectedAgents.length !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
