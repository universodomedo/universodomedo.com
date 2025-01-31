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
import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
// #endregion

type ProviderProps = {
    children: React.ReactNode;
};

const combineProviders = (...providers: React.FC<ProviderProps>[]) => {
    return ({ children }: ProviderProps) =>
        providers.reduceRight((acc, Provider) => {
            return <Provider>{acc}</Provider>;
        }, children);
};

const ProvidersControle = combineProviders(
    ContextoControleEfeitosProvider,
    ContextoControleAtributosPericiasProvider,
    ContextoControleInventarioProvider,
    ContextoControleAcoesProvider,
    ContextoControleHabilidadesProvider,
    ContextoControleRituaisProvider
);

const pagina = () => {
    const personagem = getPersonagemFromContext();

    const listaPaginas = [
        {
            nome: 'Perícias',
            componente: <PaginaControleAtributosPericias atributos={personagem.atributos} pericias={personagem.pericias} />,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Ações',
            componente: <PaginaControleAcoes acoesPersonagem={personagem.acoes} />,
            contexto: useContextoControleAcoes
        },
        {
            nome: 'Inventário',
            componente: <PaginaControleInventario estatisticasBuffaveis={personagem.estatisticasBuffaveis} inventarioPersonagem={personagem.inventario} />,
            contexto: useContextoControleInventario
        },
        {
            nome: 'Habilidades',
            componente: <PaginaControleHabilidades habilidadesPersonagem={personagem.habilidades} />,
            contexto: useContextoControleHabilidades
        },
        {
            nome: 'Rituais',
            componente: <PaginaControleRituais rituaisPersonagem={personagem.rituais} />,
            contexto: useContextoControleRituais
        },
        {
            nome: 'Efeitos',
            componente: <PaginaControleEfeitos controladorModificadores={personagem.controladorModificadores} />,
            contexto: useContextoControleEfeitos
        },
    ];

    const [paginaAbertaSwiper, setPaginaAbertaSwiper] = useState(0);
    const paginaSelecionada = listaPaginas[paginaAbertaSwiper];

    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);
    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);

    return (
        <ProvidersControle>
            <div className={`${style.swiper_direita} ${!swiperDireitaAberto ? style.swiper_direita_fechado : ''}`}>
                <button onClick={alternaSwiperDireitaAberto} className={style.botao_swiper_direita}>o</button>
                <div id={style.conteudo_swiper_direita}>
                    <CarrosselSwiperDireita listaPaginas={listaPaginas} setPaginaAbertaSwiper={setPaginaAbertaSwiper} paginaAbertaSwiper={paginaAbertaSwiper} />

                    <hr style={{ width: '100%' }} />

                    {paginaSelecionada.componente}
                </div>
            </div>
        </ProvidersControle>
    );
}

export default pagina;