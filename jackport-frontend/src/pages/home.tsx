/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  Leftslide,
  Rightarrow,
  Rightslide,
  Roundarrow,
  Slidecenter,
  Slidewing,
  Tripledot,
} from "../components/Svglist";
import Playhistory from "../components/Playhistory";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import MobileChat from "../components/Chat/MobileChat";

export default function Home() {
  const [isMobileChat, setIsMobileChat] = useState(false);
  return (
    <div className="flex min-h-[100vh] bg-bg bg-cover bg-no-repeat w-full">
      <Sidebar />
      <main className="xl:w-[calc(100%-280px)] w-full flex flex-col md:ml-[70px] lg:ml-[280px] md:p-6 pl-24 pr-4">
        {/* <div className="w-full h-[427px] flex flex-col bg-dicer  bg-no-repeat bg-cover relative items-center justify-center">
          <p className="uppercase text-[15px] md:text-[20px] leading-6 text-white-60 pt-[46px]">
            game of the month
          </p>
          <p className="uppercase text-[30px] md:text-[44px] leading-[54px] text-white-100 pt-[13px] font-bold">
            dice royale
          </p>
          <p className="uppercase text-[20px] md:text-[24px] leading-[29px] text-white-100 pt-[32px] font-bold">
            earn up to $20,000
          </p>

          <button className=" font-font-mono flex border-[1px] border-[#FFFFFF38] justify-center items-center rounded-[6px] w-[171px] h-[44px] box-border mt-[22px] bg-[#D9D9D938] text-[#DDDEE2] text-[14px] font-bold leading-5">
            Get Started&nbsp;&nbsp;
            <Rightarrow />
          </button>
          <button className="absolute w-[42px] h-[42px] bg-[#051350] rounded-[6.67px] border-[1.33px] border-[#FFFFFF0F] flex justify-center items-center top-6 right-[104px]">
            <Leftslide />
          </button>
          <button className="absolute w-[42px] h-[42px] bg-[#051350] rounded-[6.67px] border-[1.33px] border-[#FFFFFF0F] flex justify-center items-center top-6 right-[42px]">
            <Rightslide />
          </button>
          <div className="flex self-center mt-2 gap-[2px] cursor-pointer">
            <Slidewing />
            <Slidecenter />
            <Slidewing />
          </div>
        </div> */}

        <div className="mt-0 flex-col relative w-full">
          {/* <div className=" mb-[14px] flex justify-between">
            <p className="font-font-mono text-[26.7px] font-normal text-white-100 leading-10">
              Browse Games
            </p>
            <div className="flex gap-5">
              <button className="w-[42px] h-[42px] bg-[#04134A] rounded-[6.67px] border-[1.33px] border-[#FFFFFF0F] flex justify-center items-center top-6 right-[104px]">
                <Leftslide />
              </button>
              <button className="w-[42px] h-[42px] bg-[#04134A] rounded-[6.67px] border-[1.33px] border-[#FFFFFF0F] flex justify-center items-center top-6 right-[42px]">
                <Rightslide />
              </button>
            </div>
          </div> */}
          {/* <div className="overflow-x-auto w-full">
            <div className="flex gap-8 flex-wrap w-full overflow-x-auto">
              <div className="w-[200px] h-[200px]  rounded-2xl border-[1.33px] border-[#FFFFFF57]">
                <div className="h-[120px] w-full mt-3">
                  <img
                    className="w-full h-full object-contain"
                    src="/img/900-9009693_3d-dice 1.png"
                    alt=""
                  />
                </div>
                <p className="text-white-100 font-bold text-center mt-4">
                  Dice Royale
                </p>
              </div>
            </div>
          </div> */}
          <p className="font-font-mono text-[26.7px] font-normal mt-[38px] text-white-100 leading-10">
            Statistics
          </p>
          <div className="flex flex-wrap mt-[18px] rounded-[8px] gap-[13px]">
            <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
              <button className="flex justify-center items-center mt-6 ml-6 bg-[#444CE4] rounded-[8px] w-[46px] h-[46px]">
                <img
                  className="w-[26px]"
                  src="/img/icons8-dice-64 2.png"
                  alt=""
                />
              </button>
              <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                ${(4300).toLocaleString()}
              </p>
              <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                Amount Wagered
              </p>
              <button className="absolute top-5 right-2">
                <Tripledot />
              </button>
            </div>
            <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
              <button className="flex justify-center items-center mt-6 ml-6 bg-[#F257A0] rounded-[8px] w-[46px] h-[46px]">
                <img
                  className="w-[26px]"
                  src="/img/icons8-dice-64 2.png"
                  alt=""
                />
              </button>
              <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                {(123532).toLocaleString()}
              </p>
              <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                Amount Wagered
              </p>
              <button className="absolute top-5 right-2">
                <Tripledot />
              </button>
            </div>
            <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
              <button className="flex justify-center items-center mt-6 ml-6 bg-[#7A5AF8] rounded-[8px] w-[46px] h-[46px]">
                <img
                  className="w-[26px]"
                  src="/img/icons8-dice-64 2.png"
                  alt=""
                />
              </button>
              <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                ${(12354).toLocaleString()}
              </p>
              <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                Amount Wagered
              </p>
              <button className="absolute top-5 right-2">
                <Roundarrow />
              </button>
            </div>
          </div>
          <p className="font-font-mono text-[26.7px] font-normal mt-[29.36px] text-white-100 leading-10">
            Recent Plays
          </p>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="flex flex-row mt-[19px] mb-2">
                <p className="w-1/4 text-sm text-[#FFFFFFA8] pl-10">Game</p>
                <p className="w-[calc(29%)] text-sm text-[#FFFFFFA8]">
                  Username
                </p>
                <p className="w-[calc(13%)] text-sm text-[#FFFFFFA8]">Bet</p>
                <p className="w-[calc(15%)] text-sm text-[#FFFFFFA8]">Payout</p>
                <p className="text-sm text-[#FFFFFFA8]">TX</p>
              </div>

              <Playhistory
                game="DiceRoyale"
                user="HostyTheDev@0332"
                bet=".5 SOL"
                payout="4.5 SOL"
              />
              <Playhistory
                game="DiceRoyale"
                user="HostyTheDev@0332"
                bet=".5 SOL"
                payout="4.5 SOL"
              />
              <Playhistory
                game="DiceRoyale"
                user="HostyTheDev@0332"
                bet=".5 SOL"
                payout="4.5 SOL"
              />
            </div>
          </div>
        </div>
      </main>
      {/* <Chat className="fixed w-[300px] hidden flex-col px-4 pt-4 border-[1px] border-[#FFFFFF3D] right-0 top-0 h-[100vh] xl:flex" />
      <MobileChat opened={isMobileChat} setOpen={setIsMobileChat} /> */}
    </div>
  );
}
