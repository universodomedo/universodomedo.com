import React from 'react';

interface CheckboxComponentProps { onChange: (checked: boolean) => void; checked: boolean; valor: number; descricao: string; valorBuffavel:string; }

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ onChange, checked, valor, descricao, valorBuffavel }) => {
    const classDiv = checked ? "checked" : "notChecked";

    return (
        <div className={`item-inventario ${classDiv}`}>
            <p>{(valor > 0 ? `+${valor}`: `-${valor}`)}</p>
            <div className="descricao">
                <p>{descricao}</p>
                <p>{valorBuffavel}</p>
            </div>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        </div>
    );
};


export default CheckboxComponent;