// #region Imports
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import PaginaBaseArma from './pageBaseArma.tsx';
import PaginaCaracteristicaArma from './pageCaracteristicaArma.tsx';

import { basesArma, classificacoesArma, DadosCaracteristicasArmas, DadosItem, listaCaracteristicaArma, patentesArma, tiposArma } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

interface ContextoArmaProps {
    adicionar: () => void;
    idPaginaArmaAberta: number;
    mudarPaginaArma: (idPagina: number) => void;
    paginasArma: { [key: number]: ReactNode };
    idBaseArmaSelecionada: number;
    selecionarBaseArma: (idBaseArma: number) => void;
    pontosDeCaracteristicaTotais: number;
    caracteristicasDisponiveis: {id: number; nome: string; descricao: string; dadosCaracteristicaNaBase?: { custoCaracteristica: number; dadosCaracteristicasArmas: DadosCaracteristicasArmas; } }[];
    alternaCaracteristicaSelecionada: (idCaracteristica: number) => void;
    caracteristicasSelecionadas: {id: number; nome: string; descricao: string; dadosCaracteristicaNaBase?: { custoCaracteristica: number; dadosCaracteristicasArmas: DadosCaracteristicasArmas; } }[];
    listaDadosArma: { nome: string, valor: string }[];
    atualizaNomeCustomizado : (nomeCustomizado: string) => void;
}

export const ContextoArma = createContext<ContextoArmaProps | undefined>(undefined);

export const useContextoArma = (): ContextoArmaProps => {
    const context = useContext(ContextoArma);

    if (!context) {
        throw new Error('useContextoArma precisa estar dentro de um ContextoArma');
    }

    return context;
};

