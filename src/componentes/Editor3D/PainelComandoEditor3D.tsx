'use client';

import styles from './Editor3D.module.css';

import type { CorrenteMapa } from 'types-nora-api';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import { PainelCorrenteEditor3D } from './PainelCorrenteEditor3D';
import type { CircuitoEditor3D, InterruptorEditor3D } from './editor3D.camadaJogo';

const MAXIMO_ALCANCE_INTERRUPTOR_MILIMETROS_EDITOR3D = 100000;

interface PainelComandoEditor3DProps {
    readonly interruptor: InterruptorEditor3D;
    // O circuito que este corpo alterna: corrente e estado inicial do GATE se editam por aqui (o corpo é a porta de
    // entrada do circuito na autoria). null = circuito órfão (não deveria acontecer; nada de jogo sai daqui).
    readonly circuito: CircuitoEditor3D | null;
    readonly nomeElementoVinculado: string | null;
    readonly aoMudarDescricao: (descricao: string) => void;
    readonly aoMudarAlcance: (valor: number) => void;
    readonly aoMudarCorrenteCircuito: (corrente: CorrenteMapa) => void;
    readonly aoAlternarLigadoInicialmente: () => void;
    // Simulação do acionamento em jogo, direto na Coleção de Iluminação (preview do editor: não altera o projeto).
    readonly aoAcionar: () => void;
};

// Interruptor = corpo físico que alterna o GATE de um circuito: ele não se cria nem se revincula por aqui — nasce do gesto
// de fiação (Definir interruptor na Fonte de Luz) e dissolve quando o circuito morre. Este painel edita o CORPO (descrição
// em jogo, alcance de uso) e o CIRCUITO que ele alterna (corrente, estado inicial). RENOMEAR e EXCLUIR ficam na árvore,
// como objeto e luz.
export function PainelComandoEditor3D({ interruptor, circuito, nomeElementoVinculado, aoMudarDescricao, aoMudarAlcance, aoMudarCorrenteCircuito, aoAlternarLigadoInicialmente, aoAcionar }: PainelComandoEditor3DProps) {
    return (
        <div className={styles.painel_objeto}>
            <div className={styles.campo_subdivisao}>
                <span>Corpo físico</span>
                <p className={styles.dica_subdivisao}>{nomeElementoVinculado !== null ? `Interruptor sobre "${nomeElementoVinculado}". A posição e o tamanho em jogo derivam do bbox dele a cada salvamento.` : '⚠ O objeto deste interruptor não existe mais na cena — ele não vai produzir interruptor em jogo.'}</p>
                <div className={styles.acoes_objeto_painel}>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoAcionar} title="Simular o acionamento como em jogo (alterna o gate do circuito só na visualização)">⏻ Acionar</button>
                </div>
                <p className={styles.dica_subdivisao}>Alterna o gate do circuito na visualização, como em jogo — as luzes REFLETEM. Não altera o projeto. O circuito se monta pela Fonte de Luz (vincular e desvincular são ações dela).</p>
            </div>

            {circuito !== null && (
                <>
                    <div className={styles.campo_subdivisao}>
                        <span>Estado inicial</span>
                        <div className={styles.acoes_objeto_painel}>
                            <button type="button" className={styles.botao_acao_objeto} aria-pressed={circuito.ligadoInicialmente} onClick={aoAlternarLigadoInicialmente} title="Como o circuito COMEÇA em toda Partida deste mapa">{circuito.ligadoInicialmente ? '⏻ Ligado ao iniciar' : '⭘ Desligado ao iniciar'}</button>
                        </div>
                        <p className={styles.dica_subdivisao}>{circuito.ligadoInicialmente ? 'A sala começa energizada; o acionamento em jogo desliga.' : 'A sala começa às escuras; alguém precisa acionar o interruptor em jogo.'}</p>
                    </div>

                    <PainelCorrenteEditor3D titulo="Corrente do circuito" ajuda="O que a alimentação entrega a TODAS as luzes deste circuito: dano ou regime daqui vale para a linha inteira." corrente={circuito.corrente} aoMudar={aoMudarCorrenteCircuito} />
                </>
            )}

            <div className={styles.campo_subdivisao}>
                <span>Descrição em jogo</span>
                {/* key com a descrição do ESTADO: o input é uncontrolled (defaultValue) e sem remount mostraria texto velho
                    quando a descrição muda por fora — trocar de interruptor selecionado, por exemplo. */}
                <input type="text" key={`${interruptor.idLocal}:${interruptor.descricao}`} defaultValue={interruptor.descricao} maxLength={400} onKeyDown={evento => { evento.stopPropagation(); if (evento.key === 'Enter') evento.currentTarget.blur(); }} onBlur={evento => aoMudarDescricao(evento.target.value)} title="O que o jogador lê ao inspecionar (confirma ao sair do campo)" />
            </div>

            <div className={styles.campo_subdivisao}>
                <span>Alcance de uso (mm)</span>
                <CampoNumeroEditor3D rotulo="◎" valor={interruptor.alcanceMilimetros} passo={100} minimo={0} maximo={MAXIMO_ALCANCE_INTERRUPTOR_MILIMETROS_EDITOR3D} atualizaValor={aoMudarAlcance} />
                <p className={styles.dica_subdivisao}>Distância em que o jogador alcança o interruptor — braço, não sala.</p>
            </div>
        </div>
    );
};