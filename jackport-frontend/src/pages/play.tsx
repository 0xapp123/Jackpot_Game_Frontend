/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Waiting(props: {
  isMute: boolean;
  setIsMute: Function;
}) {
  const router = useRouter()

  useEffect(() => {
    router.push("/room/the-tower")
  }, [router])

  return <></>;
}
