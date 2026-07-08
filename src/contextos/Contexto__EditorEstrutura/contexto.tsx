'use client';

import { createContext, useContext, useState } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import type { LayoutContextualizadoFecharProps } from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';
import type { useEditorEstruturaMembros } from 'Componentes/EditorMembros/useEditorEstruturaMembros';
import type { AcaoMembroEditor, MembroEditor } from 'Componentes/EditorMembros/membrosSerJogavelEditor';
import { Contexto__EditorEstrutura__VisaoGeral__Provider } from '../Contexto__EditorEstrutura__VisaoGeral/contexto';
import { Contexto__EditorEstrutura__Membro__Provider } from '../Contexto__EditorEstrutura__Membro/contexto';
import { Contexto__EditorEstrutura__Acao__Provider } from '../Contexto__EditorEstrutura__Acao/contexto';

type SubVistaEditorEstrutura = 'visaoGeral' | 'membro' | 'acao';

export type LayoutBaseEditorEstrutura = { readonly subtitulo: string; readonly fecharProps: LayoutContextualizadoFecharProps | undefined; };

export interface Contexto__EditorEstrutura__Props {
    editor: ReturnType<typeof useEditorEstruturaMembros>;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    subVista: SubVistaEditorEstrutura;
    membroEmEdicao: MembroEditor | null;
    acaoEmEdicao: AcaoMembroEditor | null;
    abreMembro: (idLocal: number) => void;
    abreNovoMembro: () => void;
    abreAcao: (idLocalMembro: number, idLocalAcao: number) => void;
    abreNovaAcao: (idLocalMembro: number) => void;
    voltarParaVisaoGeral: () => void;
    voltarParaMembro: () => void;
    removeMembroEmEdicao: () => void;
    removeAcaoEmEdicao: () => void;
};

type PropsProvider = {
    editor: ReturnType<typeof useEditorEstruturaMembros>;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    layoutBase: LayoutBaseEditorEstrutura;
};

const Contexto__EditorEstrutura = createContext<Contexto__EditorEstrutura__Props | undefined>(undefined);

export const useContexto__EditorEstrutura = (): Contexto__EditorEstrutura__Props => {
    const context = useContext(Contexto__EditorEstrutura);
    if (!context) throw new Error('useContexto__EditorEstrutura precisa estar dentro de um Contexto__EditorEstrutura');
    return context;
};

// Controlador de Fluxo REUTILIZÁVEL do editor de estrutura de membros (estrutura da espécie Humano e estrutura própria do não-humano):
// dono da subvista ativa (Visão Geral / Membro / Ação) e do layout contextual por subvista; o estado dos membros vive no editor do host (callbacks).
// O resolveSaida abaixo decide qual vista renderiza — nunca uma SPA.
export const Contexto__EditorEstrutura__Provider = ({ editor, salvando, podeSalvar, salvar, layoutBase }: PropsProvider) => {
    const [subVista, setSubVista] = useState<SubVistaEditorEstrutura>('visaoGeral');
    const [idLocalMembroEmEdicao, setIdLocalMembroEmEdicao] = useState<number | null>(null);
    const [idLocalAcaoEmEdicao, setIdLocalAcaoEmEdicao] = useState<number | null>(null);

    const membroEmEdicao = editor.membros.find(membro => membro.idLocal === idLocalMembroEmEdicao) ?? null;
    const acaoEmEdicao = membroEmEdicao?.acoes.find(acao => acao.idLocal === idLocalAcaoEmEdicao) ?? null;

    function abreMembro(idLocal: number): void { setIdLocalMembroEmEdicao(idLocal); setSubVista('membro'); };
    function abreNovoMembro(): void { abreMembro(editor.adicionaMembro()); };
    function abreAcao(idLocalMembro: number, idLocalAcao: number): void { setIdLocalMembroEmEdicao(idLocalMembro); setIdLocalAcaoEmEdicao(idLocalAcao); setSubVista('acao'); };
    function abreNovaAcao(idLocalMembro: number): void { abreAcao(idLocalMembro, editor.adicionaAcaoMembro(idLocalMembro)); };
    function voltarParaVisaoGeral(): void { setIdLocalMembroEmEdicao(null); setIdLocalAcaoEmEdicao(null); setSubVista('visaoGeral'); };
    function voltarParaMembro(): void { setIdLocalAcaoEmEdicao(null); setSubVista('membro'); };

    function removeMembroEmEdicao(): void {
        if (idLocalMembroEmEdicao !== null) editor.removeMembro(idLocalMembroEmEdicao);
        voltarParaVisaoGeral();
    };
    function removeAcaoEmEdicao(): void {
        if (idLocalMembroEmEdicao !== null && idLocalAcaoEmEdicao !== null) editor.removeAcaoMembro(idLocalMembroEmEdicao, idLocalAcaoEmEdicao);
        voltarParaMembro();
    };

    // Dono único do layout contextual das subvistas: re-aplica subtítulo + fecharProps a cada troca (o hook não restaura no unmount). Identidade do alvo mora no subtítulo, não no corpo.
    useConfigurarLayoutContextualizado(layoutContextualDaSubVista({ subVista, layoutBase, membroEmEdicao, acaoEmEdicao, voltarParaVisaoGeral, voltarParaMembro }));

    return (
        <Contexto__EditorEstrutura.Provider value={{ editor, salvando, podeSalvar, salvar, subVista, membroEmEdicao, acaoEmEdicao, abreMembro, abreNovoMembro, abreAcao, abreNovaAcao, voltarParaVisaoGeral, voltarParaMembro, removeMembroEmEdicao, removeAcaoEmEdicao }}>
            <ConteinerInterno__EditorEstrutura />
        </Contexto__EditorEstrutura.Provider>
    );
};

