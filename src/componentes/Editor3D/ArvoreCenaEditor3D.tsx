'use client';

import styles from './Editor3D.module.css';

import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';

import type { MembroPersonagemEditor3D } from 'types-nora-api';

import { SELECAO_CAMERA_EDITOR3D, SELECAO_CORPO_PERSONAGEM_EDITOR3D, SELECAO_TITULO_CAPA_ARTE_EDITOR3D } from './editor3D.tipos';
import { colecaoMostraFiacao, colecaoMostraGeometria, type TipoColecaoSistemaEditor3D } from './editor3D.colecoesSistema';

export type ObjetoResumoEditor3D = { readonly id: number; readonly nome: string; readonly icone: string; readonly tipoRotulo: string; readonly visivel: boolean; readonly ehPeca: boolean; };
export type ColecaoArvoreEditor3D = { readonly id: number; readonly nome: string; readonly visivel: boolean; readonly objetos: readonly ObjetoResumoEditor3D[]; };
// Fonte de Luz na árvore: nó de primeira classe da cena do MAPA, ao lado dos objetos (id é string — a luz não entra na numeração dos objetos).
export type LuzArvoreEditor3D = { readonly idLocal: string; readonly nome: string; readonly tipoRotulo: string; };
// Comando na árvore: a fiação do mapa. `tipoRotulo` mostra o tamanho do circuito.
export type ComandoArvoreEditor3D = { readonly idLocal: string; readonly nome: string; readonly tipoRotulo: string; };

interface ArvoreCenaEditor3DProps {
    // A Coleção de Sistema ATIVA escopa a árvore: PROJETO mostra tudo; CENARIO só geometria; ILUMINACAO só fontes+comandos, agrupados.
    readonly colecaoSistema: TipoColecaoSistemaEditor3D;
    readonly objetosRaiz: readonly ObjetoResumoEditor3D[];
    readonly colecoes: readonly ColecaoArvoreEditor3D[];
    readonly idSelecionado: number | null;
    readonly temCamera: boolean;
    readonly povCameraAtiva: boolean;
    readonly regioesCorpo: readonly { readonly membro: MembroPersonagemEditor3D; readonly rotulo: string }[];
    readonly regiaoCorpoSelecionada: MembroPersonagemEditor3D | null;
    readonly aoSelecionarCorpo: (regiao: MembroPersonagemEditor3D | null) => void;
    readonly aoSelecionar: (id: number) => void;
    readonly aoAlternarVisibilidadeObjeto: (id: number) => void;
    readonly aoDuplicarObjeto: (id: number) => void;
    readonly aoExcluirObjeto: (id: number) => void;
    readonly aoAlternarVisibilidadeColecao: (id: number) => void;
    readonly aoRenomearColecao: (id: number, nome: string) => void;
    readonly aoRenomearObjeto: (id: number, nome: string) => void;
    readonly aoRemoverColecao: (id: number) => void;
    readonly aoMoverObjeto: (idObjeto: number, idColecaoDestino: number | null) => void;
    readonly aoAlternarPovCamera: () => void;
    readonly luzes: readonly LuzArvoreEditor3D[];
    readonly idLuzSelecionada: string | null;
    readonly aoSelecionarLuz: (idLocal: string) => void;
    readonly aoRenomearLuz: (idLocal: string, nome: string) => void;
    readonly aoExcluirLuz: (idLocal: string) => void;
    readonly comandos: readonly ComandoArvoreEditor3D[];
    readonly idComandoSelecionado: string | null;
    readonly aoSelecionarComando: (idLocal: string) => void;
    readonly aoRenomearComando: (idLocal: string, nome: string) => void;
    readonly aoExcluirComando: (idLocal: string) => void;
};

const ALVO_RAIZ_ARVORE_EDITOR3D = -1;

