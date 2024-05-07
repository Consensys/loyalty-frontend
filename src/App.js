import Stamp from "./Components/Stamp";
import LoadingCircle from "./Components/Loader";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi' 
import { config } from "./wagmi";
import './App.css';
import Layout from "./Components/Layout";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div>hi</div>} />
              {/* <Route path="about" element={<About />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. 
              <Route path="*" element={<NoMatch />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
          {/* <Stamp
              points={8}
              title="Ownership verification"
              subtitle="Verify ownership of the smart contract address."
          />
          <LoadingCircle /> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
