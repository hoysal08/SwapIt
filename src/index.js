import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createClient,
  goerli,
  sepolia,
  WagmiConfig,
} from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider, VisuallyHidden } from "@chakra-ui/react";

export const Filecointestnet = {
  id: 3141,
  name: "Filecoin - Hyperspace ",
  network: "Filecoin",
  iconUrl:
    "https://w7.pngwing.com/pngs/98/456/png-transparent-filecoin-fil-coin-cryptocoin-exchange-coins-crypto-blockchain-cryptocurrency-logo-glyph-icon.png",
  iconBackground: "#000000",
  nativeCurrency: {
    decimals: 18,
    name: "tFIL",
    symbol: "tFIL",
  },
  rpcUrls: {
    default: {
      http: ["https://filecoin-hyperspace.chainup.net/rpc/v1"],
      // public rpc url
    },
  },
  blockExplorers: {
    default: {
      name: "Filecoin - Hyperspace  Testnet Explorer",
      url: "https://hyperspace.filfox.info/en",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [Filecointestnet, sepolia, polygonMumbai], //,mainnet, polygon
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "SwapIt",
  projectId: process.env.Wallet_Connect_PRJ_ID,
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>
);
