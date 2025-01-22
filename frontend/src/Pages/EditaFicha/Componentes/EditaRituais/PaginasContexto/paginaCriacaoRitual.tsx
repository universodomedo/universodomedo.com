// #region Imports
import style from '../style.module.css';
import { useState } from 'react';

import { GanhoIndividualNexRitual, Ritual } from 'Types/classes/index.ts';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { useContextoCriaRitual } from '../contexto.tsx';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const pagina = () => {
    const { opcoesNivelRitual } = useContextoCriaRitual();

    const [idElementoSelecionado, setIdElementoSelecionado] = useState(0);
    const handleSelectChangeElemento = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdElementoSelecionado(Number(event.target.value));
    };

    const [idNivelSelecionado, setIdNivelSelecionado] = useState(0);
    const handleSelectChangeNivel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdNivelSelecionado(Number(event.target.value));
    };

    return (
        <>
            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Elemento do Ritual'}>
                    <select value={idElementoSelecionado} onChange={handleSelectChangeElemento}><option value={0} disabled>Selecionar Elemento</option>{SingletonHelper.getInstance().elementos.filter(elemento => elemento.id !== 3).map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nome}</option>))}</select>
                </InputComRotulo>
            </div>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Nível do Ritual'}>
                    <select value={idNivelSelecionado} onChange={handleSelectChangeNivel} disabled={idElementoSelecionado === 0}><option value={0} disabled>Selecionar Nível</option>{opcoesNivelRitual.map(opcao => (<option key={opcao.circuloNivelRitual.id} value={opcao.circuloNivelRitual.id} disabled={opcao.desabilitado}>{opcao.circuloNivelRitual.nome}</option>))}</select>
                </InputComRotulo>
            </div>
        </>
    );
}

const paginaSemLigacaoOuIniciado = () => {
    return (
        <></>
    );
};

const pagignaComLigacaoEIniciado = () => {
    return (
        <></>
    );
};

export default pagina;