import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  isOpen?: boolean;
  id: string;
  name: string;
  placeholder: string;
  autoFocus?: boolean;
  rows: number;
  rules?: {
    required?: string;
    maxLength?: {
      value: number;
      message: string;
    };
  };
  limited?: boolean;
  parentStyles: CSSModuleClasses;
  baseInput: string;
}

const TextArea: FC<Props> = ({
  isOpen,
  id,
  name,
  placeholder,
  rules,
  autoFocus = false,
  limited = false,
  parentStyles,
  baseInput,
}) => {
  const [input, setInput] = useState<string>("");
  const { register } = useFormContext();

  useEffect(() => {
    const resetInput = () => {
      if (!isOpen && isOpen !== undefined) {
        setInput("");
      }
    };

    setInput(baseInput || "");
    resetInput();

    return () => setInput("");
  }, [isOpen, baseInput]);

  const updateInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const textarea = e.target as HTMLTextAreaElement;

    if (textarea) {
      setInput(textarea.value);
    }
  };

  return (
    <>
      <textarea
        className={parentStyles.textarea}
        id={id}
        placeholder={placeholder}
        onInput={(e) => {
          updateInput(e);
        }}
        rows={5}
        autoFocus={autoFocus}
        value={input}
        {...register(name, rules)}
      ></textarea>

      {limited && (
        <div className={parentStyles.textareaLimit}>
          <span
            className={
              rules
                ? rules.maxLength
                  ? input.length > rules.maxLength?.value
                    ? parentStyles.error
                    : ""
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
