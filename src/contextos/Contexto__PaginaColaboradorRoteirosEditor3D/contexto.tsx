'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { RoteiroEditor3DPersistido } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { consultaRoteiroEditor3D, criaRoteiroEditor3D, removeRoteiroEditor3D } from 'Componentes/Editor3D/editor3D.roteiro.api';
import { relatorioValidacaoRoteiroEditor3D, validaRoteiroContraGoldenEditor3D, type EtapaValidadaRoteiroEditor3D, type ResultadoValidacaoRoteiroEditor3D } from 'Componentes/Editor3D/editor3D.roteiro';

export type RegistroRoteiroEditor3D = ReturnType<typeof obtemListagemRoteirosEditor3D>['registros'][number];

// Estado de validação por roteiro (só da SESSÃO — resultado é derivado por reexecução, nunca persistido).
export type EstadoValidacaoRoteiroEditor3D = ResultadoValidacaoRoteiroEditor3D | 'VALIDANDO';

// Detalhe do roteiro: o passo a passo legível FORA do editor — é a resposta a "como se faz isso mesmo?". O resultado da
// validação é opcional porque roteiro sem golden (em montagem) também merece ser lido; só não tem o que comparar.
export type DetalheValidacaoRoteiroEditor3D = {
    readonly roteiro: RoteiroEditor3DPersistido;
    readonly resultado: ResultadoValidacaoRoteiroEditor3D | null;
    // Etapa a etapa: confere / regrediu / não executou / contaminada. Vazio quando não há golden para comparar.
    readonly etapas: readonly EtapaValidadaRoteiroEditor3D[];
};

export interface Contexto__PaginaColaboradorRoteirosEditor3D__Props {
    listagemRoteiros: ReturnType<typeof obtemListagemRoteirosEditor3D>;
    estaEmCadastro: boolean;
    iniciarCadastro: () => void;
    irParaListagem: () => void;
    criarRoteiro: (nome: string, objetivo: string) => Promise<void>;
    removerRoteiro: (idRoteiro: number) => Promise<void>;
    resultadosValidacao: Readonly<Record<number, EstadoValidacaoRoteiroEditor3D>>;
    resumoValidacao: string | null;
    validandoTodos: boolean;
    validarTodos: () => Promise<void>;
    detalheValidacao: DetalheValidacaoRoteiroEditor3D | null;
    abrirDetalheValidacao: (idRoteiro: number) => Promise<void>;
    fecharDetalheValidacao: () => void;
};

const Contexto__PaginaColaboradorRoteirosEditor3D = createContext<Contexto__PaginaColaboradorRoteirosEditor3D__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorRoteirosEditor3D = (): Contexto__PaginaColaboradorRoteirosEditor3D__Props => {
    const context = useContext(Contexto__PaginaColaboradorRoteirosEditor3D);
    if (!context) throw new Error('useContexto__PaginaColaboradorRoteirosEditor3D precisa estar dentro de um Contexto__PaginaColaboradorRoteirosEditor3D');
    return context;
};

