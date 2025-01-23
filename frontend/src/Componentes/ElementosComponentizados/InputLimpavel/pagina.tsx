// #region Imports
import React, { useEffect, useState, InputHTMLAttributes, ChangeEvent, useRef } from 'react';
import style from "./style.module.css";
// #endregion

interface InputLimpavelProps extends InputHTMLAttributes<HTMLInputElement> {
    id?: string;
}

const InputLimpavel: React.FC<InputLimpavelProps> = ({ id, value, ...props }) => {
    const [inputValue, setInputValue] = useState(value ?? '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);

        if (props.onChange) {
            props.onChange(event);
        }
    };

    const clearInput = () => {
        setInputValue('');

        if (props.onChange) {
            props.onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={style.wrapper_input_limpavel}>
            <div className={style.div_input}>
                <input id={id} ref={inputRef} className={style.input} onChange={handleChange} value={inputValue} {...props} />
            </div>
            <div className={style.div_botao}>
                <BotaoLimpar onClick={clearInput} />
            </div>
        </div>
    );
};

const BotaoLimpar = ({ onClick }: { onClick: () => void }) => {
    return (
        <div onClick={onClick} className="clear-button">
            <div className={style.div_botao_limpar}>
                <svg height={20} width={20} viewBox={"0 0 20 20"} className={style.svg_botao_limpar}>
                    <path d={"M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"} />
                </svg>
            </div>
        </div>
    );
}

export default InputLimpavel;