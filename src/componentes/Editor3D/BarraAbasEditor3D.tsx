'use client';

import styles from './Editor3D.module.css';

import { type MouseEvent } from 'react';

export type AbaResumoEditor3D = { readonly idAba: number; readonly nome: string; readonly ativa: boolean; readonly alterado: boolean; };

interface BarraAbasEditor3DProps {
    readonly abas: readonly AbaResumoEditor3D[];
    readonly aoSelecionar: (idAba: number) => void;
    readonly aoFechar: (idAba: number) => void;
    readonly aoNovaAba: () => void;
};

export function BarraAbasEditor3D({ abas, aoSelecionar, aoFechar, aoNovaAba }: BarraAbasEditor3DProps) {
    function fecha(evento: MouseEvent<HTMLButtonElement>, idAba: number): void { evento.preventDefault(); evento.stopPropagation(); aoFechar(idAba); };

    return (
        <section className={styles.barra_abas} aria-label="Projetos abertos no Editor 3D">
            <div className={styles.lista_abas} role="tablist">
                {abas.map(aba => (
                    <div key={aba.idAba} className={`${styles.aba} ${aba.ativa ? styles.aba_ativa : ''}`}>
                        <button type="button" role="tab" className={styles.botao_selecionar_aba} aria-selected={aba.ativa} onClick={() => aoSelecionar(aba.idAba)}>
                            <span className={styles.nome_aba}>{aba.nome}</span>
                            {aba.alterado && <span className={styles.indicador_aba} aria-label="Projeto com alterações não salvas" />}
                        </button>
                        <button type="button" className={styles.botao_fechar_aba} onClick={evento => fecha(evento, aba.idAba)} aria-label={`Fechar ${aba.nome}`}>✕</button>
                    </div>
                ))}
            </div>
            <button type="button" className={styles.botao_nova_aba} onClick={aoNovaAba} aria-label="Novo projeto em nova aba" title="Novo projeto">+</button>
        </section>
    );
};
