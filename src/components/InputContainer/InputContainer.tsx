import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  baseInput?: string;
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
  baseInput,
}) => {
  const [input, setInput] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState<boolean>();
  const [visibility, setVisibility] = useState(false);
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const { ref, ...rest } = register(name ? name : id, validation);
  const currentStyles = parentStyles ? parentStyles : styles;
  const [placeholderShown, setPlaceholderShown] = useState<boolean>(false);

  useEffect(() => {
    setInput(baseInput || "");
    setValue(name || id, baseInput || "");

    return () => {
      setInput("");
    };
  }, [baseInput, name, id, setValue]);

  useLayoutEffect(() => {
    // Check for prefilled input on load periodically
    // The time when it's autofilled is not very stable, so check few times
    const registerAutofill = () => {
      registerAutofilledInput(inputRef);
      setIsEmpty(isInputEmpty({ inputRef }));
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
          baseInput={baseInput || ""}
        />
      ) : (
        <input
          id={id}
          className={currentStyles.input}
          type={type !== "password" ? type : visibility ? "text" : type}
          autoComplete={autoComplete}
          value={input}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setInput(target.value);
            setIsEmpty(isInputEmpty({ e }));
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
              : isEmpty
              ? ""
              : placeholder
              ? placeholder
              : label
          }
        />
      )}

      {type === "password" && !isEmpty && (
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
