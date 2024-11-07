// #region Imports
import style from './style.module.css';

import { useEffect, useState } from 'react';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { GanhoIndividualNexEscolhaClasse } from 'Types/classes/index.ts';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();
    const [classeSelecionada, setClasseSelecionada] = useState(0);

    const ganhoClasse = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexEscolhaClasse)!;

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClasseSelecionada(Number(event.target.value));
    };

    useEffect(() => {
        ganhoClasse.setIdEscolhido(classeSelecionada);
        atualizarFicha();
    }, [classeSelecionada]);

    return (
        <div>
            <select id="selectNex" value={classeSelecionada} onChange={handleSelectChange}>
                <option value="0" disabled >Selecionar Classe</option>
                {SingletonHelper.getInstance().classes.filter(classe => classe.id !== 1).map(classe => (<option key={classe.id} value={classe.id}> {classe.nome} </option>))}
            </select>
        </div>
    );
}

export default page;