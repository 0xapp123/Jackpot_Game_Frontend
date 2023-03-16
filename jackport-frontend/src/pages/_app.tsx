import "../styles/globals.css";
import SocketProvider from "../context/SocketContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Wallet from "../components/wallet/Wallet";
import { ToastContainer } from "react-toastify";
import { AppProps } from "next/app";
import { useState } from "react";
import { SoundOffIcon, SoundOnIcon } from "../components/Svglist";
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [isMute, setIsMute] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Wallet>
          <WalletModalProvider>
            <Component
              {...pageProps}
              isMute={isMute}
              setIsMute={setIsMute}
            />
            <ToastContainer
              style={{ fontSize: 15 }}
              pauseOnFocusLoss={false}
            />
            <button className="fixed bottom-5 left-5 z-50" onClick={() => setIsMute(!isMute)}>
              {isMute ? <SoundOffIcon /> : <SoundOnIcon />}
            </button>
          </WalletModalProvider>
        </Wallet>
      </SocketProvider>
    </QueryClientProvider>
  )
}