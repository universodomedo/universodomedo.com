'use client';

import styles from './Editor3D.module.css';

import { useEffect, useState, type KeyboardEvent } from 'react';

interface PainelObjetoEditor3DProps {
    readonly nome: string;
    readonly cor: string;
    readonly peca: { readonly idPeca: string; readonly nome: string } | null;
    readonly aoRenomear: (nome: string) => void;
    readonly aoMudarCor: (cor: string) => void;
    readonly aoDuplicar: () => void;
    readonly aoExcluir: () => void;
    readonly aoRemoverPeca: (idPeca: string) => void;
};

// Propriedades do objeto selecionado (nome/cor/ações). O nome confirma no blur/Enter (Escape restaura) para não renomear a cada tecla.
// Parte de peça: sem Duplicar/Excluir individual — a peça é removida inteira.
export function PainelObjetoEditor3D({ nome, cor, peca, aoRenomear, aoMudarCor, aoDuplicar, aoExcluir, aoRemoverPeca }: PainelObjetoEditor3DProps) {
    const [nomeEditado, setNomeEditado] = useState(nome);

    useEffect(() => { setNomeEditado(nome); }, [nome]);

    function confirmaNome(): void {
        const nomeLimpo = nomeEditado.trim();
        if (nomeLimpo.length === 0) { setNomeEditado(nome); return; }
        if (nomeLimpo !== nome) aoRenomear(nomeLimpo);
    };

    function teclaNome(evento: KeyboardEvent<HTMLInputElement>): void {
        evento.stopPropagation();
        if (evento.key === 'Enter') evento.currentTarget.blur();
        if (evento.key === 'Escape') { setNomeEditado(nome); evento.currentTarget.blur(); }
    };

    return (
        <div className={styles.painel_objeto}>
            <label className={styles.campo_texto_capa}>
                <span>Nome</span>
                <input type="text" value={nomeEditado} maxLength={80} onChange={evento => setNomeEditado(evento.target.value)} onBlur={confirmaNome} onKeyDown={teclaNome} />
            </label>
            <label className={styles.campo_cor_capa}>
                <span>Cor</span>
                <input type="color" value={cor} onChange={evento => aoMudarCor(evento.target.value)} />
            </label>
            {peca !== null ? (
                <>
                    <p className={styles.aviso_membro_obrigatorio}>🧥 Parte da peça &quot;{peca.nome}&quot; — a peça é removida por inteiro.</p>
                    <div className={styles.acoes_objeto_painel}>
                        <button type="button" className={`${styles.botao_acao_objeto} ${styles.botao_excluir_objeto}`} onClick={() => aoRemoverPeca(peca.idPeca)} title={`Remover a peça ${peca.nome} inteira`}>✕ Remover Peça</button>
                    </div>
                </>
            ) : (
                <div className={styles.acoes_objeto_painel}>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoDuplicar} title="Duplicar objeto">⧉ Duplicar</button>
                    <button type="button" className={`${styles.botao_acao_objeto} ${styles.botao_excluir_objeto}`} onClick={aoExcluir} title="Excluir objeto">✕ Excluir</button>
                </div>
            )}
        </div>
    );
};
