import cn from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserModalStore from "store/UserModalStore";
import { Meta } from "utils/Meta.ts";
import { useLocalStore } from "utils/useLocalStore.ts";
import Button from "../Button";
import Input from "../Input";
import Loader from "../Loader";
import Text from "../Text";
import CloseIcon from "../icons/CloseIcon";
import SettingsIcon from "../icons/SettingsIcon";
import styles from "./UserModal.module.scss";

export type ModalProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const UserModal: React.FC<ModalProps> = observer(
  ({ className, setIsOpen, isOpen }) => {
    const store = useLocalStore(() => new UserModalStore());
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");

    const handleLoginClick = useCallback(() => {
      store.login();
    }, []);

    const handleRegistrationClick = useCallback(() => {
      store.registration();
    }, []);

    const handleLogoutClick = useCallback(() => {
      store.logout();
    }, []);

    const handleGoProfileClick = useCallback(() => {
      navigate("/profile");
      setIsOpen(!isOpen);
    }, []);

    useEffect(() => {
      if (store.checkJWT() !== "") {
        store.getProfileData();
      }
    }, []);

    useEffect(() => {
      store.checkJWT();
    }, [store.profileData]);

    return (
      <div className={cn(className, styles.UserModal)}>
        <div className={styles.titleUserBlock}>
          <Text
            tag={"div"}
            weight={"bold"}
            view={"title"}
            className={styles.cartTitle}
          >
            Account
          </Text>
          <div className={styles.closeButton}>
            <CloseIcon onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>

        <div className={styles.divider} />
        {store.meta === Meta.loading ? (
          <div className={styles.loader}>
            <Loader size={"l"} className={styles.loading} />
          </div>
        ) : (
          <div>
            {store.jwtState === "" ? (
              <div className={styles.authContent}>
                <div className={styles.buttonsBlock}>
                  <Button
                    className={cn(styles.buttonsModal, {
                      [styles.activeButtonModal]: activeTab === "login",
                    })}
                    onClick={() => setActiveTab("login")}
                  >
                    Login
                  </Button>
                  <Button
                    className={cn(styles.buttonsModal, {
                      [styles.activeButtonModal]: activeTab === "register",
                    })}
                    onClick={() => setActiveTab("register")}
                  >
                    Registration
                  </Button>
                </div>
                {activeTab === "login" ? (
                  <div className={styles.authBlock}>
                    <AnimatePresence>
                      {store.errorMessage !== "" && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          style={{ overflow: "hidden" }}
                        >
                          <Text className={styles.errorBlock}>
                            {store.errorMessage}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={styles.inputs}>
                      <Input
                        value={store.authEmail}
                        onChange={store.setDataLogin}
                        placeholder={"Enter email"}
                      />
                    </div>
                    <div className={styles.inputs}>
                      <Input
                        value={store.authPass}
                        onChange={store.setDataPassword}
                        placeholder={"Enter password"}
                        type={"password"}
                      />
                    </div>
                    <div className={styles.buttonContainer}>
                      <Button
                        className={styles.buttonAuth}
                        onClick={handleLoginClick}
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.authBlock}>
                    <AnimatePresence>
                      {store.errorMessage !== "" && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          style={{ overflow: "hidden" }}
                        >
                          <Text className={styles.errorBlock}>
                            {store.errorMessage}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {store.successMessage !== "" && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          style={{ overflow: "hidden" }}
                        >
                          <Text
                            className={cn(
                              styles.errorBlock,
                              styles.successBlock,
                            )}
                          >
                            {store.successMessage}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className={styles.inputs}>
                      <Input
                        value={store.registerLogin}
                        onChange={store.setDataLoginRegister}
                        placeholder={"Enter login"}
                      />
                    </div>
                    <div className={styles.inputs}>
                      <Input
                        value={store.registerEmail}
                        onChange={store.setDataEmail}
                        placeholder={"Enter e-mail"}
                        type={"email"}
                      />
                    </div>
                    <div className={styles.inputs}>
                      <Input
                        value={store.registerPass}
                        onChange={store.setDataPasswordRegister}
                        placeholder={"Enter password"}
                        type={"password"}
                      />
                    </div>
                    <div className={styles.inputs}>
                      <Input
                        value={store.registerConfirmPass}
                        onChange={store.setDataConfirmPasswordRegister}
                        placeholder={"Confirm password"}
                        type={"password"}
                      />
                    </div>
                    <div className={styles.buttonContainer}>
                      <Button
                        className={styles.buttonAuth}
                        onClick={handleRegistrationClick}
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.profileBlock}>
                {store.profileData?.avatar && (
                  <img src={store.profileData.avatar} alt="avatar" />
                )}

                <div className={styles.profileName}>
                  <Text tag={"h1"} weight={"bold"} view={"p-20"}>
                    {store.profileData?.name}
                  </Text>
                  <div className={styles.buttons}>
                    <Button onClick={handleGoProfileClick}>
                      <SettingsIcon />
                    </Button>
                    <Button onClick={handleLogoutClick}>Logout</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

export default UserModal;
