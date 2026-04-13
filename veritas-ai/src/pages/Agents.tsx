import { useState, useEffect, useRef } from "react";

interface Agent {
  id: string;
  name: string;
  icon: string;
  status: "idle" | "running" | "completed" | "error";
  specialization: string;
  tasksCompleted: number;
  accuracy: number;
  currentTask: string;
  uptime: string;
  color: string;
}

interface CollabMessage {
  from: string;
  fromIcon: string;
  to?: string;
  type: "flag" | "confirm" | "query" | "info" | "result";
  message: string;
  time: string;
}

const AGENTS: Agent[] = [
  { id: "neural-inspector", name: "Neural Inspector", icon: "🧠", status: "running", specialization: "Image/Video", tasksCompleted: 847, accuracy: 98.4, currentTask: "Analyzing facial landmark inconsistencies...", uptime: "14h 32m", color: "#00FFC8" },
  { id: "entanglement-analyzer", name: "Entanglement Analyzer", icon: "⚛️", status: "running", specialization: "All Media", tasksCompleted: 1203, accuracy: 99.1, currentTask: "Computing quantum entanglement signatures...", uptime: "8h 15m", color: "#4285F4" },
  { id: "spectral-fingerprinter", name: "Spectral Fingerprinter", icon: "🔬", status: "running", specialization: "Audio/Image", tasksCompleted: 562, accuracy: 97.8, currentTask: "Extracting frequency domain fingerprints...", uptime: "6h 44m", color: "#FF6B35" },
  { id: "temporal-coherence", name: "Temporal Coherence", icon: "⏱️", status: "idle", specialization: "Video", tasksCompleted: 334, accuracy: 96.9, currentTask: "Awaiting video input...", uptime: "22h 10m", color: "#6B46C1" },
  { id: "quantum-forge", name: "Quantum Forge Agent", icon: "🔮", status: "running", specialization: "All Media", tasksCompleted: 289, accuracy: 98.7, currentTask: "Multi-dimensional quantum state analysis...", uptime: "3h 08m", color: "#10A37F" },
  { id: "adversarial-detector", name: "Adversarial Detector", icon: "🛡️", status: "completed", specialization: "Image", tasksCompleted: 721, accuracy: 97.2, currentTask: "Last task: GAN artifact detection complete", uptime: "11h 55m", color: "#DB4437" },
];

const INITIAL_COLLAB: CollabMessage[] = [
  { from: "Neural Inspector", fromIcon: "🧠", type: "flag", message: "Facial inconsistency detected in regions [0.28,0.12,0.5,0.68] — inconsistent edge sharpness gradient.", time: "14:32:01" },
  { from: "Entanglement Analyzer", fromIcon: "⚛️", to: "Neural Inspector", type: "query", message: "Cross-checking spectral data against entanglement model... confirm inconsistency at that region?", time: "14:32:03" },
  { from: "Neural Inspector", fromIcon: "🧠", type: "confirm", message: "Confirmed. Lighting vector mismatch 23% above natural variance. Likely GAN-generated boundary.", time: "14:32:05" },
  { from: "Spectral Fingerprinter", fromIcon: "🔬", type: "info", message: "Frequency analysis complete. Noise pattern matches Midjourney v6.1 signature at 87.4% probability.", time: "14:32:08" },
  { from: "Entanglement Analyzer", fromIcon: "⚛️", type: "confirm", message: "Quantum coherence score: 28.3% — 31.7% below authenticity threshold. Synthetic origin confirmed.", time: "14:32:11" },
  { from: "Quantum Forge Agent", fromIcon: "🔮", type: "result", message: "VERDICT: DEEPFAKE — Confidence 96.4%. Primary model: Midjourney. Risk: HIGH. Recommend chain verification.", time: "14:32:14" },
];

