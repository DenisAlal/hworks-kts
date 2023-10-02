import { CategoryAPI, CategoryModel } from "./Categories.ts";

export interface ProductsApi {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  creationAt: Date;
  updatedAt: Date;
  category: CategoryAPI;
}
export interface ProductsModel {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  creationAt: Date;
  updatedAt: Date;
  category: CategoryModel;
  onCart: boolean;
}
export const normalizeProducts = (
  from: ProductsApi,
  cartIds?: boolean | null,
): ProductsModel => ({
  id: from.id,
  title: from.title,
  price: from.price,
  description: from.description,
  images: from.images,
  creationAt: from.creationAt,
  updatedAt: from.updatedAt,
  category: from.category,
  onCart: cartIds ? cartIds : false,
});
