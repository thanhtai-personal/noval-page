import Image from "next/image";

import usdCoinGif from "../dollar-coin.gif";

export const USDCoin = () => {
  return <Image alt="coin" height={40} src={usdCoinGif} width={40} />;
};
