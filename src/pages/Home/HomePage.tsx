import axios from 'axios'
import * as React from "react";
import {useEffect, useState} from "react";

import Card from "components/Card";
import Header from "components/Header";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Text from "../../components/Text";
import {Products} from "./Home.interface.ts";
import styles from './Home.module.scss'
import MultiDropdown from "../../components/MultiDropdown";


const HomePage: React.FC = () => {
    const [myData, setMyData] = useState<Products[]>();
    const [findInput, setFindInput] = useState("")
    // const [myData, setMyData] = useState([])
    useEffect(() => {
        const fetch = async () => {
            const result = await axios({
                method: "get",
                url: "https://api.escuelajs.co/api/v1/products"
            })
            setMyData(result.data)
        }
        fetch()

    }, []);
    useEffect(() => {
        console.log(myData?.map((item) => item))
    }, [myData]);
    return (
        <>
            <Header/>

            <div className={styles.container}>
                <div className={styles.infoContent}>
                    <Text tag={"span"} color={"primary"} weight={"bold"} className={styles.infoContentTitle}>
                        Products
                    </Text>
                    <Text view={"p-20"} tag={"span"} color={"secondary"} weight={"bold"} maxLines={2}
                          className={styles.infoDescription}>
                        We display products based on the latest products we have, if you want
                        to see our old products please enter the name of the item
                    </Text>
                </div>
                <div>
                    <div className={styles.findInputBlock}>
                        <Input value={findInput} onChange={setFindInput} placeholder={"Search product"}
                               className={styles.findInput}/>
                        <Button className={styles.findButton}>Find now</Button>
                    </div>
                    {/*<MultiDropdown options={[]} value={[]} onChange={() => {}} getTitle={}/>*/}
                </div>
                <Text view={"p-32"} tag={"span"} color={"primary"} weight={"bold"} className={styles.productsTitle}>
                    Total Product
                    <Text view={"p-20"} tag={"span"} color={"accent"} weight={"bold"}>{myData?.length}</Text>
                </Text>


                <div className={styles.products}>
                    {myData?.map((item) => (
                        <div key={item.id} className={styles.divCard}>
                            <Card image={item.images[0]} captionSlot={item.category.name} title={item.title}
                                  subtitle={item.description}
                                  contentSlot={`$${item.price}`} className={styles.card}
                                  actionSlot={<Button>Add to Cart</Button>}/>
                        </div>
                    ))}
                </div>
            </div>
        </>

    )

}
export default HomePage;