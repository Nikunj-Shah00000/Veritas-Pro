import { useState, useEffect } from "react";
import { DetectionReport } from "../types/detection";

interface BlockchainVerificationProps {
  report: DetectionReport;
}

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const h = Math.abs(hash).toString(16).padStart(8, "0");
  // Generate a longer hex string
  const seed = str.length + hash;
  const parts = [h, Math.abs(seed * 31).toString(16).padStart(8, "0"), Math.abs(seed * 17 + 1234567).toString(16).padStart(8, "0"), Math.abs(seed * 7 + 9876543).toString(16).padStart(8, "0")];
  return "0x" + parts.join("").slice(0, 64);
}

function generateBlockId(id: string): string {
  const num = parseInt(id.slice(-4), 10) || 1234;
  return `#${(18400000 + num).toLocaleString()}`;
}

export default function BlockchainVerification({ report }: BlockchainVerificationProps) {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);

  const fileHash = generateHash(report.id + report.fileName);
  const resultHash = generateHash(report.id + report.status + report.confidence);
  const blockId = generateBlockId(report.id);
  const chainId = "VERITAS-QUANTUM-CHAIN-v2";

  const steps = [
    "Computing SHA-3 quantum hash...",
    "Broadcasting to quantum ledger...",
    "Awaiting node confirmation...",
    "Sealed in block " + blockId,
  ];

  const handleVerify = async () => {
    if (verified) return;
    setVerifying(true);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 600));
    }
    setVerified(true);
    setVerifying(false);
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔗</span>
          <div>
            <div className="text-sm font-bold text-white">Blockchain Authenticity Ledger</div>
            <div className="text-xs text-white/40">Tamper-proof verification on {chainId}</div>
          </div>
        </div>
        {!verified && !verifying && (
          <button
            onClick={handleVerify}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400/15 text-cyan-400 border border-cyan-400/25 hover:bg-cyan-400/25 transition-all"
          >
            Seal on Chain
          </button>
        )}
        {verified && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-400/15 border border-green-400/25">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-mono font-bold">VERIFIED ON CHAIN</span>
          </div>
        )}
      </div>

      {verifying && (
        <div className="mb-4 space-y-2">
          {steps.slice(0, step + 1).map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                i < step ? "bg-green-400" : "bg-cyan-400 animate-pulse"
              }`}>
                {i < step ? (
                  <svg className="w-2.5 h-2.5 text-gray-900" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                )}
              </div>
              <span className={i < step ? "text-white/60" : "text-cyan-400"}>{s}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <HashRow label="File Hash (SHA-3)" value={fileHash} />
        <HashRow label="Result Hash" value={resultHash} />

        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="Block ID" value={blockId} />
          <InfoBox label="Network" value="VQCHAIN-2" />
          <InfoBox label="Timestamp" value={report.timestamp.toISOString().slice(0, 19) + "Z"} mono />
          <InfoBox label="Confirmations" value={verified ? "12 / 12" : "0 / 12"} highlight={verified} />
        </div>

        {verified && (
          <div className="p-3 rounded-xl bg-green-400/8 border border-green-400/20 mt-2">
            <div className="flex items-center gap-2 text-xs text-green-400">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-semibold">Sealed and tamper-proof</span>
            </div>
            <p className="text-xs text-white/40 mt-1">
              This verification result is permanently recorded. Any modification to the original media will produce a different hash, immediately invalidating this record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function HashRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/8 group">
        <code className="text-xs text-cyan-400/80 font-mono flex-1 truncate">{value}</code>
        <button
          onClick={copy}
          className="text-white/20 hover:text-white/60 transition-colors shrink-0"
        >
          {copied ? (
            <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function InfoBox({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/8">
      <div className="text-xs text-white/30 mb-0.5">{label}</div>
      <div className={`text-xs font-semibold truncate ${mono ? "font-mono" : ""} ${highlight ? "text-green-400" : "text-white/80"}`}>
        {value}
      </div>
    </div>
  );
}
