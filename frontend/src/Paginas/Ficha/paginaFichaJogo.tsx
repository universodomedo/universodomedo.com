// #region Imports
import style from "./style.module.css";

import { useClasseContextualPersonagemDetalhes } from "Classes/ClassesContextuais/PersonagemDetalhes";
import { useClasseContextualPersonagemEstatisticasDanificaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasDanificaveis";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShoppingCart, faUsers } from '@fortawesome/free-solid-svg-icons';
import img from 'Assets/testeCapa1.png'

import ControladorSwiperDireita from 'Componentes/ControladorSwiperDireita/pagina.tsx';
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
            <ControladorSwiperDireita />
        </>
    );
}

const PaginaFichaBaixo = () => {
    const { nome, classe, nivel } = useClasseContextualPersonagemDetalhes();
    const { estatisticasDanificaveis } = useClasseContextualPersonagemEstatisticasDanificaveis();

    return (
        <>
            <div className={`${style.fatia_parte_baixo_detalhes}`}>
                <div className={style.recipiente_infomacoes_personagem}>
                    <h2>{nome}</h2>
                    <h2>{classe.nome} - {nivel.nomeDisplay}</h2>
                </div>
                <div className={style.recipiente_imagem_personagem}>
                    <div id={style.imagem_personagem} />
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
                    <div className={style.barra_acoes}>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao} style={{ backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+)` }} />
                        </div>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao}><FontAwesomeIcon icon={faPlus} style={{ width: '50%', height: '50%' }} /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.fatia_parte_baixo_estatisticas_danificaveis}>
                {estatisticasDanificaveis.map((estatistica, index) => (
                    <div key={index} className={style.recipiente_estatistica_danificavel}>
                        <BarraEstatisticaDanificavel titulo={estatistica.refEstatisticaDanificavel.nomeAbrev} valorAtual={estatistica.valor} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default pagina;