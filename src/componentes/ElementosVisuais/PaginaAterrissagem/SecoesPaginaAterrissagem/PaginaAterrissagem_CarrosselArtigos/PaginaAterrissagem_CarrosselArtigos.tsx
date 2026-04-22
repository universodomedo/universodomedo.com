'use client';

import styles from './styles.module.css'

import { CSSProperties, ReactNode, useState } from 'react';
import Slider, { Settings } from "react-slick";
import { ArquivoInternoKey, ARQUIVOS_INTERNOS } from 'types-nora-api';

import BotaoCarrossel from 'Componentes/ElementosVisuais/ElementosCarroseis/BotaoCarrossel/BotaoCarrossel';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';

type PaginaAterrissagem_CarrosselArtigos_Item = {
    id: number;
    fundo: ArquivoInternoKey;
    sobreposicao: ArquivoInternoKey;
    slide: string;
    titulo: ReactNode;
    posicao: Pick<CSSProperties, 'top' | 'left' | 'scale'>;
    filtro: { angle: string; start: string; end: string; };
    paragrafo: string;
};

export default function PaginaAterrissagem_CarrosselArtigos() {
    const [slideAtivo, setSlideAtivo] = useState(0);

    const lista: PaginaAterrissagem_CarrosselArtigos_Item[] = [
        {
            id: 1,
            fundo: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_1__FUNDO',
            sobreposicao: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_1__SOBREPOSICAO',
            slide: 'investigacao conjunta',
            titulo: <><strong>I</strong>NVESTIGAÇÃO <strong>CO</strong>NJUNTA</>,
            posicao: { top: '-32%', left: '13%', scale: '0.95' },
            filtro: { angle: '-20deg', start: '#0E0B18 45%', end: '#290d1b91' },
            paragrafo: 'Unindo forças, conectando descobertas e investigando o paranormal, os jogadores deixam marcas reais no mundo. Desvendando pouco a pouco o que a realidade tem de mais obscuro.',
        },
        {
            id: 2,
            fundo: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_2__FUNDO',
            sobreposicao: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_2__SOBREPOSICAO',
            slide: 'combates expressivos',
            titulo: <><strong>COM</strong>BATES <strong>EXP</strong>RESSIVOS</>,
            posicao: { top: '-30%', left: '37.5%', scale: '.97' },
            filtro: { angle: '20deg', start: '#0E0B18 45%', end: '#290d1b91 70%' },
            paragrafo: 'Os confrontos no Universo do Medo vão além de rolagens. É possível explorar diferentes estilos de jogo, criar builds únicas e personalizar rituais que refletem quem seu personagem é — e até no que ele acredita.',
        },
        {
            id: 3,
            fundo: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_3__FUNDO',
            sobreposicao: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_3__SOBREPOSICAO',
            slide: 'marcas permanentes',
            titulo: <><strong>M</strong>ARCAS <strong>P</strong>ERMANENTES</>,
            posicao: { top: '-46.75%', left: '7%', scale: '.97' },
            filtro: { angle: '-35deg', start: '#0E0B18 50%', end: '#290d1b91 90%' },
            paragrafo: 'Algumas escolhas não podem ser desfeitas. Certas decisões atravessam campanhas, redefinem eventos e ficam gravadas para sempre na história do Universo do Medo.',
        },

        {
            id: 4,
            fundo: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_4__FUNDO',
            sobreposicao: 'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__ARTIGO_4__SOBREPOSICAO',
            slide: 'influencia mutua',
            titulo: <><strong>I</strong>NFLUÊNCIA <strong>M</strong>ÚTUA</>,
            posicao: { top: '-185%', left: '-72.5%', scale: '.41' },
            filtro: { angle: '-35deg', start: '#0E0B18 50%', end: '#290d1b91 90%' },
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
        nextArrow: <BotaoCarrossel arquivo={ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__SETA_PROXIMO} classNameExterno={styles.botao_next}/>,
        prevArrow: <BotaoCarrossel arquivo={ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__SETA_ANTERIOR} classNameExterno={styles.botao_prev}/>,
        beforeChange: (_current, next) => {
            setSlideAtivo(next);
        }
    };

    const slideAtual = lista[slideAtivo]

    return (
        <div className={styles.recipiente_artigo_carrossel}>
            <div className={styles.recipiente_carrossel}>
                <div className={styles.absolute_layout}>
                    <div className={styles.recipiente_layout_artigo_carrossel} style={{ '--filtro-angle': slideAtual.filtro.angle, '--filtro-start': slideAtual.filtro.start, '--filtro-end': slideAtual.filtro.end, } as React.CSSProperties}>
                        <figure className={styles.borda_principal}>
                            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__BORDA'} />
                        </figure>

                        <figure className={styles.borda_dourada}>
                            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__BORDA_DOURADA'} />
                        </figure>

                        <div className={styles.filtro_slides} style={{ ['--mascara-carrossel' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__MASCARA_CARROSSEL)}")` }}/>
                    </div>
                </div>

                <div key={slideAtivo} className={styles.recipiente_texto_artigo}>
                    <h3 className={styles.titulo_slide}>{slideAtual.titulo}</h3>
                    <p className={styles.paragrafo_slide}>{slideAtual.paragrafo}</p>
                </div>

                <div className={styles.overlayLayer}>
                    {lista[slideAtivo] && lista[slideAtivo].sobreposicao && (
                        <RecipienteArquivoInterno key={slideAtivo} arquivo={lista[slideAtivo].sobreposicao} className={styles.sobreposicao_slide} alt={lista[slideAtivo].slide} style={lista[slideAtivo].posicao} />
                    )}
                </div>

                <div className={styles.sliderWrapper} style={{ ['--dot-carrossel' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__DOT)}")`, ['--dot-ativo' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__DOT_ATIVO)}")`, ['--mascara-carrossel' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__MASCARA_CARROSSEL)}")`, ['--moldura-esquerda' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__MOLDURA_DOTS__ESQUERDA)}")`, ['--moldura-direita' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__MOLDURA_DOTS__DIREITA)}")` }}>

                    <Slider {...settings}>
                        {lista.map(item => (
                            <div key={item.id} className={styles.recipiente_slides_carrossel}>
                                <div className={styles.recipiente_slides}>
                                    <RecipienteArquivoInterno arquivo={item.fundo} className={styles.imagem_fundo_carrossel} alt={item.slide} />
                                </div>
                            </div>
                        ))}
                    </Slider>

                    <div className={styles.recipiente_arestas} style={{ ['--ornamento' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__ORNAMENTO_TOPO)}")`, ['--moldura-esquerda' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__MOLDURA_DOTS__ESQUERDA)}")`, ['--moldura-direita' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__CARROSSEL_PRINCIPAL__MOLDURA_DOTS__DIREITA)}")` }}>
                        <figure className={styles.borda_arestas}>
                            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__CARROSSEL_ARTIGOS__SETAS_FUNDO'} />
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    );
};