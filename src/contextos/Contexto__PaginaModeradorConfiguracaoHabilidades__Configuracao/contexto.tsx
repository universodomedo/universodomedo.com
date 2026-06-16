'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { AcaoLogicaComponivel, AtributoCompletaDto, LogicaComponivel, ModificadorLogicaComponivel, PropriedadesModificadorLogicaComponivel } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useToast } from 'Hooks/useToast';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectCache } from 'Redux/slices/cacheSlice';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { obtemLogicaHabilidade, salvarLogicaHabilidade } from 'Uteis/ApiConsumer/HabilidadesMiddleware';
import { Contexto__PaginaModeradorConfiguracaoHabilidades__Props } from '../Contexto__PaginaModeradorConfiguracaoHabilidades/contexto';
import SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao from 'Conteineres/PaginaModeradorConfiguracaoHabilidades/paginas/SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao/SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao';

type FormularioNovoModificador = {
    nome: string;
    valor: string;
    tipoModificador: PropriedadesModificadorLogicaComponivel['tipo'];
};

type FormularioAcaoLogica = {
    nome: string;
    ordem: string;
    chaveDominio: string;
};

const FORMULARIO_CREATE_MODIFICADOR_HABILIDADE = defineFormularioCreate<FormularioNovoModificador>({
    valoresIniciais: { nome: '', valor: '', tipoModificador: 'atributo' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, placeholder: 'Ex: Inteligência ampliada' },
        valor: { tipo: 'text', label: 'Valor', obrigatorio: true, placeholder: 'Ex: 1 ou -1' },
        tipoModificador: { tipo: 'text', label: 'Tipo de Modificador', obrigatorio: true },
    },
});

interface Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props {
    habilidade: NonNullable<Contexto__PaginaModeradorConfiguracaoHabilidades__Props['habilidadeSelecionada']>;
    atributos: AtributoCompletaDto[];
    modificadoresLogica: readonly ModificadorLogicaComponivel[];
    idAtributoSelecionado: number | null;
    selecionaAtributo: (idAtributo: number | null) => void;
    tipoModificadorSelecionado: PropriedadesModificadorLogicaComponivel['tipo'];
    selecionaTipoModificador: (tipoModificador: string) => void;
    formularioNovoModificador: FormularioCreateEstado<FormularioNovoModificador>;
    valorEhValido: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    excluirModificador: (indiceModificador: number, nome: string) => Promise<void>;
    logicaHabilidade: LogicaComponivel | null;
    acoesLogica: FormularioAcaoLogica[];
    logicaCarregando: boolean;
    logicaErro: string | null;
    salvandoLogica: boolean;
    podeSalvarLogica: boolean;
    adicionaAcaoLogica: () => void;
    alteraAcaoLogica: (indice: number, campo: keyof FormularioAcaoLogica, valor: string) => void;
    removeAcaoLogica: (indice: number) => void;
    salvarLogica: () => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao = createContext<Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao = (): Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Provider = ({ habilidade, deselecionaHabilidade }: { habilidade: Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props['habilidade']; deselecionaHabilidade: Contexto__PaginaModeradorConfiguracaoHabilidades__Props['deselecionaHabilidade']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: habilidade.nome, fecharProps: { tipo: 'acao', executar: deselecionaHabilidade, tituloTooltip: 'Voltar para Listagem' } });

    const toast = useToast();
    const cache = useAppSelector(selectCache);
    const atributos = cache?.atributos ?? [];
    const [idAtributoSelecionado, setIdAtributoSelecionado] = useState<number | null>(null);
    const [logicaHabilidade, setLogicaHabilidade] = useState<LogicaComponivel | null>(null);
    const [acoesLogica, setAcoesLogica] = useState<FormularioAcaoLogica[]>([]);
    const [logicaCarregando, setLogicaCarregando] = useState<boolean>(true);
    const [logicaErro, setLogicaErro] = useState<string | null>(null);
    const [salvandoLogica, setSalvandoLogica] = useState<boolean>(false);
    const formularioNovoModificador = useFormularioCreate(FORMULARIO_CREATE_MODIFICADOR_HABILIDADE, async payload => {
        if (logicaHabilidade === null) throw new Error('Lógica da habilidade ainda não foi carregada.');
        if (!ehValorModificadorValido(payload.valor)) return;

        const modificador = montaModificadorLogica(payload.nome, payload.tipoModificador, idAtributoSelecionado, Number(payload.valor), logicaHabilidade.modificadores);
        if (modificador === null) return;

        const logicaSalva = await salvarLogicaHabilidade({ idHabilidade: habilidade.id, logica: { ...logicaHabilidade, modificadores: [...logicaHabilidade.modificadores, modificador] } });
        setLogicaHabilidade(logicaSalva);
        setAcoesLogica(logicaSalva.acoes.map(acao => criaFormularioAcaoLogica(acao)));
    });
    const valorEhValido = ehValorModificadorValido(formularioNovoModificador.valores.valor);
    const tipoModificadorSelecionado = formularioNovoModificador.valores.tipoModificador;
    const modificadoresLogica = logicaHabilidade?.modificadores ?? [];
    const podeSalvar = logicaHabilidade !== null && !logicaCarregando && !salvandoLogica && (!modificadorPrecisaDeAtributo(tipoModificadorSelecionado) || idAtributoSelecionado !== null) && valorEhValido && formularioNovoModificador.podeSalvar;
    const podeSalvarLogica = logicaHabilidade !== null && !logicaCarregando && !salvandoLogica && acoesLogica.every(acao => acao.nome.trim().length > 0 && acao.chaveDominio.trim().length > 0 && ehOrdemAcaoValida(acao.ordem));