// Aplica o layout base enquanto o Controlador não está montado (carregando/erro do host) — a navegação nunca fica travada.
export const EditorEstrutura__AplicaLayoutBase = ({ layoutBase }: { layoutBase: LayoutBaseEditorEstrutura; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: layoutBase.subtitulo, fecharProps: layoutBase.fecharProps });
    return null;
};

type EntradaLayoutSubVista = {
    subVista: SubVistaEditorEstrutura;
    layoutBase: LayoutBaseEditorEstrutura;
    membroEmEdicao: MembroEditor | null;
    acaoEmEdicao: AcaoMembroEditor | null;
    voltarParaVisaoGeral: () => void;
    voltarParaMembro: () => void;
};

function layoutContextualDaSubVista({ subVista, layoutBase, membroEmEdicao, acaoEmEdicao, voltarParaVisaoGeral, voltarParaMembro }: EntradaLayoutSubVista) {
    if (subVista === 'membro' && membroEmEdicao !== null) return { subtitulo: `${layoutBase.subtitulo} · Membro · ${membroEmEdicao.nome.trim() || 'novo'}`, fecharProps: { tipo: 'acao' as const, executar: voltarParaVisaoGeral, tituloTooltip: 'Voltar para a Estrutura' } };
    if (subVista === 'acao' && membroEmEdicao !== null && acaoEmEdicao !== null) return { subtitulo: `${layoutBase.subtitulo} · ${membroEmEdicao.nome.trim() || 'membro'} · Ação · ${acaoEmEdicao.nome.trim() || 'nova'}`, fecharProps: { tipo: 'acao' as const, executar: voltarParaMembro, tituloTooltip: 'Voltar para o Membro' } };
    return { subtitulo: layoutBase.subtitulo, fecharProps: layoutBase.fecharProps };
};

// Conteiner aninhado: o resolveSaida escolhe a subvista a partir do estado de fluxo do contexto.
const ConteinerInterno__EditorEstrutura = criaConteiner<Contexto__EditorEstrutura__Props>({ useEstado: useContexto__EditorEstrutura, resolveSaida });

function resolveSaida(props: Contexto__EditorEstrutura__Props): SaidaConteiner {
    if (props.subVista === 'acao' && props.membroEmEdicao !== null && props.acaoEmEdicao !== null) return criaSaidaConteiner(Contexto__EditorEstrutura__Acao__Provider, {});
    if (props.subVista === 'membro' && props.membroEmEdicao !== null) return criaSaidaConteiner(Contexto__EditorEstrutura__Membro__Provider, {});
    return criaSaidaConteiner(Contexto__EditorEstrutura__VisaoGeral__Provider, {});
};
