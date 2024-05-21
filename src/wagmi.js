import { http, createConfig } from 'wagmi'
import { sepolia, mainnet, lineaSepolia } from "wagmi/chains"
import { injected, metaMask, safe } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, lineaSepolia],
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
    [lineaSepolia.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})