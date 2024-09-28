import { FC, useState } from "react";
import styles from "./InputContainer.module.css";
import { isInputEmpty } from "../../utils/domUtils";
import { useFormContext } from "react-hook-form";
import { errorValue } from "../../config/formValues";

type InputTypes = "password" | "text";

interface Props {
  form: {
    focus: boolean;
    setFocus: React.Dispatch<React.SetStateAction<boolean>>;
    setError?: React.Dispatch<React.SetStateAction<errorValue | null>>;
  };
  id: string;
  type?: InputTypes;
  autoComplete: string;
  label: string;
  validation: {
    required?: string;
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    pattern?: {
      value: RegExp;
      message: string;
    };
  };
}

const InputContainer: FC<Props> = ({
  id,
  type = "text",
  autoComplete,
  label,
  validation,
  form,
}) => {
  const [input, setInput] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { register } = useFormContext();
  const { required, minLength, maxLength, pattern } = validation;

  return (
    <div className={styles.inputContainer}>
      <label
        className={
          input || isFocused || form.focus ? styles.hiddenLabel : styles.label
        }
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type={type !== "password" ? type : visibility ? "text" : type}
        autoComplete={autoComplete}
        onInput={(e) => {
          setInput(isInputEmpty(e));

          if (form.setError) {
            form.setError(null);
          }
        }}
        {...register(id, {
          required: required,
          minLength: minLength,
          maxLength: maxLength,
          pattern: pattern,
        })}
        onFocus={() => {
          setIsFocused(true);
          form.setFocus(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          form.setFocus(false);
        }}
        name={id}
        placeholder={isFocused || input || form.focus ? label : ""}
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
