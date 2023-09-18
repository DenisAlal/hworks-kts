import axios from "axios";
import { action, computed, makeObservable, observable, reaction } from "mobx";
import { Option } from "components/Filter";
import { Meta } from "utils/Meta.ts";
import rootStore from "../RootStore";
import {
  CategoryAPI,
  normalizeCategory,
  normalizeProducts,
  ProductsApi,
  ProductsModel,
} from "../models";

type PrivateFields = "_meta" | "_setProductsCounterData";

class ProductsStore {
  private _productsOnPage = 9;
  private _meta: Meta = Meta.initial;
  productsData: ProductsModel[] = [];
  counterProductsData: number = 0;
  categories: Option[] = [];
  valueOptions: Option[] = [];
  inputValue: string | undefined;
  valueUserOptions: Option[] = [];
  inputClickButton: string | undefined = "";
  pagesCountValue = 0;
  selectedPage: number = 1;
  constructor() {
    makeObservable<ProductsStore, PrivateFields>(this, {
      _meta: observable,
      productsData: observable,
      valueOptions: observable,
      inputValue: observable,
      categories: observable,
      inputClickButton: observable,
      counterProductsData: observable,
      selectedPage: observable,
      valueUserOptions: observable,
      meta: computed,
      getCategories: action,
      getProducts: action,
      setDataCategories: action,
      setDataProducts: action,
      _setProductsCounterData: action,
      setValueOptions: action,
      setValueInput: action,
      setClickInputSearchButton: action,
      setSelectedPage: action,
      addToCart: action,
      runFunc: action,
      pageCounter: action,
      updateFilter: action,
    });

    reaction(
      () => this.counterProductsData,
      (counterProductsData) => {
        this.pageCounter(counterProductsData);
      },
    );
    reaction(
      () => this.categories,
      () => {
        this.getProducts();
      },
    );
  }

  get meta(): Meta {
    return this._meta;
  }

  pageCounter(pageCount: number) {
    if (pageCount) {
      if (Math.floor(pageCount / this._productsOnPage) === 0 && pageCount > 0) {
        this.pagesCountValue = 1;
      } else if (
        Math.floor(pageCount / this._productsOnPage) === 1 &&
        pageCount > 9
      ) {
        this.pagesCountValue = 2;
      } else {
        this.pagesCountValue = Math.floor(pageCount / this._productsOnPage);
      }
    } else {
      this.pagesCountValue = 0;
    }
  }

  getProducts = async () => {
    this._meta = Meta.loading;
    let categoryIdReq;
    if (
      rootStore.query.getParam("categoryId") &&
      this.valueUserOptions.length === 0
    ) {
      const categoryId = rootStore.query.getParam("categoryId");
      const category = this.categories.find(
        (category) => category.key === categoryId,
      );
      if (category) {
        categoryIdReq = category?.key;
        this.setValueOptions(
          categoryIdReq ? [{ key: category.key, value: category.value }] : [],
        );
      } else {
        categoryIdReq = this.valueOptions[0] ? this.valueOptions[0].key : null;
      }
    } else {
      categoryIdReq = this.valueUserOptions[0]
        ? this.valueUserOptions[0].key
        : null;
    }
    let title = "";

    if (rootStore.query.getParam("title")) {
      const newTitle = rootStore.query.getParam("title");
      if (newTitle !== undefined) {
        title = newTitle.toString();
        this.setValueInput(title);
      }
    } else {
      if (this.inputClickButton) {
        title = this.inputClickButton;
      }
    }
    this.getCountProductsData(categoryIdReq, title);
    let offset;
    if (this.selectedPage === 1) {
      offset = 0;
    } else if (
      Math.floor(this.counterProductsData / this._productsOnPage) === 1 &&
      this.counterProductsData > 9 &&
      this.counterProductsData <= 18 &&
      this.selectedPage === 2
    ) {
      offset = this._productsOnPage;
    } else {
      offset = this.selectedPage * this._productsOnPage;
    }

    await axios
      .get("https://api.escuelajs.co/api/v1/products", {
        params: {
          title: title,
          categoryId: categoryIdReq,
          offset: offset,
          limit: this._productsOnPage,
        },
      })
      .then((response) => {
        this.setDataProducts(
          response.data.map((item: ProductsApi) => normalizeProducts(item)),
        );

        this._meta = Meta.success;
      })
      .catch(() => {
        this._meta = Meta.error;
        this.setDataProducts([]);
      });
  };

  setDataProducts = (productsData: ProductsModel[]) => {
    this.productsData = productsData;
  };

  getCategories = async () => {
    this._meta = Meta.loading;
    await axios
      .get("https://api.escuelajs.co/api/v1/categories")
      .then((response) => {
        const normalizeCategoryResponse = response.data.map(
          (item: CategoryAPI) => normalizeCategory(item),
        );
        this.setDataCategories(
          normalizeCategoryResponse.map(
            (item: { id: { toString: () => number }; name: string }) => ({
              key: item.id.toString(),
              value: item.name,
            }),
          ),
        );
      })
      .catch(() => {
        this._meta = Meta.error;
        this.setDataCategories([]);
      });
  };
  setDataCategories = (categories: Option[]) => {
    this.categories = categories;
  };

  getCountProductsData = async (categoryId: string | null, title: string) => {
    const newTitle = title !== "" ? title : null;
    this._meta = Meta.loading;
    await axios
      .get("https://api.escuelajs.co/api/v1/products", {
        params: {
          title: newTitle,
          categoryId: categoryId,
        },
      })
      .then((response) => {
        this._setProductsCounterData(response.data.length);
      })
      .catch(() => {
        this._meta = Meta.error;
        this._setProductsCounterData(0);
      });
  };
  private _setProductsCounterData = (counterProductsData: number) => {
    this.counterProductsData = counterProductsData;
  };
  setValueOptions = (value: Option[]) => {
    this.valueUserOptions = value;
  };
  setValueInput = (value: string): string => {
    return (this.inputValue = value);
  };
  setSelectedPage = (selectedPage: number) => {
    this.selectedPage = selectedPage;
  };
  setClickInputSearchButton = () => {
    this.inputClickButton = this.inputValue;
  };

  addToCart = (id: ProductsModel) => {
    alert(`Товар с id: ${id.id} добавлен в корзину`);
  };

  runFunc = (func: () => void) => {
    func();
  };
  getTitle = (elements: Option[]) =>
    elements.map((el: Option) => el.value).join();

  updateFilter = () => {};
}

export default new ProductsStore();
