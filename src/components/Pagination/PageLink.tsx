import cn from "classnames";
import { HTMLProps } from "react";
import styles from "./PageLink.module.scss";
export type Props = HTMLProps<HTMLAnchorElement> & { active?: boolean };

export default function PageLink({
  className,
  active,
  disabled,
  children,
  ...otherProps
}: Props) {
  return (
    <a
      className={cn(styles.pageLink, className, {
        [styles.active]: active,
        [styles.disabled]: disabled,
      })}
      {...otherProps}
    >
      {children}
    </a>
  );
}
