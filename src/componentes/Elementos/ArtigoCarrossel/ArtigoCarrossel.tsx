'use client';

import { useState } from 'react';
import BotaoCarrossel from 'Componentes/ElementosVisuais/ElementosCarroseis/BotaoCarrossel/BotaoCarrossel';
import styles from './styles.module.css'
import Slider, { Settings } from "react-slick";




export default function ArtigoCarrossel() {

    const [slideAtivo, setSlideAtivo] = useState(0);

    const lista = [
        {
            id: 1,
            fundo: '/imagensFigma/slide-investigacao-conjunta.webp',
            sobreposicao: '/imagensFigma/investigacao-conjunta.png',
            titulo: 'Slide 1',
            posicao: {
                top: '-32%',
                left: '13%',
                scale: '0.95',
            },
            filtro: {
                angle: '-20deg',
                start: '#0E0B18 45%',
                end: '#290d1b91'
            }
        },
        {
            id: 2,
            fundo: '/imagensFigma/slide-combates-expressivos.webp',
            sobreposicao: '/imagensFigma/combates-expressivos.png',
            titulo: 'Slide 2',
            posicao: {
                top: '-30%',
                left: '40%',
                scale: '.97'
            },
            filtro: {
                angle: '20deg',
                start: '#0E0B18 45%',
                end: '#290d1b91 70%'
            }
        },
        {
            id: 3,
            fundo: '/imagensFigma/slide-marcas-permanentes.webp',
            sobreposicao: '/imagensFigma/sobreposicao-slide-marcas.webp',
            titulo: 'Slide 3',
            posicao: {
                top: '-44.5%',
                left: '7%',
                scale: '.97'
            },

            filtro: {
                angle: '-35deg',
                start: '#0E0B18 50%',
                end: '#290d1b91 90%'
            }
        },

        {
            id: 4,
            fundo: '/imagensFigma/slide-influencia-mutua.webp',
            sobreposicao: '/imagensFigma/sobreposicao-influencia.webp',
            titulo: 'Slide 3',
            posicao: {
                top: '-44.5%',
                left: '7%',
                scale: '.97'
            },

            filtro: {
                angle: '-35deg',
                start: '#0E0B18 50%',
                end: '#290d1b91 90%'
            }
        },
    ];


    const settings: Settings = {
        dots: true,
        dotsClass: `slick-dots ${styles.dots}`,
        autoplay: false,
        autoplaySpeed: 5500,
        infinite: true,
        speed: 1200,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '0',

        nextArrow: (
            <BotaoCarrossel
                classNameExterno={styles.botao_next}
                imagemUrl={"/imagensFigma/botao-next.png"}
            />
        ),
        prevArrow: (
            <BotaoCarrossel
                classNameExterno={styles.botao_prev}
                imagemUrl={"/imagensFigma/botao-prev.png"}
            />
        ),

        beforeChange: (_current, next) => {
            setSlideAtivo(next);
        }
    };

    const slideAtual = lista[slideAtivo]

    return (
        <div className={styles.recipiente_artigo_carrossel}>


            <div className={styles.recipiente_carrossel}>

                <div className={styles.absolute_layout}>

                    <div className={styles.recipiente_layout_artigo_carrossel} style={{
                        '--filtro-angle': slideAtual.filtro.angle,
                        '--filtro-start': slideAtual.filtro.start,
                        '--filtro-end': slideAtual.filtro.end,
                    } as React.CSSProperties} >

                        <figure className={styles.borda_principal}>
                            <img src="/imagensFigma/borda-artigo-carrossel.png" alt="#" />
                        </figure>

                        <figure className={styles.borda_dourada}>
                            <img src="/imagensFigma/borda-dourada-artigo-carrossel.png" alt="#" />
                        </figure>

                        <div className={styles.filtro_slides}></div>

                    </div>

                </div>

                <div className={styles.overlayLayer}>
                    {lista[slideAtivo] && lista[slideAtivo].sobreposicao && (
                        <img
                            key={slideAtivo}
                            className={styles.sobreposicao_slide}
                            src={lista[slideAtivo].sobreposicao}
                            alt="#"
                            style={lista[slideAtivo].posicao}
                        />
                    )}

                </div>

                <div className={styles.sliderWrapper}>

                    <Slider {...settings}>
                        {lista.map(item => (
                            <div
                                key={item.id}
                                className={styles.recipiente_slides_carrossel}
                            >
                                <div className={styles.recipiente_slides}>
                                    <img
                                        className={styles.imagem_fundo_carrossel}
                                        src={item.fundo}
                                        alt={item.titulo}
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>



                    <div className={styles.recipiente_arestas}>
                        <figure className={styles.borda_arestas}>
                            <img src="/imagensFigma/setas-fundo-carrossel.png" alt="#" />
                        </figure>
                    </div>

                </div>

            </div>
        </div>
    );
}
