import axios from "axios";
import { action, autorun, makeObservable, observable } from "mobx";
import { Products } from "interfaces/ProductsTab.interface.ts";
class ProductStore {
  productData: Products | undefined;
  relativeProductsData: Products[] = [];
  imageCounter: number = 0;
  constructor() {
    makeObservable(this, {
      productData: observable,
      relativeProductsData: observable,
      imageCounter: observable,
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

  getProductData = async (id: string | undefined) => {
    try {
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/products/${id}`,
      );
      this.setProductData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  getRelativeProductsData = async (
    id: string | undefined,
    idCategory: number | undefined,
  ) => {
    const response = await axios.get(
      `https://api.escuelajs.co/api/v1/products/`,
      {
        params: {
          categoryId: idCategory,
        },
      },
    );

    if (id) {
      const updatedData = response.data.filter(
        (item: Products) => item.id !== Number(id),
      );
      const randomItems: Products[] = this.getRandomItems(updatedData, 3);
      this.setRelativeProductsData(randomItems);
    } else {
      this.setRelativeProductsData(response.data);
    }
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
    console.log(id.id);
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
