import style from './style.module.css';
import { ReactNode } from 'react';

export default function InputComRotulo({ rotulo, children }: { rotulo: string; children: ReactNode; }) {
    return (
        <div className={style.input_e_rotulo}>
            <label>
                {rotulo}
            </label>

            {children}
        </div>
    );
};