'use client';

import styles from './Editor3D.module.css';

import type { Projeto3DResumoPersistido } from 'types-nora-api';

interface ModalAbrirProjetoEditor3DProps {
    readonly projetos: readonly Projeto3DResumoPersistido[];
    readonly carregando: boolean;
    readonly titulo?: string;
    readonly aoSelecionar: (id: number, nome: string) => void;
    readonly aoFechar: () => void;
};

function formataDataAtualizacaoEditor3D(dataIso: string): string {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return '';
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

export function ModalAbrirProjetoEditor3D({ projetos, carregando, titulo = 'Abrir projeto', aoSelecionar, aoFechar }: ModalAbrirProjetoEditor3DProps) {
    return (
        <div className={styles.fundo_modal_projeto} onClick={aoFechar}>
            <section className={styles.modal_projeto} role="dialog" aria-modal="true" aria-label={titulo} onClick={evento => evento.stopPropagation()}>
                <header className={styles.cabecalho_modal_projeto}>
                    <strong>{titulo}</strong>
                    <button type="button" onClick={aoFechar}>Fechar</button>
                </header>
                <div className={styles.corpo_modal_projeto}>
                    {carregando ? (
                        <p className={styles.vazio_inspetor}>Carregando projetos…</p>
                    ) : projetos.length === 0 ? (
                        <p className={styles.vazio_inspetor}>Nenhum projeto salvo ainda.</p>
                    ) : (
                        <ul className={styles.lista_projetos}>
                            {projetos.map(projeto => (
                                <li key={projeto.id}>
                                    <button type="button" className={styles.item_projeto} onClick={() => aoSelecionar(projeto.id, projeto.nome)}>
                                        <strong>{projeto.nome}</strong>
                                        <span>{formataDataAtualizacaoEditor3D(projeto.dataAtualizacao)}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
};
