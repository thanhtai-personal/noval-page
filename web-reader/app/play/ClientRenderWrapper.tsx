"use client";

import dynamic from "next/dynamic";

const PlayToEarn = dynamic(
  () => import("@/components/play/PlayToEarn"),
  { ssr: false },
);

const ClientRenderWrapper = (props: any) => {
  return <PlayToEarn {...props} />;
};

export default ClientRenderWrapper;
