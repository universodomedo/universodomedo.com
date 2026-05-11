'use client';

import { createContext, useContext } from 'react';
import { GraphqlOrderDirecao, GraphqlTypesEmblema } from 'types-nora-api';

import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';

const SELECT_GERENCIAMENTO_EMBLEMAS = GraphqlTypesEmblema.select('id', 'nome', 'nomeVisual', 'descricao', 'dataCriacao', { arquivos: ['caminhoArquivoMoldura', 'caminhoArquivoEmblema'] });

const WHERE_GERENCIAMENTO_EMBLEMAS: GraphqlTypesEmblema.ObtemVariosParametros['where'] = {
    id: { gt: 0 },
};

export type EmblemaGerenciamentoRegistro = GraphqlTypesEmblema.Item<typeof SELECT_GERENCIAMENTO_EMBLEMAS>;

export type ListaEmblemasGerenciamento = readonly EmblemaGerenciamentoRegistro[];

export interface Contexto__GerenciarEmblemas__Props {
    // emblemas: ListaEmblemasGerenciamento;
    // carregandoEmblemas: string | null;
    // erroEmblemas: string | null;
    // recarregarEmblemas: () => Promise<ListaEmblemasGerenciamento>;
};

const Contexto__GerenciarEmblemas = createContext<Contexto__GerenciarEmblemas__Props | undefined>(undefined);

export const useContexto__GerenciarEmblemas = (): Contexto__GerenciarEmblemas__Props => {
    const context = useContext(Contexto__GerenciarEmblemas);
    if (!context) throw new Error('useContexto__GerenciarEmblemas precisa estar dentro de um Contexto__GerenciarEmblemas');
    return context;
};
// #endregion

// #region Bloco 5 - Provider
export const Contexto__GerenciarEmblemas__Provider = ({ children }: { children: React.ReactNode; }) => {
    // const consultaEmblemas = useNoraGraphQLConsulta(obtem => obtem.Emblema.varios({
    //     parametros: { where: WHERE_GERENCIAMENTO_EMBLEMAS, order: { dataCriacao: GraphqlOrderDirecao.DESC } },
    //     select: SELECT_GERENCIAMENTO_EMBLEMAS,
    // }), { valorInicial: [], carregando: 'Buscando Emblemas', mensagemErro: 'Houve um erro recuperando os Emblemas à serem listados', carregamento: NoraApiCarregamento.BLOQUEIA_INTERFACE });

    return (
        // <Contexto__GerenciarEmblemas.Provider value={{ emblemas: consultaEmblemas.data, carregandoEmblemas: consultaEmblemas.carregando, erroEmblemas: consultaEmblemas.erro, recarregarEmblemas: consultaEmblemas.recarregar }}>
        <Contexto__GerenciarEmblemas.Provider value={{  }}>
            {children}
        </Contexto__GerenciarEmblemas.Provider>
    );
};
// #endregion