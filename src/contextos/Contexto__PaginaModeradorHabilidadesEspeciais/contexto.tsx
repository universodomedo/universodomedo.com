'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export interface Contexto__PaginaModeradorHabilidadesEspeciais__Props {
    listagemHabilidades: ReturnType<typeof useListagemHabilidades>;
    habilidadeSelecionada: ReturnType<typeof useListagemHabilidades>['registros'][number] | null;
    estaEmProcessoCriacao: boolean;
    selecionaHabilidade: (idHabilidade: number) => void;
    deselecionaHabilidade: () => void;
    iniciaCriacao: () => void;
    cancelaCriacao: () => void;
    concluiCriacao: () => void;
};

const Contexto__PaginaModeradorHabilidadesEspeciais = createContext<Contexto__PaginaModeradorHabilidadesEspeciais__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesEspeciais = (): Contexto__PaginaModeradorHabilidadesEspeciais__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesEspeciais);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesEspeciais precisa estar dentro de um Contexto__PaginaModeradorHabilidadesEspeciais');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesEspeciais__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemHabilidades = useListagemHabilidades();
    const [idHabilidadeSelecionada, setIdHabilidadeSelecionada] = useState<number | null>(null);
    const [estaEmProcessoCriacao, setEstaEmProcessoCriacao] = useState<boolean>(false);
    const recarregarListagemHabilidades = listagemHabilidades.recarregar;

    const habilidadeSelecionada = idHabilidadeSelecionada === null ? null : listagemHabilidades.registros.find(habilidade => habilidade.habilidade.id === idHabilidadeSelecionada) ?? null;

    const selecionaHabilidade = useCallback((idHabilidade: number) => { setIdHabilidadeSelecionada(idHabilidade); }, []);
    const deselecionaHabilidade = useCallback(() => { setIdHabilidadeSelecionada(null); }, []);
    const iniciaCriacao = useCallback(() => { setEstaEmProcessoCriacao(true); }, []);
    const cancelaCriacao = useCallback(() => { setEstaEmProcessoCriacao(false); }, []);

    const concluiCriacao = useCallback(() => {
        recarregarListagemHabilidades();
        setEstaEmProcessoCriacao(false);
    }, [recarregarListagemHabilidades]);

    return (
        <Contexto__PaginaModeradorHabilidadesEspeciais.Provider value={{ listagemHabilidades, habilidadeSelecionada, estaEmProcessoCriacao, selecionaHabilidade, deselecionaHabilidade, iniciaCriacao, cancelaCriacao, concluiCriacao }}>
            {children}
        </Contexto__PaginaModeradorHabilidadesEspeciais.Provider>
    );
};

function useListagemHabilidades() {
    return useNoraGraphQLListagem('HabilidadeEspecial', {
        select: ['id', 'habilidade', 'custoPontosHabilidadeEspecial', 'propriedades'],
        camposFiltroConsulta: ['habilidade.nome'],
        camposFiltroVisualizacao: ['habilidade.nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Habilidades Especiais',
        mensagemErro: 'Houve um erro recuperando as Habilidades Especiais',
        mensagemListaVazia: 'Nenhuma habilidade especial cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma habilidade especial encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { habilidade: { nome: 'ASC' } }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
