import cn from "classnames";
import * as React from 'react';
import { useState} from "react";
import Text from "../Text";
import styles from "./Tabs.module.scss"



export type TabItem = {
    id: number;
    name: string;
};

export type TabsProps = {
    className?: string,
    tabsList: TabItem[],
    onClick:  (selected: number) => void;
};



const Tabs: React.FC<TabsProps> = (props) => {
    const { tabsList, className, onClick} = props
    const [selectedTabItem, setSelectedTabItem] = useState(1)
    const selectItem = (id: number) => {
        setSelectedTabItem(id)
        onClick(id)
    }
    return <div className={cn(className, styles.tabsContainer)}>
        {tabsList.map((item) => (
            <div key={item.id} className={selectedTabItem === item.id ? styles.tabButtonActive : styles.tabButton} onClick={() => selectItem(item.id)}>
                <Text tag={"p"} weight={"medium"} view={"p-18"}>{item.name}</Text>
                <div className={selectedTabItem === item.id ? styles.lineSelectedActive : styles.lineSelected}/>
            </div>
        ))}
        </div>

};

export default Tabs;
