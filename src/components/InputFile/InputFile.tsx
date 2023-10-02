import cn from "classnames";
import * as React from "react";
import { memo } from "react";
import styles from "./InputProps.module.scss";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  afterSlot?: React.ReactNode;
};

const InputFile = memo(
  React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
    const { onChange, afterSlot, ...rest } = props;
    return (
      <div>
        <label className={cn(rest.className, styles.inputFile)}>
          <input
            type={"file"}
            ref={ref}
            hidden
            onChange={onChange}
            disabled={rest.disabled}
            placeholder={rest.placeholder}
            onMouseOver={rest.onMouseOver}
            onMouseOut={rest.onMouseOut}
            id={rest.id}
            name={rest.name}
            style={rest.style}
            readOnly={rest.readOnly}
            {...rest}
          />
          <span>Select image</span>
        </label>
        {afterSlot}
      </div>
    );
  }),
);

InputFile.displayName = "InputFile";

export default InputFile;
