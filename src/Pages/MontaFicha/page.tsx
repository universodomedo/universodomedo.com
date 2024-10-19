// #region Imports
import style from './style.module.css';
import { useState, useEffect } from 'react';
import { Personagem } from 'Types/classes2.tsx';
// #endregion

const MontaFicha: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState<string>('');

    useEffect(() => {
        const personagem = new Personagem();

        personagem.detalhes.classe = 'Classe2';
        personagem.detalhes.nome = 'Nome2';
        personagem.detalhes.nex = 5;

        setTextAreaValue(personagem.exportar());
    }, [])

    return (
        <div className={style.pagina}>
            <textarea id='textarea' value={textAreaValue} readOnly></textarea>
        </div>
    );
};

export default MontaFicha;