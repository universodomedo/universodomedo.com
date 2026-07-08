'use client';

import styles from './styles.module.css';

import { type CSSProperties } from 'react';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { CardMembroEditor } from 'Componentes/EditorMembros/CardMembroEditor';
import { corDoTipoInteracao } from 'Componentes/EditorMembros/tiposInteracaoVisual';
import { useContexto__EditorEstrutura__VisaoGeral } from 'Contextos/Contexto__EditorEstrutura__VisaoGeral/contexto';

// Complete View da estrutura: membros + resumo composto das Capacidades Inatas + resumo composto das ações. Criar/editar abre as subvistas específicas.
export default function SPA__EditorEstrutura__VisaoGeral() {
    const { membros, capacidadesInatas, mensagemValidacao, capacidadesDaEstrutura, acoesDaEstrutura, salvando, podeSalvar, salvar, abreMembro, abreNovoMembro, abreAcao } = useContexto__EditorEstrutura__VisaoGeral();
    const carregarMaisCapacidades = capacidadesInatas.carregarMais;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.visao_geral}>
                    {mensagemValidacao && <p className={styles.aviso_validacao}>{mensagemValidacao}</p>}
                    {capacidadesInatas.carregando && <span className={styles.info_discreta}>{capacidadesInatas.carregando}</span>}
                    {capacidadesInatas.erro && <p className={styles.aviso_validacao}>{capacidadesInatas.erro}</p>}
                    {carregarMaisCapacidades && carregarMaisCapacidades.podeCarregarMais && (
                        <button type="button" className={styles.botao_adicionar} onClick={carregarMaisCapacidades.aoCarregarMais} disabled={!!carregarMaisCapacidades.carregando}>{carregarMaisCapacidades.carregando ?? 'Carregar mais capacidades'}</button>
                    )}

                    <section className={styles.secao}>
                        <h3>Membros</h3>
                        <div className={styles.grade_membros}>
                            {membros.map(membro => (
                                <CardMembroEditor key={membro.idLocal} membro={membro} capacidades={capacidadesInatas.registros} ativo={false} aoSelecionar={() => abreMembro(membro.idLocal)} />
                            ))}
                            <button type="button" className={styles.botao_adicionar} onClick={abreNovoMembro} disabled={salvando}>+ Membro</button>
                        </div>
                    </section>

                    <section className={styles.secao}>
                        <h3>Capacidades Inatas da Estrutura</h3>
                        {capacidadesDaEstrutura.length > 0
                            ? <div className={styles.chips_capacidades}>
                                {capacidadesDaEstrutura.map(entrada => (
                                    <span key={entrada.capacidade.id} className={styles.chip_capacidade} style={{ '--cor-tipo': corDoTipoInteracao(entrada.capacidade.nomeInteracao) } as CSSProperties}>
                                        <span className={styles.gema_chip} />
                                        {entrada.capacidade.nome}
                                        <b>{entrada.totalMembros} membro{entrada.totalMembros > 1 ? 's' : ''}</b>
                                    </span>
                                ))}
                            </div>
                            : <p className={styles.resumo_vazio}>Nenhuma Capacidade Inata em uso.</p>}
                    </section>

                    <section className={styles.secao}>
                        <h3>Ações da Estrutura</h3>
                        {acoesDaEstrutura.length > 0
                            ? <div className={styles.lista_acoes}>
                                {acoesDaEstrutura.map(entrada => (
                                    <button key={`${entrada.idLocalMembro}_${entrada.idLocalAcao}`} type="button" className={styles.linha_acao} onClick={() => abreAcao(entrada.idLocalMembro, entrada.idLocalAcao)} style={{ '--cor-tipo': corDoTipoInteracao(entrada.capacidade?.nomeInteracao) } as CSSProperties}>
                                        <span className={styles.nome_acao}>{entrada.nomeAcao.trim() || '—'}</span>
                                        {typeof entrada.dano === 'number' && <span className={styles.dano_acao}>dano {entrada.dano}</span>}
                                        <span className={styles.origem_acao}>{entrada.nomeMembro.trim() || '—'} · {entrada.capacidade?.nome ?? 'sem capacidade'}</span>
                                    </button>
                                ))}
                            </div>
                            : <p className={styles.resumo_vazio}>Nenhuma ação definida.</p>}
                    </section>
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Salvar Estrutura'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
