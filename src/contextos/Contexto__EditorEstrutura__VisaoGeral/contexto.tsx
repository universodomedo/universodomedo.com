'use client';

import { createContext, useContext } from 'react';

import { useContexto__EditorEstrutura } from '../Contexto__EditorEstrutura/contexto';
import SPA__EditorEstrutura__VisaoGeral from 'Conteineres/EditorEstrutura/paginas/SPA__EditorEstrutura__VisaoGeral/SPA__EditorEstrutura__VisaoGeral';
import type { CapacidadesInatasListagemEditorMembros } from 'Componentes/EditorMembros/useEditorEstruturaMembros';
import type { CapacidadeInataMembroEditor, MembroEditor } from 'Componentes/EditorMembros/membrosSerJogavelEditor';

export type CapacidadeDaEstrutura = { readonly capacidade: CapacidadeInataMembroEditor; readonly totalMembros: number; };
export type AcaoDaEstrutura = { readonly idLocalMembro: number; readonly idLocalAcao: number; readonly nomeAcao: string; readonly nomeMembro: string; readonly capacidade: CapacidadeInataMembroEditor | null; readonly dano: number | ''; };

interface Contexto__EditorEstrutura__VisaoGeral__Props {
    membros: readonly MembroEditor[];
    capacidadesInatas: CapacidadesInatasListagemEditorMembros;
    mensagemValidacao: string | null;
    capacidadesDaEstrutura: readonly CapacidadeDaEstrutura[];
    acoesDaEstrutura: readonly AcaoDaEstrutura[];
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    abreMembro: (idLocal: number) => void;
    abreNovoMembro: () => void;
    abreAcao: (idLocalMembro: number, idLocalAcao: number) => void;
};

const Contexto__EditorEstrutura__VisaoGeral = createContext<Contexto__EditorEstrutura__VisaoGeral__Props | undefined>(undefined);

export const useContexto__EditorEstrutura__VisaoGeral = (): Contexto__EditorEstrutura__VisaoGeral__Props => {
    const context = useContext(Contexto__EditorEstrutura__VisaoGeral);
    if (!context) throw new Error('useContexto__EditorEstrutura__VisaoGeral precisa estar dentro de um Contexto__EditorEstrutura__VisaoGeral');
    return context;
};

// Subfluxo Visão Geral (Complete View da estrutura): membros + resumos compostos de capacidades e ações; editar/criar abre as subvistas específicas.
export const Contexto__EditorEstrutura__VisaoGeral__Provider = () => {
    const { editor, salvando, podeSalvar, salvar, abreMembro, abreNovoMembro, abreAcao } = useContexto__EditorEstrutura();

    const capacidadesDaEstrutura = montaCapacidadesDaEstrutura(editor.membros, editor.capacidadesInatas.registros);
    const acoesDaEstrutura = montaAcoesDaEstrutura(editor.membros, editor.capacidadesInatas.registros);

    return (
        <Contexto__EditorEstrutura__VisaoGeral.Provider value={{ membros: editor.membros, capacidadesInatas: editor.capacidadesInatas, mensagemValidacao: editor.mensagemValidacao, capacidadesDaEstrutura, acoesDaEstrutura, salvando, podeSalvar, salvar, abreMembro, abreNovoMembro, abreAcao }}>
            <SPA__EditorEstrutura__VisaoGeral />
        </Contexto__EditorEstrutura__VisaoGeral.Provider>
    );
};

// Resumo composto: cada capacidade em uso na estrutura + em quantos membros aparece.
function montaCapacidadesDaEstrutura(membros: readonly MembroEditor[], capacidades: readonly CapacidadeInataMembroEditor[]): CapacidadeDaEstrutura[] {
    return capacidades
        .map(capacidade => ({ capacidade, totalMembros: membros.filter(membro => membro.idsCapacidadesInatas.includes(capacidade.id)).length }))
        .filter(entrada => entrada.totalMembros > 0);
};

// Resumo composto: todas as ações da estrutura com o membro dono e a capacidade utilizada.
function montaAcoesDaEstrutura(membros: readonly MembroEditor[], capacidades: readonly CapacidadeInataMembroEditor[]): AcaoDaEstrutura[] {
    return membros.flatMap(membro => membro.acoes.map(acao => ({
        idLocalMembro: membro.idLocal,
        idLocalAcao: acao.idLocal,
        nomeAcao: acao.nome,
        nomeMembro: membro.nome,
        capacidade: capacidades.find(capacidade => capacidade.id === acao.idCapacidadeInata) ?? null,
        dano: acao.parametros.dano,
    })));
};
