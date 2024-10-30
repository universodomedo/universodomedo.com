// #region Imports
import style from './style.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RLJ_Ficha2 } from 'Types/classes/index.ts';
import { TooltipProps } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip";

import { FichaProvider, useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const gastaPonto = (idAtributo:number, modificador:number) => {
        ganhosNex.estadoGanhosNex.gastaPonto(idAtributo, modificador);
        atualizarFicha();
    }

    return (
        <div className={style.editando_ficha_atributos}>
            <div className={style.atributo_contadores}>
                <h1>Atributos a Distribuir: {ganhosNex.estadoGanhosNex.ganhosAtributos.valorRestante}</h1>
                <h1>Atributos a Trocar: {ganhosNex.estadoGanhosNex.trocasAtributos.valorRestante}</h1>
            </div>

            {ganhosNex.estadoGanhosNex.atributos.map((atributoNexUp, index) => (
                <div key={index} className={style.atributo_referencia}>
                    <ReferenciaTooltip objeto={ { caixaInformacao: { corpo: [{ tipo: 'texto', conteudo: '', }] }, corTooltip: { corPrimaria: '#FFFFFF' } } as TooltipProps }>
                        <div className={style.editar_atributo}>
                            <button onClick={() => {gastaPonto(atributoNexUp.refAtributo.id, -1)}} disabled={!atributoNexUp.estaMaiorQueInicial && ganhosNex.estadoGanhosNex.trocasAtributos.finalizado}><FontAwesomeIcon icon={faMinus} /></button>
                            <div className={style.corpo_atributo}>
                                <h2>{atributoNexUp.refAtributo.nome}</h2>
                                <h2>{atributoNexUp.valorAtual}</h2>
                            </div>
                            <button onClick={() => {gastaPonto(atributoNexUp.refAtributo.id, +1)}} disabled={atributoNexUp.estaEmValorMaximo || ganhosNex.finalizados}><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                    </ReferenciaTooltip>
                </div>
            ))}

            <div className={style.editando_ficha_estatisticas}>
                <ReferenciaTooltip objeto={ { caixaInformacao: { corpo: [{ tipo: 'texto', conteudo: '', }] }, corTooltip: { corPrimaria: '#FFFFFF' } } as TooltipProps }>
                {/* <ReferenciaTooltip objeto={ { caixaInformacao: { corpo: [{ tipo: 'texto', conteudo: '5P.V.', }, { tipo: 'texto', conteudo: '+2P.V. (1 * AGI)', }] }, corTooltip: { corPrimaria: '#FFFFFF' } } as TooltipProps }> */}
                    <div className={style.visualizador_estatistica}><h2>P.V.</h2><h2>1</h2></div>
                </ReferenciaTooltip>
                <ReferenciaTooltip objeto={ { caixaInformacao: { corpo: [{ tipo: 'texto', conteudo: '', }] }, corTooltip: { corPrimaria: '#FFFFFF' } } as TooltipProps }>
                    <div className={style.visualizador_estatistica}><h2>P.S.</h2><h2>2</h2></div>
                </ReferenciaTooltip>
                <ReferenciaTooltip objeto={ { caixaInformacao: { corpo: [{ tipo: 'texto', conteudo: '', }] }, corTooltip: { corPrimaria: '#FFFFFF' } } as TooltipProps }>
                    <div className={style.visualizador_estatistica}><h2>P.E.</h2><h2>3</h2></div>
                </ReferenciaTooltip>
            </div>
        </div>
    );
}

export default page;