export const Contexto__PaginaColaboradorRoteirosEditor3D__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemRoteiros = obtemListagemRoteirosEditor3D();

    const [estaEmCadastro, setEstaEmCadastro] = useState<boolean>(false);

    const iniciarCadastro = useCallback(() => setEstaEmCadastro(true), []);
    const irParaListagem = useCallback(() => setEstaEmCadastro(false), []);

    const recarregarRoteiros = listagemRoteiros.recarregar;

    // Admin cadastra nome + objetivo; os passos são preenchidos pela operadora DENTRO do Editor 3D (Painel Roteiro).
    const criarRoteiro = useCallback(async (nome: string, objetivo: string): Promise<void> => {
        await criaRoteiroEditor3D(nome, objetivo);
        recarregarRoteiros();
        setEstaEmCadastro(false);
    }, [recarregarRoteiros]);

    // ---- VALIDAÇÃO EM MASSA: reexecuta cada roteiro APROVADO na camada de operações e compara com o golden.
    // Roda no browser (runner puro, sem backend); o resultado é da sessão — nunca persistido.
    const [resultadosValidacao, setResultadosValidacao] = useState<Readonly<Record<number, EstadoValidacaoRoteiroEditor3D>>>({});
    const [resumoValidacao, setResumoValidacao] = useState<string | null>(null);
    const [validandoTodos, setValidandoTodos] = useState<boolean>(false);
    const [detalheValidacao, setDetalheValidacao] = useState<DetalheValidacaoRoteiroEditor3D | null>(null);

    const registrosListagem = listagemRoteiros.registros;

    const validarTodos = useCallback(async (): Promise<void> => {
        const aprovados = registrosListagem.filter(roteiro => roteiro.aprovado);
        const foraDaExecucao = registrosListagem.length - aprovados.length;
        setValidandoTodos(true);
        setResumoValidacao(null);
        setResultadosValidacao(Object.fromEntries(aprovados.map(roteiro => [roteiro.id, 'VALIDANDO'])));
        try {
            let validos = 0, divergentes = 0, falharam = 0;
            for (const resumo of aprovados) {
                const persistido = await consultaRoteiroEditor3D(resumo.id);
                if (!persistido || persistido.golden === null) { setResultadosValidacao(atuais => { const proximos = { ...atuais }; delete proximos[resumo.id]; return proximos; }); continue; }
                const resultado = validaRoteiroContraGoldenEditor3D(persistido.passos, persistido.golden);
                if (resultado.desfecho === 'VALIDO') validos++;
                else if (resultado.desfecho === 'DIVERGENTE') divergentes++;
                else falharam++;
                setResultadosValidacao(atuais => ({ ...atuais, [resumo.id]: resultado }));
            }
            setResumoValidacao(`${aprovados.length} ${aprovados.length === 1 ? 'roteiro executado' : 'roteiros executados'} — ${validos} ${validos === 1 ? 'válido' : 'válidos'} · ${divergentes} ${divergentes === 1 ? 'divergente' : 'divergentes'} · ${falharam} ${falharam === 1 ? 'falhou' : 'falharam'}${foraDaExecucao > 0 ? ` · ${foraDaExecucao} fora da execução` : ''}`);
        } finally { setValidandoTodos(false); }
    }, [registrosListagem]);

    // Detalhe por passo de QUALQUER roteiro com passos. Com golden, valida na hora e mostra o desfecho; sem golden
    // (em montagem), é só a leitura do passo a passo — que é metade do valor do roteiro.
    const abrirDetalheValidacao = useCallback(async (idRoteiro: number): Promise<void> => {
        const persistido = await consultaRoteiroEditor3D(idRoteiro);
        if (!persistido) return;
        const relatorio = persistido.golden === null ? null : relatorioValidacaoRoteiroEditor3D(persistido.passos, persistido.golden);
        if (relatorio !== null) setResultadosValidacao(atuais => ({ ...atuais, [idRoteiro]: relatorio.resultado }));
        setDetalheValidacao({ roteiro: persistido, resultado: relatorio?.resultado ?? null, etapas: relatorio?.etapas ?? [] });
    }, []);

    const fecharDetalheValidacao = useCallback(() => setDetalheValidacao(null), []);

    // Exclusão DEFINITIVA (curadoria do catálogo): leva passos e golden juntos — não há lixeira. O resumo da validação
    // em massa cai junto: os números dele falavam de um catálogo que não existe mais.
    const removerRoteiro = useCallback(async (idRoteiro: number): Promise<void> => {
        await removeRoteiroEditor3D(idRoteiro);
        setResultadosValidacao(atuais => { const proximos = { ...atuais }; delete proximos[idRoteiro]; return proximos; });
        setResumoValidacao(null);
        recarregarRoteiros();
    }, [recarregarRoteiros]);

    // Layout contextual dirigido AQUI (dono único): subfluxos só apresentam.
    useConfigurarLayoutContextualizado(
        detalheValidacao !== null
            ? { subtitulo: `Validação · ${detalheValidacao.roteiro.nome}`, fecharProps: { tipo: 'acao', executar: fecharDetalheValidacao, tituloTooltip: 'Voltar para a listagem' } }
            : estaEmCadastro
                ? { subtitulo: 'Novo Roteiro', fecharProps: { tipo: 'acao', executar: irParaListagem, tituloTooltip: 'Cancelar' } }
                : { subtitulo: undefined, fecharProps: undefined },
    );

    return (
        <Contexto__PaginaColaboradorRoteirosEditor3D.Provider value={{ listagemRoteiros, estaEmCadastro, iniciarCadastro, irParaListagem, criarRoteiro, removerRoteiro, resultadosValidacao, resumoValidacao, validandoTodos, validarTodos, detalheValidacao, abrirDetalheValidacao, fecharDetalheValidacao }}>
            {children}
        </Contexto__PaginaColaboradorRoteirosEditor3D.Provider>
    );
};

export function obtemListagemRoteirosEditor3D() {
    return useNoraGraphQLListagem('RoteiroEditor3D', {
        select: ['id', 'nome', 'objetivo', 'aprovado', 'bloqueadoMotivo', 'quantidadePassos', 'dataAtualizacao'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 100,
        carregando: 'Buscando roteiros',
        mensagemErro: 'Houve um erro recuperando os roteiros',
        mensagemListaVazia: 'Nenhum roteiro cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum roteiro encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { dataAtualizacao: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};