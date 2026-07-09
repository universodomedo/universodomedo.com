'use client';

import styles from './styles.module.css';

import { type CSSProperties } from 'react';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__EditorEstrutura__Acao } from 'Contextos/Contexto__EditorEstrutura__Acao/contexto';

// Subvista da Ação: nome + Capacidade Inata (só as do próprio membro) que a ação exerce. Os parametros (dano/visão) vivem na capacidade do Membro, não aqui.
export default function SPA__EditorEstrutura__Acao() {
    const { acao, salvando, opcoesCapacidadesDoMembro, corTipo, atualizaNome, atualizaCapacidade, removeAcaoEVolta, concluir } = useContexto__EditorEstrutura__Acao();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.acao} style={{ '--cor-tipo': corTipo } as CSSProperties}>
                    <InputComRotulo rotulo="Nome da Ação">
                        <input type="text" value={acao.nome} onChange={evento => atualizaNome(evento.target.value)} disabled={salvando} />
                    </InputComRotulo>

                    <InputComRotulo rotulo="Capacidade Inata utilizada">
                        <SelecionadorOpcoes opcoes={opcoesCapacidadesDoMembro} valor={acao.idCapacidadeInata > 0 ? String(acao.idCapacidadeInata) : null} onChange={atualizaCapacidade} disabled={salvando} placeholder="Selecione" />
                    </InputComRotulo>
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={concluir} disabled={salvando}>Concluir</button>
                <button type="button" data-variante="perigo" onClick={removeAcaoEVolta} disabled={salvando}>Remover Ação</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
