'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import combineProviders from 'Contextos/combineProviders';
import PaginaControleAtributosPericias from './PaginaControleAtributosPericias/PaginaControleAtributosPericias';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAtributosPericias/contexto';
import CarrosselSwiperDireita from '../CarrosselSwiperDireita/CarrosselSwiperDireita';

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
            nome: 'Teste1',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Teste2',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Teste3',
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
            <button onClick={alternaSwiperDireitaAberto} className={styles.botao_swiper_direita}>o</button>
            <div id={styles.conteudo_swiper_direita}>
                <CarrosselSwiperDireita listaPaginas={listaPaginas} setPaginaAbertaSwiper={setPaginaAbertaSwiper} paginaAbertaSwiper={paginaAbertaSwiper} />

                <hr style={{ width: '100%' }} />

                {paginaSelecionada.componente}
            </div>
        </div>
    );
}