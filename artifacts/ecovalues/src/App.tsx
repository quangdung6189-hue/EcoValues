import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Home from '@/pages/Home';
import LiveMap from '@/pages/LiveMap';
import Solutions from '@/pages/Solutions';
import Roadmap from '@/pages/Roadmap';
import SupportStations from '@/pages/SupportStations';
import GreenPoints from '@/pages/GreenPoints';
import Join from '@/pages/Join';
import Profile from '@/pages/Profile';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ban-do" component={LiveMap} />
      <Route path="/giai-phap" component={Solutions} />
      <Route path="/ke-hoach" component={Roadmap} />
      <Route path="/tram-ho-tro" component={SupportStations} />
      <Route path="/tich-diem" component={GreenPoints} />
      <Route path="/tham-gia" component={Join} />
      <Route path="/ca-nhan" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
