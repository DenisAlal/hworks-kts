import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { CategoryTabInterface } from "interfaces/CategoryTab.interface.ts";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";

type PrivateFields = "_meta";
class CategoryStore {
  data: CategoryTabInterface[] = [];
  private _meta: Meta = Meta.initial;
  constructor() {
    makeObservable<CategoryStore, PrivateFields>(this, {
      _meta: observable,
      data: observable,
      meta: computed,
      setCategoryData: action,
      getCategoryData: action,
    });
  }
  get meta(): Meta {
    return this._meta;
  }
  getCategoryData = async () => {
    axios
      .get("https://api.escuelajs.co/api/v1/categories")
      .then((response) => {
        this.setCategoryData(response.data);
      })
      .catch((error) => {
        log(error);
      });
  };

  setCategoryData = (data: CategoryTabInterface[]) => {
    this.data = data;
  };
}

export default new CategoryStore();
