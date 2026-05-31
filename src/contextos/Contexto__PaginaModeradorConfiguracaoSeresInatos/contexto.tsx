'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CategoriaAcaoInata, ParametroEditavelAcaoInata, ValorParametroAcaoInata } from 'types-nora-api';

import styles from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/styles.module.css';
import { AbasConfiguracaoSeresInatos } from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/componentes/ComponentesConfiguracaoSeresInatos';
import type { RegistroAcaoInata, RegistroCapacidadeInata, RegistroTipoSer } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

export type AbaConfiguracaoSeresInatos = 'acoes' | 'capacidades' | 'tipos';
export type FluxoConfiguracaoSeresInatos = 'listagem_acoes' | 'formulario_acao' | 'listagem_capacidades' | 'formulario_capacidade' | 'listagem_tipos_seres' | 'formulario_tipo_ser';

export type ParametroAcaoFormulario = {
    idFormulario: number;
    chave: string;
    nome: string;
    unidade: string;
    obrigatorio: boolean;
};

export type ValorParametroFormulario = {
    chave: string;
    nome: string;
    unidade: string | null;
    obrigatorio: boolean;
    valor: string;
};

export type FormularioAcaoInata = {
    id: number | null;
    nome: string;
    descricao: string;
    categoria: CategoriaAcaoInata;
    parametros: ParametroAcaoFormulario[];
};

export type FormularioCapacidadeAcao = {
    idAcaoInata: number;
    nomeAcao: string;
    parametrosPadrao: ValorParametroFormulario[];
};

export type FormularioCapacidadeInata = {
    id: number | null;
    nome: string;
    descricao: string;
    origemCorporal: string;
    quantidade: string;
    observacoes: string;
    acoes: FormularioCapacidadeAcao[];
};

export type FormularioTipoSerCapacidadeAcao = {
    idAcaoInata: number;
    nomeAcao: string;
    parametros: ValorParametroFormulario[];
};

export type FormularioTipoSerCapacidade = {
    idCapacidadeInata: number;
    nomeCapacidade: string;
    parametrosAcoes: FormularioTipoSerCapacidadeAcao[];
};

export type FormularioTipoSer = {
    id: number | null;
    nome: string;
    descricao: string;
    tamanho: string;
    pesoKg: string;
    limiteCargaKg: string;
    raciocinio: string;
    comunicacao: string;
    capacidades: FormularioTipoSerCapacidade[];
};

export interface Contexto__PaginaModeradorConfiguracaoSeresInatos__Props {
    fluxo: FluxoConfiguracaoSeresInatos;
    abaAtual: AbaConfiguracaoSeresInatos;
    acaoEmEdicao: RegistroAcaoInata | null;
    capacidadeEmEdicao: RegistroCapacidadeInata | null;
    tipoSerEmEdicao: RegistroTipoSer | null;
    selecionaListagemAcoes: () => void;
    selecionaListagemCapacidades: () => void;
    selecionaListagemTiposSeres: () => void;
    iniciaNovaAcao: () => void;
    editaAcao: (acao: RegistroAcaoInata) => void;
    iniciaNovaCapacidade: () => void;
    editaCapacidade: (capacidade: RegistroCapacidadeInata) => void;
    iniciaNovoTipoSer: () => void;
    editaTipoSer: (tipoSer: RegistroTipoSer) => void;
};