    useEffect(() => {
        let ativo = true;

        async function carregaLogica(): Promise<void> {
            setLogicaCarregando(true);
            setLogicaErro(null);

            try {
                const logica = await obtemLogicaHabilidade(habilidade.id);
                if (!ativo) return;

                setLogicaHabilidade(logica);
                setAcoesLogica(logica.acoes.map(acao => criaFormularioAcaoLogica(acao)));
            } catch (error) {
                if (!ativo) return;

                setLogicaHabilidade(null);
                setAcoesLogica([]);
                setLogicaErro(error instanceof Error ? error.message : 'Falha ao carregar lógica da habilidade.');
            } finally {
                if (ativo) setLogicaCarregando(false);
            }
        };

        carregaLogica();

        return () => { ativo = false; };
    }, [habilidade.id]);

    function selecionaTipoModificador(tipoModificador: string): void {
        const tipoNormalizado = normalizaTipoModificador(tipoModificador);
        formularioNovoModificador.setCampo('tipoModificador', tipoNormalizado);
        if (!modificadorPrecisaDeAtributo(tipoNormalizado)) setIdAtributoSelecionado(null);
    };

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        try {
            await formularioNovoModificador.salvar();
            formularioNovoModificador.reset();
            setIdAtributoSelecionado(null);
            await toast.sucesso('Modificador cadastrado', 'O modificador passivo foi vinculado à habilidade.');
        } catch (error) {
            await toast.erro('Falha ao cadastrar modificador', error instanceof Error ? error.message : 'Falha ao cadastrar modificador.');
        }
    };

    async function excluirModificador(indiceModificador: number, nome: string): Promise<void> {
        if (logicaHabilidade === null) return;
        if (!window.confirm(`Deseja realmente excluir o modificador ${nome}?`)) return;

        setSalvandoLogica(true);

        try {
            const modificadores = logicaHabilidade.modificadores.filter((_, indiceAtual) => indiceAtual !== indiceModificador);
            const logicaSalva = await salvarLogicaHabilidade({ idHabilidade: habilidade.id, logica: { ...logicaHabilidade, modificadores } });
            setLogicaHabilidade(logicaSalva);
            setAcoesLogica(logicaSalva.acoes.map(acao => criaFormularioAcaoLogica(acao)));
            await toast.sucesso('Modificador excluído', 'O modificador foi removido da habilidade.');
        } catch (error) {
            await toast.erro('Falha ao excluir modificador', error instanceof Error ? error.message : 'Falha ao excluir modificador.');
        } finally {
            setSalvandoLogica(false);
        }
    };

    function adicionaAcaoLogica(): void {
        setAcoesLogica(acoes => [...acoes, { nome: '', ordem: obtemProximaOrdemAcao(acoes), chaveDominio: '' }]);
    };

    function alteraAcaoLogica(indice: number, campo: keyof FormularioAcaoLogica, valor: string): void {
        setAcoesLogica(acoes => acoes.map((acao, indiceAtual) => indiceAtual === indice ? { ...acao, [campo]: valor } : acao));
    };

    function removeAcaoLogica(indice: number): void {
        setAcoesLogica(acoes => acoes.filter((_, indiceAtual) => indiceAtual !== indice));
    };

    async function salvarLogica(): Promise<void> {
        if (!podeSalvarLogica || logicaHabilidade === null) return;

        const acoes = montaAcoesLogica(acoesLogica);
        if (acoes === null) {
            await toast.erro('Falha ao salvar lógica', 'Todas as ações precisam de nome, ordem inteira e chave de domínio.');
            return;
        };

        setSalvandoLogica(true);

        try {
            const logicaSalva = await salvarLogicaHabilidade({ idHabilidade: habilidade.id, logica: { ...logicaHabilidade, acoes } });
            setLogicaHabilidade(logicaSalva);
            setAcoesLogica(logicaSalva.acoes.map(acao => criaFormularioAcaoLogica(acao)));
            await toast.sucesso('Lógica salva', 'As ações internas da habilidade foram atualizadas.');
        } catch (error) {
            await toast.erro('Falha ao salvar lógica', error instanceof Error ? error.message : 'Falha ao salvar lógica da habilidade.');
        } finally {
            setSalvandoLogica(false);
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao.Provider value={{ habilidade, atributos, modificadoresLogica, idAtributoSelecionado, selecionaAtributo: setIdAtributoSelecionado, tipoModificadorSelecionado, selecionaTipoModificador, formularioNovoModificador, valorEhValido, podeSalvar, salvar, excluirModificador, logicaHabilidade, acoesLogica, logicaCarregando, logicaErro, salvandoLogica, podeSalvarLogica, adicionaAcaoLogica, alteraAcaoLogica, removeAcaoLogica, salvarLogica }}>
            <SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao />
        </Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao.Provider>
    );
};

