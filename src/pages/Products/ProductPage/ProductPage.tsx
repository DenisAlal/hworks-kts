import axios from 'axios'
import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import Text from "components/Text";
import ArrowLeftIcon from "../../../components/icons/ArrowLeftIcon";
import {Product} from "./ProductPage.interface.ts";
import styles from './ProductPage.module.scss'


const ProductPage: React.FC = () => {
    const [data, setData] = useState<Product>();
    const {id} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const fetch = async () => {
            const result = await axios({
                method: "get",
                url: `https://api.escuelajs.co/api/v1/products/${id}`
            })
            setData(result.data)
        }
        fetch()
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.backBlock} onClick={() => navigate("/")}>
                <ArrowLeftIcon height={32} width={32}/>
                <Text tag={"div"} view={"p-20"} color={"primary"}>Назад</Text>

            </div>
            <div className={styles.mainBlock}>
                <div className={styles.mainContent}>
                    <div className={styles.imageScroll}>
                        <img src={data?.images[0]} alt="image"/>
                    </div>
                    <div className={styles.productContent}>

                    </div>
                </div>

                <div className={styles.relatedItemsBlock}>

                </div>
            </div>
        </div>
    )

}
export default ProductPage;