// #region Imports
import style from './style.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RLJ_Ficha2 } from 'Types/classes/index.ts';
import { TooltipProps } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { ControladorAtributos } from 'Pages/EditaFicha/page.tsx'
// #endregion

const page = ({controlador}: {controlador:ControladorAtributos}) => {
    const [_, setRender] = useState(false);

    const modificarAtributo = (index: number, incremento: number) => {
        controlador.modificarAtributo(index, incremento);
        setRender((prev) => !prev);
    };

    const limiteDiminuirAtributo = (valorAtributo: number): boolean => { return ( (valorAtributo <= 0) || (controlador.numeroAtributosPodeDiminuir > 0 && valorAtributo === 1) ); }
    const limiteAumentarAtributo = (valorAtributo: number): boolean => { return ( valorAtributo >= 3 || controlador.pontosRestantes <= 0 ); }

    return (
        <div className={style.editando_ficha_atributos}>
            <h1>Atributos a Distribuir: {controlador.pontosRestantes}</h1>

            {controlador.atributosAtual.map((objAtributo, index) => (
                <div key={index} className={style.atributo_referencia}>
                    <ReferenciaTooltip objeto={ { caixaInformacao: { corpo: [{ tipo: 'texto', conteudo: '', }] }, corTooltip: { corPrimaria: '#FFFFFF' } } as TooltipProps }>
                        <div className={style.editar_atributo}>
                            <button onClick={() => modificarAtributo(index, -1)} disabled={limiteDiminuirAtributo(objAtributo.valor)}><FontAwesomeIcon icon={faMinus} /></button>
                            <div className={style.corpo_atributo}>
                                <h2>{objAtributo.atributo.nome}</h2>
                                <h2>{objAtributo.valor}</h2>
                            </div>
                            <button onClick={() => modificarAtributo(index, 1)} disabled={limiteAumentarAtributo(objAtributo.valor)}><FontAwesomeIcon icon={faPlus} /></button>
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