'use client';

import styles from './Editor3D.module.css';

import { useEffect, useState } from 'react';

import { listaProjetos3D } from './editor3D.projeto.api';
import type { Projeto3DResumoPersistido } from 'types-nora-api';

interface HomeEditor3DProps {
    readonly aoProjetoVazio: () => void;
    readonly aoCapaArte: () => void;
    readonly aoPersonagem: () => void;
    readonly aoAbrirProjeto: (id: number, nome: string) => void;
    readonly aoAbrirModal: () => void;
};

function formataDataRecente(dataIso: string): string {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return '';
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

export function HomeEditor3D({ aoProjetoVazio, aoCapaArte, aoPersonagem, aoAbrirProjeto, aoAbrirModal }: HomeEditor3DProps) {
    const [recentes, setRecentes] = useState<readonly Projeto3DResumoPersistido[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let ativo = true;
        listaProjetos3D()
            .then(lista => { if (ativo) { setRecentes(lista); setCarregando(false); } })
            .catch(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, []);

    return (
        <div className={styles.tela_inicio}>
            <header className={styles.banner_inicio}>
                <span className={styles.titulo_inicio}>Editor 3D</span>
                <span className={styles.subtitulo_inicio}>Universo do Medo</span>
            </header>

            <div className={styles.colunas_inicio}>
                <section className={styles.coluna_inicio}>
                    <h3>Novo</h3>
                    <button type="button" className={styles.acao_inicio} onClick={aoProjetoVazio}><span className={styles.icone_inicio}>▱</span>Projeto Vazio</button>
                    <button type="button" className={styles.acao_inicio} onClick={aoCapaArte}><span className={styles.icone_inicio}>▭</span>Capa de Arte</button>
                    <button type="button" className={styles.acao_inicio} onClick={aoPersonagem}><span className={styles.icone_inicio}>🧍</span>Personagem</button>
                    <div className={styles.separador_inicio} />
                    <button type="button" className={styles.acao_inicio} onClick={aoAbrirModal}><span className={styles.icone_inicio}>▤</span>Abrir Projeto…</button>
                </section>

                <section className={styles.coluna_inicio}>
                    <h3>Recentes</h3>
                    {carregando ? (
                        <p className={styles.vazio_inicio}>Carregando…</p>
                    ) : recentes.length === 0 ? (
                        <p className={styles.vazio_inicio}>Nenhum projeto recente.</p>
                    ) : (
                        <ul className={styles.lista_recentes}>
                            {recentes.slice(0, 8).map(projeto => (
                                <li key={projeto.id}>
                                    <button type="button" className={styles.item_recente} onClick={() => aoAbrirProjeto(projeto.id, projeto.nome)}>
                                        <span className={styles.icone_inicio}>◳</span>
                                        <span className={styles.nome_recente}>{projeto.nome}</span>
                                        <small>{formataDataRecente(projeto.dataAtualizacao)}</small>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};
