import { Routes, Route, Outlet, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi' 
import { config } from "./wagmi";
import './App.css';
import Layout from "./Components/Layout";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Activity from "./Pages/Activity";
import Earn from "./Pages/Earn";
import Redeem from "./Pages/Redeem";
import Benefits from "./Pages/Benefits";
import Support from "./Pages/Support";

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="activity" element={<Activity />} />
              <Route path="earn" element={<Earn />} />
              <Route path="redeem" element={<Redeem />} />
              <Route path="benefits" element={<Benefits />} />
              <Route path="support" element={<Support />} />

              {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. */ }
              {/* <Route path="*" element={<NoMatch />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
