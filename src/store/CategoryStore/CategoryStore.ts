import axios from "axios";
import { action, makeObservable, observable } from "mobx";
import { CategoryTabInterface } from "interfaces/CategoryTab.interface.ts";

class CategoryStore {
  data: CategoryTabInterface[] = [];

  constructor() {
    makeObservable(this, {
      data: observable,
      setCategoryData: action,
      getCategoryData: action,
    });
  }

  getCategoryData = async () => {
    const response = await axios.get(
      "https://api.escuelajs.co/api/v1/categories",
    );
    this.setCategoryData(response.data);
  };

  setCategoryData = (data: CategoryTabInterface[]) => {
    this.data = data;
  };
}

export default new CategoryStore();
