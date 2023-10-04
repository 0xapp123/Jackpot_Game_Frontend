/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { base58ToGradient, getUserColor } from "../utils/util";
import { useSocket } from "../context/SocketContextInfinite";
import Sound from "react-sound";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import CountdownBar from "./CountdownBarInfinite";
import { useWallet } from "@solana/wallet-adapter-react";
import confetti from "canvas-confetti";

interface Pie {
  color: string;
  deg: number;
}

interface PieColor {
  color: string;
  first: number;
  second: number;
}

export default function InfiniteBox(props: {
  isMute: boolean;
  className: string;
  setIsWonWindow: Function;
  setWonValue: Function;
}) {
  const wallet = useWallet();

  const { gameData, started, winner, setClearGame, gameEnded } = useSocket();
  const [isWonSound, setIsWonSound] = useState(false);
  const [isLoseSound, setIsLoseSound] = useState(false);
  const throwConfetti = useCallback(() => {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [confetti]);

  const [ballDeg, setBallDeg] = useState(90);
  const [hiddenFlag, setHiddenFlag] = useState(1);

  const userColors = useMemo(() => {
    let colors: { color: string; address: string }[] = [];
    if (gameData && gameData && gameData.players) {
      for (let item of gameData.players) {
        const color = getUserColor(item.player);
        colors.push({
          color:
            colors.filter((c) => c.color === color).length === 0
              ? color
              : getUserColor(item.player, true),
          address: item.player,
        });
      }
    } else {
      colors = [];
    }
    return colors;
  }, [gameData]);

  const ballAnimation = (target: number) => {
    let currentDeg = 0;
    const intervalId = setInterval(() => {
      setBallDeg((prevState: number) => {
        currentDeg = prevState;
        let temp = 6;
        const range = target - currentDeg;
        if (range <= 300 && range > 200) {
          temp = 5;
        } else if (range <= 200 && range > 160) {
          temp = 4;
        } else if (range <= 160 && range > 80) {
          temp = 3;
        } else if (range <= 80 && range > 30) {
          temp = 2;
        } else if (range <= 30) {
          temp = 1;
        }
        return prevState + temp;
      });
      if (currentDeg >= target) {
        console.log("end rotate!");
        clearInterval(intervalId);
        if (winner && winner.winner === wallet.publicKey?.toBase58()) {
          throwConfetti();
          props.setIsWonWindow(true);
          props.setWonValue(winner.payout);
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
        }
        if (gameData) {
          const userUnique = gameData.players.find(
            (item) => item.player === wallet.publicKey?.toBase58()
          );
          if (userUnique && wallet.publicKey?.toBase58() !== winner?.winner) {
            if (!props.isMute) {
              setIsLoseSound(true);
              console.log("======== Lose sound ========");
              setTimeout(() => {
                setIsLoseSound(false);
                console.log("======== Lose sound pause ========");
              }, 3000);
            } else {
              setIsLoseSound(false);
            }
          }
        }
      }
    }, 1000 / 40); // 60fps
  };

  const turnFlag = useRef(false);
  useEffect(() => {
    let t = hiddenFlag;
    const modulo = ballDeg % 360;
    console.log("ballDeg", ballDeg, modulo, turnFlag.current);
    // console.log("modulo", modulo);
    // console.log(modulo) 85-92
    if (Math.abs(modulo - 90) < 4 && !turnFlag.current) {
      t++; //
      setHiddenFlag(t);
      turnFlag.current = true;
    } else if (Math.abs(modulo - 90) >= 4) {
      turnFlag.current = false;
    }
  }, [ballDeg]);

  const colors = useMemo(() => {
    if (gameData === undefined || gameData.players.length === 0) {
      return [];
    } else {
      let c: { color: string; value: number }[] = [];
      if (gameData.players.length !== 0) {
        for (let player of gameData.players) {
          c.push({
            color: userColors.filter(
              (user) => user.address === player.player
            )[0].color,
            value: player.amount,
          });
        }
      }
      console.log(c);
      return c;
    }
  }, [gameData]);

  const colorPieL = useMemo(() => {
    if (colors) {
      const potValue = colors.reduce((acc, curr) => acc + curr.value, 0);
      let pies: Pie[] = [];

      for (let i = 0; i < colors.length; i++) {
        pies.push({
          color: colors[i].color,
          deg: (colors[i].value / potValue) * 720,
        });
      }

      const resDegs = pies.reduce((acc: any, curr, i) => {
        const lastValue = (acc[i - 1] && acc[i - 1].second) || 0;
        return [
          ...acc,
          {
            color: curr.color,
            first: lastValue,
            second: lastValue + curr.deg < 360 ? lastValue + curr.deg : 360,
          },
        ];
      }, []);

      const data = resDegs.filter((item: any) => item.first !== 360);
      const firstPies = `
                conic-gradient(
                    ${data
                      .map(
                        (item: any) =>
                          `${item.color} ${item.first}deg ${item.second}deg`
                      )
                      .join(", ")}
                )
            `;
      return firstPies;
    } else {
      return "";
    }
  }, [colors]);

  const colorPieR = useMemo(() => {
    if (colors) {
      const potValue = colors.reduce((acc, curr) => acc + curr.value, 0);
      let pies: Pie[] = [];

      for (let i = 0; i < colors.length; i++) {
        pies.push({
          color: colors[i].color,
          deg: (colors[i].value / potValue) * 720,
        });
      }

      const resDegs = pies.reduce((acc: any, curr, i) => {
        const lastValue = (acc[i - 1] && acc[i - 1].second) || 0;
        return [
          ...acc,
          {
            color: curr.color,
            first: lastValue,
            second: lastValue + curr.deg,
          },
        ];
      }, []);

      let res: PieColor[] = [];
      for (let i = 0; i < resDegs.length; i++) {
        if (resDegs[i].second > 360) {
          res.push({
            color: resDegs[i].color,
            first: resDegs[i].first - 360 < 0 ? 0 : resDegs[i].first - 360,
            second: resDegs[i].second - 360,
          });
        }
      }

      const secondPies = `
                conic-gradient(
                ${res
                  .map(
                    (item: any) =>
                      `${item.color} ${item.first}deg ${item.second}deg`
                  )
                  .join(", ")}
                )
            `;
      return secondPies;
    } else {
      return "";
    }
  }, [colors]);

  const middlePice = useMemo(() => {
    if (colors) {
      const potValue = colors.reduce((acc, curr) => acc + curr.value, 0);
      let pies: Pie[] = [];

      for (let i = 0; i < colors.length; i++) {
        pies.push({
          color: colors[i].color,
          deg: (colors[i].value / potValue) * 720,
        });
      }

      const resDegs = pies.reduce((acc: any, curr, i) => {
        const lastValue = (acc[i - 1] && acc[i - 1].second) || 0;
        return [
          ...acc,
          {
            color: curr.color,
            first: lastValue,
            second: lastValue + curr.deg < 360 ? lastValue + curr.deg : 360,
          },
        ];
      }, []);

      const data = resDegs.filter((item: any) => item.first !== 360);

      const firstPies = `
                    conic-gradient(
                    ${data
                      .map(
                        (item: any) =>
                          `${item.color} ${item.first}deg ${item.second}deg`
                      )
                      .join(", ")}
                    )
                `;
      if (data[data.length - 1]?.first < 325) {
        return `
                    conic-gradient(
                        transparent 0deg 320deg,
                        ${data[data.length - 1].color} 320deg 360deg
                    )
                `;
      } else {
        return firstPies;
      }
    } else {
      return "";
    }
  }, [colors]);

  const middleTwoPice = useMemo(() => {
    if (colors) {
      const potValue = colors.reduce((acc, curr) => acc + curr.value, 0);
      let pies: Pie[] = [];

      for (let i = 0; i < colors.length; i++) {
        pies.push({
          color: colors[i].color,
          deg: (colors[i].value / potValue) * 720,
        });
      }

      const resDegs = pies.reduce((acc: any, curr, i) => {
        const lastValue = (acc[i - 1] && acc[i - 1].second) || 0;
        return [
          ...acc,
          {
            color: curr.color,
            first: lastValue,
            second: lastValue + curr.deg,
          },
        ];
      }, []);

      let res: PieColor[] = [];
      for (let i = 0; i < resDegs.length; i++) {
        if (resDegs[i].second > 360) {
          res.push({
            color: resDegs[i].color,
            first: resDegs[i].first - 360 < 0 ? 0 : resDegs[i].first - 360,
            second: resDegs[i].second - 360,
          });
        }
      }

      const secondPies = `
                conic-gradient(
                    ${res
                      .map(
                        (item: any) =>
                          `${item.color} ${item.first}deg ${item.second}deg`
                      )
                      .join(", ")}
                )
            `;
      if (res[0]?.second > 40) {
        return `
                    conic-gradient(
                        ${res[0].color} 0deg 40deg,
                        transparent 40deg 360deg
                    )
                `;
      } else {
        return secondPies;
      }
    } else {
      return "";
    }
  }, [colors]);

  const sumPots = useMemo(() => {
    if (gameData && gameData && gameData.players) {
      const sumBets = gameData.players.reduce(
        (sum: number, item: any) => sum + item.amount,
        0
      );
      return sumBets / LAMPORTS_PER_SOL;
    } else {
      return 0;
    }
  }, [gameData]);

  const [isBetSound, setIsBetSound] = useState(false);

  useEffect(() => {
    console.log(gameData, "----- game data");
    if (
      gameData &&
      winner &&
      winner.winner !== "" &&
      started &&
      gameData.players.length > 1
    ) {
      console.log("winner is ready");
      console.log(
        "Result Degree:",
        Math.ceil(720 * 1 + 720 * winner?.resultHeight + 90)
      );
      ballAnimation(Math.ceil(720 * 3 + 720 * winner?.resultHeight + 90));
    }
  }, [gameData, winner, started]);

  useEffect(() => {
    if (gameEnded === undefined) return;
    if (setClearGame) {
      setClearGame();
      setBallDeg(90);
    }
  }, [gameEnded]);

  const winPercent = useMemo(() => {
    if (
      gameData &&
      gameData &&
      gameData.players &&
      gameData.players?.length === 0
    ) {
      return 0;
    } else if (gameData) {
      const sumBets = gameData.players?.reduce(
        (sum: number, item: any) => sum + item.amount,
        0
      );
      if (wallet.publicKey !== null) {
        const userBet = gameData.players?.find(
          (item: any) => item.player === wallet.publicKey?.toBase58()
        );
        if (userBet) {
          return userBet.amount / sumBets;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
  }, [gameData?.players, wallet.publicKey, wallet.connected]);

  useEffect(() => {
    console.log("========================================colorcolor", colors);
  }, [colors]);

  return (
    <div className={props.className}>
      <h1 className="block xl:hidden text-center font-bold text-[50px] text-[#5c64fa] mb-5 ml-5">
        Infinite Rug
      </h1>
      <div className="grid w-full place-content-center">
        <div className="relative rounded-[10px] bg-[#31258f] mx-6 w-[300px] lg:w-[400px] h-[58px] -mb-[29px] z-20">
          <img
            className="absolute  left-[-24px] top-1"
            src="/img/select 3.png"
            alt=""
          />
          <img
            className="absolute  right-[-24px] top-1"
            src="/img/select 2.png"
            alt=""
          />
          <p className="text-[22px] text-white-100 font-bold leading-8 text-center py-[14px]">
            POT:&nbsp;{sumPots} SOL
          </p>
        </div>
      </div>
      <div className="border-2 border-[#FFFFFF73] py-[75px] px-[94px] rounded-[30px] bg-[#091C63]">
        <div className="grid place-content-center">
          <div className="h-[360px] relative w-[660px] -mx-20 md:mx-auto scale-50 md:scale-100 -my-20 md:my-0">
            {!started && (
              <div className="absolute top-0 left-0 z-50 flex justify-center w-full h-full">
                <div className="text-white text-[18px] font-bold text-center pt-[90px] uppercase">
                  waiting for users...
                </div>
                <CountdownBar
                  className="w-3/4"
                  isMute={props.isMute}
                  setIsBetSound={setIsBetSound}
                  setHiddenFlag={setHiddenFlag}
                />
              </div>
            )}
            {gameData && gameData.players.length !== 0 ? (
              <div
                className=""
                style={{
                  opacity: started ? 1 : 0.3,
                }}
              >
                <div
                  className="h-[360px] w-[360px] rounded-full absolute pie rotate-90 left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 -ml-[140px]"
                  style={{
                    backgroundImage: colorPieL,
                    zIndex: 10,
                  }}
                ></div>
                <div
                  className="h-[360px] w-[360px] rounded-full absolute pie rotate-90 left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 -ml-[140px]"
                  style={{
                    backgroundImage: middlePice,
                    zIndex: 12,
                    boxShadow: "0 0 0 2px #091c63",
                  }}
                ></div>
                <div
                  className="h-[360px] w-[360px] rounded-full absolute pie left-1/2 top-1/2 ml-[140px] pie-r"
                  style={{
                    backgroundImage: colorPieR,
                    zIndex: 10,
                  }}
                ></div>
                <div
                  className="h-[360px] w-[360px] rounded-full absolute pie left-1/2 top-1/2 ml-[140px] pie-r"
                  style={{
                    backgroundImage: middleTwoPice,
                    zIndex: 12,
                    boxShadow: "0 0 0 2px #091c63",
                    clipPath: "polygon(50% -5%, 100% 0, 100% 100%, 50% 100%)",
                  }}
                ></div>

                {/* Moving ball beginning*/}
                <div
                  className="moving-ball"
                  style={{
                    transform: `rotate(${ballDeg % 360}deg)`,
                    opacity: hiddenFlag % 2 === 0 ? 1 : 0,
                    zIndex:
                      ballDeg % 360 <= 90 || ballDeg % 360 > 270 ? 13 : 10,
                  }}
                ></div>
                <div
                  className="moving-ball ball-border"
                  style={{
                    transform: `rotate(${ballDeg % 360}deg)`,
                    opacity: hiddenFlag % 2 === 0 ? 1 : 0,
                    zIndex: 20,
                  }}
                ></div>
                <div
                  className="moving-ball ml-[280px] shadow-sm"
                  style={{
                    transform: `rotate(${360 - (ballDeg % 360)}deg)`,
                    opacity: hiddenFlag % 2 === 0 ? 0 : 1,
                    zIndex:
                      360 - (ballDeg % 360) < 270 && 360 - (ballDeg % 360) > 150
                        ? 13
                        : 10,
                  }}
                ></div>
                <div
                  className="moving-ball ml-[280px] shadow-sm ball-border"
                  style={{
                    transform: `rotate(${360 - (ballDeg % 360)}deg)`,
                    opacity: hiddenFlag % 2 === 0 ? 0 : 1,
                    zIndex: 20,
                  }}
                ></div>

                {/* Moving ball end */}
              </div>
            ) : (
              <div className="opacity-40">
                <div
                  className="absolute h-[360px] w-[360px] border-[80px] rounded-full -ml-[140px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[#3f4e85] left-circle opacity-100"
                  style={{ zIndex: 2 }}
                ></div>
                <div
                  className="absolute h-[360px] w-[360px] border-[80px] rounded-full ml-[140px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[#3f4e85] right-circle opacity-100"
                  style={{ zIndex: 2 }}
                ></div>
                <div
                  className="absolute h-[360px] w-[360px] border-[80px] rounded-full ml-[140px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 middle-pie opacity-100"
                  style={{ zIndex: 12 }}
                ></div>
                <div
                  className="absolute h-[360px] w-[360px] border-[80px] rounded-full -ml-[140px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 middle-pie !rotate-0 opacity-100"
                  style={{ zIndex: 12 }}
                ></div>

                {/* <div
                                    className="moving-ball"
                                    style={{
                                        transform: `rotate(${ballDeg % 360}deg)`,
                                        opacity: hiddenFlag % 2 === 0 ? 1 : 0,
                                        zIndex: (ballDeg % 360 <= 90 || ballDeg % 360 > 270) ? 13 : 10,
                                    }}
                                ></div>
                                <div
                                    className="moving-ball ball-border"
                                    style={{
                                        transform: `rotate(${ballDeg % 360}deg)`,
                                        opacity: hiddenFlag % 2 === 0 ? 1 : 0,
                                        zIndex: 20,
                                    }}
                                ></div> */}
                {/* <div
                                    className="moving-ball ml-[280px] shadow-sm"
                                    style={{
                                        transform: `rotate(${360 - ballDeg % 360}deg)`,
                                        // opacity: hiddenFlag % 2 === 0 ? 0 : 1,
                                        zIndex: (360 - ballDeg % 360 < 270 && 360 - ballDeg % 360 > 150) ? 13 : 10,
                                    }}
                                ></div>
                                <div
                                    className="moving-ball ml-[280px] shadow-sm ball-border"
                                    style={{
                                        transform: `rotate(${360 - ballDeg % 360}deg)`,
                                        // opacity: hiddenFlag % 2 === 0 ? 0 : 1,
                                        zIndex: 20,
                                    }}
                                ></div> */}
              </div>
            )}
          </div>
          {gameData && gameData?.players && gameData?.players.length !== 0 ? (
            <div className="mx-auto rounded-xl border-[1px] border-[#ffffff50] py-5 mt-[55px] text-[14px] text-[#6a71f8] font-bold text-center flex flex-wrap px-5 xl:gap-4 gap-2 w-[480px]">
              {gameData &&
                gameData.players?.map((item: any, key: number) => (
                  <div
                    className="flex items-center w-[calc(50%-20px)] justify-between"
                    key={key}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-5 h-5 rounded-md"
                        style={{
                          background: `${
                            userColors.filter(
                              (c) => c.address === item.player
                            )[0].color
                          }`,
                        }}
                      ></div>
                      <span
                        style={{
                          color: `${
                            userColors.filter(
                              (c) => c.address === item.player
                            )[0].color
                          }`,
                        }}
                        className="ml-2"
                      >
                        {item.player.slice(0, 3)}...{item.player.slice(-3)}
                      </span>
                    </div>
                    <span
                      className="flex items-center ml-3 whitespace-nowrap"
                      style={{
                        color: `${
                          userColors.filter((c) => c.address === item.player)[0]
                            .color
                        }`,
                      }}
                    >
                      {(item.amount / LAMPORTS_PER_SOL).toLocaleString()} SOL
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="mx-8 rounded-xl border-[1px] border-[#ffffff50] bg-[#04134A] py-5 mt-[25px] text-[14px] text-[#6a71f8] font-bold text-center">
              {`No one has placed a bet, be the first to start the game!`}
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto rounded-xl py-2 my-6 text-[24px] text-[#fff] font-bold text-center border-2 border-[#7882a9] w-[360px] -mt-[30px] bg-[#31258f]">
        WIN %: {winPercent && (winPercent * 100).toFixed(2)}
      </div>
      <Sound
        url="/sound/game-start.mp3"
        debug={false}
        playStatus={isBetSound ? "PLAYING" : "STOPPED"}
      />
      <Sound
        url="/sound/success.mp3"
        debug={false}
        playStatus={isWonSound ? "PLAYING" : "STOPPED"}
      />
      <Sound
        url="/sound/lose.mp3"
        debug={false}
        playStatus={isLoseSound ? "PLAYING" : "STOPPED"}
      />
    </div>
  );
}