const COLLAB_POOL: CollabMessage[] = [
  { from: "Neural Inspector", fromIcon: "🧠", type: "flag", message: "New anomaly in pixel region (456, 210) — shadow inconsistency detected.", time: "" },
  { from: "Entanglement Analyzer", fromIcon: "⚛️", to: "Spectral Fingerprinter", type: "query", message: "Can you cross-reference frequency at band 340-480 Hz?", time: "" },
  { from: "Spectral Fingerprinter", fromIcon: "🔬", type: "info", message: "Band analysis returned. Pattern overlaps with DALL-E 3 spectral signature at 71.2%.", time: "" },
  { from: "Adversarial Detector", fromIcon: "🛡️", type: "info", message: "No adversarial perturbations detected. GAN artifacts appear unmodified.", time: "" },
  { from: "Temporal Coherence", fromIcon: "⏱️", to: "Neural Inspector", type: "query", message: "Frame 342 shows motion blur inconsistent with claimed 30fps. Verify?", time: "" },
  { from: "Neural Inspector", fromIcon: "🧠", type: "confirm", message: "Motion blur pattern confirmed synthetic. Rendering artifact, not camera motion.", time: "" },
  { from: "Quantum Forge Agent", fromIcon: "🔮", type: "result", message: "Updated VERDICT: Confidence adjusted to 94.1% after cross-agent verification.", time: "" },
  { from: "Entanglement Analyzer", fromIcon: "⚛️", type: "flag", message: "Quantum coherence drop detected — new file queued for analysis.", time: "" },
];

