import { observer } from "mobx-react-lite";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Meta } from "utils/Meta.ts";
import { useLocalStore } from "utils/useLocalStore.ts";
import Button from "../../components/Button";
import CartItem from "../../components/CartItem";
import Loader from "../../components/Loader";
import Text from "../../components/Text";
import TrashIcon from "../../components/icons/TrashIcon";
import ViewItemIcon from "../../components/icons/ViewItemIcon";
import CartModalStore from "../../store/CartModalStore";
import { ProductsModel } from "../../store/models";
import styles from "./Cart.module.scss";

const Cart: React.FC = observer(() => {
  const store = useLocalStore(() => new CartModalStore());
  const navigate = useNavigate();

  useEffect(() => {
    store.getCartData();
  }, [store]);
  const handleClickCart = useCallback(
    (e: { stopPropagation: () => void }, item: ProductsModel) => {
      e.stopPropagation();
      store.removeFromCart(item);
    },
    [store],
  );
  const handleClickViewItem = useCallback(
    (e: { stopPropagation: () => void }, item: ProductsModel) => {
      e.stopPropagation();
      navigate(`/${item.id}`);
    },
    [navigate],
  );
  const handleClickClearCart = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      alert(
        `Items from the basket were purchased for the amount of $${store.priceSum} (｡◕‿‿◕｡)`,
      );
      store.clearCart();
    },
    [store],
  );

  return (
    <div className={styles.container}>
      <div className={styles.infoContent}>
        <Text
          tag={"span"}
          color={"primary"}
          weight={"bold"}
          className={styles.infoContentTitle}
        >
          Cart
        </Text>
      </div>
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
              view={"p-20"}
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
                      subtitle={item.description}
                      contentSlot={`$${item.price}`}
                      removeSlot={
                        <div className={styles.buttons}>
                          <Button
                            onClick={(e) => handleClickViewItem(e, item)}
                            className={styles.viewProduct}
                          >
                            <ViewItemIcon color={"white"} />
                          </Button>
                          <Button
                            onClick={(e) => handleClickCart(e, item)}
                            className={styles.removeFromCart}
                          >
                            <TrashIcon width={20} height={20} color={"white"} />
                          </Button>
                        </div>
                      }
                      className={styles.CardItem}
                    />
                  </div>
                ))}
              <div className={styles.buyRow}>
                <Text
                  view={"p-18"}
                  weight={"bold"}
                >{`Cart amount: $${store.priceSum}`}</Text>
                <Button
                  onClick={(e) => {
                    handleClickClearCart(e);
                  }}
                >
                  Buy Products
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
export default Cart;
