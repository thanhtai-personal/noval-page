import { useEffect } from "react";
import "./wheel-of-lottery.css"

export const WheelOfLottery = () => {

  useEffect(() => {
    const hat = document.querySelector('.m-game__wrapper') as HTMLElement | null;
    const startBtn = document.querySelector('.m-game__start');
    let token = true;
    let rotate = 0;

    function handleClick() {
      if (!token || !hat) return;
      token = false;

      const oldDeg = rotate;

      const deg = Math.floor(Math.random() * 360) + 1080 + oldDeg;

      rotate = deg;
      hat.style.transform = `rotate(${deg}deg)`;

      setTimeout(function () {
        token = true;
        calcResult(deg);
      }, 7000);
    }

    function calcResult(deg: number) {
      alert(deg);
    }

    if (startBtn) {
      startBtn.addEventListener('click', handleClick);
    }

    return () => {
      if (startBtn) {
        startBtn.removeEventListener('click', handleClick);
      }
    };
  }, [])

  return (
    <div className="wheel-of-lottery">
      <div className="m-game">
        <div className="m-game__start"><img src="https://w.ladicdn.com/source/spin-btn1.svg" alt="" /></div>
        <div className="m-game__wrapper"><img className="m-game__bg" src="https://w.ladicdn.com/source/spin-bg6.svg" alt="" />
          <div>
            <div className="m-game__text">Phần thưởng 1</div>
            <div className="m-game__text">Phần thưởng 2</div>
            <div className="m-game__text">Phần thưởng 3</div>
            <div className="m-game__text">Phần thưởng 4</div>
            <div className="m-game__text">Phần thưởng 5</div>
            <div className="m-game__text">Phần thưởng 6</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WheelOfLottery;