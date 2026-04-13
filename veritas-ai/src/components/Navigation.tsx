import { useState } from "react";
import { Link, useLocation } from "wouter";

const navLinks = [
  { path: "/", label: "Dashboard" },
  { path: "/detect", label: "Detect" },
  { path: "/analysis", label: "Analysis" },
  { path: "/reports", label: "Reports" },
  { path: "/agents", label: "Agents" },
  { path: "/about", label: "About" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60" style={{ animation: "spin-slow 8s linear infinite" }} />
            <div className="absolute inset-1 rounded-full border border-green-400/40" style={{ animation: "spin-reverse 5s linear infinite" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 quantum-glow" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold font-serif quantum-text leading-none">VeritasAI</div>
            <div className="text-xs text-cyan-400/50 font-mono">AGQIS ENGINE</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location === link.path
                  ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">ONLINE</span>
          </div>
          <Link
            href="/detect"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-400 text-gray-900 hover:bg-cyan-300 transition-all duration-200 shadow-lg"
          >
            Analyze Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location === link.path
                  ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
