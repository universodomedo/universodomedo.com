'use client';

import BotaoCarrossel from 'Componentes/ElementosVisuais/ElementosCarroseis/BotaoCarrossel/BotaoCarrossel';
import styles from './styles.module.css';

import Slider, { Settings } from "react-slick";


export default function CarrosselHomepage() {

    const lista = [
        "/capa-nahid2.png",
        "/T3-E262.png",
        "/T3-E292.png",
        "/mathias-tiffany-capa2.png",
        "/imagensFigma/capa-nahid.png",
        "/imagensFigma/prisioneiro-capa.png",
        "/miyata-disponibilidades.png",
    ]

    const settings: Settings = {
        dots: true,
        dotsClass: `slick-dots ${styles.dots}`,
        autoplay: true,
        autoplaySpeed: 5500,
        variableWidth: false,
        infinite: true,
        speed: 1200,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '0',
        nextArrow: <BotaoCarrossel classNameExterno={styles.botao_next} imagemUrl={"/imagensFigma/slide_b_over_r.svg"} />,
        prevArrow: <BotaoCarrossel classNameExterno={styles.botao_prev} imagemUrl={"/imagensFigma/slide_b_over_l.svg"} />,
    };

    return (
        <div className={styles.recipiente_secao_novoCarrossel}>

            <RecipienteLayoutBordas />

            <div className={styles.sliderWrapper}>
                <Slider {...settings}>
                    {
                        lista.map(imagem => <img src={imagem}></img>)
                    }
                </Slider>
            </div>
        </div>
    )

}

function RecipienteLayoutBordas() {
    return <div className={styles.recipiente_absolute_layout}>
        <div className={styles.recipiente_layout}>
            <div className={styles.recipiente_bordas}>
                <RecipienteBordasLaterais />
                <LayoutSlidePrincipal />
            </div>
        </div>;
    </div>
}

function RecipienteBordasLaterais() {
    return <div className={styles.recipiente_detalhe_borda}>

        <div className={styles.recipiente_detalhes}>
            <div className={styles.detalhe_borda1}>
                <div className={styles.borda_interna1} />
            </div>

            <div className={styles.flex_detalhe_borda} />

            <div className={styles.detalhe_borda2}>
                <div className={styles.borda_interna2} />
            </div>
        </div>
    </div>;
}

function LayoutSlidePrincipal() {
    return (
        <div className={styles.slide_principal}>

            <div className={styles.borda_slide2} />

            <img className={styles.side_bl} src="/imagensFigma/crystal-botao-esquerda.svg" alt="#"></img>
            <img className={styles.side_br} src="/imagensFigma/crystal-azul-direita.svg" alt="#"></img>

            <img className={styles.adesivos} src="/imagensFigma/adesivos.svg" alt="#"></img>


            <img className={styles.moldura_carrossel} src="/imagensFigma/moldura_carrossel.svg" alt="#"></img>
        </div>
    )
}



