import React from 'react';

interface InputNumericoProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
    value: number;
    onChange: (value: number) => void;
}

export default function InputNumerico({ value, onChange, ...props }: InputNumericoProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.disabled) return;

        const newValue = e.target.valueAsNumber;
        if (!isNaN(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <input type="number" value={value} onChange={handleChange} {...props} />
    );
};