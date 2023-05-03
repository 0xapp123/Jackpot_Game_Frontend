import "../styles/globals.scss";
import SocketProvider from "../context/SocketContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Wallet from "../components/wallet/Wallet";
import { ToastContainer } from "react-toastify";
import { AppProps } from "next/app";
import { useState } from "react";
import { SoundOffIcon, SoundOnIcon } from "../components/Svglist";
import SocketProviderGrave from "../context/SocketContextGrave";

import "../styles/infinite.scss";
import SocketProviderInfinite from "../context/SocketContextInfinite";
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [isMute, setIsMute] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <SocketProviderGrave>
          <SocketProviderInfinite>
            <Wallet>
              <WalletModalProvider>
                <Component {...pageProps} isMute={isMute} setIsMute={setIsMute} />
                <ToastContainer
                  style={{ fontSize: 15 }}
                  pauseOnFocusLoss={false}
                />
                <button
                  className="fixed bottom-6 left-6 z-50"
                  onClick={() => setIsMute(!isMute)}
                >
                  {isMute ? <SoundOffIcon /> : <SoundOnIcon />}
                </button>
              </WalletModalProvider>
            </Wallet>
          </SocketProviderInfinite>
        </SocketProviderGrave>
      </SocketProvider>
    </QueryClientProvider>
  );
}
