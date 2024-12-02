// #region Imports
import style from './style.module.css';
import { ReactNode } from 'react';
// #endregion

const InputComRotulo = ({ rotulo, children }: { rotulo: string; children: ReactNode; }) => {
    return (
        <div className={style.input_e_rotulo}>
            <label>
                {rotulo}
            </label>

            {children}
        </div>
    );
};

export default InputComRotulo;