import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "components/Text";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import ArrowDownIcon from "../../../components/icons/ArrowDownIcon";
import ArrowLeftIcon from "../../../components/icons/ArrowLeftIcon";
import { Product } from "./ProductPage.interface.ts";
import styles from "./ProductPage.module.scss";

const ProductPage: React.FC = () => {
  const [data, setData] = useState<Product>();
  const [dataRelatedItems, setDataRelatedItems] = useState<Product[]>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      const result = await axios({
        method: "get",
        url: `https://api.escuelajs.co/api/v1/products/${id}`,
      });
      setData(result.data);
    };
    fetch();
  }, []);
  useEffect(() => {
    if (data) {
      const fetch = async () => {
        let url = `https://api.escuelajs.co/api/v1/products/?limit=3&offset=0`;
        if (data.category.id !== 0) {
          url = url + `&categoryId=${data.category.id}`;
        }
        const result = await axios({
          method: "get",
          url: url,
        });
        setDataRelatedItems(result.data);
      };
      fetch();
    }
  }, [data]);

  const handleNextImage = () => {
    if (data) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % data?.images.length,
      );
    }
  };

  const handlePrevImage = () => {
    if (data) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + data?.images.length) % data?.images.length,
      );
    }
  };
  const ImageView = (props: { image: string | undefined }) => {
    return <img src={props.image} alt="image" className={styles.imageScroll} />;
  };

  const handleButtonClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  const goToPage = (id: number) => {
    navigate(`/${id}`);
    window.location.reload();
  };

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
              <ImageView image={data?.images[currentImageIndex]} />
            </div>
            <div className={styles.buttonsBlock}>
              <button className={styles.circle} onClick={handlePrevImage}>
                <ArrowDownIcon
                  color={"secondary"}
                  width={30}
                  height={30}
                  className={styles.prevImage}
                />
              </button>
              <button className={styles.circle} onClick={handleNextImage}>
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
            {dataRelatedItems?.map((item) => (
              <div key={item.id} className={styles.divCard}>
                <Card
                  image={item.images[0]}
                  captionSlot={item.category.name}
                  title={item.title}
                  subtitle={item.description}
                  contentSlot={`$${item.price}`}
                  className={styles.card}
                  actionSlot={
                    <Button onClick={handleButtonClick}>Add to Cart</Button>
                  }
                  onClick={() => goToPage(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
