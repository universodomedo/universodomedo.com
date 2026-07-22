'use client';

import { createContext, useCallback, useContext } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { Contexto__PaginaDocumentacaoProduto__Props } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Edicao from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Edicao/SPA__PaginaDocumentacaoProduto__Edicao';

export type RegistroVinculoEdicao = ReturnType<typeof obtemListagemVinculosTodos>['registros'][number];
export type RegistroPassoEdicao = ReturnType<typeof obtemListagemPassosEdicao>['registros'][number];
export type RegistroPaginaCtaEdicao = ReturnType<typeof obtemListagemPaginasCtasTodas>['registros'][number];
export type RegistroSecaoEdicao = ReturnType<typeof obtemListagemSecoesTodas>['registros'][number];
export type RegistroPublicoEdicao = ReturnType<typeof obtemListagemPublicosTodos>['registros'][number];
export type RegistroMensagemEdicao = ReturnType<typeof obtemListagemMensagensTodas>['registros'][number];

export interface Contexto__PaginaDocumentacaoProduto__Edicao__Props {
    listagemPaginas: Contexto__PaginaDocumentacaoProduto__Props['listagemPaginas'];
    listagemDocumentacoes: Contexto__PaginaDocumentacaoProduto__Props['listagemDocumentacoes'];
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemPersonas'];
    listagemNecessidades: Contexto__PaginaDocumentacaoProduto__Props['listagemNecessidades'];
    listagemLigacoes: Contexto__PaginaDocumentacaoProduto__Props['listagemLigacoes'];
    listagemJornadas: Contexto__PaginaDocumentacaoProduto__Props['listagemJornadas'];
    listagemCtas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtas'];
    listagemCtasPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtasPersonas'];
    listagemTiposSecao: Contexto__PaginaDocumentacaoProduto__Props['listagemTiposSecao'];
    listagemVinculos: ReturnType<typeof obtemListagemVinculosTodos>;
    listagemPassos: ReturnType<typeof obtemListagemPassosEdicao>;
    listagemPaginasCtas: ReturnType<typeof obtemListagemPaginasCtasTodas>;
    listagemSecoes: ReturnType<typeof obtemListagemSecoesTodas>;
    listagemPublicos: ReturnType<typeof obtemListagemPublicosTodos>;
    listagemMensagens: ReturnType<typeof obtemListagemMensagensTodas>;
    estaDocumentada: (idPagina: number) => boolean;
    exportarPdf: () => void;
};

type PropsProvider = Pick<Contexto__PaginaDocumentacaoProduto__Props, 'listagemPaginas' | 'listagemDocumentacoes' | 'listagemPersonas' | 'listagemNecessidades' | 'listagemLigacoes' | 'listagemJornadas' | 'listagemCtas' | 'listagemCtasPersonas' | 'listagemTiposSecao' | 'estaDocumentada'> & { fecharEdicao: () => void };

const Contexto__PaginaDocumentacaoProduto__Edicao = createContext<Contexto__PaginaDocumentacaoProduto__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Edicao = (): Contexto__PaginaDocumentacaoProduto__Edicao__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Edicao);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Edicao precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Edicao');
    return context;
};

export const Contexto__PaginaDocumentacaoProduto__Edicao__Provider = ({ fecharEdicao, ...props }: PropsProvider) => {
    const listagemVinculos = obtemListagemVinculosTodos();
    const listagemPassos = obtemListagemPassosEdicao();
    const listagemPaginasCtas = obtemListagemPaginasCtasTodas();
    const listagemSecoes = obtemListagemSecoesTodas();
    const listagemPublicos = obtemListagemPublicosTodos();
    const listagemMensagens = obtemListagemMensagensTodas();

    // Navegação contextual: título estável (da PÁGINA); subtítulo identifica a edição; o X volta pra listagem. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: 'Edição (PDF)',
        fecharProps: { tipo: 'acao', executar: fecharEdicao, tituloTooltip: 'Voltar para a listagem' },
    });

    // O "Exportar para PDF" renderiza o documento pelo diálogo de impressão do navegador (destino: Salvar como PDF).
    const exportarPdf = useCallback(() => window.print(), []);

    return (
        <Contexto__PaginaDocumentacaoProduto__Edicao.Provider value={{ ...props, listagemVinculos, listagemPassos, listagemPaginasCtas, listagemSecoes, listagemPublicos, listagemMensagens, exportarPdf }}>
            <SPA__PaginaDocumentacaoProduto__Edicao />
        </Contexto__PaginaDocumentacaoProduto__Edicao.Provider>
    );
};

