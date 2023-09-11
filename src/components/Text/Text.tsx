import cn from "classnames";
import * as React from "react";
import styles from "./Text.module.scss";
export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?:
    | "title"
    | "button"
    | "p-44"
    | "p-32"
    | "p-20"
    | "p-18"
    | "p-16"
    | "p-14";
  /** Html-тег */
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p" | "span";
  /** Начертание шрифта */
  weight?: "normal" | "medium" | "bold";
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: "primary" | "secondary" | "accent";
  /** Максимальное кол-во строк */
  maxLines?: 1 | 2 | 3 | 4 | 5 | 6;
};

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag = "p",
  weight = "normal",
  children,
  color,
  maxLines,
}) => {
  const TextComponent = tag || "p";
  return (
    <TextComponent
      className={cn(className, {
        [styles.title]: view === "title",
        [styles.button]: view === "button",
        [styles["p-44"]]: view === "p-44",
        [styles["p-32"]]: view === "p-32",
        [styles["p-20"]]: view === "p-20",
        [styles["p-18"]]: view === "p-18",
        [styles["p-16"]]: view === "p-16",
        [styles["p-14"]]: view === "p-14",
        [styles[weight]]: weight,
        [styles.primary]: color === "primary",
        [styles.secondary]: color === "secondary",
        [styles.accent]: color === "accent",
        [styles.maxLines]: maxLines,
        [styles[`maxLines_${maxLines}`]]: maxLines,
      })}
    >
      {children}
    </TextComponent>
  );
};

export default Text;
