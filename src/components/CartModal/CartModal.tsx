import cn from "classnames";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartPath } from "config/pathLinks.ts";
import CartModalStore from "store/CartModalStore";
import { Meta } from "utils/Meta.ts";
import { useLocalStore } from "utils/useLocalStore.ts";
import Button from "../Button";
import CartItem from "../CartItem";
import Loader from "../Loader";
import Text from "../Text";
import CloseIcon from "../icons/CloseIcon";
import styles from "./CartModal.module.scss";

export type ModalProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const CartModal: React.FC<ModalProps> = observer(
  ({ className, setIsOpen, isOpen }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [firstLoad, setFirstLoad] = useState(true);
    useEffect(() => {
      if (!firstLoad) {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
          ) {
            setIsOpen(!isOpen);
          }
        };

        if (modalRef.current) {
          document.addEventListener("click", handleClickOutside);
        }

        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      } else {
        setFirstLoad(false);
      }
    }, [setIsOpen, modalRef, firstLoad, isOpen]);

    const store = useLocalStore(() => new CartModalStore());
    useEffect(() => {
      store.getModalCartData();
    }, [store]);
    const navigate = useNavigate();

    const handleCartClick = useCallback(() => {
      navigate(cartPath);
      setIsOpen(!isOpen);
    }, [isOpen, navigate, setIsOpen]);

    return (
      <div ref={modalRef} className={cn(className, styles.CartModal)}>
        <div className={styles.titleBlock}>
          <Text
            tag={"div"}
            weight={"bold"}
            view={"title"}
            className={styles.cartTitle}
          >
            Cart
          </Text>
          <div className={styles.closeButton}>
            <CloseIcon onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>

        <div className={styles.divider} />
        {store.meta === Meta.loading ? (
          <div className={styles.loader}>
            <Loader size={"l"} className={styles.loading} />
          </div>
        ) : (
          <div>
            {store.emptyCart ? (
              <Text
                className={styles.emptyCart}
                weight={"bold"}
                view={"p-16"}
                color={"secondary"}
              >
                Your shopping cart is empty! (ಥ﹏ಥ)
              </Text>
            ) : (
              <div>
                {store.data &&
                  store.data.map((item) => (
                    <div key={item.id}>
                      <CartItem
                        image={item.images[0]}
                        title={item.title}
                        className={styles.border}
                      />
                    </div>
                  ))}
                <div className={styles.footer}>
                  <Button onClick={handleCartClick}>Go to Cart</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

export default CartModal;
