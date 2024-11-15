import { FC } from "react";
import styles from "./Loader.module.css";

interface Props {
  type: "dots" | "spinner";
  color: string;
  bgColor?: string;
  size: {
    width: string;
    height: string;
  };
}

const Loader: FC<Props> = ({ type, color, bgColor = "#ffffff", size }) => {
  const style = {
    "--bg-color": bgColor,
    "--color": color,
    width: size.width,
    height: size.height,
  };

  return <div style={style} className={styles[type]}></div>;
};

export default Loader;
