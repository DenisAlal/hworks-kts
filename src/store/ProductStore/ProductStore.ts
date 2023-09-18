import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
import { normalizeProducts, ProductsApi, ProductsModel } from "../models";

type PrivateFields = "_meta";
class ProductStore {
  productData: ProductsModel | undefined;
  relativeProductsData: ProductsModel[] = [];
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
  }
  get meta(): Meta {
    return this._meta;
  }
  getProductData = async (id: string | undefined) => {
    this._meta = Meta.loading;
    await axios
      .get(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then((response) => {
        this.setProductData(normalizeProducts(response.data));
      })
      .catch(log);
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
        const normalizedResponse = response.data.map((item: ProductsApi) =>
          normalizeProducts(item),
        );
        if (id) {
          const updatedData = normalizedResponse.filter(
            (item: ProductsModel) => item.id !== Number(id),
          );
          const randomItems: ProductsModel[] = this.getRandomItems(
            updatedData,
            3,
          );
          this.setRelativeProductsData(randomItems);
        } else {
          this.setRelativeProductsData(normalizedResponse);
        }
        this._meta = Meta.success;
      })
      .catch(log);
  };

  getRandomItems = (data: ProductsModel[], count: number): ProductsModel[] => {
    const randomItems: ProductsModel[] = [];
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
  addToCart = (id: ProductsModel) => {
    alert(`Товар с id: ${id.id} добавлен в корзину`);
  };
  setProductData = (productData: ProductsModel) => {
    this.productData = productData;
    this.getRelativeProductsData(
      String(this.productData.id),
      this.productData.category.id,
    );
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
  setRelativeProductsData = (relativeProductsData: ProductsModel[]) => {
    this.relativeProductsData = relativeProductsData;
  };
}

export default ProductStore;
