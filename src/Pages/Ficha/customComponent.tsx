import React from 'react';

interface CheckboxComponentProps { onChange: (checked: boolean) => void; checked: boolean; }

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ onChange, checked }) => {
    const classDiv = (checked ? "checked" : "notChecked");

    return (
        <div className={`item-inventario ${classDiv}`}>
            <p>+2 LUTA</p>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        </div>
    );
};

export default CheckboxComponent;