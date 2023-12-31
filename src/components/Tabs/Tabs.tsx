import cn from "classnames";
import * as React from "react";
import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Text from "components/Text";
import { aboutPath, categoriesPath, productsPath } from "config/pathLinks.ts";
import { AppContext } from "context/App.context.tsx";
import styles from "./Tabs.module.scss";

export type TabItem = {
  id: number;
  name: string;
};

export type TabsProps = {
  className?: string;
  tabsList: TabItem[];
};

const Tabs: React.FC<TabsProps> = (props) => {
  const { tabsList, className } = props;
  const { usingTab, setUsingTab } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const usingTabLink = (id?: number) => {
    switch (location.pathname) {
      case productsPath:
        setUsingTab(1);
        break;
      case categoriesPath:
        setUsingTab(2);
        break;
      case aboutPath:
        setUsingTab(3);
        break;
    }

    switch (id) {
      case 1:
        navigate(productsPath);
        break;
      case 2:
        navigate(categoriesPath);
        break;
      case 3:
        navigate(aboutPath);
        break;
    }
  };
  useEffect(() => {
    usingTabLink();
  }, [location, usingTabLink]);

  return (
    <div className={cn(className, styles.tabsContainer)}>
      {tabsList.map((item) => (
        <div
          key={item.id}
          className={
            usingTab === item.id ? styles.tabButtonActive : styles.tabButton
          }
          onClick={() => usingTabLink(item.id)}
        >
          <Text tag={"p"} weight={"medium"} view={"p-18"}>
            {item.name}
          </Text>
          <div
            className={
              usingTab === item.id
                ? styles.lineSelectedActive
                : styles.lineSelected
            }
          />
        </div>
      ))}
    </div>
  );
};

export default Tabs;
