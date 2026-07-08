'use client';

import { createContext, useContext } from 'react';

import { useContexto__EditorEstrutura } from '../Contexto__EditorEstrutura/contexto';
import SPA__EditorEstrutura__Membro from 'Conteineres/EditorEstrutura/paginas/SPA__EditorEstrutura__Membro/SPA__EditorEstrutura__Membro';
import type { AcaoMembroEditor, CapacidadeInataMembroEditor, MembroEditor } from 'Componentes/EditorMembros/membrosSerJogavelEditor';

export type AcaoDoMembro = { readonly acao: AcaoMembroEditor; readonly capacidade: CapacidadeInataMembroEditor | null; };

interface Contexto__EditorEstrutura__Membro__Props {
    membro: MembroEditor;
    salvando: boolean;
    capacidadesRegistros: readonly CapacidadeInataMembroEditor[];
    acoesDoMembro: readonly AcaoDoMembro[];
    podeAdicionarAcao: boolean;
    atualizaNome: (nome: string) => void;
    aoMudarCapacidades: (valores: readonly string[]) => void;
    abreAcao: (idLocalAcao: number) => void;
    abreNovaAcao: () => void;
    removeMembroEVolta: () => void;
    concluir: () => void;
};

const Contexto__EditorEstrutura__Membro = createContext<Contexto__EditorEstrutura__Membro__Props | undefined>(undefined);

export const useContexto__EditorEstrutura__Membro = (): Contexto__EditorEstrutura__Membro__Props => {
    const context = useContext(Contexto__EditorEstrutura__Membro);
    if (!context) throw new Error('useContexto__EditorEstrutura__Membro precisa estar dentro de um Contexto__EditorEstrutura__Membro');
    return context;
};

// Subfluxo Membro: nome + Capacidades Inatas do membro; as ações listam aqui e são editadas na subvista específica de Ação.
export const Contexto__EditorEstrutura__Membro__Provider = () => {
    const { editor, salvando, membroEmEdicao, abreAcao, abreNovaAcao, removeMembroEmEdicao, voltarParaVisaoGeral } = useContexto__EditorEstrutura();
    if (membroEmEdicao === null) throw new Error('Contexto__EditorEstrutura__Membro exige um membro em edição (resolveSaida garante).');
    const membro = membroEmEdicao;

    const acoesDoMembro = membro.acoes.map(acao => ({ acao, capacidade: editor.capacidadesInatas.registros.find(capacidade => capacidade.id === acao.idCapacidadeInata) ?? null }));

    function aoMudarCapacidades(valores: readonly string[]): void {
        const novos = valores.map(Number);
        for (const id of novos) if (!membro.idsCapacidadesInatas.includes(id)) editor.alternaCapacidadeMembro(membro.idLocal, id);
        for (const id of membro.idsCapacidadesInatas) if (!novos.includes(id)) editor.alternaCapacidadeMembro(membro.idLocal, id);
    };

    return (
        <Contexto__EditorEstrutura__Membro.Provider value={{
            membro,
            salvando,
            capacidadesRegistros: editor.capacidadesInatas.registros,
            acoesDoMembro,
            podeAdicionarAcao: membro.idsCapacidadesInatas.length > 0 && !salvando,
            atualizaNome: nome => editor.atualizaNomeMembro(membro.idLocal, nome),
            aoMudarCapacidades,
            abreAcao: idLocalAcao => abreAcao(membro.idLocal, idLocalAcao),
            abreNovaAcao: () => abreNovaAcao(membro.idLocal),
            removeMembroEVolta: removeMembroEmEdicao,
            concluir: voltarParaVisaoGeral,
        }}>
            <SPA__EditorEstrutura__Membro />
        </Contexto__EditorEstrutura__Membro.Provider>
    );
};
