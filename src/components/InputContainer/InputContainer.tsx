import { FC, useState } from "react";
import styles from "./InputContainer.module.css";
import { isInputEmpty } from "../../utils/domUtils";

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
  const [input, setInput] = useState(false);

  return (
    <div className={styles.inputContainer}>
      <label className={input ? styles.hiddenLabel : styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type={type}
        autoComplete={autoComplete}
        onInput={(e) => setInput(isInputEmpty(e))}
      />
    </div>
  );
};

export default InputContainer;
