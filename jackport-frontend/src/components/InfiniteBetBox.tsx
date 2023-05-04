/* eslint-disable @next/next/no-img-element */
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useQuery } from "@tanstack/react-query";
import { SOL_PRICE_API } from "../config";
import { InfiniteIcon } from "./Svglist";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSocket } from "../context/SocketContextInfinite";

export default function InfiniteBetBox(props: {
    betAmount: number,
    setBetAmount: Function,
    handleBetAmount: Function,
    handleKeyDown: any,
    handleBet: any,
    isBetLoading: boolean,
    className: string,
}) {
    const { betAmount, handleBetAmount, setBetAmount, handleKeyDown, handleBet, isBetLoading } = props;
    const wallet = useWallet();
    const { gameData, isStarting } = useSocket();
    const { data } = useQuery(["solanaPrice"], async () => {
        const response = await fetch(SOL_PRICE_API);
        const data = await response.json();
        return data.solana?.usd;
    });
    return (
        <div className={props.className}>
            <div className="border-[1px] bg-[#091C63] border-[#FFFFFF24] rounded-3xl px-4 ">
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
                            className="object-contain w-6 h-6 mx-auto lg:w-9 lg:h-9"
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
                            className="object-contain w-6 h-6 mx-auto lg:w-9 lg:h-9"
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
                            className="object-contain w-6 h-6 mx-auto lg:w-9 lg:h-9"
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
                        className="w-[calc(100%-118px)] h-12 border-[1px] bg-[#091C63] pl-5 border-white-10 rounded-xl text-[16px] text-[#FFFFFF]"
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
                                className="bg-[#7E49F0] xl:my-5 my-3 rounded-2xl text-[16px] xl:text-[20px] text-white-100 font-bold text-center xl:py-4 py-2 w-full"
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
                            <div className="mx-auto playground">
                                <WalletMultiButton className="!w-full" />
                            </div>
                        )}
                    </>
                ) : isStarting !== 0 ? (
                    <>
                        {wallet.publicKey ? (
                            <button
                                className="bg-[#7E49F0] xl:my-8 my-5 rounded-2xl text-[16px] xl:text-[20px] text-white-100 font-bold text-center xl:py-4 py-2  w-full"
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
                            <div className="mx-auto playground">
                                <WalletMultiButton />
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        className="bg-[#7E49F0] xl:my-8 my-5 rounded-2xl text-[16px] xl:text-[20px] text-white-100 font-bold text-center xl:py-4 py-2 w-full"
                        disabled
                    >
                        Waiting...
                    </button>
                )}
            </div>
            <h1 className="hidden xl:block text-center font-bold text-[50px] text-[#5c64fa] mt-5 ml-5">Infinite Rug</h1>
        </div>
    )
}