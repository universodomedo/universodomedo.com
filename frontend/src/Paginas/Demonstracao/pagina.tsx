// #region Imports
import style from "./style.module.css";
import "./style.css";

import { useEffect, useRef, useState } from 'react';

import PaginaControleAcoes from 'Paginas/SubPaginas/PaginaControleAcoes/pagina.tsx';

import { ContextoFichaProvider, getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';

import { ContextoAbaAcoes, ContextoAbaAcoesProvider, useContextoAbaAcoes } from 'Contextos/ContextoControleAcoes/contexto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faPlus, faGear } from '@fortawesome/free-solid-svg-icons';
import img from 'Assets/testeCapa1.png'

import Slider from "react-slick";

import BarraMenu from 'Componentes/BarraMenu/page.tsx';
import BarraEstatisticaDanificavel from 'Componentes/BarraEstatisticaDanificavel/page.tsx';
// #endregion

const page = () => {
    const indexFicha = 0;

    return (
        <ContextoFichaProvider idFichaNoLocalStorage={indexFicha}>
            <InterseccaoParaPendencia />
        </ContextoFichaProvider>
    );
}

const InterseccaoParaPendencia = () => {
    const temPendencia = getPersonagemFromContext().temPendencia;

    return (
        <>
            {temPendencia ? (
                <PaginaEditaFicha />
            ): (
                <PaginaFicha />
            )}
        </>
    );
}

const PaginaFicha = () => {
    return (
        <>
            <div className={style.secao1}><PaginaFichaCima /></div>
            <div className={style.secao2}><PaginaFichaBaixo /></div>
        </>
    );
}

const PaginaFichaCima = () => {
    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);
    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);
    const [paginaAbertaSwiper, setPaginaAbertaSwiper] = useState(0);

    const personagem = getPersonagemFromContext();

    const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_next}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowRight}/>
            </div>
        );
    }

    const PrevArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_prev}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowLeft}/>
            </div>
        );
    }

    const settings = { infinite: true, speed: 300, slidesToShow: 3, centerMode: true, centerPadding: "0", nextArrow: <NextArrow />, prevArrow: <PrevArrow />, beforeChange: (current: number, next: number) => setPaginaAbertaSwiper(next) };

    const listaPaginas = [ 'Efeitos', 'Perícias', 'Inventário', 'Ações', 'Habilidades', 'Rituais' ];

    return (
        <>
            <div className={style.tela_principal} style={{ backgroundImage:`url(${img})` }}/>
            <div className={`${style.swiper_direita} ${!swiperDireitaAberto ? style.swiper_direita_fechado : ''}`}>
                <button onClick={alternaSwiperDireitaAberto} className={style.botao_swiper_direita}>o</button>
                <div className={style.conteudo_swiper_direita}>
                    <ContextoAbaAcoesProvider>
                        <div className={style.titulos_paginas_swiper_direita}>
                            <p>oi1</p>
                            <p>oi2</p>
                            {/* <Slider {...settings}>
                                {listaPaginas.sort((a, b) => a.localeCompare(b)).map((pagina, index) => (
                                    <div key={index} className={`${style.item_slider} ${index === paginaAbertaSwiper ? style.item_slider_selecionado : ''}`}>
                                        <h1 className="noMargin">
                                            {pagina}
                                            {index === paginaAbertaSwiper && (<AbaComIconeConfig />)}
                                        </h1>
                                    </div>
                                ))}
                            </Slider> */}
                        </div>
                        <hr style={{width:'100%'}}/>

                        <PaginaControleAcoes abaId={"aba6"} acoesPersonagem={personagem.acoes} />
                    </ContextoAbaAcoesProvider>
                </div>
            </div>
        </>
    );
}

const AbaComIconeConfig = () => {
    const { listaMenus } = useContextoAbaAcoes();

    return (
        <BarraMenu>
            {listaMenus.map((menu, indexMenu) => (
                <BarraMenu.Menu key={indexMenu}>
                    <BarraMenu.Trigger><FontAwesomeIcon icon={faGear} className={style.icone_config_pagina}/></BarraMenu.Trigger>
                    <BarraMenu.Portal>
                        {menu.itensMenu.map((itemMenu, indexItem) => {
                            if (itemMenu.tipoItem === 'CheckboxItem') {
                                return (
                                    <BarraMenu.CheckboxItem key={indexItem} checked={itemMenu.checked || false} onCheckedChange={itemMenu.funcItem} >
                                        {itemMenu.tituloItem}
                                    </BarraMenu.CheckboxItem>
                                );
                            } else if (itemMenu.tipoItem === 'Separator') {
                                return <BarraMenu.Separator key={indexItem} />;
                            } else {
                                return (
                                    <BarraMenu.Item key={indexItem} onSelect={itemMenu.funcItem}>
                                        {itemMenu.tituloItem}
                                    </BarraMenu.Item>
                                );
                            }
                        })}
                    </BarraMenu.Portal>
                </BarraMenu.Menu>
            ))}
        </BarraMenu>
    );
}

const PaginaFichaBaixo = () => {
    const personagem = getPersonagemFromContext();

    return (
        <>
            <div className={`${style.fatia_parte_baixo_detalhes}`}>
                <h2 className="noMargin">{personagem.detalhes.nome}</h2>
                <h2 className="noMargin">{personagem.detalhes.refClasse.nome}</h2>
                <h2 className="noMargin">{personagem.detalhes.refNivel.nomeDisplay}</h2>
            </div>
            <div className={style.fatia_parte_baixo_atalhos}>
                <div className={style.barras}>
                    <div className={style.barra_acoes}>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao} style={{ backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+)`}}/>
                        </div>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao}><FontAwesomeIcon icon={faPlus} style={{ width: '50%', height:'50%' }}/></div>
                        </div>
                    </div>
                    <div className={style.barra_atalhos}>
                        <div className={style.item_barra_atalhos}>
                            <h3 className="noMargin">Ações</h3>
                        </div>
                        <div className={style.item_barra_atalhos}>
                            <h3 className="noMargin">Contatos</h3>
                        </div>
                        <div className={style.item_barra_atalhos}>
                            <h3 className="noMargin">Novo Atalho..</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.fatia_parte_baixo_estatisticas_danificaveis}>
                {personagem.estatisticasDanificaveis.map((estatistica, index) => (
                    <div key={index} className={style.recipiente_estatistica_danificavel}>
                        <BarraEstatisticaDanificavel titulo={estatistica.refEstatisticaDanificavel.nomeAbrev} valorAtual={estatistica.valor} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor}/>
                    </div>
                ))}
            </div>
        </>
    );
}

const PaginaEditaFicha = () => {
    return (
        <></>
    );
}

export default page;