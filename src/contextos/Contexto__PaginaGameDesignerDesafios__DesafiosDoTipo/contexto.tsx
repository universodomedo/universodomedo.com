'use client';

import { createContext, useContext, useState } from 'react';
import type { DesafioResumo, GrupoTipoDesafio } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerDesafios__Props } from '../Contexto__PaginaGameDesignerDesafios/contexto';
import SPA__PaginaGameDesignerDesafios__DesafiosDoTipo from 'Conteineres/PaginaGameDesignerDesafios/paginas/SPA__PaginaGameDesignerDesafios__DesafiosDoTipo/SPA__PaginaGameDesignerDesafios__DesafiosDoTipo';

type EditorDesafio = {
    readonly id: number | null;
    readonly nome: string;
    readonly descricao: string;
};

interface Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Props {
    grupo: GrupoTipoDesafio;
    salvando: boolean;
    voltaParaTipos: Contexto__PaginaGameDesignerDesafios__Props['voltaParaTipos'];
    alternarAtivoDesafio: Contexto__PaginaGameDesignerDesafios__Props['alternarAtivoDesafio'];
    editorDesafio: EditorDesafio | null;
    abrirCriacao: () => void;
    abrirEdicao: (desafio: DesafioResumo) => void;
    alterarEditor: (parcial: Partial<EditorDesafio>) => void;
    cancelarEditor: () => void;
    salvarEditor: () => Promise<void>;
};

type PropsProvider = {
    grupo: GrupoTipoDesafio;
    salvando: boolean;
    voltaParaTipos: Contexto__PaginaGameDesignerDesafios__Props['voltaParaTipos'];
    criarDesafio: Contexto__PaginaGameDesignerDesafios__Props['criarDesafio'];
    salvarDesafio: Contexto__PaginaGameDesignerDesafios__Props['salvarDesafio'];
    alternarAtivoDesafio: Contexto__PaginaGameDesignerDesafios__Props['alternarAtivoDesafio'];
};

const Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo = createContext<Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo = (): Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Props => {
    const context = useContext(Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo);
    if (!context) throw new Error('useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo precisa estar dentro de um Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo');
    return context;
};

export const Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Provider = ({ grupo, salvando, voltaParaTipos, criarDesafio, salvarDesafio, alternarAtivoDesafio }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: `${grupo.rotulo}`, fecharProps: { tipo: 'acao', executar: voltaParaTipos, tituloTooltip: 'Voltar para os tipos' } });

    const [editorDesafio, setEditorDesafio] = useState<EditorDesafio | null>(null);

    function abrirCriacao(): void { setEditorDesafio({ id: null, nome: '', descricao: '' }); };
    function abrirEdicao(desafio: DesafioResumo): void { setEditorDesafio({ id: desafio.id, nome: desafio.nome, descricao: desafio.descricao }); };
    function alterarEditor(parcial: Partial<EditorDesafio>): void { setEditorDesafio(editorAtual => editorAtual ? { ...editorAtual, ...parcial } : editorAtual); };
    function cancelarEditor(): void { setEditorDesafio(null); };

    async function salvarEditor(): Promise<void> {
        if (!editorDesafio || editorDesafio.nome.trim().length === 0 || editorDesafio.descricao.trim().length === 0) return;

        if (editorDesafio.id === null) await criarDesafio(grupo.tipo, editorDesafio.nome, editorDesafio.descricao);
        else await salvarDesafio(editorDesafio.id, grupo.tipo, editorDesafio.nome, editorDesafio.descricao);

        setEditorDesafio(null);
    };

    return (
        <Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo.Provider value={{ grupo, salvando, voltaParaTipos, alternarAtivoDesafio, editorDesafio, abrirCriacao, abrirEdicao, alterarEditor, cancelarEditor, salvarEditor }}>
            <SPA__PaginaGameDesignerDesafios__DesafiosDoTipo />
        </Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo.Provider>
    );
};