import { FC, useLayoutEffect, useRef, useState } from "react";
import styles from "./InputContainer.module.css";
import {
  checkAutofilled,
  registerAutofilledInput,
  isInputEmpty,
  isPlaceholderShown,
} from "../../utils/domUtils";
import { useFormContext } from "react-hook-form";
import { errorValue } from "../../config/formValues";
import TextArea from "../TextArea/TextArea";

type InputTypes = "password" | "text" | "textarea";

interface Props {
  isOpen?: boolean;
  form?: {
    focus: boolean;
    setFocus: React.Dispatch<React.SetStateAction<boolean>>;
    setError?: React.Dispatch<React.SetStateAction<errorValue | null>>;
    setErrorList?: React.Dispatch<React.SetStateAction<errorValue[] | null>>;
  };
  id: string;
  name?: string;
  type?: InputTypes;
  rows?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  label: string;
  labelType?: "DEFAULT" | "PLACEHOLDER" | "FLOATING" | "HIDDEN";
  placeholder?: string;
  validation?: {
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
  parentStyles?: CSSModuleClasses;
  withErrors?: boolean;
  limited?: boolean;
}

const InputContainer: FC<Props> = ({
  isOpen,
  id,
  name,
  type = "text",
  rows,
  autoComplete = "off",
  autoFocus,
  label,
  placeholder,
  validation,
  form,
  parentStyles,
  labelType = "DEFAULT",
  withErrors = false,
  limited = false,
}) => {
  const [input, setInput] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const { ref, ...rest } = register(name ? name : id, validation);
  const currentStyles = parentStyles ? parentStyles : styles;
  const [placeholderShown, setPlaceholderShown] = useState<boolean>(false);

  useLayoutEffect(() => {
    // Check for prefilled input on load periodically
    // The time when it's autofilled is not very stable, so check few times
    const registerAutofill = () => {
      registerAutofilledInput(inputRef);
      setInput(isInputEmpty({ inputRef }));
      checkAutofilled(inputRef, setIsAutofilled);
      setPlaceholderShown(isPlaceholderShown(inputRef));
    };

    setTimeout(registerAutofill, 0);
    setTimeout(registerAutofill, 150);
    setTimeout(registerAutofill, 450);
    setTimeout(registerAutofill, 600);
  }, []);

  return (
    <div className={currentStyles.inputContainer}>
      <label
        className={
          labelType === "HIDDEN"
            ? currentStyles.hiddenLabel
            : labelType !== "DEFAULT"
            ? isAutofilled || !placeholderShown
              ? currentStyles.hiddenLabel
              : currentStyles.label
            : currentStyles.label
        }
        htmlFor={id}
      >
        {label}
      </label>
      {withErrors && errors[name ? name : id] && (
        <span className={currentStyles.errorTxt}>
          {errors[name ? name : id]?.message as string}
        </span>
      )}
      {type === "textarea" ? (
        <TextArea
          isOpen={isOpen}
          id={id}
          name={name || id}
          placeholder={placeholder || label}
          rows={rows || 3}
          rules={validation}
          autoFocus={autoFocus}
          parentStyles={currentStyles}
          limited={limited}
        />
      ) : (
        <input
          id={id}
          className={currentStyles.input}
          type={type !== "password" ? type : visibility ? "text" : type}
          autoComplete={autoComplete}
          onInput={(e) => {
            setInput(isInputEmpty({ e }));
            if (form?.setError) {
              form.setError(null);
            }

            if (form?.setErrorList) {
              form.setErrorList(null);
            }

            setPlaceholderShown(isPlaceholderShown(inputRef));
          }}
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          name={id}
          placeholder={
            labelType === "DEFAULT"
              ? placeholder
                ? placeholder
                : label
              : !input
              ? ""
              : placeholder
              ? placeholder
              : label
          }
        />
      )}

      {type === "password" && input && (
        <button
          type="button"
          className={currentStyles.visibilityBtn}
          onClick={() => setVisibility(!visibility)}
        >
          <span
            className={
              visibility ? currentStyles.visible : currentStyles.hidden
            }
          ></span>
        </button>
      )}
    </div>
  );
};

export default InputContainer;
