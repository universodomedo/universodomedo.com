'use client';

import styles from './styles.module.css';

import type { PartidaResumo } from 'types-nora-api';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';
import { ConteudoConfiguracaoPartida } from 'Conteineres/PaginaPartidas/paginas/SPA__PaginaPartidas/ConteudoConfiguracaoPartida';
import { PainelPlacarDesafio } from 'Conteineres/PaginaPartidas/paginas/SPA__PaginaPartidas/PainelPlacarDesafio';

// Detalhe da Partida selecionada: ocupa 100% da altura ao lado do Orbital.
// Topo = Arte de Capa. Corpo = descrição (2 colunas: título/descrição | meta) + rodapé (botão Jogar) num mesmo bloco.
export function DetalhePartida({ partida, textoBotaoJogar, desabilitado, aoJogar }: { partida: PartidaResumo; textoBotaoJogar: string; desabilitado: boolean; aoJogar: () => void; }) {
    const imagemCapa = useImagemCapaArte(partida.arteCapa?.idProjeto ?? null);

    return (
        <aside className={styles.detalhe}>
            <div className={styles.detalhe_capa}>
                {imagemCapa && <div className={styles.detalhe_capa_imagem} style={{ backgroundImage: `url("data:image/png;base64,${imagemCapa}")` }} aria-hidden="true" />}
            </div>

            <div className={styles.detalhe_corpo}>
                <div className={styles.detalhe_descricao}>
                    <div className={styles.info}>
                        <div className={styles.info_principal}>
                            <h2 className={styles.info_titulo}>{partida.nome}</h2>
                            <ConteudoConfiguracaoPartida key={partida.id} idPartida={partida.id} />
                        </div>

                        <dl className={styles.info_meta}>
                            <div className={styles.info_meta_item}>
                                <span className={styles.info_meta_icone} aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="7" width="19" height="10" rx="4.5" /><path d="M7 12h3M8.5 10.5v3" /><circle cx="15.5" cy="11.5" r="0.7" fill="currentColor" stroke="none" /><circle cx="17.5" cy="13.5" r="0.7" fill="currentColor" stroke="none" /></svg>
                                </span>
                                <div className={styles.info_meta_texto}>
                                    <dt className={styles.info_meta_rotulo}>Já jogou</dt>
                                    <dd className={styles.info_meta_valor}>Sim</dd>
                                </div>
                            </div>

                            <div className={styles.info_meta_item}>
                                <span className={styles.info_meta_icone} aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
                                </span>
                                <div className={styles.info_meta_texto}>
                                    <dt className={styles.info_meta_rotulo}>Tempo estimado</dt>
                                    <dd className={styles.info_meta_valor}>30 – 45 min</dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    {partida.tipo === 'DESAFIO' && partida.tipoDesafio && <PainelPlacarDesafio tipoDesafio={partida.tipoDesafio} />}
                </div>

                <div className={styles.detalhe_rodape}>
                    <button type="button" className={styles.botao_jogar} disabled={desabilitado} onClick={aoJogar}>{textoBotaoJogar}</button>
                </div>
            </div>
        </aside>
    );
};