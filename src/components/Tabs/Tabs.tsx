import cn from "classnames";
import * as React from 'react';
import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../context/App.context.tsx";
import Text from "../Text";
import styles from "./Tabs.module.scss"

export type TabItem = {
    id: number;
    name: string;
};

export type TabsProps = {
    className?: string,
    tabsList: TabItem[],
};

const Tabs: React.FC<TabsProps> = (props) => {
    const {tabsList, className} = props
    const {usingTab, setUsingTab} = useContext(AppContext)
    const navigate = useNavigate();
    const usingTabLink = (id?: number) => {
        if (id) {
            setUsingTab(id);
        }
        switch (id) {
            case 1:
                navigate('/')
                break;
            case 2:
                navigate('/categories')
                break;
            case 3:
                navigate('/about')
                break;
        }
    }
    useEffect(() => {
        usingTabLink()
    }, []);

    return <div className={cn(className, styles.tabsContainer)}>
        {tabsList.map((item) => (
            <div key={item.id} className={usingTab === item.id ? styles.tabButtonActive : styles.tabButton}
                 onClick={() => usingTabLink(item.id)}>
                <Text tag={"p"} weight={"medium"} view={"p-18"}>{item.name}</Text>
                <div className={usingTab === item.id ? styles.lineSelectedActive : styles.lineSelected}/>
            </div>
        ))}
    </div>

};

export default Tabs;