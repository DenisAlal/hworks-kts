import cn from "classnames";
import *  as React from 'react'
import Avatar from "../icons/AvatarIcon";
import Cart from "../icons/CartIcon";
import Logo from "../icons/LogoIcon";
import styles from './Header.module.scss'
import Text from "../Text";

export type HeaderProps = {
    className?: string;
    color?: 'primary' | 'secondary' | 'accent';
};

const Header: React.FC<HeaderProps> =
    (props) => {
        const {color, className} = props

        return (
            <div className={cn(className, styles.header)}>
                <div className={styles.logo}><Logo className={styles.logoIcon}/></div>
                <div className={styles.tabs}>
                    <div className={styles.tabsContainer}>
                        <a>
                            <Text tag={"p"} weight={"medium"} view={"p-18"} color={"primary"}>Products</Text>
                        </a>
                        <a>
                            <Text tag={"p"} weight={"medium"} view={"p-18"} color={"primary"}>Categories</Text>
                        </a>
                        <a>
                            <Text tag={"p"} weight={"medium"} view={"p-18"} color={"primary"}>About us</Text>
                        </a>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Cart className={styles.menuIcons}/>
                    <Avatar/>
                </div>
            </div>
        );
    };
export default Header;
