import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "components/Button";
import Card from "components/Card";
import Filter from "components/Filter";
import Input from "components/Input";
import Pagination from "components/Pagination";
import Text from "components/Text";
import productsStore, { Option } from "store/ProductsStore";
import { useQueryParamsStoreInit } from "store/RootStore/hooks/useQueryParamsStoreInit.ts";
import styles from "./ProductsTab.module.scss";
const ProductsTab = observer(() => {
  const navigate = useNavigate();
  const store = productsStore;
  useQueryParamsStoreInit();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    store.getProducts().then();
  }, [
    store.inputClickButton,
    store.counterProductsData,
    store.valueUserOptions,
    store.selectedPage,
  ]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    const { selectedPage, inputValue, valueUserOptions } = store;
    newParams.set("page", `${selectedPage}`);
    if (inputValue !== "") {
      newParams.set("title", `${inputValue}`);
    } else {
      newParams.delete("title");
    }
    if (valueUserOptions.length > 0) {
      const categoryId = valueUserOptions[0] ? valueUserOptions[0].key : null;
      newParams.set("categoryId", `${categoryId}`);
    }
    setSearchParams(newParams);
  }, [store.selectedPage, store.inputValue, store.valueUserOptions]);

  return (
    <div className={styles.container}>
      <div className={styles.infoContent}>
        <Text
          tag={"span"}
          color={"primary"}
          weight={"bold"}
          className={styles.infoContentTitle}
        >
          Products
        </Text>
        <Text
          view={"p-20"}
          tag={"span"}
          color={"secondary"}
          weight={"bold"}
          className={styles.infoDescription}
        >
          We display products based on the latest products we have, if you want
          to see our old products please enter the name of the item
        </Text>
      </div>

      <div className={styles.filterBlock}>
        <div className={styles.findInputBlock}>
          <Input
            value={store.inputValue}
            onChange={store.setValueInput}
            placeholder={"Search product"}
            className={styles.findInput}
          />
          <Button
            className={styles.findButton}
            onClick={() => store.setClickInputSearchButton()}
          >
            Find now
          </Button>
        </div>
        <div>
          {store.categories && (
            <Filter
              options={toJS(store.categories)}
              value={store.valueUserOptions}
              onChange={(newValue: Option[]) => {
                store.setValueOptions(newValue);
              }}
              getTitle={store.getTitle}
              ifValueEmpty={"Filter"}
              className={styles.filterDropDown}
            />
          )}
        </div>
      </div>
      <Text
        view={"p-32"}
        tag={"span"}
        color={"primary"}
        weight={"bold"}
        className={styles.productsTitle}
      >
        Total Product
        <Text view={"p-20"} tag={"span"} color={"accent"} weight={"bold"}>
          {store.counterProductsData}
        </Text>
      </Text>

      <div className={styles.products}>
        {store.productsData?.map((item) => (
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
                    store.addToCart(item);
                  }}
                >
                  Add to Cart
                </Button>
              }
              onClick={() => store.runFunc(() => navigate(`/${item.id}`))}
            />
          </div>
        ))}
      </div>
      <div className={styles.paginationBlock}>
        {store.productsData && store.pagesCountValue !== 0 && (
          <Pagination
            currentPage={store.selectedPage}
            lastPage={store.pagesCountValue}
            maxLength={5}
            setCurrentPage={store.setSelectedPage}
          />
        )}
      </div>
    </div>
  );
});
export default ProductsTab;
