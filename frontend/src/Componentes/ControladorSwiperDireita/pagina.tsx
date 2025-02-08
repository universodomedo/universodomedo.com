// #region Imports
import style from './style.module.css';
import { useState } from 'react';

import CarrosselSwiperDireita from 'Componentes/Carrosseis/CarrosselSwiperDireita/pagina.tsx';

import PaginaControleEfeitos from 'Paginas/SubPaginas/ControleFicha/PaginaControleEfeitos/pagina';
import PaginaControleAtributosPericias from 'Paginas/SubPaginas/ControleFicha/PaginaControleAtributosPericias/pagina';
import PaginaControleInventario from 'Paginas/SubPaginas/ControleFicha/PaginaControleInventario/pagina';
import PaginaControleAcoes from 'Paginas/SubPaginas/ControleFicha/PaginaControleAcoes/pagina';
import PaginaControleHabilidades from 'Paginas/SubPaginas/ControleFicha/PaginaControleHabilidades/pagina';
import PaginaControleRituais from 'Paginas/SubPaginas/ControleFicha/PaginaControleRituais/pagina';

import { ContextoControleEfeitosProvider, useContextoControleEfeitos } from 'Contextos/ContextoControleEfeitos/contexto.tsx';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextoControleAtributosPericias/contexto.tsx';
import { ContextoControleInventarioProvider, useContextoControleInventario } from 'Contextos/ContextoControleInventario/contexto.tsx';
import { ContextoControleAcoesProvider, useContextoControleAcoes } from 'Contextos/ContextoControleAcoes/contexto.tsx';
import { ContextoControleHabilidadesProvider, useContextoControleHabilidades } from 'Contextos/ContextoControleHabilidades/contexto.tsx';
import { ContextoControleRituaisProvider, useContextoControleRituais } from 'Contextos/ContextoControleRituais/contexto.tsx';

import { combineProviders } from 'Uteis/uteis.tsx';
// #endregion

const pagina = () => {
    const ProvidersControle = combineProviders(
        ContextoControleEfeitosProvider,
        ContextoControleAtributosPericiasProvider,
        ContextoControleInventarioProvider,
        ContextoControleAcoesProvider,
        ContextoControleHabilidadesProvider,
        ContextoControleRituaisProvider
    );

    return (
        <ProvidersControle>
            <PaginaComContexto />
        </ProvidersControle>
    );
}

const PaginaComContexto = () => {
    const listaPaginas = [
        {
            nome: 'Perícias',
            componente: <PaginaControleAtributosPericias />,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Ações',
            componente: <PaginaControleAcoes />,
            contexto: useContextoControleAcoes
        },
        {
            nome: 'Inventário',
            componente: <PaginaControleInventario />,
            contexto: useContextoControleInventario
        },
        // {
        //     nome: 'Habilidades',
        //     componente: <PaginaControleHabilidades />,
        //     contexto: useContextoControleHabilidades
        // },
        {
            nome: 'Rituais',
            componente: <PaginaControleRituais />,
            contexto: useContextoControleRituais
        },
        {
            nome: 'Efeitos',
            componente: <PaginaControleEfeitos />,
            contexto: useContextoControleEfeitos
        },
    ];

    const [paginaAbertaSwiper, setPaginaAbertaSwiper] = useState(0);
    const paginaSelecionada = listaPaginas[paginaAbertaSwiper];

    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);
    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);

    return (
        <div className={`${style.swiper_direita} ${!swiperDireitaAberto ? style.swiper_direita_fechado : ''}`}>
            <button onClick={alternaSwiperDireitaAberto} className={style.botao_swiper_direita}>o</button>
            <div id={style.conteudo_swiper_direita}>
                <CarrosselSwiperDireita listaPaginas={listaPaginas} setPaginaAbertaSwiper={setPaginaAbertaSwiper} paginaAbertaSwiper={paginaAbertaSwiper} />

                <hr style={{ width: '100%' }} />

                {paginaSelecionada.componente}
            </div>
        </div>
    );
}

export default pagina;