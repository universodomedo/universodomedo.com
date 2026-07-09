'use client';

import { createContext, useContext } from 'react';

import { useContexto__EditorEstrutura } from '../Contexto__EditorEstrutura/contexto';
import SPA__EditorEstrutura__Acao from 'Conteineres/EditorEstrutura/paginas/SPA__EditorEstrutura__Acao/SPA__EditorEstrutura__Acao';
import { corDoTipoInteracao } from 'Componentes/EditorMembros/tiposInteracaoVisual';
import { idsCapacidadesDoMembroEditor, type AcaoMembroEditor } from 'Componentes/EditorMembros/membrosSerJogavelEditor';
import type { OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';

interface Contexto__EditorEstrutura__Acao__Props {
    acao: AcaoMembroEditor;
    salvando: boolean;
    opcoesCapacidadesDoMembro: readonly OpcaoSelecionador[];
    corTipo: string;
    atualizaNome: (nome: string) => void;
    atualizaCapacidade: (valor: string | null) => void;
    removeAcaoEVolta: () => void;
    concluir: () => void;
};

const Contexto__EditorEstrutura__Acao = createContext<Contexto__EditorEstrutura__Acao__Props | undefined>(undefined);

export const useContexto__EditorEstrutura__Acao = (): Contexto__EditorEstrutura__Acao__Props => {
    const context = useContext(Contexto__EditorEstrutura__Acao);
    if (!context) throw new Error('useContexto__EditorEstrutura__Acao precisa estar dentro de um Contexto__EditorEstrutura__Acao');
    return context;
};

// Subfluxo Ação: nome + Capacidade Inata (do próprio membro) que a ação exerce. Os parametros (dano/visão) são da capacidade do Membro, não da ação — não se autoram aqui.
export const Contexto__EditorEstrutura__Acao__Provider = () => {
    const { editor, salvando, membroEmEdicao, acaoEmEdicao, removeAcaoEmEdicao, voltarParaMembro } = useContexto__EditorEstrutura();
    if (membroEmEdicao === null || acaoEmEdicao === null) throw new Error('Contexto__EditorEstrutura__Acao exige membro e ação em edição (resolveSaida garante).');
    const membro = membroEmEdicao;
    const acao = acaoEmEdicao;

    const idsDoMembro = idsCapacidadesDoMembroEditor(membro);
    const capacidadesDoMembro = editor.capacidadesInatas.registros.filter(capacidade => idsDoMembro.includes(capacidade.id));
    const capacidadeDaAcao = capacidadesDoMembro.find(capacidade => capacidade.id === acao.idCapacidadeInata) ?? null;

    return (
        <Contexto__EditorEstrutura__Acao.Provider value={{
            acao,
            salvando,
            opcoesCapacidadesDoMembro: capacidadesDoMembro.map(capacidade => ({ value: String(capacidade.id), label: capacidade.nome })),
            corTipo: corDoTipoInteracao(capacidadeDaAcao?.nomeInteracao),
            atualizaNome: nome => editor.atualizaNomeAcaoMembro(membro.idLocal, acao.idLocal, nome),
            atualizaCapacidade: valor => editor.atualizaCapacidadeAcaoMembro(membro.idLocal, acao.idLocal, valor === null ? 0 : Number(valor)),
            removeAcaoEVolta: removeAcaoEmEdicao,
            concluir: voltarParaMembro,
        }}>
            <SPA__EditorEstrutura__Acao />
        </Contexto__EditorEstrutura__Acao.Provider>
    );
};
