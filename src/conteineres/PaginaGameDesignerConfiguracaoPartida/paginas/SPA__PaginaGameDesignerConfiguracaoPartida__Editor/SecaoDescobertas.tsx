'use client';

import styles from './secaoCards.module.css';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { rotuloDescoberta, type DescobertaCondicionada } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type Props = {
    descobertas: readonly DescobertaCondicionada[];
    aoAdicionar: () => void;
    aoEditar: (key: string) => void;
    aoRemover: (key: string) => void;
};

// Grade de cards das descobertas condicionadas: exibe, adiciona e remove. Clicar num card / no "+" dispara ações de fluxo — o Controlador de Fluxo renderiza a config da descoberta em vista própria.
export function SecaoDescobertas({ descobertas, aoAdicionar, aoEditar, aoRemover }: Props) {
    return (
        <InputComRotulo rotulo="Descobertas Condicionais">
            <div className={styles.grade_cards}>
                {descobertas.map(descoberta => (
                    <DivClicavel key={descoberta.key} className={styles.cartao} onClick={() => aoEditar(descoberta.key)}>
                        <button type="button" className={styles.botao_remover} onClick={evento => { evento.stopPropagation(); aoRemover(descoberta.key); }} aria-label="Remover descoberta">×</button>
                        <span className={styles.glifo}><span className={styles.glifo_icone} aria-hidden>✦</span></span>
                        <span className={styles.rotulo}>{rotuloDescoberta(descoberta)}</span>
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
