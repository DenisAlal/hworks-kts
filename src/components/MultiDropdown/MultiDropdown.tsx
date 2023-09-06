import cn from "classnames";
import * as React from 'react'
import {useEffect, useRef, useState} from 'react';
import Input from "../Input";
import Text from "../Text";
import ArrowDownIcon from "../icons/ArrowDownIcon";

import styles from "./MultiDropdown.module.scss"


export type Option = {
    /** Ключ варианта, используется для отправки на бек/использования в коде */
    key: string;
    /** Значение варианта, отображается пользователю */
    value: string;
};

// Пропсы, которые принимает компонент Dropdown
export type MultiDropdownProps = {
    className?: string;
    // Массив возможных вариантов для выбора
    options: Option[];
    // Текущие выбранные значения поля, может быть пустым
    value: Option[];
    // Callback, вызываемый при выборе варианта
    onChange: (value: Option[]) => void;
    // Заблокирован ли дропдаун
    disabled?: boolean;
    // Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder.
    getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
                                                         className,
                                                         options,
                                                         value,
                                                         onChange,
                                                         disabled,
                                                         getTitle,
                                                     }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        const filteredOptions = options.filter((option) => {
            const optionValue = option.value.toLowerCase();
            const inputValue = value.toLowerCase();
            for (let i = 0; i < Math.min(optionValue.length, inputValue.length); i++) {
                if (optionValue[i] !== inputValue[i]) {
                    return false;
                }
            }
            return true;
        });
        setFilteredOptions(filteredOptions);
    };

    useEffect(() => {
        const filteredOptions = options.filter((option) => {
            const optionValue = option.value.toLowerCase();
            const tempInputValue = inputValue.toLowerCase();
            for (let i = 0; i < Math.min(tempInputValue.length, tempInputValue.length); i++) {
                if (optionValue[i] !== tempInputValue[i]) {
                    return false;
                }
            }
            return true;
        });
        setFilteredOptions(filteredOptions);
    }, [options, inputValue]);

    const handleOptionClick = (option: Option) => {
        setInputValue("")
        const optionIndex = value.findIndex((val) => val.key === option.key);
        if (optionIndex !== -1) {
            const updatedValue = value.filter((val) => val.key !== option.key);
            onChange(updatedValue);
        } else {
            const updatedValue = [...value, option];
            onChange(updatedValue);
        }
    };

    const openOptionBlock = () => {
        if (!disabled) {
            setIsOpen(!isOpen)
        }
    }

    const findOptionByKey = (key: string): boolean => {
        const foundOption = value.find(option => option.key === key);
        return !!foundOption;
    }
    return (
        <div className={cn(className, styles.dropdown)} ref={dropdownRef}>
            <Input
                value={!isOpen && value.length !== 0 ? getTitle(value) : inputValue}
                onChange={handleInputChange}
                disabled={disabled}
                onClick={() => setIsOpen(true)}
                placeholder={getTitle(value)}
                afterSlot={<div style={{height: "24px"}} onClick={() => openOptionBlock()}><ArrowDownIcon/></div>}
            />
            {isOpen && !disabled && (
                <div className={styles.optionsBlock}>
                    {filteredOptions.map((option) => (
                        <div key={option.key} className={styles.option}>
                            <div key={option.key} onClick={() => handleOptionClick(option)}>
                                <Text weight={"normal"} tag={"p"} view={"p-16"} className={cn(styles.itemOption, {
                                    [styles.checkedOption]: findOptionByKey(option.key)
                                })}>
                                    {option.value}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiDropdown;
