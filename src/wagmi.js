import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = 'Loyalty Dapp'

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    safe(),
    metaMask({
      dappMetadata: {
        name: "Loyalty Dapp",
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});