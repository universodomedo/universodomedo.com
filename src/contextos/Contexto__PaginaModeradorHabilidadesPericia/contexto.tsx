'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { PatentePericiaCompletaDto, PericiaCompletaDto } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectCache } from 'Redux/slices/cacheSlice';

export interface Contexto__PaginaModeradorHabilidadesPericia__Props {
    pericias: PericiaCompletaDto[];
    patentes: PatentePericiaCompletaDto[];
    listagemHabilidades: ReturnType<typeof useListagemHabilidades>;
    habilidadeSelecionada: ReturnType<typeof useListagemHabilidades>['registros'][number] | null;
    estaEmProcessoCriacao: boolean;
    selecionaHabilidade: (idHabilidade: number) => void;
    deselecionaHabilidade: () => void;
    iniciaCriacao: () => void;
    cancelaCriacao: () => void;
    concluiCriacao: () => void;
};

const Contexto__PaginaModeradorHabilidadesPericia = createContext<Contexto__PaginaModeradorHabilidadesPericia__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesPericia = (): Contexto__PaginaModeradorHabilidadesPericia__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesPericia);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesPericia precisa estar dentro de um Contexto__PaginaModeradorHabilidadesPericia');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesPericia__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemHabilidades = useListagemHabilidades();
    const cache = useAppSelector(selectCache);
    const pericias = cache?.pericias ?? [];
    const patentes = cache?.patentesPericia ?? [];
    const [idHabilidadeSelecionada, setIdHabilidadeSelecionada] = useState<number | null>(null);
    const [estaEmProcessoCriacao, setEstaEmProcessoCriacao] = useState<boolean>(false);
    const recarregarListagemHabilidades = listagemHabilidades.recarregar;

    const habilidadeSelecionada = idHabilidadeSelecionada === null ? null : listagemHabilidades.registros.find(habilidade => habilidade.id === idHabilidadeSelecionada) ?? null;

    const selecionaHabilidade = useCallback((idHabilidade: number) => { setIdHabilidadeSelecionada(idHabilidade); }, []);
    const deselecionaHabilidade = useCallback(() => { setIdHabilidadeSelecionada(null); }, []);
    const iniciaCriacao = useCallback(() => { setEstaEmProcessoCriacao(true); }, []);
    const cancelaCriacao = useCallback(() => { setEstaEmProcessoCriacao(false); }, []);

    const concluiCriacao = useCallback(() => {
        recarregarListagemHabilidades();
        setEstaEmProcessoCriacao(false);
    }, [recarregarListagemHabilidades]);

    return (
        <Contexto__PaginaModeradorHabilidadesPericia.Provider value={{ pericias, patentes, listagemHabilidades, habilidadeSelecionada, estaEmProcessoCriacao, selecionaHabilidade, deselecionaHabilidade, iniciaCriacao, cancelaCriacao, concluiCriacao }}>
            {children}
        </Contexto__PaginaModeradorHabilidadesPericia.Provider>
    );
};

function useListagemHabilidades() {
    return useNoraGraphQLListagem('HabilidadePericia', {
        select: ['id', 'habilidade', 'pericia', 'patentePericia'],
        camposFiltroConsulta: ['habilidade.nome', 'pericia.nome', 'patentePericia.nome'],
        camposFiltroVisualizacao: ['habilidade.nome', 'pericia.nome', 'patentePericia.nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Habilidades de Perícia',
        mensagemErro: 'Houve um erro recuperando as Habilidades de Perícia',
        mensagemListaVazia: 'Nenhuma habilidade cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma habilidade encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { habilidade: { nome: 'ASC' } }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};