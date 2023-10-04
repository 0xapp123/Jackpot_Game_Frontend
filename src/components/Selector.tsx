/* eslint-disable react-hooks/exhaustive-deps */
import { useWallet } from "@solana/wallet-adapter-react";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Waitboard from "../components/Waitboard";
import { useSocket } from "../context/SocketContext";
import CountdownBar from "./CountdownBar";
import confetti from "canvas-confetti";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Sound from "react-sound";
import { warningAlert } from "./ToastGroup";

export default function Selector(props: {
  className: string;
  setIsWonWindow: Function;
  setWonValue: Function;
  isMute: boolean;
}) {
  const wallet = useWallet();
  const { winner, gameData, setClearGame, started, gameEnded } = useSocket();
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const list = [32, 132, 232, 332, 432];
  const [isWonSound, setIsWonSound] = useState(false);
  const [isBetSound, setIsBetSound] = useState(false);
  const [isLoseSound, setIsLoseSound] = useState(false);
  const [confettiThrown, setConfettiThrown] = useState(false);

  const throwConfetti = useCallback(() => {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [confetti]);

  const target = useMemo(() => {
    let res = 0;
    if (
      gameData &&
      gameData.players.length > 1 &&
      winner &&
      winner.winner !== ""
    ) {
      res = winner.resultHeight * 500 + 2500;
    }
    console.log(winner, "Result height: ", res);
    return Math.ceil(res);
  }, [winner, gameData]);

  useEffect(() => {
    if (!target) return;
    let intervalId: NodeJS.Timeout;

    function handleTimer() {
      intervalId = setInterval(() => {
        setTimer((count) => count + 2);
      }, 1);
      setIsTimerRunning(true);
      console.log("targetValue", target);
    }

    if (timer === 0) {
      handleTimer();
      return () => clearInterval(intervalId);
    }

    const timeDifference = target - timer;
    let increment = isTimerRunning ? 3 : 0;

    if (timeDifference >= 600 && isTimerRunning) {
      increment = 1.9;
    } else if (timeDifference >= 450 && isTimerRunning) {
      increment = 1.7;
    } else if (timeDifference >= 300 && isTimerRunning) {
      increment = 1.5;
    } else if (timeDifference >= 250 && isTimerRunning) {
      increment = 1.2;
    } else if (timeDifference >= 200 && isTimerRunning) {
      increment = 1;
    } else if (timeDifference >= 50 && isTimerRunning) {
      increment = 0.7;
    } else if (timeDifference >= 5 && isTimerRunning) {
      increment = 0.3;
    }
    // else if (timeDifference >= 70 && isTimerRunning) {
    //   increment = 0.15;
    // } else if (timeDifference >= 50 && isTimerRunning) {
    //   increment = 0.08;
    // } else if (timeDifference >= 30 && isTimerRunning) {
    //   increment = 0.04;
    // }
    // else if (timeDifference >= 10 && isTimerRunning) {
    //   increment = 0.01;
    // } else if (timeDifference >= 1 && isTimerRunning) {
    //   increment = 0.005;
    // }

    intervalId = setInterval(() => {
      setTimer((count) => count + increment);
    }, 1);

    if (timer >= target) {
      clearInterval(intervalId);
      setIsTimerRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [timer, target, isTimerRunning]);

  useEffect(() => {
    if (
      Math.ceil(target) - Math.ceil(timer) < 1 &&
      !confettiThrown &&
      winner?.winner !== "" &&
      gameData
    ) {
      if (
        wallet.publicKey?.toBase58() === winner?.winner &&
        gameData.players?.length !== 0
      ) {
        console.log("====>>>> confetti start");
        setTimeout(() => {
          throwConfetti();
          console.log("====>>>> confetti end");

          setConfettiThrown(true);
          const sumBets = gameData.players.reduce(
            (sum: number, item: any) => sum + item.amount,
            0
          );
          props.setIsWonWindow(true);
          props.setWonValue(sumBets / LAMPORTS_PER_SOL);
          if (!props.isMute) {
            console.log("====>>>> sound start");
            setIsWonSound(true);
            setTimeout(() => {
              console.log("====>>>> sound end");
              setIsWonSound(false);
            }, 1500);
          } else {
            setIsWonSound(false);
          }
        }, 1000);
      }
      const userUnique = gameData.players.find(
        (item) => item.player === wallet.publicKey?.toBase58()
      );
      if (userUnique && wallet.publicKey?.toBase58() !== winner?.winner) {
        setIsLoseSound(true);
        console.log("======== Lose sound ========");
        setTimeout(() => {
          setIsLoseSound(false);
          console.log("======== Lose sound pause ========");
        }, 3000);
      }
    }
  }, [timer, wallet, gameData?.players, gameData?.endTimestamp]);

  useEffect(() => {
    if (gameEnded === undefined) return;
    if (setClearGame) setClearGame();
    if (!gameEnded) {
      console.log("====>>>> game start");
      setTimer(0);
      props.setIsWonWindow(false);
      setConfettiThrown(false);
    } else {
      console.log("====>>>> game end");
    }
  }, [gameEnded]);

  useEffect(() => {
    if (!gameEnded || !gameData?.players) return;
    if (gameData.players.length === 1) {
      warningAlert("No another player for 4 mins. Refunding..");
    }
  }, [gameEnded, gameData?.players]);

  useEffect(() => {
    console.log("started~~: ", started)
  }, [started])

  return (
    <>
      <div className={`${props.className}`}>
        {started ? (
          <>
            <div
              className="w-9 h-9 absolute bg-white blur-[9px] rounded-full left-[-60px]"
              style={{
                top: `${Math.floor(timer / 500) % 2
                  ? list[Math.floor(timer / 100) % 5]
                  : list[5 - (Math.floor(timer / 100) % 5)]
                  }px`,
              }}
            ></div>
            <div
              className="w-9 h-9 absolute bg-white blur-[9px] rounded-full right-[-60px]"
              style={{
                top: `${Math.floor(timer / 500) % 2
                  ? list[Math.floor(timer / 100) % 5]
                  : list[5 - (Math.floor(timer / 100) % 5)]
                  }px`,
              }}
            ></div>
            <div
              className={`w-full absolute border-t-4 border-dashed after:w-4 lg:after:w-5 after:h-5 after:bg-[#fff] after:absolute after:-right-2 after:rotate-45 after:-top-3 before:w-5 before:h-5 before:bg-[#fff] before:absolute before:-left-2 before:rotate-45 before:-top-3`}
              style={{
                top: `${Math.floor(timer / 500) % 2
                  ? timer % 500
                  : 500 - (timer % 500)
                  }px`,
              }}
            ></div>
          </>
        ) : (
          <div className="absolute left-0 top-0 w-full h-full bg-[#00000080] rounded-lg">
            <CountdownBar
              className=""
              isMute={props.isMute}
              setIsBetSound={setIsBetSound}
            />
            <div
              className={`w-full absolute border-t-4 border-dashed after:w-3 after:h-3 lg:after:w-5 lg:after:h-5 after:bg-[#fff] after:absolute after:-right-2 after:rotate-45 after:-top-2 xl:after:-top-3 lg:before:w-5 lg:before:h-5 before:w-3 before:h-3 before:bg-[#fff] before:absolute before:-left-2 before:rotate-45 before:-top-2 xl:before:-top-3 opacity-20 top-0`}
            >
            </div>
            <div className="w-full h-full rounded-xl relative z-10 pointer-events-none">
              <p className="text-white text-[18px] font-bold text-center pt-[90px]">
                WAITING FOR USERS...
              </p>
            </div>
          </div>
        )}
        <Waitboard />
      </div>
      <Sound
        url="/sound/success.mp3"
        debug={false}
        playStatus={isWonSound ? "PLAYING" : "STOPPED"}
      />
      <Sound
        url="/sound/game-start.mp3"
        debug={false}
        playStatus={isBetSound ? "PLAYING" : "STOPPED"}
      />
      <Sound
        url="/sound/lose.mp3"
        debug={false}
        playStatus={isLoseSound ? "PLAYING" : "STOPPED"}
      />
    </>
  );
}
