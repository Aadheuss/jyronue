import { FC } from "react";
import styles from "./InputContainer.module.css";

type InputTypes = "password" | "text";

interface Props {
  id: string;
  type?: InputTypes;
  autoComplete: string;
  label: string;
}

const InputContainer: FC<Props> = ({
  id,
  type = "text",
  autoComplete,
  label,
}) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type={type}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default InputContainer;