function ehValorModificadorValido(valorInformado: string): boolean {
    const valor = Number(valorInformado);

    return valorInformado.trim().length > 0 && Number.isInteger(valor) && valor !== 0;
};

function normalizaTipoModificador(tipoModificador: string): PropriedadesModificadorLogicaComponivel['tipo'] {
    if (tipoModificador === 'teste_pericia_valor_maximo_parametrizado') return 'teste_pericia_valor_maximo_parametrizado';

    return 'atributo';
};

function modificadorPrecisaDeAtributo(tipoModificador: PropriedadesModificadorLogicaComponivel['tipo']): boolean {
    return tipoModificador === 'atributo';
};

function montaPropriedadesModificador(tipoModificador: PropriedadesModificadorLogicaComponivel['tipo'], idAtributoSelecionado: number | null, valor: number): PropriedadesModificadorLogicaComponivel | null {
    if (tipoModificador === 'teste_pericia_valor_maximo_parametrizado') return { tipo: 'teste_pericia_valor_maximo_parametrizado', valor, argumento: { tipo: 'pericia' }, multiplicidade: 'por_argumento' };
    if (idAtributoSelecionado === null) return null;

    return { tipo: 'atributo', idAtributo: idAtributoSelecionado, valor };
};

function montaModificadorLogica(nomeInformado: string, tipoModificador: PropriedadesModificadorLogicaComponivel['tipo'], idAtributoSelecionado: number | null, valor: number, modificadoresAtuais: readonly ModificadorLogicaComponivel[]): ModificadorLogicaComponivel | null {
    const nome = nomeInformado.trim();
    const propriedades = montaPropriedadesModificador(tipoModificador, idAtributoSelecionado, valor);
    if (nome.length < 1 || propriedades === null) return null;

    return { nome, ordem: obtemProximaOrdemModificador(modificadoresAtuais), propriedades };
};

function obtemProximaOrdemModificador(modificadores: readonly ModificadorLogicaComponivel[]): number {
    if (modificadores.length === 0) return 1;

    return Math.max(...modificadores.map(modificador => modificador.ordem)) + 1;
};

function criaFormularioAcaoLogica(acao: AcaoLogicaComponivel): FormularioAcaoLogica {
    return { nome: acao.nome, ordem: acao.ordem.toString(), chaveDominio: acao.dominioInteracao.chave };
};

function ehOrdemAcaoValida(ordemInformada: string): boolean {
    const ordem = Number(ordemInformada);
    return ordemInformada.trim().length > 0 && Number.isInteger(ordem);
};

function montaAcoesLogica(acoes: FormularioAcaoLogica[]): AcaoLogicaComponivel[] | null {
    const acoesMontadas: AcaoLogicaComponivel[] = [];

    for (const acao of acoes) {
        const ordem = Number(acao.ordem);
        const nome = acao.nome.trim();
        const chaveDominio = acao.chaveDominio.trim();

        if (nome.length < 1 || chaveDominio.length < 1 || !Number.isInteger(ordem)) return null;

        acoesMontadas.push({ tipo: 'acao_dominio_interacao', nome, ordem, dominioInteracao: { tipo: 'capacidade_inata', chave: chaveDominio }, parametros: [] });
    };

    return acoesMontadas;
};

function obtemProximaOrdemAcao(acoes: FormularioAcaoLogica[]): string {
    const ordens = acoes.map(acao => Number(acao.ordem)).filter(ordem => Number.isInteger(ordem));
    if (ordens.length === 0) return '1';

    return (Math.max(...ordens) + 1).toString();
};