export const ContextoArmaProvider = ({ children }: { children: React.ReactNode }) => {
    const { adicionarItem } = useContextoLoja();

    const [idPaginaArmaAberta, setIdPaginaArmaAberta] = useState(0);
    const [idBaseArmaSelecionada, setIdBaseArmaSelecionada] = useState(0);
    const [caracteristicasDisponiveis, setCaracteristicasDisponiveis] = useState<{id: number; nome: string; descricao: string; dadosCaracteristicaNaBase: { custoCaracteristica: number; dadosCaracteristicasArmas: DadosCaracteristicasArmas; } }[]>([]);
    const [idsCaracteristicasSelecionadas, setIdsCaracteristicasSelecionadas] = useState<number[]>([]);
    const [nomeCustomizado, setNomeCustomizado] = useState<string>('');

    const baseSelecionada = basesArma.find(baseArma => baseArma.id === idBaseArmaSelecionada);
    const tipoDaBaseSelecionada = tiposArma.find(tipoArma => tipoArma.id === baseSelecionada?.composicaoBaseArma.idTipo);
    const classificacaoDaBaseSelecionada = classificacoesArma.find(classificacaoArma => classificacaoArma.id === baseSelecionada?.composicaoBaseArma.idClassificacao);
    const patenteDaBaseSelecionada = patentesArma.find(patente => patente.id === baseSelecionada?.composicaoBaseArma.idPatente);

    const paginasArma = {
        0: <PaginaBaseArma />,
        1: <PaginaCaracteristicaArma />,
    }

    const adicionar = () => { adicionarItem(dadosItem); }

    const mudarPaginaArma = (idPagina: number) => {
        if (idPagina === 0) { setIdBaseArmaSelecionada(0); }
        setIdPaginaArmaAberta(idPagina);
    };

    const selecionarBaseArma = (idBaseArma: number) => { setIdBaseArmaSelecionada(idBaseArma); }

    const pontosDeCaracteristicaTotais:number = patenteDaBaseSelecionada?.pontosCaracteristica || 0;

    const alternaCaracteristicaSelecionada = (idCaracteristica: number) => {
        setIdsCaracteristicasSelecionadas(prevState => prevState.includes(idCaracteristica)
            ? prevState.filter(id => id !== idCaracteristica)
            : [...prevState, idCaracteristica]
        );
    };

    const atualizaNomeCustomizado = (nomeCustomizado: string) => {
        setNomeCustomizado(nomeCustomizado);
    }

    const caracteristicasSelecionadas = caracteristicasDisponiveis.filter((caracteristica) => idsCaracteristicasSelecionadas.includes(caracteristica.id));

    const dadosCaracteristicasAgrupados = caracteristicasSelecionadas.reduce((acc, cur) => {
        return {
            peso: acc.peso + (cur.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.modificadorPeso || 0),
            categoria: acc.categoria + (cur.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.modificadorCategoria || 0),
            danoMin: acc.danoMin + (cur.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.modificadorDanoMinimo || 0),
            danoMax: acc.danoMax + (cur.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.modificadorDanoMaximo || 0),
        }
    }, { peso: 0, categoria: 0, danoMin: 0, danoMax: 0 });

    const dadosItem: DadosItem = {
        idTipoItem: 1,
        nomeItem: { nomeCustomizado: nomeCustomizado.trim() || undefined, nomePadrao: `${tipoDaBaseSelecionada?.nome} ${classificacaoDaBaseSelecionada?.nome} ${patenteDaBaseSelecionada?.nome}` },
        peso: (baseSelecionada?.peso || 0) + dadosCaracteristicasAgrupados.peso,
        categoria: (baseSelecionada?.categoria || 0) + dadosCaracteristicasAgrupados.categoria,
        dadosComportamentos: baseSelecionada ? {
            dadosComportamentoEmpunhavel: [true, baseSelecionada.numeroExtremidadesUtilizadas],
            dadosComportamentoAtributoPericia: [baseSelecionada.idAtributoUtilizado, baseSelecionada.idPericiaUtilizada],
            dadosComportamentoAcao: [
                'Dano',
                baseSelecionada.danoMin + dadosCaracteristicasAgrupados.danoMin,
                baseSelecionada.danoMax + dadosCaracteristicasAgrupados.danoMax,
            ],
        } : {},
        dadosAcoes: [{
            nomeAcao: 'Realizar Ataque',
            idTipoAcao: 2,
            idCategoriaAcao: 1,
            idMecanica: 6,
            custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] },
            requisitos: [2],
        }],
    };

    const listaDadosArma: { nome: string, valor: string }[] = [
        { nome: 'Peso', valor: `${dadosItem.peso}` },
        { nome: 'Categoria', valor: `${dadosItem.categoria}` },
        { nome: 'Dano Base', valor: `${dadosItem.dadosComportamentos.dadosComportamentoAcao?.[1]} - ${dadosItem.dadosComportamentos.dadosComportamentoAcao?.[2]}` },
        { nome: 'Extremidades para Empunhar', valor: `${dadosItem.dadosComportamentos.dadosComportamentoEmpunhavel?.[1]}` },
        { nome: 'Atributo Base', valor: `${SingletonHelper.getInstance().atributos.find(atributo => atributo.id === dadosItem.dadosComportamentos.dadosComportamentoAtributoPericia?.[0])?.nome}` },
        { nome: 'Perícia Base', valor: `${SingletonHelper.getInstance().pericias.find(pericia => pericia.id === dadosItem.dadosComportamentos.dadosComportamentoAtributoPericia?.[1])?.nome}` },
    ];

    useEffect(() => {
        if (idBaseArmaSelecionada === 0) return;

        setCaracteristicasDisponiveis(
            listaCaracteristicaArma.filter(caracteristicaArma => caracteristicaArma.basesArma.some(base => base.idBaseArma === idBaseArmaSelecionada)).map(caracteristicaArma => {
                const baseCorrespondente = caracteristicaArma.basesArma.find(base => base.idBaseArma === idBaseArmaSelecionada);

                return {
                    id: caracteristicaArma.id,
                    nome: caracteristicaArma.nome,
                    descricao: caracteristicaArma.descricao,
                    dadosCaracteristicaNaBase: baseCorrespondente!.dadosCaracteristicaNaBase,
                };
            })
        );
    }, [idBaseArmaSelecionada]);

    useEffect(() => {
        setIdsCaracteristicasSelecionadas([]);
    }, [caracteristicasDisponiveis]);

    return (
        <ContextoArma.Provider value={{ adicionar, idPaginaArmaAberta, mudarPaginaArma, paginasArma, idBaseArmaSelecionada, selecionarBaseArma, pontosDeCaracteristicaTotais, caracteristicasDisponiveis, alternaCaracteristicaSelecionada, caracteristicasSelecionadas, listaDadosArma, atualizaNomeCustomizado }}>
            {children}
        </ContextoArma.Provider>
    );
}