export default function Agents() {
  const [agents] = useState(AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [collabMessages, setCollabMessages] = useState<CollabMessage[]>(INITIAL_COLLAB);
  const [sysLogs, setSysLogs] = useState<{ time: string; agent: string; msg: string; type: "info" | "warn" | "success" }[]>([
    { time: "14:32:01", agent: "Neural Inspector", msg: "Detected facial inconsistency — region flagged", type: "warn" },
    { time: "14:31:47", agent: "Entanglement Analyzer", msg: "Quantum coherence score: 28.4% below threshold", type: "warn" },
    { time: "14:31:32", agent: "Spectral Fingerprinter", msg: "Midjourney v6.1 signature confirmed 91.3%", type: "warn" },
    { time: "14:30:55", agent: "Adversarial Detector", msg: "Analysis complete — no adversarial perturbations", type: "success" },
    { time: "14:30:21", agent: "Quantum Forge Agent", msg: "Processing multi-dimensional quantum matrix...", type: "info" },
  ]);
  const collabEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let poolIndex = 0;
    const collab = setInterval(() => {
      const msg = COLLAB_POOL[poolIndex % COLLAB_POOL.length];
      poolIndex++;
      setCollabMessages(prev => [...prev, { ...msg, time: new Date().toLocaleTimeString("en", { hour12: false }) }]);
    }, 3500);

    const logs = setInterval(() => {
      const options = [
        { agent: "Neural Inspector", msg: "Frame batch processed", type: "info" as const },
        { agent: "Entanglement Analyzer", msg: `Entanglement: ${(99 + Math.random() * 0.9).toFixed(2)}%`, type: "success" as const },
        { agent: "Spectral Fingerprinter", msg: "Frequency analysis complete", type: "info" as const },
        { agent: "Quantum Forge Agent", msg: "Quantum depth: 12 layers", type: "info" as const },
        { agent: "Neural Inspector", msg: "Pixel distribution anomaly detected", type: "warn" as const },
      ];
      const entry = options[Math.floor(Math.random() * options.length)];
      setSysLogs(prev => [{ ...entry, time: new Date().toLocaleTimeString("en", { hour12: false }) }, ...prev.slice(0, 19)]);
    }, 2000);

    return () => { clearInterval(collab); clearInterval(logs); };
  }, []);

  useEffect(() => {
    collabEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [collabMessages]);

  const getStatusBadge = (status: Agent["status"]) => {
    switch (status) {
      case "running": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/25";
      case "completed": return "text-green-400 bg-green-400/10 border-green-400/25";
      case "idle": return "text-white/50 bg-white/5 border-white/15";
      case "error": return "text-red-400 bg-red-400/10 border-red-400/25";
    }
  };

  const getStatusDot = (status: Agent["status"]) => {
    switch (status) {
      case "running": return "bg-cyan-400 animate-pulse";
      case "completed": return "bg-green-400";
      case "idle": return "bg-white/30";
      case "error": return "bg-red-400";
    }
  };

  const getMsgStyle = (type: CollabMessage["type"]) => {
    switch (type) {
      case "flag": return "border-l-red-400/60 bg-red-400/5";
      case "confirm": return "border-l-green-400/60 bg-green-400/5";
      case "query": return "border-l-blue-400/60 bg-blue-400/5";
      case "result": return "border-l-cyan-400/60 bg-cyan-400/5";
      default: return "border-l-white/20 bg-white/5";
    }
  };

  const getMsgLabel = (type: CollabMessage["type"]) => {
    switch (type) {
      case "flag": return { text: "FLAG", color: "text-red-400 bg-red-400/15" };
      case "confirm": return { text: "CONFIRM", color: "text-green-400 bg-green-400/15" };
      case "query": return { text: "QUERY", color: "text-blue-400 bg-blue-400/15" };
      case "result": return { text: "VERDICT", color: "text-cyan-400 bg-cyan-400/15" };
      default: return { text: "INFO", color: "text-white/50 bg-white/10" };
    }
  };

  const runningCount = agents.filter(a => a.status === "running").length;

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif quantum-text">Quantum Agent Control</h1>
            <p className="text-white/40 mt-1 text-sm">Monitor agents and watch them collaborate in real-time</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
            <span className="text-xs text-cyan-400 font-mono">{runningCount} RUNNING / {agents.length} TOTAL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Cards */}
          <div className="grid grid-cols-1 gap-3">
            {agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                className={`glass-card rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedAgent?.id === agent.id ? "border-cyan-400/30" : "hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{agent.icon}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{agent.name}</div>
                      <div className="text-xs text-white/40">{agent.specialization}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-mono ${getStatusBadge(agent.status)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(agent.status)}`} />
                    {agent.status.toUpperCase()}
                  </div>
                </div>
                <div className="text-xs text-white/35 italic truncate mb-2">{agent.currentTask}</div>
                <div className="flex gap-2 text-center">
                  {[
                    { label: "Tasks", value: agent.tasksCompleted.toLocaleString() },
                    { label: "Acc.", value: `${agent.accuracy}%` },
                    { label: "Up", value: agent.uptime },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex-1 p-1.5 rounded-lg bg-white/5">
                      <div className="text-xs font-bold font-mono text-white">{value}</div>
                      <div className="text-xs text-white/25">{label}</div>
                    </div>
                  ))}
                </div>
                {agent.status === "running" && (
                  <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full progress-bar-quantum w-3/4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Collaboration + Logs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Agent Collaboration Chat */}
            <div className="glass-card rounded-2xl p-4 flex flex-col" style={{ height: "440px" }}>
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🤝</span> Agent Collaboration Channel
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400/70 font-mono">ACTIVE</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {collabMessages.map((msg, i) => {
                  const style = getMsgStyle(msg.type);
                  const label = getMsgLabel(msg.type);
                  return (
                    <div key={i} className={`p-3 rounded-xl border-l-4 ${style} slide-in-up`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{msg.fromIcon}</span>
                        <span className="text-xs font-bold text-white">{msg.from}</span>
                        {msg.to && (
                          <>
                            <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span className="text-xs text-white/50">{msg.to}</span>
                          </>
                        )}
                        <span className={`ml-auto text-xs px-1.5 py-0.5 rounded font-mono font-bold ${label.color}`}>{label.text}</span>
                        <span className="text-xs text-white/20 font-mono">{msg.time}</span>
                      </div>
                      <p className="text-xs text-white/65 leading-relaxed pl-7">{msg.message}</p>
                    </div>
                  );
                })}
                <div ref={collabEndRef} />
              </div>
            </div>

            {/* System Logs */}
            <div className="glass-card rounded-2xl p-4 flex flex-col" style={{ height: "260px" }}>
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">System Logs</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs text-cyan-400/60 font-mono">LIVE</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5">
                {sysLogs.map((log, i) => (
                  <div key={i} className="text-xs flex items-start gap-2 py-1 border-b border-white/5">
                    <span className="text-white/20 font-mono shrink-0">{log.time}</span>
                    <div>
                      <span className={`font-medium shrink-0 mr-1 ${
                        log.type === "warn" ? "text-yellow-400" : log.type === "success" ? "text-green-400" : "text-cyan-400/70"
                      }`}>
                        [{log.agent.split(" ")[0]}]
                      </span>
                      <span className="text-white/50">{log.msg}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
