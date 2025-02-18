import style from "./style.module.css";

import { useContextoFicha } from "Contextos/ContextoPersonagem/contexto.tsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUsers } from '@fortawesome/free-solid-svg-icons';

const Pagina = () => {
    const { paginaDeJogoAberta, mudarPaginaDeJogo } = useContextoFicha();

    return (
        <>
            <div className={style.barra_locais_borda_esquerda} onClick={() => { mudarPaginaDeJogo({tipoAcao: 'procedimento', acaoParaPaginaDeJogo: 'anterior'}); }} />
            <div className={style.barra_locais_centro}>
                <FontAwesomeIcon className={`${style.icone_local} ${ paginaDeJogoAberta === 1 ? style.local_selecionado : ''}`} title={'Mundo Aberto'} icon={faUsers} onClick={() => { mudarPaginaDeJogo({tipoAcao: 'direto', idPaginaDeJogo: 1}); }} />
                <FontAwesomeIcon className={`${style.icone_local} ${ paginaDeJogoAberta === 2 ? style.local_selecionado : ''}`} title={'Shopping'} icon={faShoppingCart} onClick={() => { mudarPaginaDeJogo({tipoAcao: 'direto', idPaginaDeJogo: 2}); }} />
            </div>
            <div className={style.barra_locais_borda_direita} onClick={() => { mudarPaginaDeJogo({tipoAcao: 'procedimento', acaoParaPaginaDeJogo: 'proximo'}); }} /> 
        </>
    );
}

export default Pagina;