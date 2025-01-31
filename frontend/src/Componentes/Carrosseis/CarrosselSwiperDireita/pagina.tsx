// #region Imports
import style from './style.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';

import BarraMenu from 'Componentes/BarraMenu/pagina';

import Slider from "react-slick";
// #endregion

const pagina = ({ listaPaginas, setPaginaAbertaSwiper, paginaAbertaSwiper }: { listaPaginas: { nome: string; componente: React.ReactNode; contexto: () => any; }[], setPaginaAbertaSwiper: React.Dispatch<React.SetStateAction<number>>, paginaAbertaSwiper: number }) => {
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

    return (
        <div id={style.titulos_paginas_swiper_direita}>
            <Slider {...settings}>
                {listaPaginas.map((pagina, index) => (
                    <div key={index} onClick={() => setPaginaAbertaSwiper(index)} className={`${style.item_slider} ${index === paginaAbertaSwiper ? style.item_slider_selecionado : ''}`}>
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