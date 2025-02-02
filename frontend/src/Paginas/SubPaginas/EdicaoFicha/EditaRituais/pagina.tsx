// #region Imports
import style from './style.module.css';

import { GanhoIndividualNexRitual } from 'Classes/ClassesTipos/index.ts';

import { ContextoCriaRitualProvider, useContextoCriaRitual } from 'Contextos/ContextoCriacaoRitual/contexto.tsx';
import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';
// #endregion

const page = () => {
    return (
        <ContextoCriaRitualProvider>
            <PageComContexto />
        </ContextoCriaRitualProvider>
    );
}

const PageComContexto = () => {
    const { ganhosNex, triggerSetState } = useContextoNexUp();
    const { mudarPaginaRitual, paginaRitualAberta, mudarPaginaTipoRitual, paginaTipoRitualAberta, dadosRitual, setDadosRitual } = useContextoCriaRitual();

    const ganhoRitual = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexRitual)!;

    const adicionaRitual = () => {
        ganhoRitual.dadosRituais.push({ dadosRitual: dadosRitual!, emCriacao: true });
        mudarPaginaTipoRitual(0)
        setDadosRitual(undefined);
        mudarPaginaRitual(0);
        triggerSetState();
    }

    return (
        <div className={style.recipiente_pagina_rituais}>
            <div className={style.recipiente_conteudo_criacao_ritual}>
                {paginaRitualAberta}
            </div>

            {paginaTipoRitualAberta !== undefined && (
                <div className={style.recipiente_botao_salva_ritual}>
                    <button disabled={dadosRitual === undefined} onClick={adicionaRitual}>Adicionar Ritual</button>
                </div>
            )}
        </div>
    );
};

export default page;