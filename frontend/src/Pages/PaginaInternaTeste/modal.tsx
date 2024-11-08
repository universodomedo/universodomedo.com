// #region Imports
import style from './style.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const page = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [nexSelecionado, setNexSelecionado] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNexSelecionado(event.target.value);
    };

    const criaNovaFichaComNexEspecifico = () => {
        navigate('/edita-ficha', { state: { idNivel: nexSelecionado, nome: inputValue } });
    }

    return (
        <div className={style.modal_criacao_ficha}>
            <h1>Nivel da Ficha</h1>
            <input type='text' placeholder='Nome do Personagem' value={inputValue} onChange={handleInputChange} autoFocus />
            <select id="selectNex" value={nexSelecionado} onChange={handleSelectChange}>
                <option value="" disabled >Selecionar NEX</option>
                {SingletonHelper.getInstance().niveis.filter(nivel => nivel.id <= 3).map(nivel => (<option key={nivel.id} value={nivel.id}> {nivel.nomeDisplay} </option>))}
            </select>
            <button onClick={criaNovaFichaComNexEspecifico} disabled={!inputValue || !nexSelecionado}>Confirmar</button>
        </div>
    );
}

export default page;