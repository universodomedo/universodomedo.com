'use client';

import { createContext, useContext } from 'react';
import { TIPOS_INTERACAO } from 'types-nora-api';

import { useContexto__EditorEstrutura } from '../Contexto__EditorEstrutura/contexto';
import SPA__EditorEstrutura__Acao from 'Conteineres/EditorEstrutura/paginas/SPA__EditorEstrutura__Acao/SPA__EditorEstrutura__Acao';
import { corDoTipoInteracao } from 'Componentes/EditorMembros/tiposInteracaoVisual';
import type { AcaoMembroEditor } from 'Componentes/EditorMembros/membrosSerJogavelEditor';
import type { OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';

interface Contexto__EditorEstrutura__Acao__Props {
    acao: AcaoMembroEditor;
    salvando: boolean;
    opcoesCapacidadesDoMembro: readonly OpcaoSelecionador[];
    acaoDanificavel: boolean;
    corTipo: string;
    atualizaNome: (nome: string) => void;
    atualizaCapacidade: (valor: string | null) => void;
    atualizaDano: (dano: number) => void;
    removeAcaoEVolta: () => void;
    concluir: () => void;
};

const Contexto__EditorEstrutura__Acao = createContext<Contexto__EditorEstrutura__Acao__Props | undefined>(undefined);

export const useContexto__EditorEstrutura__Acao = (): Contexto__EditorEstrutura__Acao__Props => {
    const context = useContext(Contexto__EditorEstrutura__Acao);
    if (!context) throw new Error('useContexto__EditorEstrutura__Acao precisa estar dentro de um Contexto__EditorEstrutura__Acao');
    return context;
};

// Subfluxo Ação: nome + Capacidade Inata (do próprio membro) + dano quando Danificável — responsabilidade isolada da ação.
export const Contexto__EditorEstrutura__Acao__Provider = () => {
    const { editor, salvando, membroEmEdicao, acaoEmEdicao, removeAcaoEmEdicao, voltarParaMembro } = useContexto__EditorEstrutura();
    if (membroEmEdicao === null || acaoEmEdicao === null) throw new Error('Contexto__EditorEstrutura__Acao exige membro e ação em edição (resolveSaida garante).');
    const membro = membroEmEdicao;
    const acao = acaoEmEdicao;

    const capacidadesDoMembro = editor.capacidadesInatas.registros.filter(capacidade => membro.idsCapacidadesInatas.includes(capacidade.id));
    const capacidadeDaAcao = capacidadesDoMembro.find(capacidade => capacidade.id === acao.idCapacidadeInata) ?? null;
    const acaoDanificavel = capacidadeDaAcao?.nomeInteracao === TIPOS_INTERACAO.DANIFICAVEL.chave;

    return (
        <Contexto__EditorEstrutura__Acao.Provider value={{
            acao,
            salvando,
            opcoesCapacidadesDoMembro: capacidadesDoMembro.map(capacidade => ({ value: String(capacidade.id), label: capacidade.nome })),
            acaoDanificavel,
            corTipo: corDoTipoInteracao(capacidadeDaAcao?.nomeInteracao),
            atualizaNome: nome => editor.atualizaNomeAcaoMembro(membro.idLocal, acao.idLocal, nome),
            atualizaCapacidade: valor => editor.atualizaCapacidadeAcaoMembro(membro.idLocal, acao.idLocal, valor === null ? 0 : Number(valor)),
            atualizaDano: dano => editor.atualizaDanoAcaoMembro(membro.idLocal, acao.idLocal, dano),
            removeAcaoEVolta: removeAcaoEmEdicao,
            concluir: voltarParaMembro,
        }}>
            <SPA__EditorEstrutura__Acao />
        </Contexto__EditorEstrutura__Acao.Provider>
    );
};
