import axios from 'axios'
import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Pagination from "../../components/Pagination";
import Text from "../../components/Text";
import {Products} from "./ProductsTab.interface.ts";
import styles from './ProductsTab.module.scss'
// import MultiDropdown from "../../components/MultiDropdown";



const ProductsTab: React.FC = () => {
    const [data, setData] = useState<Products[]>();
    const [countProducts, setCountProducts] = useState(0)
    const [findInput, setFindInput] = useState("")
    const [reloadInput, setReloadInput] = useState("")
    const [selectedPage, setSelectedPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const navigate = useNavigate();
    const productsOnPage = 9;

    useEffect(() => {
        const fetch = async () => {
            let url = `https://api.escuelajs.co/api/v1/products/`

            if (reloadInput) {
                url = url + `?title=${reloadInput}`
            }
            const result = await axios({
                method: "get",
                url: url
            })

            setCountProducts(result.data.length)
        }
        fetch()
    }, [reloadInput]);

    useEffect(() => {
        const fetch = async () => {
            let url = `https://api.escuelajs.co/api/v1/products/?limit=${productsOnPage}`
            if (selectedPage === 1) {
                url = url + `&offset=0`
            } else if (Math.floor(countProducts / productsOnPage) === 1 && countProducts > 9
                && countProducts <= 18 && selectedPage === 2) {
                url = url + `&offset=${productsOnPage}`
            } else {
                url = url + `&offset=${selectedPage * productsOnPage}`
            }

            if (reloadInput) {
                url = url + `&title=${reloadInput}`
            }

            const result = await axios({
                method: "get",
                url: url
            })
            setData(result.data)

        }
        fetch()
    }, [reloadInput, selectedPage]);

    useEffect(() => {
        if(countProducts) {
            if (Math.floor(countProducts / productsOnPage) === 0 && countProducts > 0) {
                setPageCount(1)
            } else if (Math.floor(countProducts / productsOnPage) === 1 && countProducts > 9) {
                setPageCount(2)
            } else {
                setPageCount(Math.floor(countProducts / productsOnPage) );
            }

        }
    }, [countProducts]);
    const goToPage = (id: number) => {
        navigate(`/${id}`)
    }
    const handleButtonClick = (e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
    };


    const findTitlClick = () => {
        setReloadInput(findInput)
    }

    return (

        <div className={styles.container}>
            <div className={styles.infoContent}>
                <Text tag={"span"} color={"primary"} weight={"bold"} className={styles.infoContentTitle}>
                    Products
                </Text>
                <Text view={"p-20"} tag={"span"} color={"secondary"} weight={"bold"}
                      className={styles.infoDescription}>
                    We display products based on the latest products we have, if you want
                    to see our old products please enter the name of the item
                </Text>
            </div>

            <div>
                <div className={styles.findInputBlock}>
                    <Input value={findInput} onChange={setFindInput} placeholder={"Search product"}
                           className={styles.findInput}/>
                    <Button className={styles.findButton} onClick={() => findTitlClick()}>Find now</Button>
                </div>
                {/*<MultiDropdown options={[]} value={[]} onChange={() => {}} getTitle={}/>*/}
            </div>
            <Text view={"p-32"} tag={"span"} color={"primary"} weight={"bold"} className={styles.productsTitle}>
                Total Product
                <Text view={"p-20"} tag={"span"} color={"accent"} weight={"bold"}>{countProducts}</Text>
            </Text>


            <div className={styles.products}>
                {data?.map((item) => (
                    <div key={item.id} className={styles.divCard}>
                        <Card image={item.images[0]} captionSlot={item.category.name} title={item.title}
                              subtitle={item.description}
                              contentSlot={`$${item.price}`} className={styles.card}
                              actionSlot={<Button onClick={handleButtonClick}>Add to Cart</Button>}
                              onClick={() => goToPage(item.id)}/>
                    </div>
                ))}
            </div>
            <div className={styles.paginationBlock}>
                {data &&
                    <Pagination  currentPage={selectedPage} lastPage={pageCount} maxLength={5} setCurrentPage={setSelectedPage}/>
                }
            </div>
        </div>
    )

}
export default ProductsTab;