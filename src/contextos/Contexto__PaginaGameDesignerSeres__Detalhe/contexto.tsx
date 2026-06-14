'use client';

import { createContext, useContext } from 'react';
import { TIPOS_SER, type ObjetoCache } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useCache } from 'Redux/hooks/useCache';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerSeres__Props } from '../Contexto__PaginaGameDesignerSeres/contexto';
import SPA__PaginaGameDesignerSeres__Detalhe from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__Detalhe/SPA__PaginaGameDesignerSeres__Detalhe';

interface Contexto__PaginaGameDesignerSeres__Detalhe__Props {
    idSerEmEdicao: number;
    carregando: boolean;
    erro: string | null;
    nome: string | null;
    tipoNome: string | null;
    ehJogavel: boolean;
    nivelNome: string | null;
    usuarioCriacaoNome: string | null;
};

type PropsProvider = {
    idSerEmEdicao: number;
    voltaParaListagem: Contexto__PaginaGameDesignerSeres__Props['voltaParaListagem'];
};

const Contexto__PaginaGameDesignerSeres__Detalhe = createContext<Contexto__PaginaGameDesignerSeres__Detalhe__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__Detalhe = (): Contexto__PaginaGameDesignerSeres__Detalhe__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__Detalhe);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__Detalhe precisa estar dentro de um Contexto__PaginaGameDesignerSeres__Detalhe');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__Detalhe__Provider = ({ idSerEmEdicao, voltaParaListagem }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Editar Ser', fecharProps: { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const cache = useCache();
    const listagemDetalhe = useDetalheSer(idSerEmEdicao);
    const listagemTipadoJogavel = useTipadoJogavelSer(idSerEmEdicao);

    const detalhe = listagemDetalhe.registros[0] ?? null;
    const tipadoJogavel = listagemTipadoJogavel.registros[0] ?? null;

    const carregando = !!listagemDetalhe.carregando || !!listagemTipadoJogavel.carregando;
    const erro = listagemDetalhe.erro ?? listagemTipadoJogavel.erro ?? null;
    const nome = detalhe?.nome ?? null;
    const tipoNome = detalhe ? obtemNomeTipoSer(detalhe.ser.fkTiposSerId) : null;
    const ehJogavel = tipadoJogavel !== null;
    const nivelNome = ehJogavel && cache.pronto ? obtemNomeNivel(cache.niveis, tipadoJogavel.fkNivelId) : null;
    const usuarioCriacaoNome = detalhe?.usuarioCriacao.username ?? null;

    return (
        <Contexto__PaginaGameDesignerSeres__Detalhe.Provider value={{ idSerEmEdicao, carregando, erro, nome, tipoNome, ehJogavel, nivelNome, usuarioCriacaoNome }}>
            <SPA__PaginaGameDesignerSeres__Detalhe />
        </Contexto__PaginaGameDesignerSeres__Detalhe.Provider>
    );
};

function obtemNomeTipoSer(fkTiposSerId: number): string {
    const tipo = Object.values(TIPOS_SER).find(tipoSer => tipoSer.id === fkTiposSerId);
    return tipo?.nome ?? `Tipo #${fkTiposSerId}`;
};

function obtemNomeNivel(niveis: ObjetoCache['niveis'], fkNivelId: number): string {
    const nivel = niveis.find(nivelAtual => nivelAtual.id === fkNivelId);
    return nivel?.nomeVisualizacao ?? `Nível #${fkNivelId}`;
};

function useDetalheSer(idSerEmEdicao: number) {
    return useNoraGraphQLListagem('SerDetalhe', {
        select: ['fkSerId', 'nome', { ser: ['id', 'fkTiposSerId', 'dataCriacao'] }, { usuarioCriacao: ['id', 'username'] }],
        whereFixo: { fkSerId: idSerEmEdicao },
        itensPorPagina: 1,
        carregando: 'Carregando Ser',
        mensagemErro: 'Houve um erro recuperando o Ser',
        mensagemListaVazia: 'Ser não encontrado.',
        mensagemListaVaziaComFiltro: 'Ser não encontrado.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkSerId: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function useTipadoJogavelSer(idSerEmEdicao: number) {
    return useNoraGraphQLListagem('SerTipadoJogavel', {
        select: ['fkSerId', 'fkNivelId'],
        whereFixo: { fkSerId: idSerEmEdicao },
        itensPorPagina: 1,
        carregando: 'Carregando especialização',
        mensagemErro: 'Houve um erro recuperando a especialização do Ser',
        mensagemListaVazia: 'Sem especialização jogável.',
        mensagemListaVaziaComFiltro: 'Sem especialização jogável.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkSerId: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
