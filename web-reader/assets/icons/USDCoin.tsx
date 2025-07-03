import Image from "next/image"
import usdCoinGif from "../dollar-coin.gif"

export const USDCoin = () => {

  return (
    <Image
      src={usdCoinGif}
      width={40}
      height={40}
      alt="coin"
    />
  )
}