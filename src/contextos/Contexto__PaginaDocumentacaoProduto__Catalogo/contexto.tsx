'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { Contexto__PaginaDocumentacaoProduto__Props, RegistroNecessidade, RegistroPersona } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Catalogo from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Catalogo/SPA__PaginaDocumentacaoProduto__Catalogo';

export type FormPersona = { idEmEdicao: number | null; nome: string; descricao: string; ativo: boolean };
export type FormNecessidade = { idEmEdicao: number | null; fkPersonasId: number | null; titulo: string; descricao: string };

const FORM_PERSONA_INICIAL: FormPersona = { idEmEdicao: null, nome: '', descricao: '', ativo: true };
const FORM_NECESSIDADE_INICIAL: FormNecessidade = { idEmEdicao: null, fkPersonasId: null, titulo: '', descricao: '' };

interface Contexto__PaginaDocumentacaoProduto__Catalogo__Props {
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemPersonas'];
    listagemNecessidades: Contexto__PaginaDocumentacaoProduto__Props['listagemNecessidades'];
    formPersona: FormPersona;
    formNecessidade: FormNecessidade;
    salvandoPersona: boolean;
    salvandoNecessidade: boolean;
    erroPersona: string | null;
    erroNecessidade: string | null;
    podeSalvarPersona: boolean;
    podeSalvarNecessidade: boolean;
    setCampoPersona: <K extends keyof FormPersona>(campo: K, valor: FormPersona[K]) => void;
    setCampoNecessidade: <K extends keyof FormNecessidade>(campo: K, valor: FormNecessidade[K]) => void;
    editarPersona: (persona: RegistroPersona) => void;
    editarNecessidade: (necessidade: RegistroNecessidade) => void;
    limparFormPersona: () => void;
    limparFormNecessidade: () => void;
    salvarPersona: () => Promise<void>;
    salvarNecessidade: () => Promise<void>;
};

type PropsProvider = Pick<Contexto__PaginaDocumentacaoProduto__Props, 'listagemPersonas' | 'listagemNecessidades' | 'criarPersona' | 'atualizarPersona' | 'criarNecessidade' | 'atualizarNecessidade' | 'fecharCatalogo'>;

const Contexto__PaginaDocumentacaoProduto__Catalogo = createContext<Contexto__PaginaDocumentacaoProduto__Catalogo__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Catalogo = (): Contexto__PaginaDocumentacaoProduto__Catalogo__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Catalogo);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Catalogo precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Catalogo');
    return context;
};

export const Contexto__PaginaDocumentacaoProduto__Catalogo__Provider = ({ listagemPersonas, listagemNecessidades, criarPersona, atualizarPersona, criarNecessidade, atualizarNecessidade, fecharCatalogo }: PropsProvider) => {
    const [formPersona, setFormPersona] = useState<FormPersona>(FORM_PERSONA_INICIAL);
    const [formNecessidade, setFormNecessidade] = useState<FormNecessidade>(FORM_NECESSIDADE_INICIAL);
    const [salvandoPersona, setSalvandoPersona] = useState<boolean>(false);
    const [salvandoNecessidade, setSalvandoNecessidade] = useState<boolean>(false);
    const [erroPersona, setErroPersona] = useState<string | null>(null);
    const [erroNecessidade, setErroNecessidade] = useState<string | null>(null);

    // Navegação contextual: título estável (da PÁGINA); subtítulo identifica o catálogo; o X volta pra listagem de páginas. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: 'Personas & Necessidades',
        fecharProps: { tipo: 'acao', executar: fecharCatalogo, tituloTooltip: 'Voltar para a listagem' },
    });

    const setCampoPersona = useCallback(<K extends keyof FormPersona>(campo: K, valor: FormPersona[K]) => setFormPersona(f => ({ ...f, [campo]: valor })), []);
    const setCampoNecessidade = useCallback(<K extends keyof FormNecessidade>(campo: K, valor: FormNecessidade[K]) => setFormNecessidade(f => ({ ...f, [campo]: valor })), []);

    const editarPersona = useCallback((persona: RegistroPersona) => setFormPersona({ idEmEdicao: persona.id, nome: persona.nome, descricao: persona.descricao ?? '', ativo: persona.ativo }), []);
    const editarNecessidade = useCallback((necessidade: RegistroNecessidade) => setFormNecessidade({ idEmEdicao: necessidade.id, fkPersonasId: necessidade.fkPersonasId, titulo: necessidade.titulo, descricao: necessidade.descricao ?? '' }), []);
    const limparFormPersona = useCallback(() => setFormPersona(FORM_PERSONA_INICIAL), []);
    const limparFormNecessidade = useCallback(() => setFormNecessidade(FORM_NECESSIDADE_INICIAL), []);

    const podeSalvarPersona = formPersona.nome.trim().length > 0 && !salvandoPersona;
    const podeSalvarNecessidade = formNecessidade.titulo.trim().length > 0 && formNecessidade.fkPersonasId !== null && !salvandoNecessidade;

    const salvarPersona = useCallback(async (): Promise<void> => {
        setSalvandoPersona(true);
        setErroPersona(null);
        try {
            const descricao = formPersona.descricao.trim().length > 0 ? formPersona.descricao.trim() : null;
            if (formPersona.idEmEdicao === null) await criarPersona(formPersona.nome.trim(), descricao);
            else await atualizarPersona(formPersona.idEmEdicao, formPersona.nome.trim(), descricao, formPersona.ativo);
            setFormPersona(FORM_PERSONA_INICIAL);
        } catch (capturado) {
            setErroPersona(capturado instanceof Error ? capturado.message : 'Não foi possível salvar a persona.');
        } finally {
            setSalvandoPersona(false);
        }
    }, [formPersona, criarPersona, atualizarPersona]);

    const salvarNecessidade = useCallback(async (): Promise<void> => {
        if (formNecessidade.fkPersonasId === null) return;
        setSalvandoNecessidade(true);
        setErroNecessidade(null);
        try {
            const descricao = formNecessidade.descricao.trim().length > 0 ? formNecessidade.descricao.trim() : null;
            if (formNecessidade.idEmEdicao === null) await criarNecessidade(formNecessidade.fkPersonasId, formNecessidade.titulo.trim(), descricao);
            else await atualizarNecessidade(formNecessidade.idEmEdicao, formNecessidade.titulo.trim(), descricao);
            setFormNecessidade(FORM_NECESSIDADE_INICIAL);
        } catch (capturado) {
            setErroNecessidade(capturado instanceof Error ? capturado.message : 'Não foi possível salvar a necessidade.');
        } finally {
            setSalvandoNecessidade(false);
        }
    }, [formNecessidade, criarNecessidade, atualizarNecessidade]);

    return (
        <Contexto__PaginaDocumentacaoProduto__Catalogo.Provider value={{ listagemPersonas, listagemNecessidades, formPersona, formNecessidade, salvandoPersona, salvandoNecessidade, erroPersona, erroNecessidade, podeSalvarPersona, podeSalvarNecessidade, setCampoPersona, setCampoNecessidade, editarPersona, editarNecessidade, limparFormPersona, limparFormNecessidade, salvarPersona, salvarNecessidade }}>
            <SPA__PaginaDocumentacaoProduto__Catalogo />
        </Contexto__PaginaDocumentacaoProduto__Catalogo.Provider>
    );
};