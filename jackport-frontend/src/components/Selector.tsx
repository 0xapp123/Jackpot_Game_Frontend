/* eslint-disable react-hooks/exhaustive-deps */
import { useWallet } from "@solana/wallet-adapter-react";
import React, {
  useRef,
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

export default function Selector(props: {
  className: string;
  setIsWonWindow: Function;
  setWonValue: Function;
  isMute: boolean;
}) {
  const wallet = useWallet();
  const { winner, gameData, setClearGame, started, setStarted, gameEnded } =
    useSocket();
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const list = [32, 132, 232, 332, 432];
  const [isWonSound, setIsWonSound] = useState(false);
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
      // const ranCount = Math.round(1 + Math.random()) + 1;
      // console.log("ranCount =>", ranCount);
      // if (ranCount % 2 === 0) {
      //   res = winner.resultHeight * 500 + ranCount * 500;
      // } else {
      //   res = ranCount * 500 - winner.resultHeight * 500;
      // }
      res = winner.resultHeight * 500 + 1500;
      // if (setStarted) setStarted(true);
    }
    // console.log(winner, Math.ceil(res));
    // console.log(gameData, "gameData");
    console.log(winner, "Result height: ", res)
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
      console.log('targetValue', target);
    }

    if (timer === 0) {
      handleTimer();
      return () => clearInterval(intervalId);
    }

    const timeDifference = target - timer;
    let increment = 2;

    if (timeDifference >= 400 && isTimerRunning) {
      increment = 1.9;
    } else if (timeDifference >= 350 && isTimerRunning) {
      increment = 1.3;
    } else if (timeDifference >= 300 && isTimerRunning) {
      increment = 1.1;
    } else if (timeDifference >= 250 && isTimerRunning) {
      increment = 0.8;
    } else if (timeDifference >= 200 && isTimerRunning) {
      increment = 0.5;
    } else if (timeDifference >= 150 && isTimerRunning) {
      increment = 0.2;
    } else if (timeDifference >= 100 && isTimerRunning) {
      increment = 0.1;
    } else if (timeDifference >= 80 && isTimerRunning) {
      increment = 0.08;
    } else if (timeDifference >= 60 && isTimerRunning) {
      increment = 0.06;
    } else if (timeDifference >= 40 && isTimerRunning) {
      increment = 0.04;
    } else if (timeDifference >= 20 && isTimerRunning) {
      increment = 0.02;
    } else if (timeDifference >= 10 && isTimerRunning) {
      increment = 0.01;
    } else if (timeDifference >= 5 && isTimerRunning) {
      increment = 0.005;
    }

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
    console.log("target :", target);
  }, [target])

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
        throwConfetti();

        setConfettiThrown(true);
        const sumBets = gameData.players.reduce(
          (sum: number, item: any) => sum + item.amount,
          0
        );
        props.setIsWonWindow(true);
        props.setWonValue(sumBets / LAMPORTS_PER_SOL);
        if (!props.isMute) {
          setIsWonSound(true);
          setTimeout(() => {
            setIsWonSound(false);
          }, 1500);
        } else {
          setIsWonSound(false);
        }
      }
    }
  }, [timer, wallet, gameData?.players, gameData?.endTimestamp]);

  useEffect(() => {
    if (gameEnded === undefined) return;
    if (setClearGame) setClearGame();
    if (!gameEnded) {
      setTimer(0);
      props.setIsWonWindow(false);
      setConfettiThrown(false)
    }
    // if (setStarted) setStarted(false);
  }, [gameEnded]);

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
            {/* <div
                            className="w-9 h-9 absolute bg-white blur-[9px] rounded-full left-[-60px] opacity-80"
                            style={{ top: `${Math.floor(timerInfinite / 500) % 2 ? list[Math.floor((timerInfinite / 100)) % 5] : list[5 - Math.floor((timerInfinite / 100)) % 5]}px` }}>
                        </div>
                        <div
                            className="w-9 h-9 absolute bg-white blur-[9px] rounded-full right-[-60px] opacity-80"
                            style={{ top: `${Math.floor(timerInfinite / 500) % 2 ? list[Math.floor((timerInfinite / 100)) % 5] : list[5 - Math.floor((timerInfinite / 100)) % 5]}px` }}
                        >
                        </div> */}
            <CountdownBar className="" isMute={props.isMute} />
            <div
              className={`w-full absolute border-t-4 border-dashed after:w-3 after:h-3 lg:after:w-5 lg:after:h-5 after:bg-[#fff] after:absolute after:-right-2 after:rotate-45 after:-top-2 xl:after:-top-3 lg:before:w-5 lg:before:h-5 before:w-3 before:h-3 before:bg-[#fff] before:absolute before:-left-2 before:rotate-45 before:-top-2 xl:before:-top-3 opacity-20`}
              style={{ top: `0` }}
            >
              {/* style={{ top: `${Math.floor(timerInfinite / 500) % 2 ? timerInfinite % 500 : 500 - (timerInfinite % 500)}px` }}> */}
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
    </>
  );
}
