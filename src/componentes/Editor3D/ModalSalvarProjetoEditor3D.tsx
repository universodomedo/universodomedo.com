'use client';

import styles from './Editor3D.module.css';

import { useState } from 'react';

interface ModalSalvarProjetoEditor3DProps {
    readonly nomeInicial: string;
    readonly salvando: boolean;
    readonly aoConfirmar: (nome: string) => void;
    readonly aoFechar: () => void;
};

export function ModalSalvarProjetoEditor3D({ nomeInicial, salvando, aoConfirmar, aoFechar }: ModalSalvarProjetoEditor3DProps) {
    const [nome, setNome] = useState(nomeInicial);
    const nomeValido = nome.trim().length > 0;

    function confirma(): void { if (nomeValido && !salvando) aoConfirmar(nome.trim()); };

    return (
        <div className={styles.fundo_modal_projeto} onClick={aoFechar}>
            <section className={styles.modal_projeto} role="dialog" aria-modal="true" aria-label="Salvar projeto" onClick={evento => evento.stopPropagation()}>
                <header className={styles.cabecalho_modal_projeto}>
                    <strong>Salvar como novo projeto</strong>
                    <button type="button" onClick={aoFechar}>Fechar</button>
                </header>
                <div className={styles.corpo_modal_projeto}>
                    <label className={styles.rotulo_campo_projeto} htmlFor="campo-nome-projeto-editor-3d">Nome do projeto</label>
                    <input id="campo-nome-projeto-editor-3d" className={styles.campo_texto_projeto} type="text" value={nome} autoFocus placeholder="Ex.: Insígnia da Guilda" onChange={evento => setNome(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') confirma(); }} />
                    <div className={styles.acoes_modal_projeto}>
                        <button type="button" className={styles.botao_secundario_projeto} onClick={aoFechar} disabled={salvando}>Cancelar</button>
                        <button type="button" className={styles.botao_primario_projeto} onClick={confirma} disabled={!nomeValido || salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
                    </div>
                </div>
            </section>
        </div>
    );
};
