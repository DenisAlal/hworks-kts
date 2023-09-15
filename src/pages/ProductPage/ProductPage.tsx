import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/Button";
import Card from "components/Card";
import Text from "components/Text";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import ArrowLeftIcon from "components/icons/ArrowLeftIcon";
import productStore from "store/ProductStore";
import styles from "./ProductPage.module.scss";

const ProductPage = observer(() => {
  const data = productStore.productData;
  const relativeData = productStore.relativeProductsData;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    productStore.getProductData(id).then();
  }, [id]);

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
                src={data?.images[productStore.imageCounter]}
                alt="image"
                className={styles.imageScroll}
              />
            </div>
            <div className={styles.buttonsBlock}>
              <button
                className={styles.circle}
                onClick={productStore.prevImage}
              >
                <ArrowDownIcon
                  color={"secondary"}
                  width={30}
                  height={30}
                  className={styles.prevImage}
                />
              </button>
              <button
                className={styles.circle}
                onClick={productStore.nextImage}
              >
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
              {data?.title}
            </Text>
            <Text
              tag={"p"}
              color={"secondary"}
              weight={"normal"}
              view={"p-20"}
              className={styles.descriptionBlock}
            >
              {data?.description}
            </Text>
            <div className={styles.priceAndButtons}>
              <Text
                tag={"p"}
                color={"primary"}
                weight={"bold"}
                className={styles.infoContentTitle}
              >
                ${data?.price}
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
            {relativeData.map((item) => (
              <div key={item.id} className={styles.divCard}>
                <Card
                  image={item.images[0]}
                  captionSlot={item.category.name}
                  title={item.title}
                  subtitle={item.description}
                  contentSlot={`$${item.price}`}
                  className={styles.card}
                  actionSlot={
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        productStore.addToCart(item);
                      }}
                    >
                      Add to Cart
                    </Button>
                  }
                  onClick={() =>
                    productStore.goToPage(() => navigate(`/${item.id}`))
                  }
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
