'use client';

import styles from './Editor3D.module.css';

import type { CorrenteMapa } from 'types-nora-api';

import { CampoFaixaEditor3D } from './CampoFaixaEditor3D';
import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import { PadraoCriseEditor3D, type CampoPadraoCriseEditor3D } from './PadraoCriseEditor3D';
import { INTERMITENCIA_PADRAO_EDITOR3D, LIMITES_INTERMITENCIA_EDITOR3D, PADRAO_CRISE_PADRAO_EDITOR3D, sanitizaCorrenteEditor3D } from './editor3D.camadaJogo';

interface PainelCorrenteEditor3DProps {
    readonly titulo: string;
    readonly ajuda: string;
    readonly corrente: CorrenteMapa;
    readonly aoMudar: (corrente: CorrenteMapa) => void;
};

// Seção de CORRENTE (usada pelo painel da Luz — entrega — e do Interruptor — circuito). A corrente se CONSTRÓI por
// parâmetros: nível entregue + intermitência opcional — e a intermitência é Ciclo (tempo entre crises) + PADRÕES de
// crise, cada um uma rajada de flicks. A cada ciclo, uma crise sorteada entre os padrões ATIVOS: eles se mesclam ao
// acaso. Toda explicação vive em "?" e cada padrão é um bloco colapsável — o inspetor é estreito e caro.
export function PainelCorrenteEditor3D({ titulo, ajuda, corrente, aoMudar }: PainelCorrenteEditor3DProps) {
    const intermitencia = corrente.intermitencia;

    function mudaIntermitencia(muda: (atual: NonNullable<CorrenteMapa['intermitencia']>) => NonNullable<CorrenteMapa['intermitencia']>): void {
        if (intermitencia === null) return;
        aoMudar(sanitizaCorrenteEditor3D({ ...corrente, intermitencia: muda(intermitencia) }));
    };

    function mudaFaixaPadrao(indice: number, campo: CampoPadraoCriseEditor3D, lado: 'minimo' | 'maximo', valor: number): void {
        mudaIntermitencia(atual => ({ ...atual, padroes: atual.padroes.map((padrao, atualIndice) => atualIndice === indice ? { ...padrao, [campo]: { ...padrao[campo], [lado]: valor } } : padrao) }));
    };

    return (
        <div className={styles.campo_subdivisao}>
            <span>{titulo}<button type="button" className={styles.ajuda_campo} title={ajuda} aria-label={ajuda} onClick={evento => evento.preventDefault()}>?</button></span>

            <CampoNumeroEditor3D rotulo="Nível %" valor={corrente.nivelPercentual} passo={5} minimo={0} maximo={100} ajuda="Quanto da capacidade passa por aqui: 100 = fio saudável; menos = fio danificado (o lugar fica mais escuro); 0 = corte." atualizaValor={valor => aoMudar(sanitizaCorrenteEditor3D({ ...corrente, nivelPercentual: valor }))} />

            {intermitencia === null ? (
                <div className={styles.acoes_objeto_painel}>
                    <button type="button" className={styles.botao_acao_objeto} onClick={() => aoMudar({ nivelPercentual: corrente.nivelPercentual, intermitencia: INTERMITENCIA_PADRAO_EDITOR3D })} title="Crises periódicas de corrente: a cada ciclo, uma rajada de flicks sorteada entre os padrões autorados">+ Intermitência</button>
                </div>
            ) : (
                <>
                    <CampoFaixaEditor3D rotulo="Ciclo" ajuda="A normalidade entre crises: a cada ciclo acontece UMA crise, sorteada entre os padrões ativos." faixa={{ minimo: intermitencia.cicloMs.minimo / 1000, maximo: intermitencia.cicloMs.maximo / 1000 }} passo={0.5} minimo={LIMITES_INTERMITENCIA_EDITOR3D.cicloMs.minimo / 1000} maximo={LIMITES_INTERMITENCIA_EDITOR3D.cicloMs.maximo / 1000} sufixo="s" aoMudar={(lado, valor) => mudaIntermitencia(atual => ({ ...atual, cicloMs: { ...atual.cicloMs, [lado]: valor * 1000 } }))} />

                    <div className={styles.cabecalho_lista_padroes}>
                        <span>Padrões de crise<button type="button" className={styles.ajuda_campo} title="Cada padrão é uma assinatura de falha (uma rajada). Com mais de um, cada crise sorteia um deles — eles se mesclam ao acaso. Padrão inativo fica gravado, fora do sorteio." aria-label="Sobre os padrões de crise" onClick={evento => evento.preventDefault()}>?</button></span>
                        {intermitencia.padroes.length < LIMITES_INTERMITENCIA_EDITOR3D.maximoPadroes && <button type="button" className={styles.botao_add_padrao} onClick={() => mudaIntermitencia(atual => ({ ...atual, padroes: [...atual.padroes, PADRAO_CRISE_PADRAO_EDITOR3D] }))} title="Mais um padrão na mescla" aria-label="Adicionar padrão de crise">+</button>}
                    </div>

                    {intermitencia.padroes.map((padrao, indice) => (
                        <PadraoCriseEditor3D
                            key={indice}
                            indice={indice}
                            padrao={padrao}
                            podeRemover={intermitencia.padroes.length > 1}
                            aoMudarFaixa={(campo, lado, valor) => mudaFaixaPadrao(indice, campo, lado, valor)}
                            aoAlternarAtivo={() => mudaIntermitencia(atual => ({ ...atual, padroes: atual.padroes.map((atualPadrao, atualIndice) => atualIndice === indice ? { ...atualPadrao, ativo: !atualPadrao.ativo } : atualPadrao) }))}
                            aoRemover={() => mudaIntermitencia(atual => ({ ...atual, padroes: atual.padroes.filter((_, atualIndice) => atualIndice !== indice) }))}
                        />
                    ))}

                    <div className={styles.acoes_objeto_painel}>
                        <button type="button" className={styles.botao_acao_objeto} onClick={() => aoMudar({ nivelPercentual: corrente.nivelPercentual, intermitencia: null })} title="Voltar a corrente contínua, mantendo o nível">✕ Remover intermitência</button>
                    </div>
                </>
            )}
        </div>
    );
};