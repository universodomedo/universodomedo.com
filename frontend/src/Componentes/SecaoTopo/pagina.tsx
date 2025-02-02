// #region Imports
import style from './style.module.css';
import { ReactNode } from 'react';

import InformacoesLogado from 'Componentes/InformacoesLogado/pagina.tsx';

import { useContextoMenuSwiper } from 'Contextos/ContextoMenuSwiper/contexto.tsx'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";
import React from 'react';
// #endregion

const pagina = ({ layout }: { layout: 'deslogado' | 'logado' | 'emjogo' }) => {
    const { alternaMenuAberto } = useContextoMenuSwiper();

    const obterItensCabecalho = (): ReactNode[] => {
        switch (layout) {
            case 'deslogado':
                return [
                    <Link to="/ficha-demonstracao" id={style.link_demonstracao}>Ficha de Demonstração</Link>
                ];
            default:
                return [];
        }
    }

    const itensCabecalho = obterItensCabecalho();

    return (
        <>
            <div id={style.conteudo_cabecalho_esquerda}>
                <div id={style.botao_cabecalho_swiper_esquerda} onClick={alternaMenuAberto}><FontAwesomeIcon icon={faBars} /></div>
                <div id={style.logo_cabecalho}><Link to='/inicio' /></div>
            </div>
            <div id={style.conteudo_cabecalho_centro}>
                {itensCabecalho.map((item, index) => (
                    <React.Fragment key={index}>
                        {item}
                    </React.Fragment>
                ))}
            </div>
            <div id={style.conteudo_cabecalho_direita}>
                <InformacoesLogado />
            </div>
        </>
    );
}

export default pagina;