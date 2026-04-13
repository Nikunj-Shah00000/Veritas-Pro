import { DetectionReport, MediaType, AI_MODELS } from "../types/detection";

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDetectionReport(
  fileName: string,
  fileSize: string,
  mediaType: MediaType,
  sourceUrl?: string
): DetectionReport {
  const isFake = Math.random() > 0.45;
  const confidence = isFake
    ? randomInRange(72, 99)
    : randomInRange(78, 99);

  const deepfakeProbability = isFake
    ? randomInRange(65, 98)
    : randomInRange(2, 25);

  const manipulationScore = isFake
    ? randomInRange(60, 95)
    : randomInRange(2, 20);

  const quantumCoherence = isFake
    ? randomInRange(20, 60)
    : randomInRange(75, 99);

  const neuralEntanglement = isFake
    ? randomInRange(15, 55)
    : randomInRange(80, 99);

  const spectralSignature = randomInRange(30, 95);
  const noisePattern = isFake ? randomInRange(55, 90) : randomInRange(10, 40);
  const colorDistribution = isFake ? randomInRange(40, 80) : randomInRange(15, 35);
  const temporalConsistency = isFake ? randomInRange(20, 65) : randomInRange(70, 98);

  // Distribute AI model probabilities
  const aiModelScores = AI_MODELS.map((m, i) => {
    let probability = 0;
    if (isFake) {
      // Pick one primary model with high probability
      const primaryModel = Math.floor(Math.random() * AI_MODELS.length);
      if (i === primaryModel) {
        probability = randomInRange(55, 90);
      } else {
        probability = randomInRange(5, 35);
      }
    } else {
      probability = randomInRange(2, 15);
    }
    return { ...m, probability };
  });

  // Normalize
  const total = aiModelScores.reduce((s, m) => s + m.probability, 0);
  const normalized = aiModelScores.map(m => ({ ...m, probability: (m.probability / total) * 100 }));
  const detectedModel = isFake ? normalized.reduce((a, b) => (a.probability > b.probability ? a : b)).model : undefined;

  const mediaAnalysis = (() => {
    if (mediaType === "image") {
      return {
        facialConsistency: isFake ? randomInRange(20, 65) : randomInRange(75, 99),
        lightingAnalysis: isFake ? randomInRange(25, 70) : randomInRange(70, 98),
        compressionArtifacts: isFake ? randomInRange(40, 85) : randomInRange(5, 30),
      };
    } else if (mediaType === "video") {
      return {
        frameAnalysis: isFake ? randomInRange(20, 65) : randomInRange(70, 98),
        motionConsistency: isFake ? randomInRange(15, 60) : randomInRange(75, 99),
        temporalConsistency: isFake ? randomInRange(20, 60) : randomInRange(70, 98),
      };
    } else {
      return {
        spectralAnalysis: isFake ? randomInRange(30, 75) : randomInRange(65, 98),
        frequencyPatterns: isFake ? randomInRange(35, 80) : randomInRange(60, 95),
        voiceAuthenticity: isFake ? randomInRange(15, 55) : randomInRange(75, 99),
      };
    }
  })();

  const radarData = [
    quantumCoherence,
    neuralEntanglement,
    spectralSignature,
    noisePattern,
    colorDistribution,
    temporalConsistency,
  ];

  return {
    id: `VQR-${Date.now()}-${randomInt(1000, 9999)}`,
    fileName,
    fileSize,
    mediaType,
    sourceUrl,
    timestamp: new Date(),
    status: isFake ? "fake" : "real",
    confidence,
    aiModelScores: normalized.sort((a, b) => b.probability - a.probability),
    quantumMetrics: {
      quantumCoherence,
      neuralEntanglement,
      manipulationScore,
      deepfakeProbability,
      spectralSignature,
      noisePattern,
      colorDistribution,
      temporalConsistency,
    },
    mediaAnalysis,
    quantumState: {
      qubitStability: randomInRange(85, 99.9),
      gateFidelity: randomInRange(88, 99.9),
      entanglementRate: randomInRange(90, 99.9),
      coherenceTime: randomInRange(80, 99.9),
    },
    radarData,
    detectedAiModel: detectedModel,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function detectMediaType(filename: string): MediaType {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff", "avif"].includes(ext)) return "image";
  if (["mp4", "avi", "mov", "mkv", "webm", "flv", "wmv", "m4v"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"].includes(ext)) return "audio";
  return "image";
}

// Sample reports for the dashboard and reports page
export const SAMPLE_REPORTS: DetectionReport[] = [
  {
    id: "VQR-1712345678-1234",
    fileName: "interview_footage.mp4",
    fileSize: "84.2 MB",
    mediaType: "video",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: "fake",
    confidence: 96.4,
    detectedAiModel: "Midjourney",
    aiModelScores: AI_MODELS.map((m, i) => ({ ...m, probability: [12, 8, 6, 64, 7, 3][i] })),
    quantumMetrics: {
      quantumCoherence: 28.3,
      neuralEntanglement: 22.1,
      manipulationScore: 89.4,
      deepfakeProbability: 96.4,
      spectralSignature: 78.2,
      noisePattern: 82.1,
      colorDistribution: 71.5,
      temporalConsistency: 24.7,
    },
    mediaAnalysis: { frameAnalysis: 31.2, motionConsistency: 24.5, temporalConsistency: 22.8 },
    quantumState: { qubitStability: 97.2, gateFidelity: 98.1, entanglementRate: 99.4, coherenceTime: 96.8 },
    radarData: [28.3, 22.1, 78.2, 82.1, 71.5, 24.7],
  },
  {
    id: "VQR-1712345600-5678",
    fileName: "portrait_photo.jpg",
    fileSize: "3.8 MB",
    mediaType: "image",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: "real",
    confidence: 94.1,
    aiModelScores: AI_MODELS.map((m, i) => ({ ...m, probability: [18, 17, 16, 17, 15, 17][i] })),
    quantumMetrics: {
      quantumCoherence: 91.2,
      neuralEntanglement: 88.7,
      manipulationScore: 8.3,
      deepfakeProbability: 5.9,
      spectralSignature: 44.2,
      noisePattern: 12.4,
      colorDistribution: 18.9,
      temporalConsistency: 93.1,
    },
    mediaAnalysis: { facialConsistency: 92.4, lightingAnalysis: 89.6, compressionArtifacts: 11.2 },
    quantumState: { qubitStability: 98.7, gateFidelity: 97.4, entanglementRate: 99.1, coherenceTime: 97.8 },
    radarData: [91.2, 88.7, 44.2, 12.4, 18.9, 93.1],
  },
  {
    id: "VQR-1712345000-9012",
    fileName: "ceo_statement.mp3",
    fileSize: "12.1 MB",
    mediaType: "audio",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: "fake",
    confidence: 88.7,
    detectedAiModel: "Stable Diffusion",
    aiModelScores: AI_MODELS.map((m, i) => ({ ...m, probability: [8, 10, 7, 9, 56, 10][i] })),
    quantumMetrics: {
      quantumCoherence: 34.1,
      neuralEntanglement: 29.8,
      manipulationScore: 76.3,
      deepfakeProbability: 88.7,
      spectralSignature: 81.4,
      noisePattern: 75.2,
      colorDistribution: 66.1,
      temporalConsistency: 32.4,
    },
    mediaAnalysis: { spectralAnalysis: 77.2, frequencyPatterns: 72.8, voiceAuthenticity: 21.4 },
    quantumState: { qubitStability: 94.2, gateFidelity: 96.1, entanglementRate: 98.4, coherenceTime: 93.7 },
    radarData: [34.1, 29.8, 81.4, 75.2, 66.1, 32.4],
  },
  {
    id: "VQR-1712344500-3456",
    fileName: "product_render.png",
    fileSize: "7.5 MB",
    mediaType: "image",
    sourceUrl: "https://example.com/renders/product_v2.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    status: "fake",
    confidence: 91.3,
    detectedAiModel: "Google Gemini",
    aiModelScores: AI_MODELS.map((m, i) => ({ ...m, probability: [67, 8, 7, 9, 5, 4][i] })),
    quantumMetrics: {
      quantumCoherence: 31.7,
      neuralEntanglement: 27.4,
      manipulationScore: 83.2,
      deepfakeProbability: 91.3,
      spectralSignature: 79.8,
      noisePattern: 84.6,
      colorDistribution: 76.3,
      temporalConsistency: 29.1,
    },
    mediaAnalysis: { facialConsistency: 34.2, lightingAnalysis: 42.7, compressionArtifacts: 71.3 },
    quantumState: { qubitStability: 96.4, gateFidelity: 97.8, entanglementRate: 99.2, coherenceTime: 95.1 },
    radarData: [31.7, 27.4, 79.8, 84.6, 76.3, 29.1],
  },
];
