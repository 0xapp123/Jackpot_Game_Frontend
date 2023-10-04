/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContextInfinite";
import { FIRST_COOLDOWN } from "../config";

export default function CountdownBar(props: {
  isMute: boolean;
  className?: string;
  setIsBetSound: Function,
  setHiddenFlag: Function,
}) {
  const { className, isMute, setIsBetSound, setHiddenFlag } = props;
  const [count, setCount] = useState(0);
  const { gameData, setStarted, heartbeat } = useSocket();
  const [force, setForce] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timer;
    if (gameData && heartbeat) {
      if (Math.floor((gameData?.endTimestamp - heartbeat) / 1000) >= 0) {
        setCount(Math.floor((gameData?.endTimestamp - heartbeat) / 1000));
        setForce(!force);
      }
      if (
        Math.floor((gameData?.endTimestamp - heartbeat) / 1000) === 0
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
  }, [gameData, heartbeat]);

  useEffect(() => {
    console.log(count);
  }, [count])

  useEffect(() => {
    if (gameData && setStarted && gameData.players) {
      if (!gameData.players.length || gameData.players.length < 2) {
        setStarted(false);
        setHiddenFlag(false);
      }
    }
  }, [gameData]);

  return (
    <div
      className={`${className ? className : ""
        } w-[calc(100%-60px)] mx-[30px] mt-[150px] absolute text-center`}
    >
      <p className="font-semibold text-white ">Countdown</p>
      <div className="absolute w-full bg-[#050d36] h-2 rounded-3xl mt-4">
        <div
          className="absolute bg-[#4c49cc] h-2 rounded-3xl"
          style={{
            width: `${(35 - count) / 35 * 100}%`,
          }}
        >
        </div>
        {/* {(gameData && gameData.endTimestamp !== 0) ?
          <div
            className="absolute bg-[#4c49cc] h-2 rounded-3xl"
            style={{
              width: `${(FIRST_COOLDOWN / 1000 - count) / FIRST_COOLDOWN / 1000 * 100}%`,
            }}
          >
          </div>
          :
          <div
            className="absolute bg-[#4c49cc] h-2 rounded-3xl"
            style={{ width: 0 }}></div>
        } */}
      </div>
    </div>
  );
}
