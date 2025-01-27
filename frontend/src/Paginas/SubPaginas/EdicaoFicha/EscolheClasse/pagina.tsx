// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { GanhoIndividualNexEscolhaClasse } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';
// #endregion

const page = () => {
    const { ganhosNex, triggerSetState } = useContextoNexUp();
    const [classeSelecionada, setClasseSelecionada] = useState(0);

    const ganhoClasse = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexEscolhaClasse)!;

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClasseSelecionada(Number(event.target.value));
    };

    useEffect(() => {
        ganhoClasse.setIdEscolhido(classeSelecionada);
        triggerSetState();
    }, [classeSelecionada]);

    return (
        <div>
            <h2>Seleção de Classe</h2>
            <select id="selectNex" value={classeSelecionada} onChange={handleSelectChange}>
                <option value="0" disabled >Selecionar Classe</option>
                {SingletonHelper.getInstance().classes.filter(classe => classe.id !== 1).map(classe => (<option key={classe.id} value={classe.id}> {classe.nome} </option>))}
            </select>
        </div>
    );
}

export default page;