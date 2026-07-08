'use client';

import styles from './styles.module.css';

import type { CapacidadeInataMembroEditor, MembroEditor } from './membrosSerJogavelEditor';

type CarregarMaisEditorMembros = { readonly podeCarregarMais: boolean; readonly aoCarregarMais: () => void; readonly carregando?: string | null; };

export type CapacidadesInatasListagemEditorMembros = {
    readonly registros: readonly CapacidadeInataMembroEditor[];
    readonly carregando?: string | null;
    readonly erro?: string | null;
    readonly carregarMais?: CarregarMaisEditorMembros | null;
};

type Props = {
    membros: readonly MembroEditor[];
    capacidadesInatas: CapacidadesInatasListagemEditorMembros;
    salvando: boolean;
    mensagemValidacao: string | null;
    adicionaMembro: () => void;
    removeMembro: (idLocal: number) => void;
    atualizaNomeMembro: (idLocal: number, nome: string) => void;
    alternaCapacidadeMembro: (idLocal: number, idCapacidade: number) => void;
    adicionaAcaoMembro: (idLocal: number) => void;
    removeAcaoMembro: (idLocal: number, idLocalAcao: number) => void;
    atualizaNomeAcaoMembro: (idLocal: number, idLocalAcao: number, nome: string) => void;
    atualizaCapacidadeAcaoMembro: (idLocal: number, idLocalAcao: number, idCapacidadeInata: number) => void;
    atualizaDanoAcaoMembro: (idLocal: number, idLocalAcao: number, dano: number | '') => void;
};

// Editor de membros REUTILIZÁVEL (Ser jogável e Base de Ser): renderiza a lista de membros com capacidades inatas e ações, dirigido por props.
// O estado/validação vive no contexto de quem usa (helpers em membrosSerJogavelEditor); este componente só renderiza e dispara callbacks.
export function EditorMembros({ membros, capacidadesInatas, salvando, mensagemValidacao, adicionaMembro, removeMembro, atualizaNomeMembro, alternaCapacidadeMembro, adicionaAcaoMembro, removeAcaoMembro, atualizaNomeAcaoMembro, atualizaCapacidadeAcaoMembro, atualizaDanoAcaoMembro }: Props) {
    const carregarMaisCapacidades = capacidadesInatas.carregarMais;

    return (
        <div className={styles.bloco_membros}>
            <div className={styles.cabecalho_membros}>
                <h3>Membros</h3>
                <button type="button" onClick={adicionaMembro} disabled={salvando}>Adicionar membro</button>
            </div>

            {mensagemValidacao && <p className={styles.erro_campo}>{mensagemValidacao}</p>}
            {capacidadesInatas.carregando && <strong>{capacidadesInatas.carregando}</strong>}
            {capacidadesInatas.erro && <small className={styles.erro_campo}>{capacidadesInatas.erro}</small>}
            {carregarMaisCapacidades && carregarMaisCapacidades.podeCarregarMais && (
                <button type="button" onClick={carregarMaisCapacidades.aoCarregarMais} disabled={!!carregarMaisCapacidades.carregando}>{carregarMaisCapacidades.carregando ?? 'Carregar mais capacidades'}</button>
            )}

            {membros.map(membro => {
                const capacidadesDoMembro = capacidadesInatas.registros.filter(capacidade => membro.idsCapacidadesInatas.includes(capacidade.id));

                return (
                    <article key={membro.idLocal} className={styles.card_membro}>
                        <label className={styles.campo}>
                            <span>Nome do membro</span>
                            <input type="text" value={membro.nome} onChange={evento => atualizaNomeMembro(membro.idLocal, evento.target.value)} disabled={salvando} />
                        </label>

                        <div className={styles.lista_capacidades}>
                            {capacidadesInatas.registros.map(capacidade => (
                                <label key={capacidade.id} className={styles.capacidade}>
                                    <input type="checkbox" checked={membro.idsCapacidadesInatas.includes(capacidade.id)} onChange={() => alternaCapacidadeMembro(membro.idLocal, capacidade.id)} disabled={salvando} />
                                    <span>{capacidade.nome}</span>
                                </label>
                            ))}
                        </div>

                        <div className={styles.bloco_acoes_membro}>
                            <div className={styles.cabecalho_acoes_membro}>
                                <strong>Ações do membro</strong>
                                <button type="button" onClick={() => adicionaAcaoMembro(membro.idLocal)} disabled={salvando || capacidadesDoMembro.length < 1}>Adicionar ação</button>
                            </div>

                            {membro.acoes.length > 0 && (
                                <div className={styles.lista_acoes_membro}>
                                    {membro.acoes.map(acao => {
                                        const capacidadeAcao = capacidadesDoMembro.find(capacidade => capacidade.id === acao.idCapacidadeInata);
                                        const acaoDanificavel = capacidadeAcao?.nomeInteracao === 'Danificável';

                                        return (
                                            <div key={acao.idLocal} className={styles.acao_membro}>
                                                <label className={styles.campo}>
                                                    <span>Nome da ação</span>
                                                    <input type="text" value={acao.nome} onChange={evento => atualizaNomeAcaoMembro(membro.idLocal, acao.idLocal, evento.target.value)} disabled={salvando} />
                                                </label>

                                                <label className={styles.campo}>
                                                    <span>Capacidade Inata utilizada</span>
                                                    <select value={acao.idCapacidadeInata} onChange={evento => atualizaCapacidadeAcaoMembro(membro.idLocal, acao.idLocal, Number(evento.target.value))} disabled={salvando}>
                                                        <option value={0}>Selecione</option>
                                                        {capacidadesDoMembro.map(capacidade => <option key={capacidade.id} value={capacidade.id}>{capacidade.nome}</option>)}
                                                    </select>
                                                </label>

                                                {acaoDanificavel && (
                                                    <label className={styles.campo}>
                                                        <span>Dano</span>
                                                        <input type="number" min={1} step={1} value={acao.parametros.dano} onChange={evento => atualizaDanoAcaoMembro(membro.idLocal, acao.idLocal, evento.target.value === '' ? '' : Number(evento.target.value))} disabled={salvando} />
                                                    </label>
                                                )}

                                                <button type="button" className={styles.botao_remover} onClick={() => removeAcaoMembro(membro.idLocal, acao.idLocal)} disabled={salvando}>Remover ação</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button type="button" className={styles.botao_remover} onClick={() => removeMembro(membro.idLocal)} disabled={salvando}>Remover membro</button>
                    </article>
                );
            })}
        </div>
    );
};
