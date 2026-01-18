'use client';

import BotaoCarrossel from 'Componentes/ElementosVisuais/ElementosCarroseis/BotaoCarrossel/BotaoCarrossel';
import styles from './styles.module.css';

import Slider from "react-slick";


export default function CarrosselHomepage() {

    const lista = [
        "/capa-nahid2.png",
        "/T3-E262.png",
        "/T3-E292.png",
    ]

    const settings = {
        variableWidth: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '0',
        nextArrow: <BotaoCarrossel classNameExterno={styles.botao_next} imagemUrl={"/imagensFigma/slide_b_over_r.svg"}/>,
        prevArrow: <BotaoCarrossel classNameExterno={styles.botao_prev} imagemUrl={"/imagensFigma/slide_b_over_l.svg"}/>,

        onInit: () => {

        },

        beforeChange: (current: number, next: number) => {

        },

    };

    return (
        <div className={styles.recipiente_secao_novoCarrossel}>

            <div className={styles.recipiente_layout}>
                <div className={styles.recipiente_bordas}>

                    <div className={styles.recipiente_detalhe_borda}>

                        <div className={styles.recipiente_detalhes}>
                            <div className={styles.detalhe_borda1}>
                                <div className={styles.borda_interna1}></div>
                            </div>

                            <div className={styles.flex_detalhe_borda}>

                            </div>

                            <div className={styles.detalhe_borda2}>
                                <div className={styles.borda_interna2}></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.slide_principal}>

                        <div className={styles.borda_slide2}></div>

                        <img className={styles.side_bl} src="/imagensFigma/crystal-botao-esquerda.svg" alt="#"></img>
                        <img className={styles.side_br} src="/imagensFigma/crystal-azul-direita.svg" alt="#"></img>

                        <img className={styles.adesivos} src="/imagensFigma/adesivos.svg" alt="#"></img>


                        <img className={styles.moldura_carrossel} src="/imagensFigma/moldura_carrossel.svg" alt="#"></img>
                    </div>

                </div>
            </div>

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

