import { observer } from "mobx-react-lite";

const WallPaperBg1 = observer(({ children, className = "", ...props }: any) => {
  return (
    <div {...props} className="bg-cover bg-center w-full">
      {children}
    </div>
  );
});

export default WallPaperBg1;
