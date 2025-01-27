// #region Imports
import style from '../style.module.css';
import { useState } from 'react';

import { ContextoRitualPericiaProvider, useContextoRitualPericia } from 'Contextos/ContextoCriacaoRitual/SubContextos/RituaisPericia/contextoRitualPericia';

import InputComRotulo from 'Componentes/ElementosComponentizados/InputComRotulo/pagina.tsx';
// #endregion

const page = () => {
    return (
        <ContextoRitualPericiaProvider>
            <PaginaComContexto />
        </ContextoRitualPericiaProvider>
    );
}

const PaginaComContexto = () => {
    const { opcoesPericias, selecionaPericia, periciaSelecionada, argsRitual } = useContextoRitualPericia();

    const handleSelectChangePericia = (event: React.ChangeEvent<HTMLSelectElement>) => {
        selecionaPericia(Number(event.target.value));
    }

    const idPericiaSelecionada = periciaSelecionada?.id || 0;

    return (
        <>
            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Perícia do Ritual'}>
                    <select style={{width:'100%'}} value={idPericiaSelecionada} onChange={handleSelectChangePericia}><option value={0} disabled>Selecionar Perícia</option>{opcoesPericias.map(pericia => (<option key={pericia.id} value={pericia.id}>{pericia.texto}</option>))}</select>
                </InputComRotulo>
            </div>

            {argsRitual !== undefined && (
                <div className={style.recipiente_detalhes_ritual}>
                    <h2>{argsRitual.args.nome}</h2>
                    <h3>Custo PE: {argsRitual.dadosAcoes[0].custos.custoPE?.valor}</h3>
                    <h3>Valor do Bônus: {argsRitual.dadosAcoes[0].modificadores![0].props.dadosEfeitos[0].dadosValoresEfeitos?.valorBonusAdicional}</h3>
                </div>
            )}
        </>
    );
}

export default page;