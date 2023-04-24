/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
  GRAVE_API_URL,
  NEXT_COOLDOWN,
  SOL_PRICE_API,
} from "../../config";
import Terms from "../../components/Terms";
import { useQuery } from "@tanstack/react-query";
import { errorAlert, warningAlert } from "../../components/ToastGroup";
import { useRouter } from "next/router";
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
        className={`flex flex-col xl:flex-row min-h-[100vh] bg-cover bg-no-repeat w-full overflow-x-hidden flex-wrap bg-bg`}
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
        <div className="px-6 mt-[80px] xl:mt-[40px] flex flex-col xl:flex-row w-full xl:w-[calc(100%-300px)] mr-[300px]">
          <div className="w-full md:w-[calc(100%-300px)] xl:w-[450px] mt-6">
            <p className="xl:text-[36px] text-3xl text-[#FFFFFF] text-center font-bold xl:my-8 my-5 ">
              The Tower
            </p>
            <div className="flex flex-col border-[1px] bg-[#30058c42] border-[#FFFFFF24] rounded-3xl px-6">
              <p className="xl:text-[26.6px] text-[18px] text-white-100 font-bold text-center xl:leading-[32px] xl:mt-5 mt-3">
                Place a Bet in SOL
              </p>
              <div className="flex flex-row mt-[33px]">
                <button
                  className={`w-1/3 text-center ${betAmount === 1 ? "oapcity-100" : "opacity-30"
                    }`}
                  onClick={() => setBetAmount(1)}
                >
                  <img
                    src="/img/solana.png"
                    alt=""
                    className="w-6 h-6 lg:w-9 lg:h-9 object-contain mx-auto"
                  />
                  <p className="xl:text-[26.6px] text-[18px] text-white-100 leading-8 font-semibold mt-[5px]">
                    1 SOL
                  </p>
                  <p className="text-[16px] text-[#FFFFFFA8] leading-[19px] font-semibold mt-[5px]">
                    {typeof data === "number"
                      ? "$" + (data * 1).toFixed(2) + "USD"
                      : "---"}
                  </p>
                </button>
                <button
                  className={`w-1/3 text-center ${betAmount === 2 ? "oapcity-100" : "opacity-30"
                    }`}
                  onClick={() => setBetAmount(2)}
                >
                  <img
                    src="/img/solana.png"
                    alt=""
                    className="w-6 h-6 lg:w-9 lg:h-9 object-contain mx-auto"
                  />
                  <p className="xl:text-[26.6px] text-[18px] text-white-100 leading-8 font-semibold mt-[5px]">
                    2 SOL
                  </p>
                  <p className="text-[16px] text-[#FFFFFFA8] leading-[19px] font-semibold mt-[5px]">
                    {typeof data === "number"
                      ? "$" + (data * 2).toFixed(2) + "USD"
                      : "---"}
                  </p>
                </button>
                <button
                  className={`w-1/3 text-center ${betAmount === 3 ? "oapcity-100" : "opacity-30"
                    }`}
                  onClick={() => setBetAmount(3)}
                >
                  <img
                    src="/img/solana.png"
                    alt=""
                    className="w-6 h-6 lg:w-9 lg:h-9 object-contain mx-auto"
                  />
                  <p className="xl:text-[26.6px] text-[18px] text-white-100 leading-8 font-semibold mt-[5px]">
                    3 SOL
                  </p>
                  <p className="text-[16px] text-[#FFFFFFA8] leading-[19px] font-semibold mt-[5px]">
                    {typeof data === "number"
                      ? "$" + (data * 3).toFixed(2) + "USD"
                      : "---"}
                  </p>
                </button>
              </div>
              <p className="text-white-60 text-[16px] leading-[19.32px] mt-7 whitespace-nowrap flex">
                Custom bet: (Min&nbsp;
                <span className="font-bold text-[#fff]">0.05 </span>&nbsp;SOL -
                Max&nbsp;
                <span>
                  <InfiniteIcon />
                </span>
                &nbsp;SOL)
              </p>
              <div className="flex flex-row mt-[13px] items-center gap-3">
                <input
                  type={"number"}
                  value={betAmount}
                  step={0.1}
                  onChange={(e) =>
                    handleBetAmount(e.target.value as unknown as number)
                  }
                  onKeyDown={handleKeyDown}
                  className="w-[calc(100%-118px)] h-12 border-[1px] bg-[#30058c42] pl-5 border-white-10 rounded-xl text-[16px] text-[#FFFFFF]"
                />
                <button
                  className="w-[48px] h-[48px] border-[1px] border-white-10 rounded-xl text-[16px] text-[#FFFFFF54]"
                  disabled={betAmount / 2 < 0.05}
                  onClick={() => setBetAmount(betAmount / 2)}
                >
                  1/2
                </button>
                <button
                  className="w-[48px] h-[48px] border-[1px] border-white-10 rounded-xl text-[16px] text-[#FFFFFF54]"
                  onClick={() => setBetAmount(betAmount * 2)}
                >
                  2x
                </button>
              </div>
              {(gameData?.players ?? []).length > 0 ? (
                <>
                  {wallet.publicKey ? (
                    <button
                      className="bg-[#7E49F0] xl:my-8 my-5 rounded-2xl text-[16px] xl:text-[20px] text-white-100 font-bold text-center xl:py-4 py-2"
                      onClick={handleBet}
                      disabled={isBetLoading}
                    >
                      {isBetLoading ? (
                        <>Waiting...</>
                      ) : (
                        <>Add {betAmount} SOL to bet</>
                      )}
                    </button>
                  ) : (
                    <div className="playground mx-auto">
                      <WalletMultiButton />
                    </div>
                  )}
                </>
              ) : isStarting !== 0 ? (
                <>
                  {wallet.publicKey ? (
                    <button
                      className="bg-[#7E49F0] xl:my-8 my-5 rounded-2xl text-[16px] xl:text-[20px] text-white-100 font-bold text-center xl:py-4 py-2"
                      onClick={handleBet}
                      disabled={isBetLoading}
                    >
                      {isBetLoading ? (
                        <>Waiting...</>
                      ) : (
                        <>Add {betAmount} SOL to bet</>
                      )}
                    </button>
                  ) : (
                    <div className="playground mx-auto">
                      <WalletMultiButton />
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="bg-[#7E49F0] xl:my-8 my-5 rounded-2xl text-[16px] xl:text-[20px] text-white-100 font-bold text-center xl:py-4 py-2"
                  disabled
                >
                  Waiting...
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-[calc(100%-300px)] xl:w-[calc(100%-450px)]">
            <Tower
              setIsWonWindow={setIsWonWindow}
              setWonValue={setWonValue}
              isMute={props.isMute}
            />
          </div>
        </div>
        <Chat
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
        />
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
