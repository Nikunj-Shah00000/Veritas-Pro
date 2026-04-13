export default function About() {
  return (
    <div className="relative z-10 min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="text-6xl mb-4">⚛️</div>
          <h1 className="text-4xl font-bold font-serif quantum-text">About VeritasAI</h1>
          <p className="text-white/40 mt-3 text-lg max-w-2xl mx-auto">
            The world's first Artificial Generative Quantum Intelligent System for deepfake detection and media authenticity verification.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card rounded-2xl p-7 mb-6 neon-border">
          <h2 className="text-xl font-bold font-serif text-white mb-3">Our Mission</h2>
          <p className="text-white/60 leading-relaxed">
            VeritasAI was built on the belief that truth is the foundation of trust. As generative AI grows more capable, 
            the gap between real and synthetic media narrows — threatening journalism, legal evidence, personal identity, 
            and public discourse. AGQIS bridges that gap using quantum-enhanced AI to analyze media at depths impossible 
            for classical computers, providing reliable, explainable authenticity verification for everyone.
          </p>
        </div>

        {/* Technology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold font-serif quantum-text mb-4">AGQIS Technology</h2>
            <div className="space-y-3">
              {[
                { label: "Quantum Coherence Analysis", desc: "2048-qubit array for deep feature extraction" },
                { label: "Neural Entanglement Networks", desc: "Quantum-entangled multi-layer neural processing" },
                { label: "Spectral AI Fingerprinting", desc: "Unique frequency signatures per generative model" },
                { label: "Temporal Coherence Mapping", desc: "Frame-by-frame consistency verification" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{label}</div>
                    <div className="text-xs text-white/40">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold font-serif quantum-text mb-4">Supported Platforms</h2>
            <div className="space-y-2">
              {[
                { name: "Google Gemini", color: "#4285F4", desc: "Detects Gemini AI generation patterns" },
                { name: "ChatGPT / DALL-E", color: "#10A37F", desc: "OpenAI image generation fingerprints" },
                { name: "Google Bard (Imagen)", color: "#DB4437", desc: "Google Imagen signature analysis" },
                { name: "Midjourney", color: "#FF6B35", desc: "Midjourney-specific noise patterns" },
                { name: "Stable Diffusion", color: "#6B46C1", desc: "Latent diffusion artifacts" },
                { name: "Adobe Firefly", color: "#FF0000", desc: "Firefly spectral signature detection" },
              ].map(({ name, color, desc }) => (
                <div key={name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: color + "30", border: `1px solid ${color}50` }}>
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">{name[0]}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{name}</div>
                    <div className="text-xs text-white/30">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { value: "98.7%", label: "Detection Accuracy", icon: "🎯" },
            { value: "2048", label: "Qubit Array Size", icon: "⚛️" },
            { value: "<2s", label: "Avg Analysis Time", icon: "⚡" },
            { value: "6+", label: "AI Models Detected", icon: "🤖" },
          ].map(({ value, label, icon }) => (
            <div key={label} className="glass-card rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-2xl font-bold font-mono quantum-text">{value}</div>
              <div className="text-xs text-white/40 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold font-serif text-white mb-5">How VeritasAI Works</h2>
          <div className="space-y-4">
            {[
              { n: "01", title: "Upload Media", desc: "Upload any image, video, or audio file via local storage, URL, or cloud service." },
              { n: "02", title: "Quantum Initialization", desc: "A 2048-qubit quantum array initializes and prepares the computational field for analysis." },
              { n: "03", title: "Multi-Agent Analysis", desc: "Specialized quantum agents — Neural Inspector, Entanglement Analyzer, Spectral Fingerprinter — run concurrently." },
              { n: "04", title: "AI Model Identification", desc: "The spectral fingerprinting engine compares against signatures from Gemini, DALL-E, Midjourney, Stable Diffusion, and more." },
              { n: "05", title: "Quantum Verdict", desc: "All agent outputs are aggregated through quantum superposition to produce a confidence-weighted authenticity verdict." },
              { n: "06", title: "Detailed Report", desc: "A comprehensive report is generated with radar charts, metric breakdowns, and downloadable PDF." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 items-start">
                <div className="text-2xl font-black font-mono quantum-text shrink-0 w-10">{n}</div>
                <div>
                  <div className="font-semibold text-white text-sm">{title}</div>
                  <div className="text-xs text-white/40 mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-5 rounded-xl bg-yellow-400/5 border border-yellow-400/15">
          <div className="flex gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div>
              <div className="text-sm font-semibold text-yellow-400 mb-1">Research & Demonstration System</div>
              <div className="text-xs text-white/40 leading-relaxed">
                VeritasAI is a showcase of quantum-inspired deepfake detection technology. Detection results are probabilistic estimates simulated for demonstration purposes. 
                In a production deployment, results would be generated by actual quantum computing hardware and certified AI detection models. 
                Do not rely on this demo system for legal, forensic, or security-critical decisions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
