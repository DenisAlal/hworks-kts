import cn from 'classnames'
import * as React from 'react';
import Loader from "../Loader";
import styles from "./Button.module.scss"


export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({children, className, loading, ...props}) => {
    let disabled = props.disabled
    const disabledStyle = props.disabled
    if (loading) {
        disabled = true
    }

    return (
        <button
            className={cn(styles.button, className, {
                [styles.button_disabled]: disabledStyle,
            })}
            data-testid="button"
            disabled={disabled}
            onClick={props.onClick}
            onMouseOver={props.onMouseOver}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onMouseOut={props.onMouseOut}
            id={props.id}
            name={props.name}
            style={props.style}
        >
            {loading && <Loader size={"s"} className={styles.loader}/>}
            {children}
        </button>)

};

export default Button;
