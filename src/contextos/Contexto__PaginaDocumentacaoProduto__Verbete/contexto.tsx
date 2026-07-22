'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { Contexto__PaginaDocumentacaoProduto__Props, RegistroDocumentacaoPagina, RegistroPaginaParaDocumentar } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Verbete from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Verbete/SPA__PaginaDocumentacaoProduto__Verbete';

export type RegistroVinculoVerbete = ReturnType<typeof obtemListagemVinculos>['registros'][number];
export type RegistroPublicoVerbete = ReturnType<typeof obtemListagemPublicos>['registros'][number];
export type RegistroMensagemVerbete = ReturnType<typeof obtemListagemMensagens>['registros'][number];
export type RegistroPaginaCtaVerbete = ReturnType<typeof obtemListagemPaginasCtas>['registros'][number];
export type RegistroSecaoVerbete = ReturnType<typeof obtemListagemSecoes>['registros'][number];
export type RegistroSecaoPersonaVerbete = ReturnType<typeof obtemListagemSecoesPersonas>['registros'][number];

export interface Contexto__PaginaDocumentacaoProduto__Verbete__Props {
    pagina: RegistroPaginaParaDocumentar;
    documentacao: RegistroDocumentacaoPagina | null;
    listagemVinculos: ReturnType<typeof obtemListagemVinculos>;
    listagemPublicos: ReturnType<typeof obtemListagemPublicos>;
    listagemMensagens: ReturnType<typeof obtemListagemMensagens>;
    listagemPaginasCtas: ReturnType<typeof obtemListagemPaginasCtas>;
    listagemSecoes: ReturnType<typeof obtemListagemSecoes>;
    listagemSecoesPersonas: ReturnType<typeof obtemListagemSecoesPersonas>;
    listagemCtas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtas'];
    listagemCtasPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtasPersonas'];
    nomePersonaPorId: (idPersona: number) => string;
    rotuloTipoSecao: (idTipo: number) => string;
    rotuloDestinoCta: (idCta: number) => string;
    idPaginaDestinoCta: (idCta: number) => number | null;
    abrirVerbetePorId: (idPagina: number) => void;
    abrirEdicao: () => void;
};

type PropsProvider = {
    pagina: RegistroPaginaParaDocumentar;
    documentacao: RegistroDocumentacaoPagina | null;
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemPersonas'];
    listagemCtas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtas'];
    listagemCtasPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtasPersonas'];
    listagemTiposSecao: Contexto__PaginaDocumentacaoProduto__Props['listagemTiposSecao'];
    listagemPaginas: Contexto__PaginaDocumentacaoProduto__Props['listagemPaginas'];
    listagemJornadas: Contexto__PaginaDocumentacaoProduto__Props['listagemJornadas'];
    selecionarPagina: Contexto__PaginaDocumentacaoProduto__Props['selecionarPagina'];
    abrirEdicao: () => void;
    voltar: () => void;
};

const Contexto__PaginaDocumentacaoProduto__Verbete = createContext<Contexto__PaginaDocumentacaoProduto__Verbete__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Verbete = (): Contexto__PaginaDocumentacaoProduto__Verbete__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Verbete);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Verbete precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Verbete');
    return context;
};

// Modo LEITURA do verbete: a página como documento (zero formulários). Editar é ação explícita que troca a vista no Controlador de Fluxo.
export const Contexto__PaginaDocumentacaoProduto__Verbete__Provider = ({ pagina, documentacao, listagemPersonas, listagemCtas, listagemCtasPersonas, listagemTiposSecao, listagemPaginas, listagemJornadas, selecionarPagina, abrirEdicao, voltar }: PropsProvider) => {
    // Navegação contextual: título estável (da PÁGINA); subtítulo identifica o verbete; o X volta pra listagem. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: pagina.label,
        fecharProps: { tipo: 'acao', executar: voltar, tituloTooltip: 'Voltar para a listagem' },
    });

    const listagemVinculos = obtemListagemVinculos(documentacao?.id ?? null);
    const listagemPublicos = obtemListagemPublicos(pagina.id);
    const listagemMensagens = obtemListagemMensagens();
    const listagemPaginasCtas = obtemListagemPaginasCtas(pagina.id);
    const listagemSecoes = obtemListagemSecoes(pagina.id);
    const listagemSecoesPersonas = obtemListagemSecoesPersonas();

    const nomePersonaPorId = useCallback((idPersona: number): string => listagemPersonas.registros.find(persona => persona.id === idPersona)?.nome ?? `Persona #${idPersona}`, [listagemPersonas.registros]);
    const rotuloTipoSecao = useCallback((idTipo: number): string => listagemTiposSecao.registros.find(tipo => tipo.id === idTipo)?.rotulo ?? `Tipo #${idTipo}`, [listagemTiposSecao.registros]);

    const rotuloDestinoCta = useCallback((idCta: number): string => {
        const cta = listagemCtas.registros.find(registro => registro.id === idCta);
        if (!cta) return '';
        if (cta.fkJornadasId !== null) return `Jornada: ${listagemJornadas.registros.find(jornada => jornada.id === cta.fkJornadasId)?.titulo ?? `#${cta.fkJornadasId}`}`;
        if (cta.fkPaginasNavegacaoId !== null) return `Página: ${listagemPaginas.registros.find(destino => destino.id === cta.fkPaginasNavegacaoId)?.label ?? `#${cta.fkPaginasNavegacaoId}`}`;
        return 'Sem destino';
    }, [listagemCtas.registros, listagemJornadas.registros, listagemPaginas.registros]);

    const idPaginaDestinoCta = useCallback((idCta: number): number | null => listagemCtas.registros.find(registro => registro.id === idCta)?.fkPaginasNavegacaoId ?? null, [listagemCtas.registros]);

    // Destino é referência navegável: abre o verbete da página destino (mesmo padrão do Mapa: nó → verbete).
    const abrirVerbetePorId = useCallback((idPagina: number): void => {
        const destino = listagemPaginas.registros.find(registro => registro.id === idPagina);
        if (destino) selecionarPagina(destino);
    }, [listagemPaginas.registros, selecionarPagina]);

    return (
        <Contexto__PaginaDocumentacaoProduto__Verbete.Provider value={{ pagina, documentacao, listagemVinculos, listagemPublicos, listagemMensagens, listagemPaginasCtas, listagemSecoes, listagemSecoesPersonas, listagemCtas, listagemCtasPersonas, nomePersonaPorId, rotuloTipoSecao, rotuloDestinoCta, idPaginaDestinoCta, abrirVerbetePorId, abrirEdicao }}>
            <SPA__PaginaDocumentacaoProduto__Verbete />
        </Contexto__PaginaDocumentacaoProduto__Verbete.Provider>
    );
};

