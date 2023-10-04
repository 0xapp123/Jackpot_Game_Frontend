import { useQuery } from "@tanstack/react-query";
import { SOL_PRICE_API, hexColors } from "../config";

// const colors = [
//   {
//     id: 1,
//     color: "#82C861",
//     value: 2
//   },
//   {
//     id: 2,
//     color: "#CDB767",
//     value: 15
//   },
//   {
//     id: 3,
//     color: "#A367D2",
//     value: 6
//   },
//   {
//     id: 4,
//     color: "#C05CAA",
//     value: 10
//   },
//   {
//     id: 5,
//     color: "#93C4FF",
//     value: 5
//   },
// ];
export const useSolanaPrice = () => {
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { isLoading, isError, data, error } = useQuery(["solanaPrice"], async () => {
            const response = await fetch(SOL_PRICE_API);
            const data = await response.json();
            return data.solana?.usd;
        });

        return { isLoading, isError, data, error };
    } catch (error) {
        console.log(error)
        return {};
    }
};


export const base58ToColor = (publicKey: string) => {
    let hex = '';
    for (let i = 0; i < publicKey.length; i++) {
        let code = publicKey.charCodeAt(i).toString(16);
        hex += code.padStart(2, '0');
    }
    return "#" + hex.slice(0, 6);
};

export const base58ToGradient = (publicKey: string) => {
    const intNumber = publicKey.slice(0, 3).split('').map(char => char.charCodeAt(0)).join('');
    return colors[parseInt(intNumber) % 18];
}

export const getUserColor = (address: string, repeat?: boolean) => {
    const intNumber = address.slice(0, 8).split('').map(char => char.charCodeAt(0)).join('');
    return hexColors[(parseInt(intNumber) + (repeat ? 1 : 0)) % 90].hex;
};

interface Pie {
    color: string,
    deg: number,
}

export const getPieData = (colors: { color: string, value: number }[]) => {
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

    const data = resDegs.filter((item: any) => item.first !== 360);
    return data
}

const colors = [
    {
        gradient: "linear-gradient(180deg, #B28EFF 0%, #7230FF 100%)",
        color: "#B28EFF",
        shadow: "inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25) "
    },
    {
        gradient: "linear-gradient(180deg, #FF7E7E 0%, #E14646 100%)",
        color: "#FF7E7E",
        shadow: "inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #7EB2FF 0%, #467BE1 100%)",
        color: "#7EB2FF",
        shadow: "inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #FFE37E 0%, #DEE146 100%)",
        color: "#FFE37E",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #A8FF7E 0%, #81E146 100%)",
        color: "#A8FF7E",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #7EFFE0 0%, #46D8E1 100%)",
        color: "#7EFFE0",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #7EA2FF 0%, #5C46E1 100%)",
        color: "#7EA2FF",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #C67EFF 0%, #C246E1 100%)",
        color: "#C67EFF",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #FF7EE3 0%, #E146A3 100%)",
        color: "#FF7EE3",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #E77070 0%, #E71515 100%)",
        color: "#E77070",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #6C98DB 0%, #255FCF 100%)",
        color: "#6C98DB",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #CDB767 0%, #BCBF29 100%)",
        color: "#CDB767",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #82C861 0%, #67CD29 100%)",
        color: "#82C861",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #67CEB5 0%, #25A4AC 100%)",
        color: "#67CEB5",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #5873BA 0%, #3821BF 100%)",
        color: "#5873BA",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #A367D2 0%, #AC2FCB 100%)",
        color: "#A367D2",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #C05CAA 0%, #C22684 100%)",
        color: "#C05CAA",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #93C4FF 0%, #4A8CDD 100%)",
        color: "#93C4FF",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
]