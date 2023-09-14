import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Button from "components/Button";
import Card from "components/Card";
import Text from "components/Text";
import categoryStore from "store/CategoryStore";
import styles from "./CategoryTab.module.scss";

const CategoryTab = observer(() => {
  const data = categoryStore.data;
  useEffect(() => {
    categoryStore.getCategoryData().catch();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.infoContent}>
        <Text
          tag={"span"}
          color={"primary"}
          weight={"bold"}
          className={styles.infoContentTitle}
        >
          Categories
        </Text>
        <Text
          view={"p-20"}
          tag={"span"}
          color={"secondary"}
          weight={"bold"}
          className={styles.infoDescription}
        >
          {" "}
          On this page we display product categories
        </Text>
      </div>

      <Text
        view={"p-32"}
        tag={"span"}
        color={"primary"}
        weight={"bold"}
        className={styles.productsTitle}
      >
        Total Category
        <Text view={"p-20"} tag={"span"} color={"accent"} weight={"bold"}>
          {data.length}
        </Text>
      </Text>

      <div className={styles.products}>
        {data.map((item) => (
          <div key={item.id} className={styles.divCard}>
            <Card
              image={item.image}
              title={item.name}
              className={styles.card}
              actionSlot={<Button>View category</Button>}
              onClick={() => {
                alert("В разработке");
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default CategoryTab;
