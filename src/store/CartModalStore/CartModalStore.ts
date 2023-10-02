import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
import { normalizeProducts, ProductsApi, ProductsModel } from "../models";

type PrivateFields = "_meta";

class CartModalStore {
  private _meta: Meta = Meta.initial;
  data: ProductsModel[] = [];

  constructor() {
    makeObservable<CartModalStore, PrivateFields>(this, {
      _meta: observable,
      data: observable,
      meta: computed,
      emptyCart: computed,
      getModalCartData: action,
      setModalCartData: action,
    });
  }
  get meta(): Meta {
    return this._meta;
  }
  get emptyCart(): boolean {
    return this.data.length === 0;
  }
  getModalCartData = async () => {
    this._meta = Meta.loading;
    try {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/products/",
      );
      const normalized = response.data.map((item: ProductsApi) =>
        normalizeProducts(item, null),
      );
      this.setModalCartData(normalized);
    } catch (e) {
      log(e);
    }
  };

  setModalCartData = (data: ProductsModel[]) => {
    const cartModalItems = localStorage.getItem("cartItems");
    if (cartModalItems) {
      const itemsArray = JSON.parse(cartModalItems);
      this.data = data.filter((item) => itemsArray.includes(item.id));
    }
    this._meta = Meta.success;
  };
}

export default CartModalStore;
