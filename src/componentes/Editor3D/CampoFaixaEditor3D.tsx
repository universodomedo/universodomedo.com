'use client';

import styles from './Editor3D.module.css';

import type { FaixaValoresMapa } from 'types-nora-api';

import { InputNumeroEditor3D } from './CampoNumeroEditor3D';

interface CampoFaixaEditor3DProps {
    readonly rotulo: string;
    // Explicação do campo: vive no "?" (tooltip), nunca como parágrafo — o inspetor é espaço caro.
    readonly ajuda: string;
    readonly faixa: FaixaValoresMapa;
    readonly passo: number;
    readonly minimo: number;
    readonly maximo: number;
    readonly inteiro?: boolean;
    readonly sufixo?: string;
    readonly aoMudar: (lado: 'minimo' | 'maximo', valor: number) => void;
};

// Linha de FAIXA mín–máx: rótulo + "?" + os dois valores NA MESMA LINHA. Empilhar mín e máx em linhas separadas dobrava
// a altura de cada parâmetro e afogava o inspetor — aqui a faixa se lê como uma coisa só ("3 – 5"), que é o que ela é.
export function CampoFaixaEditor3D({ rotulo, ajuda, faixa, passo, minimo, maximo, inteiro = false, sufixo, aoMudar }: CampoFaixaEditor3DProps) {
    return (
        <div className={styles.campo_faixa}>
            <span className={styles.rotulo_faixa}>
                {rotulo}
                <button type="button" className={styles.ajuda_campo} title={ajuda} aria-label={ajuda} onClick={evento => evento.preventDefault()}>?</button>
            </span>
            <div className={styles.valores_faixa}>
                <InputNumeroEditor3D valor={faixa.minimo} passo={passo} minimo={minimo} maximo={maximo} inteiro={inteiro} atualizaValor={valor => aoMudar('minimo', valor)} titulo={`Mínimo de ${rotulo.toLowerCase()}`} />
                <span className={styles.separador_faixa}>–</span>
                <InputNumeroEditor3D valor={faixa.maximo} passo={passo} minimo={minimo} maximo={maximo} inteiro={inteiro} atualizaValor={valor => aoMudar('maximo', valor)} titulo={`Máximo de ${rotulo.toLowerCase()}`} />
                {sufixo !== undefined && <span className={styles.sufixo_faixa}>{sufixo}</span>}
            </div>
        </div>
    );
};