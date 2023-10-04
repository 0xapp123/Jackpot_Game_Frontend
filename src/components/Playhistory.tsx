import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function Playhistory(props: { game: string, user: string, bet: string, payout: string, tx: string }) {
    return (
        <div className="flex flex-row items-center justify-between mb-1 border-[1px] border-[#FFFFFF1C] py-2 rounded-[8px] px-2">
            <p className="w-[200px] text-sm text-[#FFFFFFA8] leading-[26px] text-center">{props.game}</p>
            <p className="w-[250px] text-sm text-[#FFFFFFA8] leading-[26px]  text-center">{props.user}</p>
            <p className="w-[150px] text-sm text-[#FFFFFFA8] leading-[26px]  text-center">{props.bet}</p>
            <p className="w-[150px] text-sm text-[#5BDCC6] leading-[26px]  text-center">{props.payout}</p>
            <Link href={`https://solscan.io/tx/${props.tx}`} passHref>
                <a target="_blank" >
                    <div className="w-[150px] text-center py-[7px] border-[1px] px-2 border-[#FFFFFF1C] text-[13.35px] rounded-[8px] text-[#FFFFFFA8] font-mono">
                        VIEW SOLSCAN
                    </div>
                </a>
            </Link>
        </div>
    )
}