/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ChatIcon, InfiniteIcon, Leftarrow } from "../../components/Svglist";
import { useWallet } from "@solana/wallet-adapter-react";
import { enterGame, playGame } from "../../context/solana/transaction";
import Chat from "../../components/Chat/infinite";
import { useSocket } from "../../context/SocketContextInfinite";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import MobileChat from "../../components/Chat/MobileChatInfinite";
import Head from "next/head";
import Playhistory from "../../components/Playhistory";
import { INFINITE_API_URL, NEXT_COOLDOWN, SOL_PRICE_API } from "../../config";
import Terms from "../../components/Terms";
import { useQuery } from "@tanstack/react-query";
import { errorAlert, warningAlert } from "../../components/ToastGroup";
import InfiniteBox from "../../components/InfiniteBox";
import InfiniteBetBox from "../../components/InfiniteBetBox";

export default function Rooms(props: { isMute: boolean; setIsMute: Function }) {
  const wallet = useWallet();
  const { gameData, isStarting } = useSocket();
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

  useEffect(() => {
    console.log("isStarting:", isStarting);
  }, [isStarting]);

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
          // 0.001,
          betAmount,
          setIsBetLoading,
          gameData.endTimestamp,
          "infinite"
        );
      } else {
        await playGame(
          wallet,
          // 0.001,
          betAmount,
          setIsBetLoading,
          "infinite"
        );
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
      const response = await fetch(INFINITE_API_URL + "getWinners");
      const data = await response.json();
      setRecentWinners(data?.slice(0, 3));
    } catch (error) {
      console.log(" --> getWinners:", error);
    }
  };

  const getSum = async () => {
    try {
      const response = await fetch(INFINITE_API_URL + "getTotalSum");
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
      const response = await fetch(INFINITE_API_URL + "getTimes");
      const data = await response.json();
      if (data) {
        setTotalCount(data as number);
      }
    } catch (error) {}
  };

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
        <title>Infinite Rug</title>
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
        <div className="absolute top-0 left-0 w-full">
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
                <span className="hidden ml-2 md:block">Back Home</span>
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

        <div className="2xl:mr-[300px] mt-[70px] xl:mt-[70px] w-full 2xl:w-[calc(100%-300px)]">
          <div className="relative flex flex-col-reverse items-start w-full px-6 xl:flex-row">
            <InfiniteBetBox
              className="w-[380px] mb-10 mt-6 mx-auto xl:mx-0"
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              handleBetAmount={handleBetAmount}
              handleKeyDown={handleKeyDown}
              handleBet={handleBet}
              isBetLoading={isBetLoading}
            />
            <InfiniteBox
              className="w-[calc(100%-0px)] xl:w-[calc(100%-400px)] xl:ml-5 mt-5 xl:mt-0"
              isMute={props.isMute}
              setIsWonWindow={setIsWonWindow}
              setWonValue={setWonValue}
            />
          </div>
        </div>
        <Chat
          className="fixed w-[300px] hidden flex-col px-4 pt-4 border-[1px] border-[#FFFFFF3D] right-0 top-0 h-[100vh] 2xl:flex"
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
        <div className="pl-4 pr-4 w-full 2xl:w-[calc(100%-300px)] pb-20 mt-10">
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
                    game="Infinite Rug"
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
