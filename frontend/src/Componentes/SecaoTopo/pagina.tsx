// #region Imports
import style from './style.module.css';

import InformacoesLogado from 'Componentes/InformacoesLogado/pagina.tsx';

import { useContextoMenuSwiper } from 'Contextos/ContextoMenuSwiper/contexto.tsx'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";
// #endregion

const pagina = () => {
    const { alternaMenuAberto } = useContextoMenuSwiper();

    return (
        <>
            <div id={style.conteudo_cabecalho_esquerda}>
                <div id={style.botao_cabecalho_swiper_esquerda} onClick={alternaMenuAberto}><FontAwesomeIcon icon={faBars}/></div>
                <div id={style.logo_cabecalho} />
            </div>
            <div id={style.conteudo_cabecalho_centro}>
                <Link to="/ficha-demonstracao" id={style.link_demonstracao}>Ficha de Demonstração</Link>
            </div>
            <div id={style.conteudo_cabecalho_direita}>
                <InformacoesLogado />
            </div>
        </>
    );
}

export default pagina;