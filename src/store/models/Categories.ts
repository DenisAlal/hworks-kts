export interface CategoryAPI {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface CategoryModel {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export const normalizeCategory = (from: CategoryAPI): CategoryModel => ({
  id: from.id,
  name: from.name,
  image: from.image,
  creationAt: from.creationAt,
  updatedAt: from.updatedAt,
});
