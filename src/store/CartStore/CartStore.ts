import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
import { normalizeProducts, ProductsApi, ProductsModel } from "../models";

type PrivateFields = "_meta";

class CartStore {
  private _meta: Meta = Meta.initial;
  data: ProductsModel[] = [];

  constructor() {
    makeObservable<CartStore, PrivateFields>(this, {
      _meta: observable,
      data: observable,
      meta: computed,
      priceSum: computed,
      emptyCart: computed,
      getCartData: action,
      setCartData: action,
      removeFromCart: action,
      clearCart: action,
    });
  }
  get meta(): Meta {
    return this._meta;
  }
  get priceSum(): number {
    return this.data.reduce((sum, item) => sum + item.price, 0);
  }
  get emptyCart(): boolean {
    return this.data.length === 0;
  }
  getCartData = async () => {
    this._meta = Meta.loading;
    try {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/products/",
      );
      const normalized = response.data.map((item: ProductsApi) =>
        normalizeProducts(item, null),
      );
      this.setCartData(normalized);
    } catch (e) {
      log(e);
    }
  };

  setCartData = (data: ProductsModel[]) => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      const itemsArray = JSON.parse(cartItems);
      this.data = data.filter((item) => itemsArray.includes(item.id));
    }
    this._meta = Meta.success;
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
    localStorage.setItem("cartItems", JSON.stringify(itemsArray));
    this.setCartData(this.data.filter((item) => item.id !== product.id));
  };
}

export default CartStore;
