import cn from "classnames";
import * as React from "react";
import { useState } from "react";
import styles from "./Input.module.scss";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string, inputType?: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const { value, onChange, afterSlot, ...rest } = props;
    const [isFocused, setIsFocused] = useState(false);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
      setIsFocused(false);
      rest.onBlur?.(e);
    };
    const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
      setIsFocused(true);
      rest.onFocus?.(e);
    };

    return (
      <div
        className={cn(rest.className, styles.inputComponent, {
          [styles.inputComponentFocus]: isFocused,
        })}
      >
        <input
          type={"text"}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={rest.disabled}
          placeholder={rest.placeholder}
          onMouseOver={rest.onMouseOver}
          onMouseOut={rest.onMouseOut}
          onFocus={handleFocus}
          onBlur={handleBlur}
          id={rest.id}
          name={rest.name}
          style={rest.style}
          readOnly={rest.readOnly}
          {...rest}
        />
        {afterSlot}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
