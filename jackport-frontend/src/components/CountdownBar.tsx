/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { FIRST_COOLDOWN } from "../config";

export default function CountdownBar(props: {
  isMute: boolean;
  className?: string;
  setIsBetSound: Function;
}) {
  const { className, isMute, setIsBetSound } = props;
  const { gameData, setStarted } = useSocket();
  const [timeRemaining, setTimeRemaining] = useState<any>(
    calculateTimeRemaining()
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeComp = calculateTimeRemaining();
      setTimeRemaining(timeComp)
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameData]);

  useEffect(() => {
    let timeoutId: NodeJS.Timer;
    if (gameData) {
      if (gameData?.endTimestamp !== 0) {
        console.log(
          "countdown: ",
          Math.floor((gameData?.endTimestamp - new Date().getTime()) / 1000)
        );
      }
      if (
        Math.floor((gameData?.endTimestamp - new Date().getTime()) / 1000) === 0
      ) {
        if (setStarted) {
          setStarted(true);
          if (!isMute) {
            setIsBetSound(true);
            setTimeout(() => {
              setIsBetSound(false);
            }, 1500);
          } else {
            setIsBetSound(false);
          }
        }
      }
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeRemaining]);

  useEffect(() => {
    if (gameData && setStarted && gameData.players) {
      if (!gameData.players.length || gameData.players.length < 2) {
        setStarted(false);
      }
    }
  }, [gameData]);

  function calculateTimeRemaining() {
    if (
      gameData
    ) {
      const leftTime = gameData?.endTimestamp - new Date().getTime() < 0 ? 0 : gameData?.endTimestamp - new Date().getTime()
      if (gameData?.endTimestamp !== 0) console.log("leftTime: ", new Date(gameData?.endTimestamp), new Date());
      return (
        <div
          className="absolute bg-[#4c49cc] h-2 rounded-3xl"
          style={{
            width: `${(leftTime / FIRST_COOLDOWN) * 100}%`,
          }}
        ></div>
      );
    } else {
      return (
        <div className="absolute bg-[#4c49cc] h-2 rounded-3xl"></div>
      )
    }
  }

  return (
    <div
      className={`${className ? className : ""
        } w-[calc(100%-60px)] mx-[30px] mt-[150px] absolute text-center`}
    >
      <p className="text-white font-semibold ">Countdown</p>
      <div className="absolute w-full bg-[#050d36] h-2 rounded-3xl mt-4">
        {timeRemaining}
        {/* {gameData && (gameData.endTimestamp <= 0 || gameData.endTimestamp < new Date().getTime()) &&
                    <div className="absolute bg-blue-600 h-2 rounded-3xl"></div>
                } */}
      </div>
      {/* <Sound
        url="/sound/bet.mp3"
        debug={false}
        playStatus={isBetSound ? "PLAYING" : "STOPPED"}
      /> */}
    </div>
  );
}
