import cn from "classnames";
import { HTMLProps } from "react";
import "./PageLink.scss";
export type Props = HTMLProps<HTMLAnchorElement> & { active?: boolean };

export default function PageLink({
  className,
  active,
  disabled,
  children,
  ...otherProps
}: Props) {
  const customClassName = cn("page-link", className, {
    active,
    disabled,
  });

  if (disabled) {
    return <span className={customClassName}>{children}</span>;
  }

  return (
    <a className={customClassName} {...otherProps}>
      {children}
    </a>
  );
}
