import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
import { CategoryAPI, CategoryModel, normalizeCategory } from "../models";

type PrivateFields = "_meta";
class CategoryStore {
  data: CategoryModel[] = [];
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
    try {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/categories",
      );
      const normalized = response.data.map((item: CategoryAPI) =>
        normalizeCategory(item),
      );
      this.setCategoryData(normalized);
    } catch (e) {
      log(e);
    }
  };

  setCategoryData = (data: CategoryModel[]) => {
    this.data = data;
  };
}

export default CategoryStore;
