'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type RegistroCoeficiente = ReturnType<typeof useListagemCoeficientes>['registros'][number];

export interface Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props {
    listagemCoeficientes: ReturnType<typeof useListagemCoeficientes>;
    idCoeficienteEmEdicao: number | null;
    coeficienteSelecionado: RegistroCoeficiente | null;
    coeficientesExistentes: readonly { idClasse: number; idEstatisticaDanificavel: number }[];
    emCadastro: boolean;
    selecionaCoeficiente: (idCoeficiente: number) => void;
    iniciaCadastro: () => void;
    cancelaCadastro: () => void;
    concluiCadastro: () => void;
    voltaParaListagem: () => void;
    concluiEdicao: () => void;
};

const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica = createContext<Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica = (): Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica precisa estar dentro de um Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica');
    return context;
};

export const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemCoeficientes = useListagemCoeficientes();
    const [idCoeficienteEmEdicao, setIdCoeficienteEmEdicao] = useState<number | null>(null);
    const [emCadastro, setEmCadastro] = useState<boolean>(false);
    const recarregarListagem = listagemCoeficientes.recarregar;

    const coeficienteSelecionado = useMemo(() => idCoeficienteEmEdicao === null ? null : (listagemCoeficientes.registros.find(coeficiente => coeficiente.id === idCoeficienteEmEdicao) ?? null), [idCoeficienteEmEdicao, listagemCoeficientes.registros]);
    const coeficientesExistentes = useMemo(() => listagemCoeficientes.registros.map(coeficiente => ({ idClasse: coeficiente.classe.id, idEstatisticaDanificavel: coeficiente.estatisticaDanificavel.id })), [listagemCoeficientes.registros]);

    const selecionaCoeficiente = useCallback((idCoeficiente: number) => {
        setEmCadastro(false);
        setIdCoeficienteEmEdicao(idCoeficiente);
    }, []);
    const iniciaCadastro = useCallback(() => {
        setIdCoeficienteEmEdicao(null);
        setEmCadastro(true);
    }, []);
    const cancelaCadastro = useCallback(() => { setEmCadastro(false); }, []);
    const concluiCadastro = useCallback(() => {
        recarregarListagem();
        setEmCadastro(false);
    }, [recarregarListagem]);
    const voltaParaListagem = useCallback(() => { setIdCoeficienteEmEdicao(null); }, []);
    const concluiEdicao = useCallback(() => {
        recarregarListagem();
        setIdCoeficienteEmEdicao(null);
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica.Provider value={{ listagemCoeficientes, idCoeficienteEmEdicao, coeficienteSelecionado, coeficientesExistentes, emCadastro, selecionaCoeficiente, iniciaCadastro, cancelaCadastro, concluiCadastro, voltaParaListagem, concluiEdicao }}>
            {children}
        </Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica.Provider>
    );
};

function useListagemCoeficientes() {
    return useNoraGraphQLListagem('CoeficienteGanhoEstatisticaClasse', {
        select: ['id', 'coeficiente', { classe: ['id', 'nome'] }, { estatisticaDanificavel: ['id', 'nome'] }, { ganhosRelativos: ['fkAtributosId', 'valorPorcentagem'] }],
        itensPorPagina: 50,
        carregando: 'Buscando Coeficientes',
        mensagemErro: 'Houve um erro recuperando os Coeficientes',
        mensagemListaVazia: 'Nenhum coeficiente cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum coeficiente encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
