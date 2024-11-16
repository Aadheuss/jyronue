import styles from "./ReplyButton.module.css";
import { FC } from "react";

interface Props {
  size?: "SMALL" | "DEFAULT";
  onClick: () => void;
}

const ReplyButton: FC<Props> = ({ size = "DEFAULT", onClick }) => {
  return (
    <button
      className={size === "DEFAULT" ? styles.reply : styles.replySmall}
      onClick={onClick}
    ></button>
  );
};

export default ReplyButton;
