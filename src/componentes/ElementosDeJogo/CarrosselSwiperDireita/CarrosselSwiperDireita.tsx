import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import BarraMenu from 'Componentes/ElementosDeJogo/BarraMenu/BarraMenu.tsx';
import Slider from "react-slick";

export default function CarrosselSwiperDireita({ listaPaginas, setPaginaAbertaSwiper, paginaAbertaSwiper }: {
    listaPaginas: { nome: string; componente: React.ReactNode; contexto: () => any; }[],
    setPaginaAbertaSwiper: React.Dispatch<React.SetStateAction<number>>,
    paginaAbertaSwiper: number
}) {
    const sliderRef = useRef<Slider>(null);

    // Atualiza o slide sempre que `paginaAbertaSwiper` mudar
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(paginaAbertaSwiper, true); // true para animação
        }
    }, [paginaAbertaSwiper]);

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

    const settings = { infinite: true, speed: 300, slidesToShow: 3, centerMode: true, centerPadding: "0", nextArrow: <NextArrow />, prevArrow: <PrevArrow />, beforeChange: (current: number, next: number) => setPaginaAbertaSwiper(next) };

    return (
        <div id={styles.titulos_paginas_swiper_direita}>
            <Slider ref={sliderRef} {...settings}>
                {listaPaginas.map((pagina, index) => (
                    <div key={index} onClick={() => setPaginaAbertaSwiper(index)} className={`${styles.item_slider} ${index === paginaAbertaSwiper ? styles.item_slider_selecionado : ''}`}>
                        <h1>
                            {pagina.nome}
                            {index === paginaAbertaSwiper && <AbaComIconeConfig useContextoPaginaAberta={pagina.contexto} />}
                        </h1>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

const AbaComIconeConfig = ({ useContextoPaginaAberta }: { useContextoPaginaAberta: () => { listaMenus: Array<{ itensMenu: any[] }> } }) => {
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
}