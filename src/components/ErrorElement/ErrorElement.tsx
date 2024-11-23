import styles from "./ErrorElement.module.css";
import { FC } from "react";

interface Props {
  children: React.ReactNode;
  parentStyles: CSSModuleClasses;
}

const ErrorElement: FC<Props> = ({ children, parentStyles }) => {
  const currentStyle = parentStyles ? parentStyles : styles;

  return <div className={currentStyle.errorElement}>{children}</div>;
};

export default ErrorElement;
