import axios from 'axios'
import * as React from "react";
import {useEffect, useState} from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Text from "../../components/Text";
import {CategoryTabInterface} from "./CategoryTab.interface.ts";
import styles from './CategoryTab.module.scss'


const CategoryTab: React.FC = () => {
    const [data, setData] = useState<CategoryTabInterface[]>();
    useEffect(() => {
        const fetch = async () => {
            const result = await axios({
                method: "get",
                url: "https://api.escuelajs.co/api/v1/categories"
            })
            setData(result.data)
        }
        fetch()
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.infoContent}>
                <Text tag={"span"} color={"primary"} weight={"bold"} className={styles.infoContentTitle}>
                   Categories
                </Text>
                <Text view={"p-20"} tag={"span"} color={"secondary"} weight={"bold"}
                      className={styles.infoDescription}> On this page we display product categories
                </Text>
            </div>

            <Text view={"p-32"} tag={"span"} color={"primary"} weight={"bold"} className={styles.productsTitle}>
                Total Category
                <Text view={"p-20"} tag={"span"} color={"accent"} weight={"bold"}>{data?.length}</Text>
            </Text>


            <div className={styles.products}>
                {data?.map((item) => (
                    <div key={item.id} className={styles.divCard}>
                        <Card image={item.image} title={item.name}
                              className={styles.card}
                              actionSlot={<Button>View category</Button>}
                              onClick={() =>{alert("В разработке")}}/>
                    </div>
                ))}
            </div>
        </div>
    )

}
export default CategoryTab;