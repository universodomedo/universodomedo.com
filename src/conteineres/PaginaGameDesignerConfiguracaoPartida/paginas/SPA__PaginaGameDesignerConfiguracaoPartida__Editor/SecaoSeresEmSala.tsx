'use client';

import styles from './secaoCards.module.css';

import { PathAvatarPadrao } from 'types-nora-api';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import type { InteragivelSer } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type Props = {
    titulo: string;
    seres: readonly InteragivelSer[];
    nomesPorIdSer: Record<number, string>;
    aoAdicionar: () => void;
    aoEditar: (chave: string) => void;
    aoRemover: (chave: string) => void;
};

// Grade de avatares dos Seres de um grupo de controle (Jogadores / Sistema): exibe, adiciona (via seleção de Ser) e remove.
// Card: título = Nome do Ser (catálogo, via nomesPorIdSer); subtítulo = "nome em jogo" quando houver. Clicar dispara ações de fluxo (config/seleção em vistas próprias).
export function SecaoSeresEmSala({ titulo, seres, nomesPorIdSer, aoAdicionar, aoEditar, aoRemover }: Props) {
    return (
        <InputComRotulo rotulo={titulo}>
            <div className={styles.grade_cards}>
                {seres.map(ser => {
                    const nomeSer = nomesPorIdSer[ser.idSer];
                    const nomeEmJogo = ser.nome && ser.nome.trim().length > 0 ? ser.nome : null;
                    const tituloCard = nomeSer ?? nomeEmJogo ?? 'Ser';
                    const subtitulo = nomeSer && nomeEmJogo ? nomeEmJogo : null;
                    return (
                        <DivClicavel key={ser.chave} className={styles.cartao} onClick={() => aoEditar(ser.chave)}>
                            <button type="button" className={styles.botao_remover} onClick={evento => { evento.stopPropagation(); aoRemover(ser.chave); }} aria-label="Remover Ser">×</button>
                            <span className={styles.avatar_circulo}><RenderUsuario caminhoArquivoAvatar={PathAvatarPadrao} /></span>
                            <span className={styles.rotulo}>{tituloCard}</span>
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
