'use client';

import styles from './styles.module.css';

import { type CSSProperties } from 'react';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { corDoTipoInteracao } from 'Componentes/EditorMembros/tiposInteracaoVisual';
import { useContexto__EditorEstrutura__Membro } from 'Contextos/Contexto__EditorEstrutura__Membro/contexto';

// Subvista do Membro: nome + Capacidades Inatas; as ações listam como resumo e abrem na subvista específica de Ação.
export default function SPA__EditorEstrutura__Membro() {
    const { membro, salvando, capacidadesRegistros, acoesDoMembro, podeAdicionarAcao, atualizaNome, aoMudarCapacidades, abreAcao, abreNovaAcao, removeMembroEVolta, concluir } = useContexto__EditorEstrutura__Membro();

    const opcoesCapacidades = capacidadesRegistros.map(capacidade => ({ value: String(capacidade.id), label: capacidade.nome }));

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.membro}>
                    <InputComRotulo rotulo="Nome do Membro">
                        <input type="text" value={membro.nome} onChange={evento => atualizaNome(evento.target.value)} disabled={salvando} />
                    </InputComRotulo>

                    <InputComRotulo rotulo="Capacidades Inatas">
                        <SelecionadorOpcoes isMulti opcoes={opcoesCapacidades} valores={membro.idsCapacidadesInatas.map(String)} onChange={aoMudarCapacidades} disabled={salvando} placeholder="Selecione..." />
                    </InputComRotulo>

                    <div className={styles.cabecalho_acoes}>
                        <h3>Ações do Membro</h3>
                        <button type="button" className={styles.botao_adicionar} onClick={abreNovaAcao} disabled={!podeAdicionarAcao}>+ Ação</button>
                    </div>

                    {acoesDoMembro.length > 0
                        ? <div className={styles.lista_acoes}>
                            {acoesDoMembro.map(entrada => (
                                <button key={entrada.acao.idLocal} type="button" className={styles.linha_acao} onClick={() => abreAcao(entrada.acao.idLocal)} style={{ '--cor-tipo': corDoTipoInteracao(entrada.capacidade?.nomeInteracao) } as CSSProperties}>
                                    <span className={styles.nome_acao}>{entrada.acao.nome.trim() || '—'}</span>
                                    {typeof entrada.acao.parametros.dano === 'number' && <span className={styles.dano_acao}>dano {entrada.acao.parametros.dano}</span>}
                                    <span className={styles.capacidade_acao}>{entrada.capacidade?.nome ?? 'sem capacidade'}</span>
                                </button>
                            ))}
                        </div>
                        : <p className={styles.resumo_vazio}>Nenhuma ação neste membro.</p>}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={concluir} disabled={salvando}>Concluir</button>
                <button type="button" data-variante="perigo" onClick={removeMembroEVolta} disabled={salvando}>Remover Membro</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
