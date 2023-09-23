import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
import { normalizeProducts, ProductsApi, ProductsModel } from "../models";

type PrivateFields = "_meta";

class CartModalStore {
  private _meta: Meta = Meta.initial;
  data: ProductsModel[] = [];
  itemsArrayList: number[] = [];
  priceSum = 0;
  emptyCart: boolean = false;

  constructor() {
    makeObservable<CartModalStore, PrivateFields>(this, {
      _meta: observable,
      data: observable,
      itemsArrayList: observable,
      priceSum: observable,
      emptyCart: observable,
      meta: computed,
      getCartData: action,
      setCartData: action,
      removeFromCart: action,
      cartSum: action,
      clearCart: action,
      setPriceSum: action,
    });
  }

  get meta(): Meta {
    return this._meta;
  }

  getCartData = async () => {
    this._meta = Meta.loading;
    axios
      .get("https://api.escuelajs.co/api/v1/products/")
      .then((response) => {
        this.setCartData(
          response.data.map((item: ProductsApi) => normalizeProducts(item)),
        );
      })
      .catch(log);
  };

  setCartData = (data: ProductsModel[]) => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      const itemsArray = JSON.parse(cartItems);
      this.data = data.filter((item) => itemsArray.includes(item.id));
    }
    this.emptyCart = this.data.length === 0;
    this.cartSum();
  };
  cartSum = () => {
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      sum = sum + this.data[i].price;
    }
    this.setPriceSum(sum);
  };
  setPriceSum = (sum: number) => {
    this.priceSum = sum;
    setTimeout(() => (this._meta = Meta.success), 500);
  };
  clearCart = () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
    this.getCartData();
  };

  removeFromCart = (product: ProductsModel) => {
    const cartItems = localStorage.getItem("cartItems");
    let itemsArray = [];
    if (cartItems) {
      itemsArray = JSON.parse(cartItems);
      if (itemsArray.indexOf(product.id) !== -1) {
        itemsArray.splice(itemsArray.indexOf(product.id), 1);
      }
    }
    this.itemsArrayList = itemsArray;
    localStorage.setItem("cartItems", JSON.stringify(itemsArray));
    this.getCartData();
  };
}

export default CartModalStore;
