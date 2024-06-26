import { Routes, Route, Outlet, Link } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "./wagmi"
import "./Styles/App.scss"
import Layout from "./Components/Layout"
import { BrowserRouter } from "react-router-dom"
import Dashboard from "./Pages/Dashboard"
import Activity from "./Pages/Activity"
import Auditor from "./Pages/Auditor"
import Earn from "./Pages/Earn"
import Redeem from "./Pages/Redeem"
import Benefits from "./Pages/Benefits"
import Support from "./Pages/Support"
import axios from 'axios'

axios.defaults.withCredentials = true;

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="activity" element={<Activity />} />
              <Route path="auditor" element={<Auditor />} />
              <Route path="earn" element={<Earn />} />
              <Route path="redeem" element={<Redeem />} />
              <Route path="benefits" element={<Benefits />} />
              <Route path="support" element={<Support />} />

              {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. */}
              {/* <Route path="*" element={<NoMatch />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
