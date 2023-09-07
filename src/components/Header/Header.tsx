import cn from "classnames";
import *  as React from 'react'
import {useContext, useState} from "react";
import Tabs, {TabItem} from "components/Tabs";
import Avatar from "../icons/AvatarIcon";
import Cart from "../icons/CartIcon";
import Logo from "../icons/LogoIcon";
import styles from './Header.module.scss'
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../context/App.context.tsx";


export type HeaderProps = {
    className?: string;
};

const Header: React.FC<HeaderProps> =
    (props) => {
        const {usingTab} = useContext(AppContext)
        const {className} = props
        const navigate = useNavigate();
        const tabs: TabItem[] = [{
            id: 1,
            name: "Products",
        }, {
            id: 2,
            name: "Categories",
        }, {
            id: 3,
            name: "About us",
        }];

        return (
            <div className={cn(className, styles.header)}>
                <div className={styles.logo}>
                    <div className={styles.logoButton} onClick={() => navigate("/")}>
                        <Logo className={styles.logoIcon} />
                    </div>
                </div>
                <Tabs tabsList={tabs} className={styles.tabs}/>
                <div className={styles.buttons}>
                    <div onClick={() => alert("You clicked on: Cart")}>
                        <Cart className={styles.menuIcons}/>
                    </div>
                    <div onClick={() => alert("You clicked on: User")}>
                        <Avatar/>
                    </div>
                </div>
            </div>
        );
    };
export default Header;
