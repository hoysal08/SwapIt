import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, goerli, sepolia, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider, VisuallyHidden } from '@chakra-ui/react'

const { chains, provider } = configureChains(
  [polygonMumbai,sepolia],//,mainnet, polygon
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'SwapIt',
  projectId: process.env.Wallet_Connect_PRJ_ID,
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const root = ReactDOM.createRoot(document.getElementById('root'));
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