//

// Todos os vínculos documentação↔necessidade — a edição imprime as necessidades servidas por cada verbete.
function obtemListagemVinculosTodos() {
    return useNoraGraphQLListagem('DocumentacaoPaginaNecessidade', {
        select: ['id', 'fkDocumentacoesPaginasId', 'motivo', 'atendida', { necessidade: ['id', 'titulo', 'fkPersonasId'] }],
        itensPorPagina: 1000,
        carregando: 'Buscando vínculos',
        mensagemErro: 'Houve um erro recuperando os vínculos',
        mensagemListaVazia: 'Nenhum vínculo registrado.',
        mensagemListaVaziaComFiltro: 'Nenhum vínculo encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Todos os passos de jornada — a edição imprime cada jornada com o caminho completo.
function obtemListagemPassosEdicao() {
    return useNoraGraphQLListagem('JornadaPasso', {
        select: ['id', 'fkJornadasId', 'fkPaginasNavegacaoId', 'nota', 'ordem'],
        itensPorPagina: 1000,
        carregando: 'Buscando passos',
        mensagemErro: 'Houve um erro recuperando os passos',
        mensagemListaVazia: 'Nenhum passo registrado.',
        mensagemListaVaziaComFiltro: 'Nenhum passo encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Todas as aparições de CTA por página — a edição imprime as CTAs de cada página.
function obtemListagemPaginasCtasTodas() {
    return useNoraGraphQLListagem('PaginaCta', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkCtasId', 'prioridade', 'nota'],
        itensPorPagina: 1000,
        carregando: 'Buscando CTAs por página',
        mensagemErro: 'Houve um erro recuperando as CTAs por página',
        mensagemListaVazia: 'Nenhuma CTA por página.',
        mensagemListaVaziaComFiltro: 'Nenhuma CTA encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { prioridade: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Todas as seções documentais — a edição imprime as seções de cada página configurável.
function obtemListagemSecoesTodas() {
    return useNoraGraphQLListagem('Secao', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkTiposSecaoId', 'nome', 'objetivo', 'conteudoEditavel', 'ordem'],
        itensPorPagina: 1000,
        carregando: 'Buscando seções',
        mensagemErro: 'Houve um erro recuperando as seções',
        mensagemListaVazia: 'Nenhuma seção registrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma seção encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Todos os públicos graduados por página — a edição imprime os públicos e seus graus.
function obtemListagemPublicosTodos() {
    return useNoraGraphQLListagem('DocumentacaoPaginaPersona', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkPersonasId', 'grau'],
        itensPorPagina: 1000,
        carregando: 'Buscando públicos por página',
        mensagemErro: 'Houve um erro recuperando os públicos por página',
        mensagemListaVazia: 'Nenhum público por página.',
        mensagemListaVaziaComFiltro: 'Nenhum público encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Todas as mensagens-chave — a edição imprime as mensagens de cada público-de-página.
function obtemListagemMensagensTodas() {
    return useNoraGraphQLListagem('MensagemChave', {
        select: ['id', 'fkDocumentacoesPaginasPersonasId', 'texto', 'ordem'],
        itensPorPagina: 2000,
        carregando: 'Buscando mensagens-chave',
        mensagemErro: 'Houve um erro recuperando as mensagens-chave',
        mensagemListaVazia: 'Nenhuma mensagem-chave.',
        mensagemListaVaziaComFiltro: 'Nenhuma mensagem encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};