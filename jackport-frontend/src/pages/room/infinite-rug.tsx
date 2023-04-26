/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatIcon, InfiniteIcon, Leftarrow } from "../../components/Svglist";
import { useWallet } from "@solana/wallet-adapter-react";
import { enterGame, playGame } from "../../context/solana/transaction";
import Chat from "../../components/Chat";
import Tower from "../../components/Tower";
import { useSocket } from "../../context/SocketContext";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import MobileChat from "../../components/Chat/MobileChat";
import Head from "next/head";
import Playhistory from "../../components/Playhistory";
import {
  API_URL,
  NEXT_COOLDOWN,
  SOL_PRICE_API,
} from "../../config";
import Terms from "../../components/Terms";
import { useQuery } from "@tanstack/react-query";
import { errorAlert, warningAlert } from "../../components/ToastGroup";
import { useRouter } from "next/router";

const colors = [
  {
    id: 1,
    color: "#82C861",
    value: 2
  },
  {
    id: 2,
    color: "#CDB767",
    value: 15
  },
  {
    id: 3,
    color: "#A367D2",
    value: 6
  },
  {
    id: 4,
    color: "#C05CAA",
    value: 10
  },
  {
    id: 5,
    color: "#93C4FF",
    value: 5
  },
];

interface Pie {
  color: string,
  deg: number,
}

