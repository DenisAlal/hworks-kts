import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./CheckBox.module.scss";
import CheckIcon from "../icons/CheckIcon";

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const { onChange, ...rest } = props;
  const [checked, setChecked] = useState(false);
  const [hoverBorder, setHoverBorder] = useState(false);

  useEffect(() => {
    if (props.checked) {
      setChecked(props.checked);
    }
  }, [props.checked]);

  const handleOnChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <div
      className={cn(rest.className, styles.checkboxContainer, {
        [styles.checkboxContainerDisabled]: rest.disabled,
      })}
    >
      <div
        className={cn(styles.borderBox, {
          [styles.borderBoxHover]: hoverBorder,
        })}
      ></div>
      <input
        onMouseEnter={() => setHoverBorder(true)}
        onMouseLeave={() => setHoverBorder(false)}
        className={styles.checkbox}
        data-testid="checkbox"
        type={"checkbox"}
        disabled={rest.disabled}
        checked={rest.checked}
        onChange={handleOnChange}
      />
      {checked && <CheckIcon className={styles.arrowIcon} />}
    </div>
  );
};

export default CheckBox;