const Contexto__PaginaModeradorConfiguracaoSeresInatos = createContext<Contexto__PaginaModeradorConfiguracaoSeresInatos__Props | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoSeresInatos = (): Contexto__PaginaModeradorConfiguracaoSeresInatos__Props => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoSeresInatos);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoSeresInatos precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoSeresInatos');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoSeresInatos__Provider = ({ children }: { children: ReactNode; }) => {
    const [fluxo, setFluxo] = useState<FluxoConfiguracaoSeresInatos>('listagem_acoes');
    const [acaoEmEdicao, setAcaoEmEdicao] = useState<RegistroAcaoInata | null>(null);
    const [capacidadeEmEdicao, setCapacidadeEmEdicao] = useState<RegistroCapacidadeInata | null>(null);
    const [tipoSerEmEdicao, setTipoSerEmEdicao] = useState<RegistroTipoSer | null>(null);
    const abaAtual = resolveAbaAtual(fluxo);

    function selecionaListagemAcoes(): void {
        setAcaoEmEdicao(null);
        setFluxo('listagem_acoes');
    };

    function selecionaListagemCapacidades(): void {
        setCapacidadeEmEdicao(null);
        setFluxo('listagem_capacidades');
    };

    function selecionaListagemTiposSeres(): void {
        setTipoSerEmEdicao(null);
        setFluxo('listagem_tipos_seres');
    };

    function iniciaNovaAcao(): void {
        setAcaoEmEdicao(null);
        setFluxo('formulario_acao');
    };

    function editaAcao(acao: RegistroAcaoInata): void {
        setAcaoEmEdicao(acao);
        setFluxo('formulario_acao');
    };

    function iniciaNovaCapacidade(): void {
        setCapacidadeEmEdicao(null);
        setFluxo('formulario_capacidade');
    };

    function editaCapacidade(capacidade: RegistroCapacidadeInata): void {
        setCapacidadeEmEdicao(capacidade);
        setFluxo('formulario_capacidade');
    };

    function iniciaNovoTipoSer(): void {
        setTipoSerEmEdicao(null);
        setFluxo('formulario_tipo_ser');
    };

    function editaTipoSer(tipoSer: RegistroTipoSer): void {
        setTipoSerEmEdicao(tipoSer);
        setFluxo('formulario_tipo_ser');
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos.Provider value={{ fluxo, abaAtual, acaoEmEdicao, capacidadeEmEdicao, tipoSerEmEdicao, selecionaListagemAcoes, selecionaListagemCapacidades, selecionaListagemTiposSeres, iniciaNovaAcao, editaAcao, iniciaNovaCapacidade, editaCapacidade, iniciaNovoTipoSer, editaTipoSer }}>
            <section className={styles.recipiente}>
                <AbasConfiguracaoSeresInatos abaAtual={abaAtual} selecionaListagemAcoes={selecionaListagemAcoes} selecionaListagemCapacidades={selecionaListagemCapacidades} selecionaListagemTiposSeres={selecionaListagemTiposSeres} />
                {children}
            </section>
        </Contexto__PaginaModeradorConfiguracaoSeresInatos.Provider>
    );
};

function resolveAbaAtual(fluxo: FluxoConfiguracaoSeresInatos): AbaConfiguracaoSeresInatos {
    if (fluxo === 'listagem_capacidades' || fluxo === 'formulario_capacidade') return 'capacidades';
    if (fluxo === 'listagem_tipos_seres' || fluxo === 'formulario_tipo_ser') return 'tipos';

    return 'acoes';
};

export function criaValoresFormulario(parametros: readonly ParametroEditavelAcaoInata[], valores: readonly ValorParametroAcaoInata[]): ValorParametroFormulario[] {
    const valoresPorChave = new Map(valores.map(valor => [valor.chave, valor.valor]));

    return parametros.map(parametro => ({
        chave: parametro.chave,
        nome: parametro.nome,
        unidade: parametro.unidade,
        obrigatorio: parametro.obrigatorio,
        valor: valoresPorChave.has(parametro.chave) ? String(valoresPorChave.get(parametro.chave)) : '',
    }));
};

export function atualizaValorParametro(parametros: readonly ValorParametroFormulario[], chave: string, valor: string): ValorParametroFormulario[] {
    return parametros.map(parametro => parametro.chave === chave ? { ...parametro, valor } : parametro);
};

export function montaValoresParametros(parametros: readonly ValorParametroFormulario[], exigirObrigatorios: boolean): readonly ValorParametroAcaoInata[] {
    const valores: ValorParametroAcaoInata[] = [];
    const algumValorPreenchido = parametros.some(parametro => parametro.valor.trim().length > 0);

    for (const parametro of parametros) {
        const valorTexto = parametro.valor.trim();
        if (valorTexto.length < 1) {
            if ((exigirObrigatorios || algumValorPreenchido) && parametro.obrigatorio) throw new Error(`Informe o valor de ${parametro.nome}.`);
            continue;
        }

        const valor = Number(valorTexto);
        if (!Number.isFinite(valor)) throw new Error(`Valor inválido para ${parametro.nome}.`);

        valores.push({ chave: parametro.chave, valor });
    }

    return valores;
};