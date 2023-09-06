import * as React from 'react'

export type TextProps = {
    /** Дополнительный класс */
    className?: string;
    /** Стиль отображения */
    view?: 'title' | 'button' |'p-32' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
    /** Html-тег */
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
    /** Начертание шрифта */
    weight?: 'normal' | 'medium' | 'bold';
    /** Контент */
    children: React.ReactNode;
    /** Цвет */
    color?: 'primary' | 'secondary' | 'accent';
    /** Максимальное кол-во строк */
    maxLines?: number;
};
const primaryColor = "#000000"
const secondaryColor = "#AFADB5"
const accentColor = "#518581"
const Text: React.FC<TextProps> = ({
                                       className,
                                       view,
                                       tag = 'p',
                                       weight,
                                       children,
                                       color,
                                       maxLines,
                                   }) => {

    const styles: React.CSSProperties = {};
    if (view) {
        switch (view) {
            case "button":
                styles.fontSize = 18;
                break;
            case "title":
                styles.fontSize = 44;
                break;
            case "p-32":
                styles.fontSize = 32;
                break;
            case "p-20":
                styles.fontSize = 20;
                break;
            case "p-18":
                styles.fontSize = 18;
                break;
            case "p-16":
                styles.fontSize = 16;
                break;
            case "p-14":
                styles.fontSize = 14;
                break;
        }
    }

    if (weight) {
        styles.fontWeight = weight;
    }
    if (color) {
        switch (color) {
            case "primary":
                styles.color = primaryColor;
                break;
            case "secondary":
                styles.color = secondaryColor;
                break;
            case "accent":
                styles.color = accentColor;
                break;
        }
    }
    if (maxLines) {
        styles.WebkitLineClamp = maxLines;
        styles.overflow = "hidden"
        styles.WebkitBoxOrient = "vertical"
        styles.display = "-webkit-box"
    }

    const TextComponent = tag || 'p';
    return (
        <TextComponent className={className} style={styles}>
            {children}
        </TextComponent>)
};

export default Text;
