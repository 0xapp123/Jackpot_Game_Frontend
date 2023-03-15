/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { MobileMenuIcon } from "./Svglist";

export default function Sidebar() {
  const [mobilMenuState, setMobileMenuState] = useState<boolean>(true);
  return (
    <nav
      className={`${mobilMenuState ? "w-[80px]" : "w-[280px]"
        } lg:w-[280px] bg-gradient flex-col lg:flex fixed left-0 top-0 h-full z-50`}
      style={{ background: "linear-gradient(90deg, #05104C 0%, #09185A 100%)" }}
    >
      <div
        className={`flex lg:hidden w-full  ${mobilMenuState ? "justify-center" : "justify-end"
          } items-center cursor-pointer p-5`}
        onClick={() => setMobileMenuState(!mobilMenuState)}
      >
        <MobileMenuIcon color="white" />
      </div>
      <div
        className={`h-full overflow-y-auto scrollbar overflow-x-hidden ${mobilMenuState ? "space-y-4" : "lg:space-y-0"
          } `}
      >
        <div className={`px-6 lg:block ${mobilMenuState ? "hidden" : "block"}`}>
          <h1
            style={{ color: "transparent" }}
            className="text-[32px] bg-gra_font font-fontInter bg-clip-text pt-[32px]"
          >
            EXP & BET 3
          </h1>
          <div
            className={`w-full my-6 lg:block ${mobilMenuState ? "hidden" : "block"
              }`}
          >
            {/* <WalletMultiButton /> */}
          </div>
        </div>
        <p
          className={` font-normal text-[#ffffff] mt-6 border-[#ffffff30] pb-3 mx-6 lg:block ${mobilMenuState ? "hidden" : "block"
            }`}
        >
          Games
        </p>
        <h1
          style={{ color: "transparent" }}
          className={`text-[32px] bg-gra_font font-fontInter bg-clip-text text-center lg:hidden ${mobilMenuState ? "block" : "hidden"
            }`}
        >
          EXP
        </h1>
        <div className="border-[1px] border-gray-500 mx-4" />
        <Link href="/" passHref>
          <div className="flex hover:bg-tower hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
            <img
              src="/img/dice-of-royale.png"
              alt=""
              className="w-6 h-6 mr-4"
            />
            <p
              className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px] ${mobilMenuState ? "hidden" : "block"
                }`}
            >
              Dice of Royale
            </p>
          </div>
        </Link>
        <Link href="/play" passHref>
          <div className="flex hover:bg-tower hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
            <img
              src="/img/tower.png"
              alt=""
              className="w-6 h-6 mr-4 object-contain"
            />
            <p
              className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px] ${mobilMenuState ? "hidden" : "block"
                }`}
            >
              Tower Of Power
            </p>
          </div>
        </Link>
        <p
          className={`font-normal text-[#ffffff] mt-6 border-[#ffffff30] pb-3 mx-6 lg:block ${mobilMenuState ? "hidden" : "block"
            }`}
        >
          Support
        </p>
        <div className="border-[1px] border-gray-700 mx-4" />
        <Link href="https://twitter.com" passHref>
          <div className="flex hover:bg-tower hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
            <img
              src="/img/twitter1.png"
              alt=""
              className="w-6 h-6 mr-4 object-contain"
            />
            <p
              className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px]  ${mobilMenuState ? "hidden" : "block"
                }`}
            >
              Twitter
            </p>
          </div>
        </Link>
        <Link href="https://discord.com" passHref>
          <div className="flex hover:bg-tower hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
            <img
              src="/img/discord.png"
              alt=""
              className="w-6 h-6 mr-4 object-contain"
            />
            <p
              className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px]  ${mobilMenuState ? "hidden" : "block"
                }`}
            >
              Discord
            </p>
          </div>
        </Link>
        <p
          className={`font-normal text-[#ffffff] mt-6 border-[#ffffff30] pb-3 mx-6 lg:block ${mobilMenuState ? "hidden" : "block"
            }`}
        >
          Get Social
        </p>
        <div className="border-[1px] border-gray-700 mx-4" />
        <Link href="https://twitter.com" passHref>
          <div className="flex hover:bg-tower hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
            <img
              src="/img/twitter1.png"
              alt=""
              className="w-6 h-6 mr-4 object-contain"
            />
            <p
              className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px] ${mobilMenuState ? "hidden" : "block"
                }`}
            >
              Experiments
            </p>
          </div>
        </Link>
        <Link href="https://discord.com" passHref>
          <div className="flex hover:bg-tower hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
            <img
              src="/img/discord.png"
              alt=""
              className="w-6 h-6 mr-4 object-contain"
            />
            <p
              className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px] ${mobilMenuState ? "hidden" : "block"
                }`}
            >
              BET3
            </p>
          </div>
        </Link>
        <Link href="https://discord.com" passHref>
          <div className="flex hover:bg-tower hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
            <img
              src="/img/discord.png"
              alt=""
              className="w-6 h-6 mr-4 object-contain"
            />
            <p className="hidden lg:block cursor-pointer font-bold text-[#ffffff] py-[15px]">
              Youtobu
            </p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
