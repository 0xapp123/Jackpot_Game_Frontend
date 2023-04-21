/* eslint-disable @next/next/no-img-element */
import { Roundarrow, Tripledot } from "../components/Svglist";
import Playhistory from "../components/Playhistory";
import Sidebar from "../components/Sidebar";
import { API_URL, GRAVE_API_URL } from "../config";
import { useEffect, useState } from "react";
import { useSolanaPrice } from "../utils/util";
import { useSocket } from "../context/SocketContext";
import { useRouter } from "next/router";

export default function Home(props: { isMute: boolean; setIsMute: Function }) {
  const [recentWinnders, setRecentWinners] = useState([]);
  const [totalWins, setTotalWins] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { data } = useSolanaPrice();
  const router = useRouter();

  const { gameData } = useSocket();

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
      console.log(data);
      if (data) {
        setTotalCount(data as number);
      }
    } catch (error) {
      console.log(" --> getTotalCount:", error);
    }
  };

  useEffect(() => {
    getWinners();
    getSum();
    getTotalCount();
  }, [gameData]);

  return (
    <div className="flex min-h-[100vh] bg-bg bg-cover bg-no-repeat w-full">
      <Sidebar />
      <main className="xl:w-[calc(100%-280px)] w-full flex flex-col ml-[80px] lg:ml-[280px] overflow-x-hidden">
        <div className="mt-0 flex-col relative w-full pb-20">
          <div className="h-[280px] md:h-[480px] overflow-hidden">
            <img src="/img/home-banner.jpg" alt="" />
          </div>
          <div className="pl-4 pr-4">
            <p className="font-font-mono text-[26.7px] font-normal mt-[38px] text-white-100 leading-10">
              Statistics
            </p>
            <div className="flex flex-wrap mt-[18px] rounded-[8px] gap-[13px]">
              <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
                <div className="mt-6 ml-6 bg-[#444CE4] rounded-[8px] w-[46px] h-[46px] "></div>
                <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                  {typeof data === "number"
                    ? "$" + (totalWins * data * 1.04).toLocaleString()
                    : "---"}
                </p>
                <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                  Amount Wagered
                </p>
              </div>
              <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
                <div className="flex justify-center items-center mt-6 ml-6 bg-[#F257A0] rounded-[8px] w-[46px] h-[46px]"></div>
                <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                  {totalCount.toLocaleString()}
                </p>
                <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                  Bets placed All Time
                </p>
              </div>
              <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
                <div className="flex justify-center items-center mt-6 ml-6 bg-[#7A5AF8] rounded-[8px] w-[46px] h-[46px]"></div>
                <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                  {typeof data === "number"
                    ? "$" + (totalWins * data).toLocaleString()
                    : "---"}
                </p>
                <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
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
      </main>
    </div>
  );
}
