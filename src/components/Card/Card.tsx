import cn from "classnames";
import * as React from 'react';
import Text from "../Text";
import styles from "./Card.module.scss"


export type CardProps = {
    /** Дополнительный classname */
    className?: string,
    /** URL изображения */
    image: string;
    /** Слот над заголовком */
    captionSlot?: React.ReactNode;
    /** Заголовок карточки */
    title: React.ReactNode;
    /** Описание карточки */
    subtitle?: React.ReactNode;
    /** Содержимое карточки (футер/боковая часть), может быть пустым */
    contentSlot?: React.ReactNode;
    /** Клик на карточку */
    onClick?: React.MouseEventHandler;
    /** Слот для действия */
    actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = (props) => {
    return <div onClick={props.onClick} className={cn(props.className, styles.main)}>
        <div>
            <img
                src={props.image}
                alt="cardImage"
            />
            <div className={styles.body}>
                {props.captionSlot && <p className={styles.captionSlot}>{props.captionSlot}</p>}
                <Text tag={"h1"} view={"p-20"} color={"primary"} maxLines={2} className={styles.title} weight={"bold"}>{props.title}</Text>
                {props.subtitle &&
                    <Text tag={"h2"} view={"p-16"} color={"secondary"} maxLines={2} weight={"normal"}
                          className={styles.subtitle}>{props.subtitle}
                    </Text>}
                <div className={styles.footer}>
                    <p className={styles.contentSlot}>{props.contentSlot}</p>
                    <div className={styles.actionSlot}>{props.actionSlot}</div>
                </div>
            </div>
        </div>

    </div>

};

export default Card;
