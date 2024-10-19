import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  isOpen: boolean;
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoFocus: boolean;
  rows: number;
  rules: {
    required?: string;
    maxLength?: {
      value: number;
      message: string;
    };
  };
  limited: boolean;
  parentStyles: CSSModuleClasses;
}

const TextArea: FC<Props> = ({
  isOpen,
  id,
  name,
  label,
  placeholder,
  rules,
  autoFocus,
  limited,
  parentStyles,
}) => {
  const [input, setInput] = useState<string>("");
  const { required, maxLength } = rules;
  const { register } = useFormContext();

  useEffect(() => {
    const resetInput = () => {
      if (!isOpen) {
        setInput("");
      }
    };

    resetInput();
  }, [isOpen]);

  const updateInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const textarea = e.target as HTMLTextAreaElement;

    if (textarea) {
      setInput(textarea.value);
    }
  };

  return (
    <>
      <div className={parentStyles.inputContainer}>
        <label className={parentStyles.textareaLabel} htmlFor={id}>
          {label}
        </label>
        <textarea
          className={parentStyles.textarea}
          id={id}
          placeholder={placeholder}
          onInput={(e) => {
            if (limited) {
              updateInput(e);
            }
          }}
          rows={5}
          autoFocus={autoFocus}
          value={input}
          {...register(name, {
            required: required,
            maxLength: maxLength,
          })}
        ></textarea>
      </div>
      {limited && (
        <div className={parentStyles.textareaLimit}>
          <span
            className={
              rules.maxLength
                ? input.length > rules.maxLength?.value
                  ? parentStyles.error
                  : ""
                : ""
            }
          >
            {input.length}
          </span>{" "}
          / {rules?.maxLength?.value || "5000"}
        </div>
      )}
    </>
  );
};

export default TextArea;
