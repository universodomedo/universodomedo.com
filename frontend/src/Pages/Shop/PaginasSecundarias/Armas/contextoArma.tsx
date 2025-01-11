// #region Imports
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { basesArma, classificacoesArma, DadosCaracteristicasArmas, ArgsItem, listaCaracteristicaArma, patentesArma, ArgsAcao, tiposArma, PropsModificador } from 'Types/classes/index.ts';
import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import PaginaBaseArma from './pageBaseArma.tsx';
import PaginaCaracteristicaArma from './pageCaracteristicaArma.tsx';
// #endregion

interface ContextoArmaProps {
    adicionar: () => void;
    idPaginaArmaAberta: number;
    mudarPaginaArma: (idPagina: number) => void;
    paginasArma: { [key: number]: ReactNode };
    idBaseArmaSelecionada: number;
    selecionarBaseArma: (idBaseArma: number) => void;
    pontosDeCaracteristicaTotais: number;
    caracteristicasDisponiveis: { id: number; nome: string; descricao: string; dadosCaracteristicaNaBase?: { custoCaracteristica: number; dadosCaracteristicasArmas: DadosCaracteristicasArmas; } }[];
    alternaCaracteristicaSelecionada: (idCaracteristica: number) => void;
    caracteristicasSelecionadas: { id: number; nome: string; descricao: string; dadosCaracteristicaNaBase?: { custoCaracteristica: number; dadosCaracteristicasArmas: DadosCaracteristicasArmas; } }[];
    listaDadosArma: ({ tipo: 'titulo'; titulo: string } | { tipo: 'par'; nome: string; valor: string } | { tipo: 'details'; summary: string; itens: string[] })[];
    atualizaNomeCustomizado: (nomeCustomizado: string) => void;
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
    const [caracteristicasDisponiveis, setCaracteristicasDisponiveis] = useState<{ id: number; nome: string; descricao: string; dadosCaracteristicaNaBase: { custoCaracteristica: number; dadosCaracteristicasArmas: DadosCaracteristicasArmas; } }[]>([]);
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

    const adicionar = () => { adicionarItem(argsItem); }

    const mudarPaginaArma = (idPagina: number) => {
        if (idPagina === 0) { setIdBaseArmaSelecionada(0); }
        setIdPaginaArmaAberta(idPagina);
    };

    const selecionarBaseArma = (idBaseArma: number) => { setIdBaseArmaSelecionada(idBaseArma); }

    const pontosDeCaracteristicaTotais: number = getPersonagemFromContext().obtemValorTotalComLinhaEfeito(patenteDaBaseSelecionada?.pontosCaracteristica || 0, 63);

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
            acoes: [...acc.acoes, ...(cur.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.acoes || [])],
            modificadores: [...acc.modificadores, ...(cur.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.modificadores || [])],
            reducaoPatenteSimplificada: acc.reducaoPatenteSimplificada || !!cur.dadosCaracteristicaNaBase?.dadosCaracteristicasArmas.reducaoPatenteSimplificada,
        };
    }, { peso: 0, categoria: 0, danoMin: 0, danoMax: 0, acoes: [] as ArgsAcao[], modificadores: [] as PropsModificador[], reducaoPatenteSimplificada: false });

    const acaoPadraoBase: ArgsAcao = {
        args: { nome: 'Ataque Padrão', idTipoAcao: 2, idMecanica: 6, },
        dadosComportamentos: baseSelecionada
            ? {
                dadosComportamentoAcao: [
                    'Dano',
                    baseSelecionada.danoMin + dadosCaracteristicasAgrupados.danoMin,
                    baseSelecionada.danoMax + dadosCaracteristicasAgrupados.danoMax,
                ],
                ...(!dadosCaracteristicasAgrupados.reducaoPatenteSimplificada && {
                    dadosComportamentoRequisito: [
                        [baseSelecionada.idPericiaUtilizada, patenteDaBaseSelecionada!.idPatentePericiaRequisito],
                    ],
                }),
                dadosComportamentoDificuldadeAcao: [
                    { idAtributo:baseSelecionada.idAtributoUtilizado, idPericia: baseSelecionada.idPericiaUtilizada },
                ]
            }
            : {},
        custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] },
        requisitos: [2],
    }

    const argsItem: ArgsItem = {
        args: { idTipoItem: 1, nome: [`${tipoDaBaseSelecionada?.nome} ${classificacaoDaBaseSelecionada?.nome} ${patenteDaBaseSelecionada?.nome}`, nomeCustomizado.trim() || undefined], peso: (baseSelecionada?.peso || 0) + dadosCaracteristicasAgrupados.peso, categoria: (baseSelecionada?.categoria || 0) + dadosCaracteristicasAgrupados.categoria, },
        dadosComportamentos: baseSelecionada ? {
            dadosComportamentoEmpunhavel: [true, baseSelecionada.numeroExtremidadesUtilizadas],
        } : {},
        dadosAcoes: [
            acaoPadraoBase,
            ...dadosCaracteristicasAgrupados.acoes,
        ],
        modificadores: [
            ...dadosCaracteristicasAgrupados.modificadores,
        ]
    };

    const listaDadosArma: ({ tipo: 'titulo'; titulo: string } | { tipo: 'par'; nome: string; valor: string } | { tipo: 'details'; summary: string; itens: string[] })[] = [
        { tipo: 'par', nome: 'Peso', valor: `${argsItem.args.peso}` },
        { tipo: 'par', nome: 'Categoria', valor: `${argsItem.args.categoria}` },
        { tipo: 'par', nome: 'Extremidades para Empunhar', valor: `${argsItem.dadosComportamentos.dadosComportamentoEmpunhavel?.[1]}` },
        { tipo: 'titulo', titulo: 'Ações' },
        ...argsItem.dadosAcoes!.map(acao => ({
            tipo: 'details' as const,
            summary: acao.args.nome,
            itens: [
                `${acao.dadosComportamentos.dadosComportamentoAcao?.[1]} - ${acao.dadosComportamentos.dadosComportamentoAcao?.[2]} de ${acao.dadosComportamentos.dadosComportamentoAcao?.[0]}`,
                acao.dadosComportamentos.dadosComportamentoRequisito ? 'Requisito de Uso' : ''
            ],
        })),
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