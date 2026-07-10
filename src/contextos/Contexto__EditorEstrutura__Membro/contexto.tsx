'use client';

import { createContext, useContext } from 'react';

import { useContexto__EditorEstrutura } from '../Contexto__EditorEstrutura/contexto';
import SPA__EditorEstrutura__Membro from 'Conteineres/EditorEstrutura/paginas/SPA__EditorEstrutura__Membro/SPA__EditorEstrutura__Membro';
import { useListagemTiposVisao } from 'Hooks/useListagemTiposVisao';
import { idsCapacidadesDoMembroEditor, type AcaoMembroEditor, type CampoParametroCapacidadeEditor, type CapacidadeInataMembroEditor, type CapacidadeMembroEditor, type MeioLocomocaoEditor, type MembroEditor } from 'Componentes/EditorMembros/membrosSerJogavelEditor';
import type { OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';

export type AcaoDoMembro = { readonly acao: AcaoMembroEditor; readonly capacidade: CapacidadeInataMembroEditor | null; };
// Capacidade do membro com o catalogo resolvido (nome/interacao) + os parametros autorados (a faculdade).
export type CapacidadeDoMembroComParametros = { readonly idCapacidadeInata: number; readonly nome: string; readonly nomeInteracao?: string; readonly parametros: CapacidadeMembroEditor['parametros']; };

interface Contexto__EditorEstrutura__Membro__Props {
    membro: MembroEditor;
    salvando: boolean;
    opcoesCapacidades: readonly OpcaoSelecionador[];
    idsCapacidadesSelecionadas: readonly string[];
    capacidadesDoMembro: readonly CapacidadeDoMembroComParametros[];
    tiposVisaoOpcoes: readonly OpcaoSelecionador[];
    tiposVisaoCarregando: string | null;
    acoesDoMembro: readonly AcaoDoMembro[];
    podeAdicionarAcao: boolean;
    atualizaNome: (nome: string) => void;
    aoMudarCapacidades: (valores: readonly string[]) => void;
    atualizaParametro: (idCapacidade: number, campo: CampoParametroCapacidadeEditor, valor: number | '') => void;
    atualizaMeioLocomocao: (idCapacidade: number, meio: MeioLocomocaoEditor) => void;
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

// Subfluxo Membro: nome + Capacidades Inatas do membro (cada uma com seus parametros — a faculdade); as ações listam aqui e são editadas na subvista específica de Ação.
export const Contexto__EditorEstrutura__Membro__Provider = () => {
    const { editor, salvando, membroEmEdicao, abreAcao, abreNovaAcao, removeMembroEmEdicao, voltarParaVisaoGeral } = useContexto__EditorEstrutura();
    const tiposVisao = useListagemTiposVisao();
    if (membroEmEdicao === null) throw new Error('Contexto__EditorEstrutura__Membro exige um membro em edição (resolveSaida garante).');
    const membro = membroEmEdicao;
    const idsDoMembro = idsCapacidadesDoMembroEditor(membro);

    const capacidadesDoMembro = membro.capacidades.map(capacidade => {
        const info = editor.capacidadesInatas.registros.find(registro => registro.id === capacidade.idCapacidadeInata);
        return { idCapacidadeInata: capacidade.idCapacidadeInata, nome: info?.nome ?? `#${capacidade.idCapacidadeInata}`, nomeInteracao: info?.nomeInteracao, parametros: capacidade.parametros };
    });
    const acoesDoMembro = membro.acoes.map(acao => ({ acao, capacidade: editor.capacidadesInatas.registros.find(capacidade => capacidade.id === acao.idCapacidadeInata) ?? null }));

    function aoMudarCapacidades(valores: readonly string[]): void {
        const novos = valores.map(Number);
        for (const id of novos) if (!idsDoMembro.includes(id)) editor.alternaCapacidadeMembro(membro.idLocal, id);
        for (const id of idsDoMembro) if (!novos.includes(id)) editor.alternaCapacidadeMembro(membro.idLocal, id);
    };

    return (
        <Contexto__EditorEstrutura__Membro.Provider value={{
            membro,
            salvando,
            opcoesCapacidades: editor.capacidadesInatas.registros.map(capacidade => ({ value: String(capacidade.id), label: capacidade.nome })),
            idsCapacidadesSelecionadas: idsDoMembro.map(String),
            capacidadesDoMembro,
            tiposVisaoOpcoes: tiposVisao.registros.map(tipo => ({ value: String(tipo.id), label: tipo.nome })),
            tiposVisaoCarregando: tiposVisao.carregando ?? null,
            acoesDoMembro,
            podeAdicionarAcao: membro.capacidades.length > 0 && !salvando,
            atualizaNome: nome => editor.atualizaNomeMembro(membro.idLocal, nome),
            aoMudarCapacidades,
            atualizaParametro: (idCapacidade, campo, valor) => editor.atualizaParametroCapacidade(membro.idLocal, idCapacidade, campo, valor),
            atualizaMeioLocomocao: (idCapacidade, meio) => editor.atualizaMeioLocomocao(membro.idLocal, idCapacidade, meio),
            abreAcao: idLocalAcao => abreAcao(membro.idLocal, idLocalAcao),
            abreNovaAcao: () => abreNovaAcao(membro.idLocal),
            removeMembroEVolta: removeMembroEmEdicao,
            concluir: voltarParaVisaoGeral,
        }}>
            <SPA__EditorEstrutura__Membro />
        </Contexto__EditorEstrutura__Membro.Provider>
    );
};
