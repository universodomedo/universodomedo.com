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
            slide: 'investigacao conjunta',

            titulo: (
                <>
                    <strong>I</strong>NVESTIGAÇÃO <strong>CO</strong>NJUNTA
                </>
            ),

            posicao: {
                top: '-32%',
                left: '13%',
                scale: '0.95',
            },

            filtro: {
                angle: '-20deg',
                start: '#0E0B18 45%',
                end: '#290d1b91'
            },

            paragrafo: 'Unindo forças, conectando descobertas e investigando o paranormal, os jogadores deixam marcas reais no mundo. Desvendando pouco a pouco o que a realidade tem de mais obscuro.',

        },
        {
            id: 2,
            fundo: '/imagensFigma/slide-combates-expressivos.webp',
            sobreposicao: '/imagensFigma/combates-expressivos.png',
            slide: 'combates expressivos',

            titulo: (
                <>
                    <strong>COM</strong>BATES <strong>EXP</strong>RESSIVOS
                </>
            ),

            posicao: {
                top: '-30%',
                left: '37.5%',
                scale: '.97'
            },

            filtro: {
                angle: '20deg',
                start: '#0E0B18 45%',
                end: '#290d1b91 70%'
            },

            paragrafo: 'Os confrontos no Universo do Medo vão além de rolagens. É possível explorar diferentes estilos de jogo, criar builds únicas e personalizar rituais que refletem quem seu personagem é — e até no que ele acredita.',

        },
        {
            id: 3,
            fundo: '/imagensFigma/slide-marcas-permanentes.webp',
            sobreposicao: '/imagensFigma/sobreposicao-slide-marcas.webp',
            slide: 'marcas permanentes',

            titulo: (
                <>
                    <strong>M</strong>ARCAS <strong>P</strong>ERMANENTES
                </>
            ),

            posicao: {
                top: '-46.75%',
                left: '7%',
                scale: '.97'
            },

            filtro: {
                angle: '-35deg',
                start: '#0E0B18 50%',
                end: '#290d1b91 90%'
            },

            paragrafo: 'Algumas escolhas não podem ser desfeitas. Certas decisões atravessam campanhas, redefinem eventos e ficam gravadas para sempre na história do Universo do Medo.',

        },

        {
            id: 4,
            fundo: '/imagensFigma/slide-influencia-mutua.webp',
            sobreposicao: '/imagensFigma/sobreposicao-influencia2.webp',
            slide: 'influencia mutua',

            titulo: (
                <>
                    <strong>I</strong>NFLUÊNCIA <strong>M</strong>ÚTUA
                </>
            ),

            posicao: {
                top: '-185%',
                left: '-72.5%',
                scale: '.41'
            },

            filtro: {
                angle: '-35deg',
                start: '#0E0B18 50%',
                end: '#290d1b91 90%'
            },

            paragrafo: 'O Universo do Medo está em constante movimento. Assim como suas ações moldam o mundo, ele também molda seus personagens — afetando decisões, relações e até a forma como o medo se manifesta.',

        },
    ];


    const settings: Settings = {
        fade: true,
        dots: true,
        dotsClass: `slick-dots ${styles.dotsArtigo}`,
        autoplay: false,
        autoplaySpeed: 5500,
        infinite: true,
        speed: 1200,
        slidesToShow: 1,
        centerMode: false,
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

                <div key={slideAtivo} className={styles.recipiente_texto_artigo}>
                    <h3 className={styles.titulo_slide}>{slideAtual.titulo}</h3>
                    <p className={styles.paragrafo_slide}>{slideAtual.paragrafo}</p>
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
                                        alt={item.slide}
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
