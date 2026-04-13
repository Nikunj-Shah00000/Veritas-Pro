import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface QuantumRadarChartProps {
  data: number[];
  labels?: string[];
  animated?: boolean;
}

export default function QuantumRadarChart({ data, labels, animated = true }: QuantumRadarChartProps) {
  const defaultLabels = [
    "Quantum Coherence",
    "Neural Entanglement",
    "Spectral Signature",
    "Noise Pattern",
    "Color Distribution",
    "Temporal Consistency",
  ];

  const chartData = {
    labels: labels || defaultLabels,
    datasets: [
      {
        label: "Analysis Metrics",
        data,
        backgroundColor: "rgba(0, 255, 200, 0.08)",
        borderColor: "rgba(0, 255, 200, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 255, 200, 1)",
        pointBorderColor: "rgba(0, 255, 200, 0.3)",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(0, 255, 200, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Baseline Threshold",
        data: [50, 50, 50, 50, 50, 50],
        backgroundColor: "rgba(100, 100, 120, 0.05)",
        borderColor: "rgba(100, 100, 150, 0.3)",
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: animated ? 1000 : 0,
    },
    scales: {
      r: {
        angleLines: {
          color: "rgba(0, 255, 200, 0.1)",
          lineWidth: 1,
        },
        grid: {
          color: "rgba(0, 255, 200, 0.08)",
          lineWidth: 1,
        },
        pointLabels: {
          color: "rgba(0, 255, 200, 0.7)",
          font: {
            size: 10,
            family: "'Space Grotesk', sans-serif",
          },
        },
        ticks: {
          display: false,
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        backgroundColor: "rgba(0, 255, 200, 0.02)",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(10, 20, 30, 0.9)",
        borderColor: "rgba(0, 255, 200, 0.3)",
        borderWidth: 1,
        titleColor: "rgba(0, 255, 200, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.7)",
        titleFont: {
          family: "'Space Mono', monospace",
          size: 11,
        },
        bodyFont: {
          family: "'Space Grotesk', sans-serif",
          size: 12,
        },
        callbacks: {
          label: (ctx: { parsed?: { r?: number } }) => {
            const val = ctx.parsed?.r ?? 0;
            return ` Score: ${val.toFixed(1)}`;
          },
        },
      },
    },
  };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,255,200,0.03) 0%, transparent 70%)",
          animation: "quantum-pulse 3s ease-in-out infinite",
        }}
      />
      <Radar data={chartData} options={options as Parameters<typeof Radar>[0]["options"]} />
    </div>
  );
}