export function ArvoreCenaEditor3D({ colecaoSistema, objetosRaiz, colecoes, idSelecionado, temCamera, povCameraAtiva, regioesCorpo, regiaoCorpoSelecionada, aoSelecionarCorpo, aoSelecionar, aoAlternarVisibilidadeObjeto, aoDuplicarObjeto, aoExcluirObjeto, aoAlternarVisibilidadeColecao, aoRenomearColecao, aoRenomearObjeto, aoRemoverColecao, aoMoverObjeto, aoAlternarPovCamera, luzes, idLuzSelecionada, aoSelecionarLuz, aoRenomearLuz, aoExcluirLuz, comandos, idComandoSelecionado, aoSelecionarComando, aoRenomearComando, aoExcluirComando }: ArvoreCenaEditor3DProps) {
    const [arrastandoId, setArrastandoId] = useState<number | null>(null);
    const [alvoArraste, setAlvoArraste] = useState<number | null>(null);
    const [colecoesAbertas, setColecoesAbertas] = useState<Record<number, boolean>>({});
    const [editando, setEditando] = useState<{ id: number; valor: string } | null>(null);
    const inputRenomearRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => { if (editando !== null) inputRenomearRef.current?.focus(); }, [editando?.id]);

    function colecaoAberta(id: number): boolean { return colecoesAbertas[id] ?? true; };
    function alternaColecaoAberta(id: number): void { setColecoesAbertas(atual => ({ ...atual, [id]: !(atual[id] ?? true) })); };

    function iniciaArraste(evento: DragEvent<HTMLDivElement>, idObjeto: number): void {
        evento.dataTransfer.effectAllowed = 'move';
        evento.dataTransfer.setData('text/plain', String(idObjeto));
        setArrastandoId(idObjeto);
    };
    function encerraArraste(): void { setArrastandoId(null); setAlvoArraste(null); };
    function permiteSoltar(evento: DragEvent<HTMLElement>, alvo: number): void {
        if (arrastandoId === null) return;
        evento.preventDefault();
        evento.dataTransfer.dropEffect = 'move';
        setAlvoArraste(alvo);
    };
    function solta(evento: DragEvent<HTMLElement>, idColecaoDestino: number | null): void {
        if (arrastandoId === null) return;
        evento.preventDefault();
        evento.stopPropagation();
        aoMoverObjeto(arrastandoId, idColecaoDestino);
        encerraArraste();
    };

    function confirmaRenomear(): void { if (editando !== null) { aoRenomearColecao(editando.id, editando.valor); setEditando(null); } };
    function teclaRenomear(evento: KeyboardEvent<HTMLInputElement>): void {
        evento.stopPropagation();
        if (evento.key === 'Enter') confirmaRenomear();
        if (evento.key === 'Escape') setEditando(null);
    };

    // Rename inline do OBJETO (duplo clique no nome, como nas coleções): o nome é identidade da árvore, não campo de painel.
    const [editandoObjeto, setEditandoObjeto] = useState<{ id: number; valor: string } | null>(null);
    function confirmaRenomearObjeto(): void { if (editandoObjeto !== null) { aoRenomearObjeto(editandoObjeto.id, editandoObjeto.valor); setEditandoObjeto(null); } };
    function teclaRenomearObjeto(evento: KeyboardEvent<HTMLInputElement>): void {
        evento.stopPropagation();
        if (evento.key === 'Enter') confirmaRenomearObjeto();
        if (evento.key === 'Escape') setEditandoObjeto(null);
    };

    const [editandoLuz, setEditandoLuz] = useState<{ idLocal: string; valor: string } | null>(null);
    function confirmaRenomearLuz(): void { if (editandoLuz !== null) { aoRenomearLuz(editandoLuz.idLocal, editandoLuz.valor); setEditandoLuz(null); } };
    function teclaRenomearLuz(evento: KeyboardEvent<HTMLInputElement>): void {
        evento.stopPropagation();
        if (evento.key === 'Enter') confirmaRenomearLuz();
        if (evento.key === 'Escape') setEditandoLuz(null);
    };

    const [editandoComando, setEditandoComando] = useState<{ idLocal: string; valor: string } | null>(null);
    function confirmaRenomearComando(): void { if (editandoComando !== null) { aoRenomearComando(editandoComando.idLocal, editandoComando.valor); setEditandoComando(null); } };
    function teclaRenomearComando(evento: KeyboardEvent<HTMLInputElement>): void {
        evento.stopPropagation();
        if (evento.key === 'Enter') confirmaRenomearComando();
        if (evento.key === 'Escape') setEditandoComando(null);
    };

    // Ações do objeto moram na própria linha (ícones inline): duplicar / visibilidade / excluir. Partes de peça não têm
    // duplicar/excluir individual (a peça é removida inteira pelo painel) — colunas ficam vazias p/ manter o alinhamento.
    function renderizaObjeto(objeto: ObjetoResumoEditor3D) {
        const selecionado = objeto.id === idSelecionado;
        return (
            <div key={objeto.id} className={`${styles.linha_objeto_grade} ${styles.linha_objeto_acoes} ${selecionado ? styles.linha_objeto_selecionado : ''} ${objeto.visivel ? '' : styles.linha_objeto_oculto} ${arrastandoId === objeto.id ? styles.linha_objeto_arrastando : ''}`} draggable onDragStart={evento => iniciaArraste(evento, objeto.id)} onDragEnd={encerraArraste}>
                {editandoObjeto?.id === objeto.id ? (
                    <input className={styles.input_renomear_colecao} autoFocus value={editandoObjeto.valor} onChange={evento => setEditandoObjeto({ id: objeto.id, valor: evento.target.value })} onBlur={confirmaRenomearObjeto} onKeyDown={teclaRenomearObjeto} />
                ) : (
                    <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={selecionado} onClick={() => aoSelecionar(objeto.id)} onDoubleClick={() => setEditandoObjeto({ id: objeto.id, valor: objeto.nome })} title="Duplo clique para renomear">
                        <span className={styles.espaco_arvore} />
                        <span className={styles.icone_objeto}>{objeto.icone}</span>
                        <span className={styles.nome_objeto}>{objeto.nome}</span>
                        <strong>{objeto.tipoRotulo}</strong>
                    </button>
                )}
                {objeto.ehPeca ? <span aria-hidden="true" /> : <button type="button" className={styles.botao_visibilidade} onClick={() => aoDuplicarObjeto(objeto.id)} title="Duplicar objeto" aria-label={`Duplicar ${objeto.nome}`}>⧉</button>}
                <button type="button" className={styles.botao_visibilidade} onClick={() => aoAlternarVisibilidadeObjeto(objeto.id)} aria-pressed={objeto.visivel} title={objeto.visivel ? 'Ocultar objeto' : 'Mostrar objeto'}>{objeto.visivel ? '👁' : '⊘'}</button>
                {objeto.ehPeca ? <span aria-hidden="true" /> : <button type="button" className={styles.botao_remover_colecao} onClick={() => aoExcluirObjeto(objeto.id)} title="Excluir objeto" aria-label={`Excluir ${objeto.nome}`}>✕</button>}
            </div>
        );
    };

    // Fonte de Luz na árvore: mesma linha do objeto, sem visibilidade nem duplicar (a luz é acesa/apagada pela intensidade, no painel).
    function renderizaLuz(luz: LuzArvoreEditor3D) {
        const selecionada = luz.idLocal === idLuzSelecionada;
        return (
            <div key={luz.idLocal} className={`${styles.linha_objeto_grade} ${styles.linha_objeto_acoes} ${selecionada ? styles.linha_objeto_selecionado : ''}`}>
                {editandoLuz?.idLocal === luz.idLocal ? (
                    <input className={styles.input_renomear_colecao} autoFocus value={editandoLuz.valor} onChange={evento => setEditandoLuz({ idLocal: luz.idLocal, valor: evento.target.value })} onBlur={confirmaRenomearLuz} onKeyDown={teclaRenomearLuz} />
                ) : (
                    <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={selecionada} onClick={() => aoSelecionarLuz(luz.idLocal)} onDoubleClick={() => setEditandoLuz({ idLocal: luz.idLocal, valor: luz.nome })} title="Duplo clique para renomear">
                        <span className={styles.espaco_arvore} />
                        <span className={styles.icone_objeto}>💡</span>
                        <span className={styles.nome_objeto}>{luz.nome}</span>
                        <strong>{luz.tipoRotulo}</strong>
                    </button>
                )}
                <span aria-hidden="true" />
                <span className={styles.botao_visibilidade} aria-hidden="true" />
                <button type="button" className={styles.botao_remover_colecao} onClick={() => aoExcluirLuz(luz.idLocal)} title="Excluir luz" aria-label={`Excluir ${luz.nome}`}>✕</button>
            </div>
        );
    };

    // Comando na árvore: mesma linha da luz — a fiação é nó de primeira classe do mapa, não propriedade escondida de um objeto.
    function renderizaComando(comando: ComandoArvoreEditor3D) {
        const selecionado = comando.idLocal === idComandoSelecionado;
        return (
            <div key={comando.idLocal} className={`${styles.linha_objeto_grade} ${styles.linha_objeto_acoes} ${selecionado ? styles.linha_objeto_selecionado : ''}`}>
                {editandoComando?.idLocal === comando.idLocal ? (
                    <input className={styles.input_renomear_colecao} autoFocus value={editandoComando.valor} onChange={evento => setEditandoComando({ idLocal: comando.idLocal, valor: evento.target.value })} onBlur={confirmaRenomearComando} onKeyDown={teclaRenomearComando} />
                ) : (
                    <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={selecionado} onClick={() => aoSelecionarComando(comando.idLocal)} onDoubleClick={() => setEditandoComando({ idLocal: comando.idLocal, valor: comando.nome })} title="Duplo clique para renomear">
                        <span className={styles.espaco_arvore} />
                        <span className={styles.icone_objeto}>⏻</span>
                        <span className={styles.nome_objeto}>{comando.nome}</span>
                        <strong>{comando.tipoRotulo}</strong>
                    </button>
                )}
                <span aria-hidden="true" />
                <span className={styles.botao_visibilidade} aria-hidden="true" />
                <button type="button" className={styles.botao_remover_colecao} onClick={() => aoExcluirComando(comando.idLocal)} title="Excluir comando" aria-label={`Excluir ${comando.nome}`}>✕</button>
            </div>
        );
    };

    const mostraGeometria = colecaoMostraGeometria(colecaoSistema);
    // O objeto Luz aparece em TODA lente (no Cenário ele se coloca e se posiciona); só a fiação é exclusiva da Iluminação,
    // onde a árvore vira o domínio agrupado — fontes de um lado, fiação do outro.
    const mostraFiacao = colecaoMostraFiacao(colecaoSistema);
    const agrupaIluminacao = colecaoSistema === 'ILUMINACAO';

    return (
        <div className={styles.arvore_cena}>
            <div className={`${styles.bloco_raiz} ${alvoArraste === ALVO_RAIZ_ARVORE_EDITOR3D ? styles.bloco_recebendo_arraste : ''}`} onDragOver={evento => permiteSoltar(evento, ALVO_RAIZ_ARVORE_EDITOR3D)} onDragLeave={() => setAlvoArraste(null)} onDrop={evento => solta(evento, null)}>
                {mostraGeometria && <button type="button" className={styles.linha_objeto} onClick={() => aoSelecionar(ALVO_RAIZ_ARVORE_EDITOR3D)}>
                    <span className={styles.espaco_arvore} />
                    <span className={styles.icone_origem}>◎</span>
                    <span className={styles.nome_objeto}>Origem</span>
                    <strong>0, 0, 0</strong>
                </button>}
                {mostraGeometria && temCamera && (
                    <div className={`${styles.linha_objeto_grade} ${idSelecionado === SELECAO_CAMERA_EDITOR3D ? styles.linha_objeto_selecionado : ''}`}>
                        <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={idSelecionado === SELECAO_CAMERA_EDITOR3D} onClick={() => aoSelecionar(SELECAO_CAMERA_EDITOR3D)}>
                            <span className={styles.espaco_arvore} />
                            <span className={styles.icone_origem}>🎥</span>
                            <span className={styles.nome_objeto}>Câmera</span>
                            <strong>Output</strong>
                        </button>
                        <button type="button" className={`${styles.botao_visibilidade} ${povCameraAtiva ? styles.botao_pov_arvore_ativo : ''}`} onClick={aoAlternarPovCamera} aria-pressed={povCameraAtiva} title={povCameraAtiva ? 'Sair da 1ª pessoa (ver em 3ª)' : 'Ver/controlar em 1ª pessoa'}>👁</button>
                    </div>
                )}
                {mostraGeometria && regioesCorpo.length > 0 && (
                    <div className={`${styles.linha_objeto_grade} ${idSelecionado === SELECAO_CORPO_PERSONAGEM_EDITOR3D && regiaoCorpoSelecionada === null ? styles.linha_objeto_selecionado : ''}`}>
                        <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={idSelecionado === SELECAO_CORPO_PERSONAGEM_EDITOR3D && regiaoCorpoSelecionada === null} onClick={() => aoSelecionarCorpo(null)}>
                            <span className={styles.espaco_arvore} />
                            <span className={styles.icone_origem}>🧍</span>
                            <span className={styles.nome_objeto}>Corpo</span>
                            <strong>Contínuo</strong>
                        </button>
                        <span className={styles.botao_visibilidade} aria-hidden="true" />
                    </div>
                )}
                {mostraGeometria && regioesCorpo.map(regiao => (
                    <div key={regiao.membro} className={`${styles.linha_objeto_grade} ${styles.linha_titulo_camera} ${regiaoCorpoSelecionada === regiao.membro ? styles.linha_objeto_selecionado : ''}`}>
                        <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={regiaoCorpoSelecionada === regiao.membro} onClick={() => aoSelecionarCorpo(regiao.membro)}>
                            <span className={styles.espaco_arvore} />
                            <span className={styles.icone_objeto}>◈</span>
                            <span className={styles.nome_objeto}>{regiao.rotulo}</span>
                            <strong>Região</strong>
                        </button>
                        <span className={styles.botao_visibilidade} aria-hidden="true" />
                    </div>
                ))}
                {mostraGeometria && temCamera && (
                    <div className={`${styles.linha_objeto_grade} ${styles.linha_titulo_camera} ${idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D ? styles.linha_objeto_selecionado : ''}`}>
                        <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D} onClick={() => aoSelecionar(SELECAO_TITULO_CAPA_ARTE_EDITOR3D)}>
                            <span className={styles.espaco_arvore} />
                            <span className={styles.icone_objeto}>T</span>
                            <span className={styles.nome_objeto}>Título</span>
                            <strong>Texto 3D</strong>
                        </button>
                        <span className={styles.botao_visibilidade} aria-hidden="true" />
                    </div>
                )}
                {mostraGeometria && objetosRaiz.map(renderizaObjeto)}
                {agrupaIluminacao && luzes.length > 0 && <div className={styles.grupo_arvore}>Fontes de Luz</div>}
                {luzes.map(renderizaLuz)}
                {/* Interruptores são DERIVADOS dos vínculos objeto↔luz — grupo e lista aparecem e somem juntos, nunca vazios. */}
                {agrupaIluminacao && comandos.length > 0 && <div className={styles.grupo_arvore}>Interruptores</div>}
                {mostraFiacao && comandos.map(renderizaComando)}
            </div>

            {mostraGeometria && colecoes.map(colecao => {
                const aberta = colecaoAberta(colecao.id);
                const recebendo = alvoArraste === colecao.id;

                return (
                    <div key={colecao.id} className={`${styles.bloco_colecao} ${recebendo ? styles.bloco_recebendo_arraste : ''}`} onDragOver={evento => permiteSoltar(evento, colecao.id)} onDragLeave={() => setAlvoArraste(null)} onDrop={evento => solta(evento, colecao.id)}>
                        <div className={`${styles.linha_colecao} ${colecao.visivel ? '' : styles.linha_objeto_oculto}`}>
                            <button type="button" className={styles.botao_alternar_colecao} onClick={() => alternaColecaoAberta(colecao.id)} aria-expanded={aberta}>{aberta ? '▾' : '▸'}</button>
                            {editando?.id === colecao.id ? (
                                <input ref={inputRenomearRef} className={styles.input_renomear_colecao} value={editando.valor} onChange={evento => setEditando({ id: colecao.id, valor: evento.target.value })} onBlur={confirmaRenomear} onKeyDown={teclaRenomear} />
                            ) : (
                                <button type="button" className={styles.botao_conteudo_colecao} onDoubleClick={() => setEditando({ id: colecao.id, valor: colecao.nome })}>
                                    <span className={styles.icone_colecao}>▣</span>
                                    <strong>{colecao.nome}</strong>
                                    <small>{colecao.objetos.length}</small>
                                </button>
                            )}
                            <button type="button" className={styles.botao_visibilidade} onClick={() => aoAlternarVisibilidadeColecao(colecao.id)} aria-pressed={colecao.visivel} title={colecao.visivel ? 'Ocultar coleção' : 'Mostrar coleção'}>{colecao.visivel ? '👁' : '⊘'}</button>
                            <button type="button" className={styles.botao_remover_colecao} onClick={() => aoRemoverColecao(colecao.id)} title="Remover coleção (objetos voltam à raiz)" aria-label={`Remover ${colecao.nome}`}>✕</button>
                        </div>
                        {aberta && colecao.objetos.map(renderizaObjeto)}
                        {aberta && colecao.objetos.length === 0 && <div className={styles.colecao_vazia}>Arraste objetos para cá</div>}
                    </div>
                );
            })}
        </div>
    );
};
