import axios from "axios";
import {action, computed, makeObservable, observable} from "mobx";
import {Meta} from "utils/Meta.ts";
import {log} from "utils/log.ts";
import {normalizeProducts, ProductsApi, ProductsModel} from "../models";

type PrivateFields = "_meta";

class ProductStore {
    productData: ProductsModel | undefined;
    relativeProductsData: ProductsModel[] = [];
    imageCounter: number = 0;
    private _meta: Meta = Meta.initial;

    constructor() {
        makeObservable<ProductStore, PrivateFields>(this, {
            _meta: observable,
            productData: observable,
            relativeProductsData: observable,
            imageCounter: observable,
            meta: computed,
            setProductData: action,
            setRelativeProductsData: action,
            getProductData: action,
            getRelativeProductsData: action,
            addToCart: action,
            nextImage: action,
            prevImage: action,
        });
    }

    get meta(): Meta {
        return this._meta;
    }

    getProductData = async (id: string | undefined) => {
        this._meta = Meta.loading;
        await axios
            .get(`https://api.escuelajs.co/api/v1/products/${id}`)
            .then((response) => {
                this.setProductData(normalizeProducts(response.data, null));
            })
            .catch(log);
    };
    getRelativeProductsData = async (
        id: string | undefined,
        idCategory: number | undefined,
    ) => {
        this._meta = Meta.loading;
        try {
            const response = await axios.get("https://api.escuelajs.co/api/v1/products/", {
                params: {
                    categoryId: idCategory,
                },
            });
            const normalized = response.data.map((item: ProductsApi) =>
                normalizeProducts(item, null),
            );
            if (id) {
                const updatedData = normalized.filter(
                    (item: ProductsModel) => item.id !== Number(id),
                );
                const randomItems: ProductsModel[] = this.getRandomItems(
                    updatedData,
                    updatedData.length,
                );
                this.setRelativeProductsData(randomItems);
            } else {
                this.setRelativeProductsData(normalized);
            }
            this._meta = Meta.success;
        } catch (e) {
            log(e);
        }
    };

    getRandomItems = (data: ProductsModel[], count: number): ProductsModel[] => {
        const randomItems: ProductsModel[] = [];
        const dataCopy = [...data];
        let newCount = count
        if (count > 3) {
            newCount = 3
        }
        for (let i = 0; i < newCount; i++) {
            const randomIndex = Math.floor(Math.random() * dataCopy.length);
            const randomItem = dataCopy.splice(randomIndex, 1)[0];
            randomItems.push(randomItem);
        }
        return randomItems;
    };

    addToCart = (id: ProductsModel) => {
        alert(`Товар с id: ${id.id} добавлен в корзину`);
    };
    setProductData = (productData: ProductsModel) => {
        this.productData = productData;
        this.getRelativeProductsData(
            String(this.productData.id),
            this.productData.category.id,
        );
    };
    nextImage = () => {
        if (this.productData) {
            this.imageCounter =
                this.imageCounter === this.productData.images.length - 1
                    ? 0
                    : this.imageCounter + 1;
        }
    };
    prevImage = () => {
        if (this.productData) {
            this.imageCounter =
                this.imageCounter === 0
                    ? this.productData.images.length - 1
                    : this.imageCounter - 1;
        }
    };
    setRelativeProductsData = (relativeProductsData: ProductsModel[]) => {
        this.relativeProductsData = relativeProductsData;
    };
}

export default ProductStore;
