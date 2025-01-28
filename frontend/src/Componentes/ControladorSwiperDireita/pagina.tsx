// #region Imports
import style from './style.module.css';

import { useState } from 'react';

import PaginaControleEfeitos from 'Paginas/SubPaginas/ControleFicha/PaginaControleEfeitos/pagina';
import PaginaControleAtributosPericias from 'Paginas/SubPaginas/ControleFicha/PaginaControleAtributosPericias/pagina';
import PaginaControleInventario from 'Paginas/SubPaginas/ControleFicha/PaginaControleInventario/pagina';
import PaginaControleAcoes from 'Paginas/SubPaginas/ControleFicha/PaginaControleAcoes/pagina';
import PaginaControleHabilidades from 'Paginas/SubPaginas/ControleFicha/PaginaControleHabilidades/pagina';
import PaginaControleRituais from 'Paginas/SubPaginas/ControleFicha/PaginaControleRituais/pagina';

import { ContextoControleEfeitosProvider, useContextoControleEfeitos } from 'Contextos/ContextoControleEfeitos/contexto.tsx';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextoControleAtributosPericias/contexto.tsx';
import { ContextoControleInventarioProvider, useContextoControleInventario } from 'Contextos/ContextoControleInventario/contexto.tsx';
import { ContextoControleAcoesProvider, useContextoControleAcoes } from 'Contextos/ContextoControleAcoes/contexto.tsx';
import { ContextoControleHabilidadesProvider, useContextoControleHabilidades } from 'Contextos/ContextoControleHabilidades/contexto.tsx';
import { ContextoControleRituaisProvider, useContextoControleRituais } from 'Contextos/ContextoControleRituais/contexto.tsx';
import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';

import BarraMenu from 'Componentes/BarraMenu/pagina';

import Slider from "react-slick";
// #endregion

type ProviderProps = {
    children: React.ReactNode;
};

const combineProviders = (...providers: React.FC<ProviderProps>[]) => {
    return ({ children }: ProviderProps) =>
        providers.reduceRight((acc, Provider) => {
            return <Provider>{acc}</Provider>;
        }, children);
};

const ProvidersControle = combineProviders(
    ContextoControleEfeitosProvider,
    ContextoControleAtributosPericiasProvider,
    ContextoControleInventarioProvider,
    ContextoControleAcoesProvider,
    ContextoControleHabilidadesProvider,
    ContextoControleRituaisProvider
);

const pagina = () => {
    const personagem = getPersonagemFromContext();

    const listaPaginas = [
        {
            nome: 'Perícias',
            componente: <PaginaControleAtributosPericias atributos={personagem.atributos} pericias={personagem.pericias} />,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Efeitos',
            componente: <PaginaControleEfeitos controladorModificadores={personagem.controladorModificadores} />,
            contexto: useContextoControleEfeitos
        },
        {
            nome: 'Inventário',
            componente: <PaginaControleInventario estatisticasBuffaveis={personagem.estatisticasBuffaveis} inventarioPersonagem={personagem.inventario} />,
            contexto: useContextoControleInventario
        },
        {
            nome: 'Ações',
            componente: <PaginaControleAcoes acoesPersonagem={personagem.acoes} />,
            contexto: useContextoControleAcoes
        },
        {
            nome: 'Habilidades',
            componente: <PaginaControleHabilidades habilidadesPersonagem={personagem.habilidades} />,
            contexto: useContextoControleHabilidades
        },
        {
            nome: 'Rituais',
            componente: <PaginaControleRituais rituaisPersonagem={personagem.rituais} />,
            contexto: useContextoControleRituais
        },
    ];

    const [paginaAbertaSwiper, setPaginaAbertaSwiper] = useState(0);
    const paginaSelecionada = listaPaginas[paginaAbertaSwiper];

    const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_next}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
        );
    }

    const PrevArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_prev}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
        );
    }

    const settings = { infinite: true, speed: 300, slidesToShow: 3, centerMode: true, centerPadding: "0", nextArrow: <NextArrow />, prevArrow: <PrevArrow />, beforeChange: (current: number, next: number) => setPaginaAbertaSwiper(next) };

    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);
    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);

    return (
        <ProvidersControle>
            <div className={`${style.swiper_direita} ${!swiperDireitaAberto ? style.swiper_direita_fechado : ''}`}>
                <button onClick={alternaSwiperDireitaAberto} className={style.botao_swiper_direita}>o</button>
                <div id={style.conteudo_swiper_direita}>
                    <div id={style.titulos_paginas_swiper_direita}>
                        <Slider {...settings}>
                            {listaPaginas.map((pagina, index) => (
                                <div key={index} onClick={() => setPaginaAbertaSwiper(index)} className={`${style.item_slider} ${index === paginaAbertaSwiper ? style.item_slider_selecionado : ''}`}>
                                    <h1 className="noMargin">
                                        {pagina.nome}
                                        {index === paginaAbertaSwiper && <AbaComIconeConfig useContextoPaginaAberta={pagina.contexto}/>}
                                    </h1>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <hr style={{ width: '100%' }} />

                    {paginaSelecionada.componente}
                </div>
            </div>
        </ProvidersControle>
    );
}

const AbaComIconeConfig = ({ useContextoPaginaAberta }: { useContextoPaginaAberta: () => { listaMenus: Array<{ itensMenu: any[] }> } }) => {
    const { listaMenus } = useContextoPaginaAberta();

    return (
        <BarraMenu>
            {listaMenus.map((menu, indexMenu) => (
                <BarraMenu.Menu key={indexMenu}>
                    <BarraMenu.Trigger><FontAwesomeIcon icon={faGear} className={style.icone_config_pagina} /></BarraMenu.Trigger>
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

export default pagina;