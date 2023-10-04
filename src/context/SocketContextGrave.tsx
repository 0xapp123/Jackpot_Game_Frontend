/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import getConfig from "next/config";
import {
  ChatType,
  ClientToServerEvents,
  Player,
  ServerToClientEvents,
} from "../utils/type";
import {
  API_URL,
  CLEAR_COOLDOWN,
  GRAVE_API_URL,
  GRAVE_SOCKET_URL,
} from "../config";
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();
export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface Context {
  socket?: SocketType;
  gameData?: {
    players: Player[];
    pda: string;
    endTimestamp: number;
    gameStarted: boolean;
  };
  gameEnded?: boolean;
  winner?: {
    bet: number,
    payout: number,
    winner: string;
    resultHeight: number;
  };
  resultHeight?: number;
  getFirstGameData?: Function;
  setClearGame?: Function;
  started?: boolean;
  setStarted?: Function;
  messages?: ChatType[];
  onlined?: number;
  isStarting?: number;
  recentWinners?: any[];
}

const context = createContext<Context>({});

export const useSocket = () => useContext(context);

const SocketProviderGrave = (props: { children: any }) => {
  const [socket, setSocket] = useState<SocketType>();
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatType[]>();
  const [onlined, setOnlined] = useState(0);
  const [isStarting, setGameStarting] = useState<number>(1);
  const [gameData, setGameData] = useState<{
    players: Player[];
    endTimestamp: number;
    pda: string;
    gameStarted: boolean;
  }>();

  const router = useRouter();

  const [recentWinners, setRecentWinner] = useState();

  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState({
    bet: 0,
    payout: 0,
    winner: "",
    resultHeight: 0,
  });
  const [resultHeight, setResultHeight] = useState(0);

  const setClearGame = () => {
    setGameData({
      players: [],
      endTimestamp: 0,
      pda: "",
      gameStarted: false,
    });
    if (gameEnded) {
      setGameStarting(1);
      setWinner({
        bet: 0,
        payout: 0,
        winner: "",
        resultHeight: 0,
      });
      setStarted(false);
    }
  };

  const getFirstGameData = async () => {
    try {
      const response = await fetch(`${GRAVE_API_URL}getRecentGame`);
      const data = await response.json();
      if (data?.pda && data?.pda !== "") {
        setGameData({
          players: data.players,
          endTimestamp: data.endTimestamp,
          pda: data.pda,
          gameStarted: true,
        });
      }
    } catch (error) {
      console.log("getFirstGameData", error);
      setGameData(undefined);
    }
  };

  useEffect(() => {
    getFirstGameData();
  }, [gameData?.endTimestamp]);

  const getFirstMessages = async () => {
    try {
      const response = await fetch(`${GRAVE_API_URL}getMessage`);
      const data = await response.json();
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.log("getFirstMessages", error);
      setGameData(undefined);
    }
  };

  // init socket client object
  useEffect(() => {
    const socket = io(GRAVE_SOCKET_URL, {
      transports: ["websocket"],
    });
    socket.on("connect", async () => {
      console.log(" --@ connected to backend (grave)", socket.id);
      await getFirstGameData();
      await getFirstMessages();
    });
    socket.on("disconnect", () => {
      console.log(" --@ disconnected from backend (grave)", socket.id);
    });
    setSocket(socket);
    return () => {
      gameData;
      socket.off("connect");
      socket.off("disconnect");
      setSocket(undefined);
    };
  }, [router]);

  useEffect(() => {
    socket?.on("endTimeUpdated", async (pda, last_ts, players) => {
      console.log(" --@ endTimeUpdated:", pda, last_ts, players);
      setGameData({
        pda: pda,
        endTimestamp: last_ts,
        players: players,
        gameStarted: true,
      });
    });

    socket?.on("connectionUpdated", async (counter) => {
      //   console.log(" --@ connectionUpdated:", counter);
      setOnlined(counter);
    });

    socket?.on("startGame", async (pda, endTimestamp, players) => {
      console.log(" --@ startGame:", pda, endTimestamp, players);
      setGameData({
        pda: pda,
        endTimestamp,
        players,
        gameStarted: true,
      });
      setWinner({
        bet: 0,
        payout: 0,
        winner: "",
        resultHeight: 0,
      });
      setResultHeight(0);
    });

    socket?.on("gameEnded", async (winner) => {
      console.log(" --@ gameEnded:", new Date().toLocaleTimeString(), winner);
      setWinner(winner);
    });

    // TODO: need to check if this fresh round is working
    socket?.on("newGameReady", async (time, players) => {
      console.log(
        " --@ newGameReady:",
        new Date().toLocaleTimeString(),
        time,
        players
      );
      setTimeout(() => {
        // if (isStarting)
        //   setGameData({
        //     players: players,
        //     endTimestamp: time,
        //     pda: "",
        //     gameStarted: false,
        //   });
        setGameEnded(true);
        //   // reset game starting
        // setGameStarting(1);
        // setWinner({
        //   winner: "",
        //   resultHeight: 0,
        // });
        // setStarted(false);
      }, CLEAR_COOLDOWN);
    });

    socket?.on("gameStarting", async (started) => {
      console.log(" --@ gameStarting:", started);
      // set game starting flag to prevent conflict
      setGameStarting(started);
      setGameEnded(false);
    });

    socket?.on("chatUpdated", async ([...msgs]: ChatType[]) => {
      setMessages(msgs);
    });
    return () => {
      socket?.off("connectionUpdated");
      socket?.off("startGame");
      socket?.off("endTimeUpdated");
      socket?.off("chatUpdated");
      socket?.off("gameEnded");
      socket?.off("newGameReady");
      socket?.off("gameStarting");
    };
  }, [socket]);

  return (
    <context.Provider
      value={{
        socket,
        gameData,
        gameEnded,
        winner,
        resultHeight,
        setClearGame,
        isStarting,
        started,
        setStarted,
        messages,
        recentWinners,
        onlined,
      }}
    >
      {props.children}
    </context.Provider>
  );
};

export default SocketProviderGrave;