export default function Rooms(props: { isMute: boolean; setIsMute: Function }) {
  const router = useRouter();
  const wallet = useWallet();
  const { gameData, winner, isStarting, setStarted } = useSocket();
  const [betAmount, setBetAmount] = useState(0.05);
  const [isBetLoading, setIsBetLoading] = useState(false);

  const [isWonWindow, setIsWonWindow] = useState(false);
  const [wonValue, setWonValue] = useState(0);
  const [isMobileChat, setIsMobileChat] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [force, setForce] = useState(false);

  const [recentWinnders, setRecentWinners] = useState([]);
  const [totalWins, setTotalWins] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const { data } = useQuery(["solanaPrice"], async () => {
    const response = await fetch(SOL_PRICE_API);
    const data = await response.json();
    return data.solana?.usd;
  });

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      // console.log("heartbeat");
      setForce(!force);
    }, 1000);
    // Clear interval if the component unmounts or when dependencies change.
    return () => clearInterval(intervalId);
  }, []);

  const handleBet = async () => {
    if (betAmount < 0.05) {
      errorAlert("Please enter the correct amount!");
      return;
    }
    try {
      if (gameData && (gameData?.players ?? []).length !== 0) {
        if (
          gameData.endTimestamp !== 0 &&
          gameData.endTimestamp - Date.now() < NEXT_COOLDOWN
        ) {
          warningAlert(
            "This transaction may fail. Please try on the next round."
          );
          return;
        }

        await enterGame(
          wallet,
          new PublicKey(gameData.pda),
          betAmount,
          setIsBetLoading,
          gameData.endTimestamp,
          "tower"
        );
      } else {
        await playGame(wallet, betAmount, setIsBetLoading, "tower");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBetAmount = (value: number) => {
    if (value < 0) return;
    setBetAmount(value);
  };

  const handleEndGame = () => {
    setIsWonWindow(false);
  };

  const getWinners = async () => {
    try {
      const response = await fetch(API_URL + "getWinners");
      const data = await response.json();
      setRecentWinners(data?.slice(0, 3));
    } catch (error) {
      console.log(" --> getWinners:", error);
    }
  };

  const getSum = async () => {
    try {
      const response = await fetch(API_URL + "getTotalSum");
      const data = await response.json();
      if (data) {
        setTotalWins(data as number);
      }
    } catch (error) {
      console.log(" --> getSum:", error);
    }
  };

  const getTotalCount = async () => {
    try {
      const response = await fetch(API_URL + "getTimes");
      const data = await response.json();
      if (data) {
        setTotalCount(data as number);
      }
    } catch (error) { }
  };

  // const getTimes = useQuery(["getTimes"], async () => {
  //   fetch(API_URL + "getTimes").then((res) =>
  //     res.json()
  //   )
  // });

  // useEffect(() => {
  //   console.log("getTimes", getTimes)
  // },[gameData])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBet();
    }
  };

  useEffect(() => {
    getWinners();
    getSum();
    getTotalCount();
  }, [gameData]);

  const [ballDeg, setBallDeg] = useState(90);
  const [hiddenFlag, setHiddenFlag] = useState(0);

  const ballAnimation = (target: number) => {
    let currentDeg = 0;
    const animate = () => {
      setBallDeg((prevState: number) => {
        currentDeg = prevState;
        let temp = 10;
        const range = target - currentDeg;
        if (range <= 300 && range > 200) {
          temp = 5
        } else if (range <= 200 && range > 160) {
          temp = 4
        } else if (range <= 160 && range > 80) {
          temp = 3
        } else if (range <= 80 && range > 30) {
          temp = 2
        } else if (range <= 30) {
          temp = 1
        }
        return prevState + temp;
      });
      if (currentDeg < target) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  useEffect(() => {
    let t = hiddenFlag;
    if (ballDeg % 360 >= 86 && ballDeg % 360 <= 90) {
      t++;
      setHiddenFlag(t);
    }
  }, [ballDeg]);

  useEffect(() => {
    ballAnimation(2445);
  }, []);

  const colorPieL = useMemo(() => {
    const potValue = colors.reduce((acc, curr) => acc + curr.value, 0);
    let pies: Pie[] = [];

    for (let i = 0; i < colors.length; i++) {
      pies.push(
        {
          color: colors[i].color,
          deg: colors[i].value / potValue * 720,
        }
      )
    }

    const resDegs = pies.reduce((acc: any, curr, i) => {
      const lastValue = (acc[i - 1] && acc[i - 1].second) || 0;
      return [
        ...acc,
        {
          color: curr.color,
          first: lastValue,
          second: lastValue + curr.deg < 360 ? lastValue + curr.deg : 360
        }
      ]
    }, []);

    const firstPies = `
      conic-gradient(
        ${resDegs.map((item: any) => `${item.color} ${item.first}deg ${item.second}deg`).join(', ')}
      )
    `
    return firstPies;
  }, [colors]);

  const colorPieR = useMemo(() => {
    const potValue = colors.reduce((acc, curr) => acc + curr.value, 0);
    let pies: Pie[] = [];

    for (let i = 0; i < colors.length; i++) {
      pies.push(
        {
          color: colors[i].color,
          deg: colors[i].value / potValue * 720,
        }
      )
    }

    const resDegs = pies.reduce((acc: any, curr, i) => {
      const lastValue = (acc[i - 1] && acc[i - 1].second) || 0;
      return [
        ...acc,
        {
          color: curr.color,
          first: lastValue,
          second: lastValue + curr.deg < 360 ? lastValue + curr.deg : 360
        }
      ]
    }, []);

    const firstPies = `
      conic-gradient(
        ${resDegs.map((item: any) => `${item.color} ${item.first}deg ${item.second}deg`).join(', ')}
      )
    `
    return firstPies;
  }, [colors])

  return (
    <>
      <Head>
        <title>Tower</title>
        <meta
          name="description"
          content="SlowRUG | Best Crypto PvP Gambling Website"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`flex flex-col xl:flex-row min-h-[100vh] bg-cover bg-no-repeat w-full overflow-x-hidden flex-wrap bg-infinite`}
      >
        <div className="absolute w-full left-0 top-0">
          <button
            className="absolute right-6 top-6 z-10 rounded-md border border-[#ffffff80] w-9 h-9 grid place-content-center md:hidden"
            onClick={() => setIsMobileChat(true)}
          >
            <ChatIcon />
          </button>
          <button className="flex items-center justify-center mt-[34px] rounded-[10px] border-[1px] border-[#FFFFFF54] py-2 pr-4 absolute left-3 -top-2.5 xl:left-6 -xl:top-2">
            <Link href={"/"}>
              <a className="text-sm text-[#FFFFFF] ml-2 uppercase font-semibold flex items-center">
                <Leftarrow className="w-3 h-3" />
                <span className="ml-2 hidden md:block">Back Home</span>
              </a>
            </Link>
          </button>

          <div className="mt-4 w-[280px] mx-auto hidden fixed right-0 top-0 z-20 xl:grid place-content-center">
            <div className="flex justify-end">
              <WalletMultiButton />
            </div>
          </div>
          <div className="w-[180px] mx-auto block md:hidden absolute mt-3 right-[70px] top-1.5">
            <div className="flex justify-end">
              <WalletMultiButton />
            </div>
          </div>
        </div>
        <div className="px-6 mt-[80px] xl:mt-[40px] w-full xl:w-[calc(100%-300px)] mr-[300px]">
          <div className="grid place-content-center w-full">
            <div className="relative rounded-[10px] bg-[#7e49f051] my-[26px] mx-6 w-[400px] h-[58px]">
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
                POT:&nbsp;{20} SOL
              </p>
            </div>
          </div>
          <div className="border-2 border-[#FFFFFF73] py-[75px] px-[94px] rounded-[30px] bg-[#091C63]">
            {/* <div className="infinity">
            </div> */}
            {/* <div className="container">
              <div className="top-left"></div>
              <div className="top-right"></div>
              <div className="bottom-left"></div>
              <div className="bottom-right"></div>
            </div> */}
            <div className="grid place-content-center">
              <div className="h-[360px] relative w-[660px] mx-auto">
                {/* <div className="absolute h-[360px] w-[360px] border-[60px] rounded-full -ml-[150px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[#3f4e85] left-circle"
                  style={{ zIndex: 2 }}></div>
                <div className="absolute h-[360px] w-[360px] border-[60px] rounded-full ml-[150px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[#3f4e85] right-circle"
                  style={{ zIndex: 2 }}>
                </div>
                <div className="absolute h-[360px] w-[360px] border-[60px] rounded-full ml-[150px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 middle-pie"
                  style={{ zIndex: 12 }}></div>
                <div className="absolute h-[360px] w-[360px] border-[60px] rounded-full -ml-[150px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 middle-pie !rotate-0"
                  style={{ zIndex: 12 }}></div> */}

                {/* ----------------- */}
                <div className="h-[360px] w-[360px] rounded-full absolute pie rotate-90 left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 -ml-[150px]"
                  style={{
                    backgroundImage: colorPieL,
                    zIndex: 10
                  }}>
                </div>
                <div className="h-[360px]  w-[360px] rounded-full absolute pie left-1/2 top-1/2 ml-[150px] rotate-x-180 pie-r"
                  style={{
                    backgroundImage: colorPieR,
                    zIndex: 10
                  }}>
                </div>
                {/* ----------------- */}
                <div
                  className="moving-ball"
                  style={{
                    transform: `rotate(${ballDeg % 360}deg)`,
                    opacity: hiddenFlag % 2 === 1 ? 1 : 0,
                    zIndex: (ballDeg % 360 <= 90 || ballDeg % 360 > 270) ? 13 : 10,
                  }}
                ></div>
                {/* } */}
                {/* {hiddenFlag % 2 === 0 && */}
                <div
                  className="moving-ball ml-[300px] shadow-sm"
                  style={{
                    transform: `rotate(${360 - ballDeg % 360}deg)`,
                    opacity: hiddenFlag % 2 === 1 ? 0 : 1,
                    zIndex: (360 - ballDeg % 360 < 270 && 360 - ballDeg % 360 > 150) ? 13 : 10,
                  }}
                ></div>
                {/* } */}
              </div>
            </div>
          </div>
        </div>
        {/* <Chat
          className="fixed w-[300px] hidden flex-col px-4 pt-4 border-[1px] border-[#FFFFFF3D] right-0 top-0 h-[100vh] md:flex"
          isOpen={isOpen}
          isMute={props.isMute}
          handleCloseModal={handleCloseModal}
          handleOpenModal={handleOpenModal}
        />
        <MobileChat
          opened={isMobileChat}
          setOpen={setIsMobileChat}
          isMute={props.isMute}
          isOpen={isOpen}
          handleCloseModal={handleCloseModal}
          handleOpenModal={handleOpenModal}
        /> */}
        <div className="pl-4 pr-4 w-full md:w-[calc(100%-300px)] pb-20">
          <p className="font-font-mono text-[26.7px] font-normal mt-[0] text-white-100 leading-10">
            Statistics
          </p>
          <div className="flex flex-wrap mt-[18px] rounded-[8px] gap-[13px]">
            <div className=" relative flex flex-col pb-5 w-[calc((100%-40px)/3)] rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
              <div className="mt-6 ml-6 bg-[#444CE4] rounded-[8px] w-[46px] h-[46px]  md:block hidden"></div>
              <p className="text-[24px] md:text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                {typeof data === "number"
                  ? "$" + (totalWins * data * 1.04).toLocaleString()
                  : "---"}
              </p>
              <p className="text-sm md:text-md text-white-100 font-normal leading-[20px] md:leading-[26px] mt-1.5 md:mt-2.5 ml-6">
                Amount Wagered
              </p>
            </div>
            <div className=" relative flex flex-col pb-5 w-[calc((100%-40px)/3)] rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
              <div className="mt-6 ml-6 bg-[#F257A0] rounded-[8px] w-[46px] h-[46px] md:block hidden"></div>
              <p className="text-[24px] md:text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                {totalCount.toLocaleString()}
              </p>
              <p className="text-sm md:text-md text-white-100 font-normal leading-[20px] md:leading-[26px] mt-1.5 md:mt-2.5 ml-6">
                Bets placed All Time
              </p>
            </div>
            <div className=" relative flex flex-col pb-5 w-[calc((100%-40px)/3)] rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
              <div className="mt-6 ml-6 bg-[#7A5AF8] rounded-[8px] w-[46px] h-[46px] md:block hidden"></div>
              <p className="text-[24px] md:text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                {typeof data === "number"
                  ? "$" + (totalWins * data).toLocaleString()
                  : "---"}
              </p>
              <p className="text-sm md:text-md text-white-100 font-normal leading-[20px] md:leading-[26px] mt-1.5 md:mt-2.5 ml-6">
                Total Wins
              </p>
            </div>
          </div>
          <p className="font-font-mono text-[26.7px] font-normal mt-[29.36px] text-white-100 leading-10">
            Recent Player
          </p>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="flex flex-row mt-[19px] mb-2 justify-between">
                <p className="w-[200px] text-sm text-[#FFFFFFA8] text-center">
                  Game
                </p>
                <p className="w-[250px] text-sm text-[#FFFFFFA8] text-center">
                  Wallet
                </p>
                <p className="w-[150px] text-sm text-[#FFFFFFA8] text-center">
                  Bet
                </p>
                <p className="w-[150px] text-sm text-[#FFFFFFA8] text-center">
                  Payout
                </p>
                <p className="w-[150px] text-sm text-[#FFFFFFA8] text-center">
                  TX
                </p>
              </div>
              {recentWinnders &&
                recentWinnders.length !== 0 &&
                recentWinnders.map((item: any, key) => (
                  <Playhistory
                    key={key}
                    game="The Tower"
                    user={item.user.slice(0, 4) + "..." + item.user.slice(-4)}
                    bet={`${item.bet_amount} SOL`}
                    payout={`${item.payout} SOL`}
                    tx={item.tx}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      {isWonWindow && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#16127aa8] backdrop-blur-lg flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-[#fff] text-[32px] font-bold">You Won!</h1>
            <p className="text-[#fff] text-[24px]">
              {wonValue.toLocaleString()} SOL
            </p>
            <button
              className="border rounded-md px-5 py-1 text-[#fff] mt-2 text-sm"
              onClick={() => handleEndGame()}
            >
              Back
            </button>
          </div>
        </div>
      )}
      {isOpen && <Terms isOpen={isOpen} handleCloseModal={handleCloseModal} />}
    </>
  );
}
