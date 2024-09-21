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
  const [visibility, setVisibility] = useState(false);

  return (
    <div className={styles.inputContainer}>
      <label className={input ? styles.hiddenLabel : styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type={type !== "password" ? type : visibility ? "text" : type}
        autoComplete={autoComplete}
        onInput={(e) => setInput(isInputEmpty(e))}
      />
      {type === "password" && input && (
        <button
          type="button"
          className={styles.visibilityBtn}
          onClick={() => setVisibility(!visibility)}
        >
          <span className={visibility ? styles.visible : styles.hidden}></span>
        </button>
      )}
    </div>
  );
};

export default InputContainer;
