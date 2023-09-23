import cn from "classnames";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Tabs, { TabItem } from "components/Tabs";
import Avatar from "components/icons/AvatarIcon";
import Cart from "components/icons/CartIcon";
import Logo from "components/icons/LogoIcon";
import CartModal from "../CartModal";
import styles from "./Header.module.scss";

export type HeaderProps = {
  className?: string;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { className } = props;
  const navigate = useNavigate();
  const [openModalCart, setOpenModalCart] = React.useState(false);

  const tabs: TabItem[] = [
    {
      id: 1,
      name: "Products",
    },
    {
      id: 2,
      name: "Categories",
    },
    {
      id: 3,
      name: "About us",
    },
  ];

  return (
    <div className={cn(className, styles.header)}>
      <div className={styles.logo}>
        <div className={styles.logoButton} onClick={() => navigate("/")}>
          <Logo className={styles.logoIcon} />
        </div>
      </div>
      <Tabs tabsList={tabs} className={styles.tabs} />
      <div className={styles.buttons}>
        <div onClick={() => setOpenModalCart(!openModalCart)}>
          <Cart className={styles.menuIcons} />
        </div>
        <div onClick={() => alert("You clicked on: User")}>
          <Avatar />
        </div>
      </div>
      {openModalCart && (
        <CartModal
          className={styles.modalCart}
          setIsOpen={setOpenModalCart}
          isOpen={openModalCart}
        />
      )}
    </div>
  );
};
export default Header;
