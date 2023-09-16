import axios from "axios";
import { action, autorun, computed, makeObservable, observable } from "mobx";
import { Products } from "interfaces/ProductsTab.interface.ts";
import { log } from "utils/log.ts";
import { Meta } from "../../utils/Meta.ts";

type PrivateFields = "_meta";
class ProductStore {
  productData: Products | undefined;
  relativeProductsData: Products[] = [];
  imageCounter: number = 0;
  private _meta: Meta = Meta.initial;
  constructor() {
    makeObservable<ProductStore, PrivateFields>(this, {
      _meta: observable,
      productData: observable,
      relativeProductsData: observable,
      imageCounter: observable,
      meta: computed,
      setProductData: action,
      setRelativeProductsData: action,
      getProductData: action,
      getRelativeProductsData: action,
      goToPage: action,
      addToCart: action,
      nextImage: action,
      prevImage: action,
    });

    autorun(() => {
      if (this.productData?.id && this.productData?.category?.id) {
        this.getRelativeProductsData(
          String(this.productData.id),
          this.productData.category.id,
        );
      }
    });
  }
  get meta(): Meta {
    return this._meta;
  }
  getProductData = async (id: string | undefined) => {
    this._meta = Meta.loading;
    await axios
      .get(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then((response) => {
        this.setProductData(response.data);
      })
      .catch((error) => log(error()));
  };
  getRelativeProductsData = async (
    id: string | undefined,
    idCategory: number | undefined,
  ) => {
    this._meta = Meta.loading;
    await axios
      .get(`https://api.escuelajs.co/api/v1/products/`, {
        params: {
          categoryId: idCategory,
        },
      })
      .then((response) => {
        if (id) {
          const updatedData = response.data.filter(
            (item: Products) => item.id !== Number(id),
          );
          const randomItems: Products[] = this.getRandomItems(updatedData, 3);
          this.setRelativeProductsData(randomItems);
        } else {
          this.setRelativeProductsData(response.data);
        }
        this._meta = Meta.success;
      })
      .catch((error) => {
        log(error);
      });
  };

  getRandomItems = (data: Products[], count: number): Products[] => {
    const randomItems: Products[] = [];
    const dataCopy = [...data];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * dataCopy.length);
      const randomItem = dataCopy.splice(randomIndex, 1)[0];
      randomItems.push(randomItem);
    }
    return randomItems;
  };
  goToPage = (func: () => void) => {
    func();
  };
  addToCart = (id: Products) => {
    alert(`Товар с id: ${id.id} добавлен в корзину`);
  };
  setProductData = (productData: Products) => {
    this.productData = productData;
  };
  nextImage = () => {
    if (this.productData) {
      this.imageCounter =
        this.imageCounter === this.productData.images.length - 1
          ? 0
          : this.imageCounter + 1;
    }
  };
  prevImage = () => {
    if (this.productData) {
      this.imageCounter =
        this.imageCounter === 0
          ? this.productData.images.length - 1
          : this.imageCounter - 1;
    }
  };
  setRelativeProductsData = (relativeProductsData: Products[]) => {
    this.relativeProductsData = relativeProductsData;
  };
}

export default new ProductStore();
