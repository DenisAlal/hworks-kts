import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/Button";
import Card from "components/Card";
import Text from "components/Text";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import ArrowLeftIcon from "components/icons/ArrowLeftIcon";
import ProductStore from "store/ProductStore";
import { ProductsModel } from "store/models";
import { useLocalStore } from "utils/useLocalStore.ts";
import styles from "./ProductPage.module.scss";

const ProductPage = observer(() => {
  const productStore = useLocalStore(() => new ProductStore());
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    productStore.getProductData(id);
  }, [id, productStore]);

  const handleNextIm = useCallback(() => {
    productStore.nextImage();
  }, [productStore]);

  const handlePrevIm = useCallback(() => {
    productStore.prevImage();
  }, [productStore]);

  const handleClickCart = useCallback(
    (e: { stopPropagation: () => void }, item: ProductsModel) => {
      e.stopPropagation();
      productStore.addToCart(item);
    },
    [productStore],
  );

  return (
    <div className={styles.container}>
      <div className={styles.backBlock} onClick={() => navigate(-1)}>
        <ArrowLeftIcon height={32} width={32} />
        <Text tag={"div"} view={"p-20"} color={"primary"}>
          Назад
        </Text>
      </div>
      <div className={styles.mainBlock}>
        <div className={styles.mainContent}>
          <div className={styles.imageScroll}>
            <div className={styles.imageViewWrapper}>
              <img
                src={
                  productStore.productData?.images[productStore.imageCounter]
                }
                alt="image"
                className={styles.imageScroll}
              />
            </div>
            <div className={styles.buttonsBlock}>
              <button className={styles.circle} onClick={handlePrevIm}>
                <ArrowDownIcon
                  color={"secondary"}
                  width={30}
                  height={30}
                  className={styles.prevImage}
                />
              </button>
              <button className={styles.circle} onClick={handleNextIm}>
                <ArrowDownIcon
                  color={"secondary"}
                  width={30}
                  height={30}
                  className={styles.nextImage}
                />
              </button>
            </div>
          </div>
          <div className={styles.productContent}>
            <Text
              tag={"p"}
              color={"primary"}
              weight={"bold"}
              className={styles.infoContentTitle}
            >
              {productStore.productData?.title}
            </Text>
            <Text
              tag={"p"}
              color={"secondary"}
              weight={"normal"}
              view={"p-20"}
              className={styles.descriptionBlock}
            >
              {productStore.productData?.description}
            </Text>
            <div className={styles.priceAndButtons}>
              <Text
                tag={"p"}
                color={"primary"}
                weight={"bold"}
                className={styles.infoContentTitle}
              >
                ${productStore.productData?.price}
              </Text>
              <div className={styles.buyButtons}>
                <Button>Buy Now</Button>
                <Button className={styles.buttonCart}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.relatedItemsBlock}>
          <Text
            tag={"p"}
            color={"primary"}
            weight={"bold"}
            className={styles.relatedContentTitle}
          >
            Related Items
          </Text>
          <div className={styles.products}>
            {productStore.relativeProductsData.length > 0 && productStore.relativeProductsData.map((item) => (
              <div key={item.id} className={styles.divCard}>
                <Card
                  image={item.images[0]}
                  captionSlot={item.category.name}
                  title={item.title}
                  subtitle={item.description}
                  contentSlot={`$${item.price}`}
                  className={styles.card}
                  actionSlot={
                    <Button onClick={(e) => handleClickCart(e, item)}>
                      Add to Cart
                    </Button>
                  }
                  onClick={() => navigate(`/${item.id}`) }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
export default ProductPage;
