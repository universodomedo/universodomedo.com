'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import Slider, { Settings } from "react-slick";

import BotaoCarrossel from 'Componentes/ElementosVisuais/ElementosCarroseis/BotaoCarrossel/BotaoCarrossel';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';

//Carrossel com *Número Mínimo* de Slides = 4.
// Não está suportando números impares de slides (dessincroniza com titulo) devido ao infinite mode. 
export default function CarrosselHomepage() {

    const [slideAtivo, setSlideAtivo] = useState(0);

    const lista = [
        {
            imagem: "https://cdn.universodomedo.com/RecursosPublicos/imagem_especial_artista/e1e4973b-d681-4387-8028-2cce061939c6.webp",
            titulo: "O Universo do Medo",
            descricao: "Participe dessa história! Descubra seus segredos e seu misterioso destino",
            link: '',
        },
        {
            imagem: "https://cdn.universodomedo.com/RecursosPublicos/imagem_especial_artista/7b1822c9-a109-4eea-a28d-382fa8f28f59.webp",
            titulo: "Diferentes épocas, o mesmo Medo!",
            descricao: "Desvende o Paranormal através do tempo jogando em diferentes épocas",
            link: '',
        },
        // {
        //     imagem: "/miyata-disponibilidades.png",
        //     titulo: "Encontre uma mesa",
        //     descricao: "Configurar suas disponibilidades é essencial para encontrarmos uma mesa pra você!",
        //     link: "https://universodomedo.com/minhas-paginas/minhas-disponibilidades",
        // },
        {
            imagem: "https://cdn.universodomedo.com/RecursosPublicos/imagem_especial_artista/8cf7fa8a-d0ef-4c66-800b-9bb208c2fc5b.webp",
            titulo: "Assista ao vivo!",
            descricao: "Acompanhe as transmissões dos episódios em tempo real",
            link: '',
        },
        {
            imagem: "https://cdn.universodomedo.com/RecursosPublicos/imagem_especial_artista/049fd99a-5185-45bf-9d9e-f6f863aaff62.webp",
            titulo: "Encare o Medo de frente!",
            descricao: "Atenda o chamado do Paranormal, ou sofra as consequências",
            link: '',
        },
    ];

    const settings: Settings = {
        initialSlide: 0,
        dots: true,
        dotsClass: `slick-dots ${styles.dots}`,
        autoplay: true,
        autoplaySpeed: 9000,
        infinite: true,
        speed: 2000,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '0',
        nextArrow: (
            <BotaoCarrossel
                classNameExterno={styles.botao_next}
                arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__SETA_PROXIMO'}
            />
        ),
        prevArrow: (
            <BotaoCarrossel
                classNameExterno={styles.botao_prev}
                arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__SETA_ANTERIOR'}
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

            <div className={styles.sliderWrapper} style={{ ['--dot-carrossel' as never]: `url("${carregaArquivoInterno({ arquivo: 'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__DOT' })}")`, ['--dot-ativo' as never]: `url("${carregaArquivoInterno({ arquivo: 'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__DOT_ATIVO' })}")`, ['--moldura-direita' as never]: `url("${carregaArquivoInterno({ arquivo: 'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__MOLDURA_DOTS__DIREITA' })}")`, ['--moldura-esquerda' as never]: `url("${carregaArquivoInterno({ arquivo: 'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__MOLDURA_DOTS__ESQUERDA' })}")`, }}>
                <Slider {...settings}>
                    {lista.map((item, index) => <img key={index} src={item.imagem} alt={item.titulo} />)}
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
    };
};

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
};

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
};

function LayoutSlidePrincipal() {
    return (
        <div className={styles.slide_principal}>

            <div className={styles.ornamentos_carrossel}>
                <figure className={styles.ornamento_relative} style={{ ['--ornamento' as never]: `url("${carregaArquivoInterno({ arquivo: "PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__ORNAMENTO_TOPO" })}")` }}/>
            </div>

            <div className={styles.borda_slide2} />

            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__CRISTAL_ESQUERDA'} className={styles.side_bl}/>
            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__CRISTAL_DIREITA'} className={styles.side_br}/>
            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__ADESIVOS'} className={styles.adesivos}/>
            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__MOLDURA'} className={styles.moldura_carrossel}/>
        </div>
    );
};