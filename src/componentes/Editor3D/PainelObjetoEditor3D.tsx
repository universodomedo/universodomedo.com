'use client';

import styles from './Editor3D.module.css';

import { useEffect, useState, type KeyboardEvent } from 'react';

import { MAXIMO_SUBDIVISAO_MALHA_EDITOR3D } from './editor3D.malha';

interface PainelObjetoEditor3DProps {
    readonly nome: string;
    readonly cor: string;
    readonly subdivisao: number;
    readonly peca: { readonly idPeca: string; readonly nome: string } | null;
    readonly aoRenomear: (nome: string) => void;
    readonly aoMudarCor: (cor: string) => void;
    readonly aoMudarSubdivisao: (subdivisao: number) => void;
    readonly aoEspelharX: () => void;
    readonly aoDuplicar: () => void;
    readonly aoExcluir: () => void;
    readonly aoRemoverPeca: (idPeca: string) => void;
};

// Propriedades do objeto selecionado (nome/cor/subdivisão/ações). O nome confirma no blur/Enter (Escape restaura) para não renomear a cada tecla.
// Parte de peça: sem Duplicar/Excluir individual — a peça é removida inteira.
export function PainelObjetoEditor3D({ nome, cor, subdivisao, peca, aoRenomear, aoMudarCor, aoMudarSubdivisao, aoEspelharX, aoDuplicar, aoExcluir, aoRemoverPeca }: PainelObjetoEditor3DProps) {
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
            <div className={styles.campo_subdivisao}>
                <span>Subdivisão (Catmull-Clark)</span>
                <div className={styles.controles_subdivisao}>
                    <button type="button" className={styles.botao_acao_objeto} disabled={subdivisao <= 0} onClick={() => aoMudarSubdivisao(subdivisao - 1)} title="Reduzir o nível de subdivisão">−</button>
                    <strong className={styles.valor_subdivisao}>{subdivisao === 0 ? 'Gaiola' : `Nível ${subdivisao}`}</strong>
                    <button type="button" className={styles.botao_acao_objeto} disabled={subdivisao >= MAXIMO_SUBDIVISAO_MALHA_EDITOR3D} onClick={() => aoMudarSubdivisao(subdivisao + 1)} title="Aumentar o nível de subdivisão">+</button>
                </div>
                <p className={styles.dica_subdivisao}>A gaiola continua editável; o viewport exibe a superfície subdividida.</p>
            </div>
            {peca !== null ? (
                <>
                    <p className={styles.aviso_membro_obrigatorio}>🧥 Parte da peça &quot;{peca.nome}&quot; — a peça é removida por inteiro.</p>
                    <div className={styles.acoes_objeto_painel}>
                        <button type="button" className={`${styles.botao_acao_objeto} ${styles.botao_excluir_objeto}`} onClick={() => aoRemoverPeca(peca.idPeca)} title={`Remover a peça ${peca.nome} inteira`}>✕ Remover Peça</button>
                    </div>
                </>
            ) : (
                <div className={styles.acoes_objeto_painel}>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoEspelharX} title="Espelhar a malha no plano X local (modele metade e espelhe; a costura em X=0 é soldada)">⇋ Espelhar X</button>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoDuplicar} title="Duplicar objeto">⧉ Duplicar</button>
                    <button type="button" className={`${styles.botao_acao_objeto} ${styles.botao_excluir_objeto}`} onClick={aoExcluir} title="Excluir objeto">✕ Excluir</button>
                </div>
            )}
        </div>
    );
};
