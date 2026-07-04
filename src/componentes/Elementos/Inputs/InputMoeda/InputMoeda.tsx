import React from 'react';

interface InputMoedaProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
    valorCentavos: number;
    onChange: (valorCentavos: number) => void;
}

// Campo de moeda com máscara: exibe "R$ 1.234,56" e devolve o valor em CENTAVOS. Os dígitos digitados preenchem da direita (centavos primeiro), como um caixa de banco.
export default function InputMoeda({ valorCentavos, onChange, ...props }: InputMoedaProps) {
    const display = (valorCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.disabled) return;
        const digitos = e.target.value.replace(/\D/g, '');
        onChange(digitos.length > 0 ? parseInt(digitos, 10) : 0);
    };

    return <input type="text" inputMode="numeric" value={display} onChange={handleChange} {...props} />;
};