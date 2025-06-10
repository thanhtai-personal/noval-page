import { isMobile } from "@/utils/funtions";
import "./fireline.css"

export const FireLine = ({ id = "fire-line", className, ...props }: any) => {
  if (isMobile()) return '';
  return <div id={id} className={`${className} fireline`} {...props}></div>;
};

export default FireLine;