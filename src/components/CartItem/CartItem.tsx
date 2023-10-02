import cn from "classnames";
import * as React from "react";
import { memo } from "react";
import Text from "../Text";
import styles from "./CartItem.module.scss";

export type CartItemProps = {
  className?: string;
  image: string;
  removeSlot?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  contentSlot?: React.ReactNode;
};

const CartItem: React.FC<CartItemProps> = memo(
  ({ className, removeSlot, image, title, subtitle, contentSlot }) => {
    return (
      <div className={cn(className, styles.main)}>
        <img src={image} alt="cardImage" className={styles.image} />
        <div className={styles.contentBlock}>
          <Text
            tag={"h1"}
            view={"p-16"}
            color={"primary"}
            maxLines={2}
            className={styles.title}
            weight={"bold"}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              tag={"h2"}
              view={"p-16"}
              color={"secondary"}
              maxLines={3}
              weight={"normal"}
              className={styles.subtitle}
            >
              {subtitle}
            </Text>
          )}
        </div>
        <div className={styles.footer}>
          <p className={styles.contentSlot}>{contentSlot}</p>
          <div className={styles.actionSlot}>{removeSlot}</div>
        </div>
      </div>
    );
  },
);
CartItem.displayName = "CartItem";
export default CartItem;
