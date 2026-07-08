'use client';

import styles from './secaoCards.module.css';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { rotuloObjeto, type InteragivelObjeto } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type Props = {
    objetos: readonly InteragivelObjeto[];
    aoAdicionar: () => void;
    aoEditar: (chave: string) => void;
    aoRemover: (chave: string) => void;
};

// Grade de cards dos objetos (Interagíveis não-vivos, ex.: Porta/Manequim): exibe, adiciona e remove. Objeto não tem avatar → glifo genérico.
// Clicar num card / no "+" só dispara ações de fluxo — o Controlador de Fluxo renderiza a config do objeto em vista própria.
export function SecaoObjetos({ objetos, aoAdicionar, aoEditar, aoRemover }: Props) {
    return (
        <InputComRotulo rotulo="Objetos">
            <div className={styles.grade_cards}>
                {objetos.map(objeto => (
                    <DivClicavel key={objeto.chave} className={styles.cartao} onClick={() => aoEditar(objeto.chave)}>
                        <button type="button" className={styles.botao_remover} onClick={evento => { evento.stopPropagation(); aoRemover(objeto.chave); }} aria-label="Remover objeto">×</button>
                        <span className={styles.glifo}><span className={styles.glifo_icone} aria-hidden>▦</span></span>
                        <span className={styles.rotulo}>{rotuloObjeto(objeto)}</span>
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
