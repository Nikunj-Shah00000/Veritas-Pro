import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ParticleBackground from "@/components/ParticleBackground";
import Navigation from "@/components/Navigation";
import QuantumStatusBar from "@/components/QuantumStatusBar";
import Dashboard from "@/pages/Dashboard";
import Detect from "@/pages/Detect";
import Analysis from "@/pages/Analysis";
import Reports from "@/pages/Reports";
import Agents from "@/pages/Agents";
import About from "@/pages/About";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="relative z-10 min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-black font-mono quantum-text mb-4">404</div>
        <p className="text-white/50">Page not found in the quantum realm</p>
        <a href="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">Return home →</a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/detect" component={Detect} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/reports" component={Reports} />
      <Route path="/agents" component={Agents} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="grid-quantum hexagon-bg min-h-screen">
            <ParticleBackground />
            <Navigation />
            <main className="relative">
              <Router />
            </main>
            <QuantumStatusBar />
            <Toaster />
          </div>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
