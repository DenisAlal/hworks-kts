import cn from "classnames";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Tabs, { TabItem } from "components/Tabs";
import Avatar from "components/icons/AvatarIcon";
import Cart from "components/icons/CartIcon";
import Logo from "components/icons/LogoIcon";
import { useQueryParamsStoreInit } from "store/RootStore/hooks/useQueryParamsStoreInit.ts";
import CartModal from "../CartModal";
import UserModal from "../UserModal";
import styles from "./Header.module.scss";

export type HeaderProps = {
  className?: string;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { className } = props;
  const navigate = useNavigate();
  const [openModalCart, setOpenModalCart] = React.useState(false);
  const [openUserModal, setOpenUserModal] = React.useState(false);
  useQueryParamsStoreInit();
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
        <div onClick={() => setOpenUserModal(!openUserModal)}>
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
      {openUserModal && (
        <UserModal
          className={styles.modalCart}
          setIsOpen={setOpenUserModal}
          isOpen={openUserModal}
        />
      )}
    </div>
  );
};
export default Header;
