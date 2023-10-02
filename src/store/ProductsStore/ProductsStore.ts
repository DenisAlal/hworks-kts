import axios from "axios";
import { action, computed, makeObservable, observable, reaction } from "mobx";
import { Option } from "components/Filter";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
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
  inputClickButton: string | undefined;
  pagesCountValue = 0;
  selectedPage: number = 1;
  firstLoad = true;
  itemsArrayList: number[] = [];

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
      itemsArrayList: observable,
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
        const pageCountNew = Math.floor(pageCount / this._productsOnPage);
        if (pageCountNew * 9 < pageCount) {
          this.pagesCountValue = pageCountNew + 1;
        } else {
          this.pagesCountValue = pageCountNew;
        }
      }
    } else {
      this.pagesCountValue = 0;
    }
  }

  getProducts = async () => {
    const cartItems = localStorage.getItem("cartItems");
    let onCartId: number[];
    const onCartMap = new Map<number, boolean>();

    if (cartItems !== null) {
      onCartId = JSON.parse(cartItems);
      onCartId.forEach((id) => onCartMap.set(id, true));
    }

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
    await this.getCountProductsData(categoryIdReq, title);
    if (rootStore.query.getParam("page") && this.firstLoad) {
      const page = Number(rootStore.query.getParam("page"));
      const checkProducts = this.counterProductsData / page;
      if (checkProducts >= 9) {
        this.setSelectedPage(page);
      }
    }
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
      offset = this.selectedPage * this._productsOnPage - this._productsOnPage;
    }

    try {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/products",
        {
          params: {
            title: title,
            categoryId: categoryIdReq,
            offset: offset,
            limit: this._productsOnPage,
          },
        },
      );
      const normalized = response.data.map((item: ProductsApi) =>
        normalizeProducts(item, onCartMap.has(item.id)),
      );
      this.setDataProducts(normalized);
      this.firstLoad = false;
      this._meta = Meta.success;
    } catch (e) {
      this._meta = Meta.error;
      this.setDataProducts([]);
      log(e);
    }
  };

  setDataProducts = (productsData: ProductsModel[]) => {
    this.productsData = productsData;
    this.addToCart();
  };

  getCategories = async () => {
    this._meta = Meta.loading;

    try {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/categories",
      );
      const normalizeCategoryResponse = response.data.map((item: CategoryAPI) =>
        normalizeCategory(item),
      );
      const normalized = normalizeCategoryResponse.map(
        (item: { id: { toString: () => number }; name: string }) => ({
          key: item.id.toString(),
          value: item.name,
        }),
      );
      this.setDataCategories(normalized);
    } catch (e) {
      this._meta = Meta.error;
      this.setDataCategories([]);
      log(e);
    }
  };
  setDataCategories = (categories: Option[]) => {
    this.categories = categories;
  };

  getCountProductsData = async (categoryId: string | null, title: string) => {
    const newTitle = title !== "" ? title : null;
    this._meta = Meta.loading;
    try {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/products",
        {
          params: {
            title: newTitle,
            categoryId: categoryId,
          },
        },
      );
      this._setProductsCounterData(response.data.length);
    } catch (e) {
      this._meta = Meta.error;
      this._setProductsCounterData(0);
      log(e);
    }
  };
  private _setProductsCounterData = (counterProductsData: number) => {
    this.counterProductsData = counterProductsData;
  };
  setValueOptions = (value: Option[]) => {
    this.valueUserOptions = value;
    if (!this.firstLoad) {
      this.getProducts();
    }
  };

  setValueInput = (value: string): string => {
    return (this.inputValue = value);
  };
  setSelectedPage = (selectedPage: number) => {
    this.selectedPage = selectedPage;
    if (!this.firstLoad) {
      this.getProducts();
    }
  };
  setClickInputSearchButton = () => {
    this.inputClickButton = this.inputValue;
    if (!this.firstLoad) {
      this.getProducts();
    }
  };

  addToCart = (product?: ProductsModel) => {
    if (product) {
      const cartItems = localStorage.getItem("cartItems");
      const itemsMap = new Map<number, boolean>();
      if (cartItems) {
        const parsedItems = JSON.parse(cartItems);
        parsedItems.forEach((itemId: number) => {
          itemsMap.set(itemId, true);
        });
      }
      if (itemsMap.has(product.id)) {
        itemsMap.delete(product.id);
      } else {
        itemsMap.set(product.id, true);
      }
      const itemsArray = Array.from(itemsMap.keys());
      this.setDataProducts(
        this.productsData.map((item: ProductsApi) =>
          normalizeProducts(item, itemsMap.has(item.id)),
        ),
      );

      localStorage.setItem("cartItems", JSON.stringify(itemsArray));
    }
  };

  getTitle = (elements: Option[]) =>
    elements.map((el: Option) => el.value).join();

  updateFilter = () => {};
}

export default ProductsStore;