//

// Vínculos de necessidade DESTA documentação (id 0 = sem documentação → lista vazia).
function obtemListagemVinculos(idDocumentacao: number | null) {
    const whereFixo = useMemo(() => ({ fkDocumentacoesPaginasId: { eq: idDocumentacao ?? 0 } }), [idDocumentacao]);
    return useNoraGraphQLListagem('DocumentacaoPaginaNecessidade', {
        select: ['id', 'fkDocumentacoesPaginasId', 'motivo', 'atendida', { necessidade: ['id', 'titulo', 'fkPersonasId'] }],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando necessidades vinculadas',
        mensagemErro: 'Houve um erro recuperando as necessidades vinculadas',
        mensagemListaVazia: 'Nenhuma necessidade vinculada ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma necessidade encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Públicos graduados DESTA página.
function obtemListagemPublicos(idPagina: number) {
    const whereFixo = useMemo(() => ({ fkPaginasNavegacaoId: { eq: idPagina } }), [idPagina]);
    return useNoraGraphQLListagem('DocumentacaoPaginaPersona', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkPersonasId', 'grau'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando públicos da página',
        mensagemErro: 'Houve um erro recuperando os públicos da página',
        mensagemListaVazia: 'Nenhum público desta página.',
        mensagemListaVaziaComFiltro: 'Nenhum público encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Mensagens-chave de todos os públicos (filtro client por vínculo).
function obtemListagemMensagens() {
    return useNoraGraphQLListagem('MensagemChave', {
        select: ['id', 'fkDocumentacoesPaginasPersonasId', 'texto', 'ordem'],
        itensPorPagina: 1000,
        carregando: 'Buscando mensagens-chave',
        mensagemErro: 'Houve um erro recuperando as mensagens-chave',
        mensagemListaVazia: 'Nenhuma mensagem-chave.',
        mensagemListaVaziaComFiltro: 'Nenhuma mensagem encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Aparições de CTA DESTA página, da mais prioritária pra menos.
function obtemListagemPaginasCtas(idPagina: number) {
    const whereFixo = useMemo(() => ({ fkPaginasNavegacaoId: { eq: idPagina } }), [idPagina]);
    return useNoraGraphQLListagem('PaginaCta', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkCtasId', 'prioridade', 'nota'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando CTAs da página',
        mensagemErro: 'Houve um erro recuperando as CTAs da página',
        mensagemListaVazia: 'Nenhuma CTA nesta página.',
        mensagemListaVaziaComFiltro: 'Nenhuma CTA encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { prioridade: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Seções documentais DESTA página na ordem do scroll.
function obtemListagemSecoes(idPagina: number) {
    const whereFixo = useMemo(() => ({ fkPaginasNavegacaoId: { eq: idPagina } }), [idPagina]);
    return useNoraGraphQLListagem('Secao', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkTiposSecaoId', 'nome', 'objetivo', 'conteudoEditavel', 'ordem'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando seções',
        mensagemErro: 'Houve um erro recuperando as seções',
        mensagemListaVazia: 'Nenhuma seção nesta página.',
        mensagemListaVaziaComFiltro: 'Nenhuma seção encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Públicos das seções (filtro client por seção — secoes_personas não tem coluna de página).
function obtemListagemSecoesPersonas() {
    return useNoraGraphQLListagem('SecaoPersona', {
        select: ['id', 'fkSecoesId', 'fkPersonasId'],
        itensPorPagina: 1000,
        carregando: 'Buscando públicos das seções',
        mensagemErro: 'Houve um erro recuperando os públicos das seções',
        mensagemListaVazia: 'Nenhum público de seção.',
        mensagemListaVaziaComFiltro: 'Nenhum público encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};