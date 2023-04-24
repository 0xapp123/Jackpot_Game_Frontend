/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { GRAVE_API_URL } from "../../config";
import { useSocket } from "../../context/SocketContextGrave";
import ChatItem from "./ChatItem";
import Sound from "react-sound";
import { errorAlert } from "../ToastGroup";

export default function Chat(props: {
  className: string;
  isOpen: boolean;
  isMute: boolean;
  handleCloseModal: Function;
  handleOpenModal: Function;
}) {
  const wallet = useWallet();
  const { messages, onlined } = useSocket();
  const [message, setMessage] = useState("");
  const [isSound, setIsSound] = useState(false);

  const handleMessage = (value: string) => {
    setMessage(value);
  };

  useEffect(() => {
    if (messages && messages.length) {
      if (!props.isMute) {
        setIsSound(true);
        setTimeout(() => {
          setIsSound(false);
        }, 1000);
      } else {
        setIsSound(false);
      }
    }
  }, [messages, props.isMute]);

  const handleKeyDown = (event: { keyCode: number }) => {
    if (event.keyCode === 13) {
      console.log("message =>", message);
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    if (wallet.publicKey === null) {
      errorAlert("Please connect wallet.");
    }
    if (wallet.publicKey === null || message === "") return;
    try {
      await axios.post(`${GRAVE_API_URL}writeMessage/`, {
        user: wallet.publicKey.toBase58(),
        msg: message,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={props.className}>
      <div className="flex flex-row justify-between items-center">
        {/* <p className="text-[18px] text-[#FFFFFFA8] font-normal uppercase">Welcome!</p> */}
      </div>
      <p className="text-[12px] text-[#ffffff] font-normal pb-3 pt-9 mt-3 leading-[29px] border-b-[1.33px] border-[#FFFFFF0F]">
        {onlined} Players Online
      </p>
      <div className="h-[calc(100vh-270px)] overflow-auto scrollbar mt-2 flex flex-col-reverse">
        {messages &&
          messages.length !== 0 &&
          messages.map((item, key) => (
            <ChatItem
              name={item.user_name}
              time={item.timestamp}
              message={item.message}
              key={key}
            />
          ))}
      </div>
      <div className="absolute -bottom-0.5 right-0 w-full px-4 border-t-[1px] bg-[#000f13] border-[#FFFFFF3D]">
        <div className="border-t-[1.33px] border-[#FFFFFF0F]"></div>
        <input
          type="text"
          className="w-full mt-5 bg-[#000f13] text-[14px] text-white-100 border-[1.33px] border-[#FFFFFF21] rounded-[8px] py-3 px-3"
          value={message}
          onChange={(e: any) => handleMessage(e.target.value)}
          disabled={wallet.publicKey === null}
          onKeyDown={handleKeyDown}
          placeholder="Say something in chat..."
        />
        <div className="flex flex-row my-4 items-center justify-between">
          <button
            className="flex items-center uppercase text-[12px] text-white leading-3 ml-1"
            onClick={() => props.handleOpenModal()}
          >
            terms of service
          </button>
          <button
            className="bg-[#000f13] rounded-[8px] border-[1px] border-[#FFFFFF42] h-8 items-center text-center text-[12px] text-white-100 px-3 font-bold"
            onClick={() => handleSubmit()}
            disabled={wallet.publicKey === null}
          >
            SEND
          </button>
        </div>
      </div>

      <Sound
        url="/sound/bet.mp3"
        playStatus={isSound ? "PLAYING" : "STOPPED"}
      />
    </div>
  );
}
