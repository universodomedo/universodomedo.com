'use client';

import styles from './secaoCards.module.css';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { rotuloLuz, type Luz } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type Props = {
    luzes: readonly Luz[];
    aoAdicionar: () => void;
    aoEditar: (chave: string) => void;
    aoRemover: (chave: string) => void;
};

// Grade de cards das Fontes de Luz do cenario: exibe, adiciona e remove. Clicar dispara o fluxo — o Controlador renderiza a config da luz em vista propria.
export function SecaoLuzes({ luzes, aoAdicionar, aoEditar, aoRemover }: Props) {
    return (
        <InputComRotulo rotulo="Luzes">
            <div className={styles.grade_cards}>
                {luzes.map(luz => (
                    <DivClicavel key={luz.chave} className={styles.cartao} onClick={() => aoEditar(luz.chave)}>
                        <button type="button" className={styles.botao_remover} onClick={evento => { evento.stopPropagation(); aoRemover(luz.chave); }} aria-label="Remover luz">×</button>
                        <span className={styles.glifo}><span className={styles.glifo_icone} aria-hidden>◔</span></span>
                        <span className={styles.rotulo}>{rotuloLuz(luz)}</span>
                    </DivClicavel>
                ))}
                <button type="button" className={styles.cartao_adicionar} onClick={aoAdicionar}>
                    <span className={styles.mais}>+</span>
                    <span className={styles.rotulo}>Adicionar</span>
                </button>
            </div>
        </InputComRotulo>
    );
};
