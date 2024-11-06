// #region Imports
import style from './style.module.css';
import { useState } from 'react';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const page = () => {
    const [classeSelecionada, setClasseSelecionada] = useState('');
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClasseSelecionada(event.target.value);
    };

    return (
        <div>
            <select id="selectNex" value={classeSelecionada} onChange={handleSelectChange}>
                <option value="" disabled >Selecionar Classe</option>
                {SingletonHelper.getInstance().classes.filter(classe => classe.id !== 1).map(classe => (<option key={classe.id} value={classe.id}> {classe.nome} </option>))}
            </select>
        </div>
    );
}

export default page;