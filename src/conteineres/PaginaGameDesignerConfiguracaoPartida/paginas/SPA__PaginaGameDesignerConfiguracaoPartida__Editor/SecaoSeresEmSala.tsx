'use client';

import styles from './secaoCards.module.css';

import { PathAvatarPadrao } from 'types-nora-api';
import type { KeySerEmSala, SerEmSala } from 'types-nora-api';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

type Props = {
    titulo: string;
    seres: readonly SerEmSala[];
    nomesPorIdSer: Record<number, string>;
    aoAdicionar: () => void;
    aoEditar: (key: KeySerEmSala) => void;
    aoRemover: (key: KeySerEmSala) => void;
};

// Grade de avatares dos Seres de um grupo (controláveis / não-controláveis): exibe, adiciona (via seleção de Ser) e remove (o "x" é da Partida).
// Card: título = Nome do Ser (catálogo, via nomesPorIdSer); subtítulo = "nome em jogo" quando houver. Clicar dispara ações de fluxo (config/seleção em vistas próprias).
export function SecaoSeresEmSala({ titulo, seres, nomesPorIdSer, aoAdicionar, aoEditar, aoRemover }: Props) {
    return (
        <InputComRotulo rotulo={titulo}>
            <div className={styles.grade_cards}>
                {seres.map(ser => {
                    const nomeSer = nomesPorIdSer[ser.referencia.id];
                    const nomeEmJogo = ser.nomeExibicao && ser.nomeExibicao.trim().length > 0 ? ser.nomeExibicao : null;
                    const titulo = nomeSer ?? nomeEmJogo ?? 'Ser';
                    const subtitulo = nomeSer && nomeEmJogo ? nomeEmJogo : null;
                    return (
                        <DivClicavel key={ser.key} className={styles.cartao} onClick={() => aoEditar(ser.key)}>
                            <button type="button" className={styles.botao_remover} onClick={evento => { evento.stopPropagation(); aoRemover(ser.key); }} aria-label="Remover Ser">×</button>
                            <span className={styles.avatar_circulo}><RenderUsuario caminhoArquivoAvatar={PathAvatarPadrao} /></span>
                            <span className={styles.rotulo}>{titulo}</span>
                            {subtitulo && <span className={styles.subtitulo}>{subtitulo}</span>}
                        </DivClicavel>
                    );
                })}
                <button type="button" className={styles.cartao_adicionar} onClick={aoAdicionar}>
                    <span className={styles.mais}>+</span>
                    <span className={styles.rotulo}>Adicionar</span>
                </button>
            </div>
        </InputComRotulo>
    );
};
