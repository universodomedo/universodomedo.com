'use client';

import styles from './Editor3D.module.css';

import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';

import type { MembroPersonagemEditor3D } from 'types-nora-api';

import { SELECAO_CAMERA_EDITOR3D, SELECAO_CORPO_PERSONAGEM_EDITOR3D, SELECAO_TITULO_CAPA_ARTE_EDITOR3D } from './editor3D.tipos';

export type ObjetoResumoEditor3D = { readonly id: number; readonly nome: string; readonly icone: string; readonly tipoRotulo: string; readonly visivel: boolean; readonly ehPeca: boolean; };
export type ColecaoArvoreEditor3D = { readonly id: number; readonly nome: string; readonly visivel: boolean; readonly objetos: readonly ObjetoResumoEditor3D[]; };

interface ArvoreCenaEditor3DProps {
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
    readonly aoRemoverColecao: (id: number) => void;
    readonly aoMoverObjeto: (idObjeto: number, idColecaoDestino: number | null) => void;
    readonly aoAlternarPovCamera: () => void;
};

const ALVO_RAIZ_ARVORE_EDITOR3D = -1;

export function ArvoreCenaEditor3D({ objetosRaiz, colecoes, idSelecionado, temCamera, povCameraAtiva, regioesCorpo, regiaoCorpoSelecionada, aoSelecionarCorpo, aoSelecionar, aoAlternarVisibilidadeObjeto, aoDuplicarObjeto, aoExcluirObjeto, aoAlternarVisibilidadeColecao, aoRenomearColecao, aoRemoverColecao, aoMoverObjeto, aoAlternarPovCamera }: ArvoreCenaEditor3DProps) {
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

    // Ações do objeto moram na própria linha (ícones inline): duplicar / visibilidade / excluir. Partes de peça não têm
    // duplicar/excluir individual (a peça é removida inteira pelo painel) — colunas ficam vazias p/ manter o alinhamento.
    function renderizaObjeto(objeto: ObjetoResumoEditor3D) {
        const selecionado = objeto.id === idSelecionado;
        return (
            <div key={objeto.id} className={`${styles.linha_objeto_grade} ${styles.linha_objeto_acoes} ${selecionado ? styles.linha_objeto_selecionado : ''} ${objeto.visivel ? '' : styles.linha_objeto_oculto} ${arrastandoId === objeto.id ? styles.linha_objeto_arrastando : ''}`} draggable onDragStart={evento => iniciaArraste(evento, objeto.id)} onDragEnd={encerraArraste}>
                <button type="button" className={styles.botao_conteudo_objeto} aria-pressed={selecionado} onClick={() => aoSelecionar(objeto.id)}>
                    <span className={styles.espaco_arvore} />
                    <span className={styles.icone_objeto}>{objeto.icone}</span>
                    <span className={styles.nome_objeto}>{objeto.nome}</span>
                    <strong>{objeto.tipoRotulo}</strong>
                </button>
                {objeto.ehPeca ? <span aria-hidden="true" /> : <button type="button" className={styles.botao_visibilidade} onClick={() => aoDuplicarObjeto(objeto.id)} title="Duplicar objeto" aria-label={`Duplicar ${objeto.nome}`}>⧉</button>}
                <button type="button" className={styles.botao_visibilidade} onClick={() => aoAlternarVisibilidadeObjeto(objeto.id)} aria-pressed={objeto.visivel} title={objeto.visivel ? 'Ocultar objeto' : 'Mostrar objeto'}>{objeto.visivel ? '👁' : '⊘'}</button>
                {objeto.ehPeca ? <span aria-hidden="true" /> : <button type="button" className={styles.botao_remover_colecao} onClick={() => aoExcluirObjeto(objeto.id)} title="Excluir objeto" aria-label={`Excluir ${objeto.nome}`}>✕</button>}
            </div>
        );
    };

    return (
        <div className={styles.arvore_cena}>
            <div className={`${styles.bloco_raiz} ${alvoArraste === ALVO_RAIZ_ARVORE_EDITOR3D ? styles.bloco_recebendo_arraste : ''}`} onDragOver={evento => permiteSoltar(evento, ALVO_RAIZ_ARVORE_EDITOR3D)} onDragLeave={() => setAlvoArraste(null)} onDrop={evento => solta(evento, null)}>
                <button type="button" className={styles.linha_objeto} onClick={() => aoSelecionar(ALVO_RAIZ_ARVORE_EDITOR3D)}>
                    <span className={styles.espaco_arvore} />
                    <span className={styles.icone_origem}>◎</span>
                    <span className={styles.nome_objeto}>Origem</span>
                    <strong>0, 0, 0</strong>
                </button>
                {temCamera && (
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
                {regioesCorpo.length > 0 && (
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
                {regioesCorpo.map(regiao => (
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
                {temCamera && (
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
                {objetosRaiz.map(renderizaObjeto)}
            </div>

            {colecoes.map(colecao => {
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
