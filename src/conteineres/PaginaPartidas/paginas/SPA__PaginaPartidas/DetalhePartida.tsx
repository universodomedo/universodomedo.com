'use client';

import styles from './styles.module.css';

import type { PartidaResumo } from 'types-nora-api';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';

// Detalhe da Partida selecionada: ocupa 100% da altura ao lado do Orbital.
// Topo = Arte de Capa vinculada (sem texto; espaço mantido mesmo sem imagem). Corpo vazio (incremental). Rodapé fixo = botão Jogar.
export function DetalhePartida({ partida, textoBotaoJogar, desabilitado, aoJogar }: { partida: PartidaResumo; textoBotaoJogar: string; desabilitado: boolean; aoJogar: () => void; }) {
    const imagemCapa = useImagemCapaArte(partida.arteCapa?.idProjeto ?? null);

    return (
        <aside className={styles.detalhe}>
            <div className={styles.detalhe_capa}>
                {imagemCapa && <div className={styles.detalhe_capa_imagem} style={{ backgroundImage: `url("data:image/png;base64,${imagemCapa}")` }} aria-hidden="true" />}
            </div>
            <div className={styles.detalhe_corpo} />
            <div className={styles.detalhe_rodape}>
                <button type="button" className={styles.botao_jogar} disabled={desabilitado} onClick={aoJogar}>{textoBotaoJogar}</button>
            </div>
        </aside>
    );
};
