'use client';

import styles from './styles.module.css';

import React, { useEffect, useRef } from 'react';
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';

import BarraMenu from 'Componentes/ElementosDeJogo/BarraMenu/BarraMenu.tsx';
import type { Menu } from 'Contextos/ContextosControladorSwiperFicha/typesContextoControle';

export type PaginaCarrosselConteudoFichaDeJogo = {
    nome: string;
    componente: React.ReactNode;
    contexto: () => { listaMenus: Menu[]; };
};

export default function CarrosselConteudoFichaDeJogo({ listaPaginas, selecionaPaginaFicha, paginaAbertaFicha }: {
    listaPaginas: PaginaCarrosselConteudoFichaDeJogo[],
    selecionaPaginaFicha: (indicePagina: number) => void,
    paginaAbertaFicha: number
}) {
    const sliderRef = useRef<Slider>(null);

    // Atualiza o slide sempre que `paginaAbertaFicha` mudar
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(paginaAbertaFicha, true); // true para animação
        }
    }, [paginaAbertaFicha]);

    const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${styles.arrow} ${styles.arrow_next}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
        );
    }

    const PrevArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${styles.arrow} ${styles.arrow_prev}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
        );
    }

    const settings = { infinite: true, speed: 300, slidesToShow: 3, centerMode: true, centerPadding: "0", nextArrow: <NextArrow />, prevArrow: <PrevArrow />, beforeChange: (_current: number, next: number) => selecionaPaginaFicha(next) };

    return (
        <div id={styles.titulos_paginas_swiper_direita}>
            <Slider ref={sliderRef} {...settings}>
                {listaPaginas.map((pagina, index) => (
                    <div key={index} onClick={() => selecionaPaginaFicha(index)} className={`${styles.item_slider} ${index === paginaAbertaFicha ? styles.item_slider_selecionado : ''}`}>
                        <h1>
                            {pagina.nome}
                            {index === paginaAbertaFicha && <AbaComIconeConfig useContextoPaginaAberta={pagina.contexto} />}
                        </h1>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

function AbaComIconeConfig ({ useContextoPaginaAberta }: { useContextoPaginaAberta: () => { listaMenus: Menu[] } }) {
    const { listaMenus } = useContextoPaginaAberta();

    return (
        <BarraMenu>
            {listaMenus.map((menu, indexMenu) => (
                <BarraMenu.Menu key={indexMenu}>
                    <BarraMenu.Trigger><FontAwesomeIcon icon={faGear} className={styles.icone_config_pagina} /></BarraMenu.Trigger>
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
};
