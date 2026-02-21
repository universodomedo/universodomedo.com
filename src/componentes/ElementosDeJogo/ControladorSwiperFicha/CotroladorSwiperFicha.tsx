'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import combineProviders from 'Contextos/combineProviders';
import PaginaControleAtributosPericias from './PaginaControleAtributosPericias/PaginaControleAtributosPericias';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAtributosPericias/contexto';
import CarrosselSwiperDireita from '../CarrosselSwiperDireita/CarrosselSwiperDireita';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function ControladorSwiperFicha() {
    const ProvidersControle = combineProviders(
        ContextoControleAtributosPericiasProvider,
    );

    return (
        <ProvidersControle>
            <ControladorSwiperFicha_ComContexto />
        </ProvidersControle>
    );
}

function ControladorSwiperFicha_ComContexto() {
    const listaPaginas = [
        {
            nome: 'Perícias',
            componente: <PaginaControleAtributosPericias />,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Inventário',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Habilidades',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Registros',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
    ];

    const [paginaAbertaSwiper, setPaginaAbertaSwiper] = useState(0);
    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);

    const paginaSelecionada = listaPaginas[paginaAbertaSwiper];

    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);

    return (
        <div className={`${styles.swiper_direita} ${!swiperDireitaAberto ? styles.swiper_direita_fechado : ''}`}>
            <button onClick={alternaSwiperDireitaAberto} className={styles.botao_swiper_direita}>
                <RecipienteImagem src={'hi/avatar/4fbe625e-8ecc-403f-967e-6041428f4b50.png'} />
            </button>
            <div id={styles.conteudo_swiper_direita}>
                <CarrosselSwiperDireita listaPaginas={listaPaginas} setPaginaAbertaSwiper={setPaginaAbertaSwiper} paginaAbertaSwiper={paginaAbertaSwiper} />

                <hr style={{ width: '100%' }} />

                {paginaSelecionada.componente}
            </div>
        </div>
    );
}