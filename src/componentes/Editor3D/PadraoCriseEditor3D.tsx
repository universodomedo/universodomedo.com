'use client';

import styles from './Editor3D.module.css';

import { useState } from 'react';
import type { PadraoCriseCorrenteMapa } from 'types-nora-api';

import { CampoFaixaEditor3D } from './CampoFaixaEditor3D';
import { LIMITES_INTERMITENCIA_EDITOR3D } from './editor3D.camadaJogo';

export type CampoPadraoCriseEditor3D = 'flicks' | 'duracaoFlickMs' | 'intervaloEntreFlicksMs';

interface PadraoCriseEditor3DProps {
    readonly indice: number;
    readonly padrao: PadraoCriseCorrenteMapa;
    readonly podeRemover: boolean;
    readonly aoMudarFaixa: (campo: CampoPadraoCriseEditor3D, lado: 'minimo' | 'maximo', valor: number) => void;
    readonly aoAlternarAtivo: () => void;
    readonly aoRemover: () => void;
};

// Resumo de uma linha para ler o padrão SEM abrir: é o que distingue um padrão do outro na lista.
function resumoPadraoCriseEditor3D(padrao: PadraoCriseCorrenteMapa): string {
    const flicks = padrao.flicks.minimo === padrao.flicks.maximo ? `${padrao.flicks.minimo}` : `${padrao.flicks.minimo}–${padrao.flicks.maximo}`;
    const duracao = padrao.duracaoFlickMs.minimo === padrao.duracaoFlickMs.maximo ? `${padrao.duracaoFlickMs.minimo}` : `${padrao.duracaoFlickMs.minimo}–${padrao.duracaoFlickMs.maximo}`;
    return `${flicks} × ${duracao}ms`;
};

// Um PADRÃO de crise (a assinatura de uma falha) como bloco COLAPSÁVEL com toggle ativo/inativo: com vários padrões na
// mescla, o inspetor viraria uma parede de campos — aberto fica o que está sendo ajustado, o resto se lê pelo resumo do
// cabeçalho. Inativo continua gravado (some do sorteio, não do projeto).
export function PadraoCriseEditor3D({ indice, padrao, podeRemover, aoMudarFaixa, aoAlternarAtivo, aoRemover }: PadraoCriseEditor3DProps) {
    const [aberto, setAberto] = useState(false);
    const limites = LIMITES_INTERMITENCIA_EDITOR3D;

    return (
        <div className={`${styles.bloco_padrao_crise} ${padrao.ativo ? '' : styles.bloco_padrao_crise_inativo}`}>
            <div className={styles.cabecalho_padrao_crise}>
                <button type="button" className={styles.botao_colapsar_padrao} aria-expanded={aberto} onClick={() => setAberto(atual => !atual)} title={aberto ? 'Recolher este padrão' : 'Abrir para ajustar este padrão'}>
                    <span className={styles.icone_padrao_crise}>{aberto ? '▾' : '▸'}</span>
                    <span className={styles.nome_padrao_crise}>Padrão {indice + 1}</span>
                    <span className={styles.resumo_padrao_crise}>{resumoPadraoCriseEditor3D(padrao)}</span>
                </button>
                <button type="button" className={styles.botao_icone_padrao} aria-pressed={padrao.ativo} onClick={aoAlternarAtivo} title={padrao.ativo ? 'Ativo: entra no sorteio das crises — clique para desativar' : 'Inativo: fica gravado, fora do sorteio — clique para ativar'}>{padrao.ativo ? '◉' : '○'}</button>
                {podeRemover && <button type="button" className={`${styles.botao_icone_padrao} ${styles.botao_excluir_objeto}`} onClick={aoRemover} title={`Excluir o padrão ${indice + 1}`}>✕</button>}
            </div>

            {aberto && (
                <div className={styles.corpo_padrao_crise}>
                    <CampoFaixaEditor3D rotulo="Flicks" ajuda="Quantos flicks (desliga → religa) a rajada tem. 1 = uma queda só; vários = o tremular encadeado de fiação danificada." faixa={padrao.flicks} passo={1} minimo={limites.flicks.minimo} maximo={limites.flicks.maximo} inteiro aoMudar={(lado, valor) => aoMudarFaixa('flicks', lado, valor)} />
                    <CampoFaixaEditor3D rotulo="Duração" ajuda="Quanto tempo a luz fica APAGADA em cada flick. Dezenas de ms = tremular; segundos = apagão." faixa={padrao.duracaoFlickMs} passo={10} minimo={limites.duracaoFlickMs.minimo} maximo={limites.duracaoFlickMs.maximo} sufixo="ms" aoMudar={(lado, valor) => aoMudarFaixa('duracaoFlickMs', lado, valor)} />
                    <CampoFaixaEditor3D rotulo="Pausa" ajuda="Quanto tempo a luz volta ACESA entre um flick e o próximo, dentro da mesma rajada." faixa={padrao.intervaloEntreFlicksMs} passo={5} minimo={limites.intervaloEntreFlicksMs.minimo} maximo={limites.intervaloEntreFlicksMs.maximo} sufixo="ms" aoMudar={(lado, valor) => aoMudarFaixa('intervaloEntreFlicksMs', lado, valor)} />
                </div>
            )}
        </div>
    );
};