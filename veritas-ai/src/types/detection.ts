export type MediaType = "image" | "video" | "audio";
export type DetectionStatus = "real" | "fake" | "analyzing" | "unknown";

export interface AIModelScore {
  model: string;
  probability: number;
  color: string;
  icon: string;
}

export interface QuantumMetrics {
  quantumCoherence: number;
  neuralEntanglement: number;
  manipulationScore: number;
  deepfakeProbability: number;
  spectralSignature: number;
  noisePattern: number;
  colorDistribution: number;
  temporalConsistency: number;
}

export interface MediaSpecificAnalysis {
  // Image
  facialConsistency?: number;
  lightingAnalysis?: number;
  compressionArtifacts?: number;
  // Video
  frameAnalysis?: number;
  motionConsistency?: number;
  // Audio
  spectralAnalysis?: number;
  frequencyPatterns?: number;
  voiceAuthenticity?: number;
}

export interface QuantumStateMetrics {
  qubitStability: number;
  gateFidelity: number;
  entanglementRate: number;
  coherenceTime: number;
}

export interface DetectionReport {
  id: string;
  fileName: string;
  fileSize: string;
  mediaType: MediaType;
  sourceUrl?: string;
  timestamp: Date;
  status: DetectionStatus;
  confidence: number;
  aiModelScores: AIModelScore[];
  quantumMetrics: QuantumMetrics;
  mediaAnalysis: MediaSpecificAnalysis;
  quantumState: QuantumStateMetrics;
  radarData: number[];
  detectedAiModel?: string;
}

export const AI_MODELS: Omit<AIModelScore, "probability">[] = [
  { model: "Google Gemini", color: "#4285F4", icon: "G" },
  { model: "ChatGPT (DALL-E)", color: "#10A37F", icon: "C" },
  { model: "Google Bard (Imagen)", color: "#DB4437", icon: "B" },
  { model: "Midjourney", color: "#FF6B35", icon: "M" },
  { model: "Stable Diffusion", color: "#6B46C1", icon: "S" },
  { model: "Adobe Firefly", color: "#FF0000", icon: "A" },
];
