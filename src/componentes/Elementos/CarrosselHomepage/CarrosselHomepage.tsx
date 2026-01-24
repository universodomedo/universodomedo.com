'use client';

//Carrossel com *Número Mínimo* de Slides = 4.
// Não está suportando números impares de slides (dessincroniza com titulo) devido ao infinite mode. 

import { useState } from 'react';
import BotaoCarrossel from 'Componentes/ElementosVisuais/ElementosCarroseis/BotaoCarrossel/BotaoCarrossel';
import styles from './styles.module.css';

import Slider, { Settings } from "react-slick"; 

export default function CarrosselHomepage() {

    const [slideAtivo, setSlideAtivo] = useState(0);

    const lista = [
        {
            imagem: "/miyata-disponibilidades.png",
            titulo: "Encontre uma mesa",
            descricao: "Configurar suas disponibilidades é essencial para encontrarmos uma mesa pra você!",
            link: "https://universodomedo.com/minhas-paginas/minhas-disponibilidades",
        },
        {
            imagem: "/capa-nahid2.png",
            titulo: "Assista ao vivo",
            descricao: "Acompanhe as transmissões dos episódios em tempo real.",
            link: '',
        },
        {
            imagem: "/T3-E29.webp",
            titulo: "Cerco",
            descricao: "E das sombras surge uma figura...",
            link: '',
        },
        {
            imagem: "/T3-E29.webp",
            titulo: "Cerco",
            descricao: "E das sombras surge uma figura...",
            link: '',
        },
    ];

    const settings: Settings = {
        initialSlide: 0,
        dots: true,
        dotsClass: `slick-dots ${styles.dots}`,
        autoplay: false,
        autoplaySpeed: 5500,
        infinite: true,
        speed: 1200,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '0',
        nextArrow: (
            <BotaoCarrossel
                classNameExterno={styles.botao_next}
                imagemUrl={"/imagensFigma/slide_b_over_r.svg"}
            />
        ),
        prevArrow: (
            <BotaoCarrossel
                classNameExterno={styles.botao_prev}
                imagemUrl={"/imagensFigma/slide_b_over_l.svg"}
            />
        ),
        
        beforeChange: (_current, next) => {
            const indiceReal = next % lista.length;
            setSlideAtivo(indiceReal);
        },

    };

    const slideCentral = lista[slideAtivo];

    return (

        <div className={styles.recipiente_secao_novoCarrossel}>

            <DescricaoSlides />

            <RecipienteLayoutBordas />

            <div className={styles.sliderWrapper}>
                <Slider {...settings}>
                    {lista.map((item, index) => (
                        <img
                            key={index}
                            src={item.imagem}
                            alt={item.titulo}
                        />
                    ))}
                </Slider>
            </div>
        </div>
    );

    function DescricaoSlides() {
        return <div className={styles.auto_alinhamento_texto}>
            <div key={slideAtivo} className={styles.relative_recipiente_texto}>
                <div
                    key={slideAtivo}
                    className={styles.recipiente_texto_carrossel}
                >
                    <a className={styles.link_atrelado} href={slideCentral.link}>
                        <h2 className={styles.titulo}>
                            {slideCentral.titulo}
                        </h2>
                        <p className={styles.descricao}>
                            {slideCentral.descricao}
                        </p>
                    </a>
                </div>
            </div>
        </div>;
    }
}

function RecipienteLayoutBordas() {
    return (
        <div className={styles.recipiente_absolute_layout}>
            <div className={styles.recipiente_layout}>
                <div className={styles.recipiente_bordas}>
                    <RecipienteBordasLaterais />
                    <LayoutSlidePrincipal />
                </div>
            </div>
        </div>
    );
}

function RecipienteBordasLaterais() {
    return (
        <div className={styles.recipiente_detalhe_borda}>
            <div className={styles.recipiente_detalhes}>
                <div className={styles.detalhe_borda1}>
                    <div className={styles.borda_interna1} />
                </div>

                <div className={styles.flex_detalhe_borda} />

                <div className={styles.detalhe_borda2}>
                    <div className={styles.borda_interna2} />
                </div>
            </div>
        </div>
    );
}

function LayoutSlidePrincipal() {
    return (
        <div className={styles.slide_principal}>

            <div className={styles.ornamentos_carrossel}>
                <figure className={styles.ornamento_relative} />
            </div>

            <div className={styles.borda_slide2} />

            <img
                className={styles.side_bl}
                src="/imagensFigma/crystal-botao-esquerda.svg"
                alt=""
            />

            <img
                className={styles.side_br}
                src="/imagensFigma/crystal-azul-direita.svg"
                alt=""
            />

            <img
                className={styles.adesivos}
                src="/imagensFigma/adesivos.svg"
                alt=""
            />

            <img
                className={styles.moldura_carrossel}
                src="/imagensFigma/moldura_carrossel.svg"
                alt=""
            />
        </div>
    );
}
