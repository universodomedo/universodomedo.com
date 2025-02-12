// #region Imports
import style from "./style.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUsers } from '@fortawesome/free-solid-svg-icons';
import img from 'Assets/testeCapa1.png'

import BarraEstatisticaDanificavel from 'Componentes/BarraEstatisticaDanificavel/pagina.tsx';
// #endregion

const pagina = () => {
    return (
        <>
            <div className={style.secao_cima}><PaginaFichaCima /></div>
            <div className={style.secao_baixo}><PaginaFichaBaixo /></div>
        </>
    );
}

const PaginaFichaCima = () => {
    return (
        <>
            <div className={style.tela_principal} style={{ backgroundImage: `url(${img})` }} />
        </>
    );
}

const PaginaFichaBaixo = () => {
    return (
        <>
            <div className={style.fatia_parte_baixo_estatisticas_danificaveis}>
                {/* isso é um map de estatisticasDanificaceis <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                <div className={style.recipiente_estatistica_danificavel}>
                    <BarraEstatisticaDanificavel titulo={'P.V.'} valorAtual={30} valorMaximo={30} corBarra={'#FF0000'} />
                </div>
                <div className={style.recipiente_estatistica_danificavel}>
                    <BarraEstatisticaDanificavel titulo={'P.S.'} valorAtual={20} valorMaximo={20} corBarra={'#324A99'} />
                </div>
                <div className={style.recipiente_estatistica_danificavel}>
                    <BarraEstatisticaDanificavel titulo={'P.E.'} valorAtual={25} valorMaximo={25} corBarra={'#47BA16'} />
                </div>
            </div>
            <div className={style.fatia_parte_baixo_atalhos}>
                <div className={style.barra_locais}>
                    <div className={style.barra_locais_borda_esquerda} />
                    <div className={style.barra_locais_centro}>
                        <FontAwesomeIcon title={'Mundo Aberto'} icon={faUsers} />
                        <FontAwesomeIcon title={'Shopping'} icon={faShoppingCart} />
                    </div>
                    <div className={style.barra_locais_borda_direita} />
                </div>

                <div className={style.barras}>

                </div>
            </div>
            <div className={`${style.fatia_parte_baixo_detalhes}`}>
                <div className={style.recipiente_informacoes_personagem}>
                    {/* Informações do PersonagemDetalhe <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                    <h2>Ficha Demonstração</h2>
                    <h2>Combatente - NEX 20%</h2>
                </div>
                <div className={style.recipiente_imagem_personagem}>
                    <div id={style.imagem_personagem} />
                </div>
            </div>
        </>
    );
}

export default pagina;