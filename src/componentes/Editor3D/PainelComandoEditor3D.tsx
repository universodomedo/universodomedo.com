'use client';

import styles from './Editor3D.module.css';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import type { ComandoEditor3D } from './editor3D.camadaJogo';

const MAXIMO_ALCANCE_COMANDO_MILIMETROS_EDITOR3D = 100000;

interface PainelComandoEditor3DProps {
    readonly comando: ComandoEditor3D;
    readonly nomeElementoVinculado: string | null;
    readonly aoMudarDescricao: (descricao: string) => void;
    readonly aoMudarAlcance: (valor: number) => void;
    // Simulação do acionamento em jogo, direto na Coleção de Iluminação (preview do editor: não altera o projeto).
    readonly aoAcionar: () => void;
};

// Interruptor = a ARESTA objeto↔luz vista do lado do objeto: ele não se cria nem se revincula por aqui — nasce do gesto
// de fiação (clique no objeto com uma luz selecionada) e dissolve quando o último vínculo sai. Este painel edita as
// propriedades da RELAÇÃO (descrição em jogo, alcance de uso, circuito). Autorado UMA vez no mapa; toda Partida que usa
// este mapa herda o interruptor funcionando. RENOMEAR e EXCLUIR ficam na árvore, como objeto e luz.
export function PainelComandoEditor3D({ comando, nomeElementoVinculado, aoMudarDescricao, aoMudarAlcance, aoAcionar }: PainelComandoEditor3DProps) {
    return (
        <div className={styles.painel_objeto}>
            <div className={styles.campo_subdivisao}>
                <span>Corpo físico</span>
                <p className={styles.dica_subdivisao}>{nomeElementoVinculado !== null ? `Interruptor sobre "${nomeElementoVinculado}". A posição e o tamanho em jogo derivam do bbox dele a cada salvamento.` : '⚠ O objeto deste interruptor não existe mais na cena — ele não vai produzir interruptor em jogo.'}</p>
                <div className={styles.acoes_objeto_painel}>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoAcionar} title="Simular o acionamento como em jogo (alterna o circuito só na visualização)">⏻ Acionar</button>
                </div>
                <p className={styles.dica_subdivisao}>Aciona o circuito inteiro na visualização, como em jogo: se qualquer luz está acesa, todas apagam. Não altera o projeto. O circuito se monta pela Fonte de Luz (vincular e desvincular são ações dela).</p>
            </div>

            <div className={styles.campo_subdivisao}>
                <span>Descrição em jogo</span>
                {/* key com a descrição do ESTADO: o input é uncontrolled (defaultValue) e sem remount mostraria texto velho
                    quando a descrição muda por fora — trocar de interruptor selecionado, por exemplo. */}
                <input type="text" key={`${comando.idLocal}:${comando.descricao}`} defaultValue={comando.descricao} maxLength={400} onKeyDown={evento => { evento.stopPropagation(); if (evento.key === 'Enter') evento.currentTarget.blur(); }} onBlur={evento => aoMudarDescricao(evento.target.value)} title="O que o jogador lê ao inspecionar (confirma ao sair do campo)" />
            </div>

            <div className={styles.campo_subdivisao}>
                <span>Alcance de uso (mm)</span>
                <CampoNumeroEditor3D rotulo="◎" valor={comando.alcanceMilimetros} passo={100} minimo={0} maximo={MAXIMO_ALCANCE_COMANDO_MILIMETROS_EDITOR3D} atualizaValor={aoMudarAlcance} />
                <p className={styles.dica_subdivisao}>Distância em que o jogador alcança o comando — braço, não sala.</p>
            </div>
        </div>
    );
};
