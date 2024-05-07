import Header from "./Components/Header";
import Stamp from "./Components/Stamp";
import LoadingCircle from "./Components/Loader";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi' 
import { config } from "./wagmi";
import './App.css';

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <div className="App">
            <Header />
            <div style={{ height: '50px'}} />
            <Stamp
                points={8}
                title="Ownership verification"
                subtitle="Verify ownership of the smart contract address."
            />
            <LoadingCircle />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
