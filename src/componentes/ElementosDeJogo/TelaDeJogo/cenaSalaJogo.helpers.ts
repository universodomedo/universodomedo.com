import { useEffect } from 'react';
import type { AcaoTemporalSalaDeJogoRuntime, EstadoTemporalSalaDeJogoRuntime } from 'types-nora-api';
import type { DestinoMovimentacaoSalaJogo } from './ContextoMovimentacaoSalaJogo';

export const ALTURA_PAREDE = 3.6;
export const ESPESSURA_PAREDE = 0.3;
export const ALTURA_OLHOS = 1.55;
export const VELOCIDADE_LOCOMOCAO_TESTE_MILIMETROS_POR_SEGUNDO = 1000;
export const COR_MOVIMENTACAO = '#4ade80';

// Caixa padrao (fallback) de um interagivel tipo objeto na cena (unidade de cena), quando o objeto nao trouxe tamanho autorado.
export const CAIXA_INTERAGIVEL = { largura: 0.8, altura: 0.9, profundidade: 0.8, centroY: 0.45 };

// Dimensoes de um interagivel-objeto em unidade de cena: usa o tamanho autorado (mm no payload) ou o padrao. Fonte unica pro DESENHO (InteragivelR3F) e o OCLUSOR (MascaraVisaoSalaJogoR3F).
export function dimensoesInteragivelCena(dims: { larguraMilimetros?: number; alturaMilimetros?: number; profundidadeMilimetros?: number; }): { largura: number; altura: number; profundidade: number; } {
    return {
        largura: dims.larguraMilimetros != null ? paraUnidadeCena(dims.larguraMilimetros) : CAIXA_INTERAGIVEL.largura,
        altura: dims.alturaMilimetros != null ? paraUnidadeCena(dims.alturaMilimetros) : CAIXA_INTERAGIVEL.altura,
        profundidade: dims.profundidadeMilimetros != null ? paraUnidadeCena(dims.profundidadeMilimetros) : CAIXA_INTERAGIVEL.profundidade,
    };
};

// O dado vive em milimetros (precisao cheia); a cena Three.js renderiza numa escala confortavel: 1 unidade de cena = 1000 mm. So o DESENHO escala — nenhum arredondamento no dado. TODA geometria de mundo (chao/paredes/plano de movimento) desenha em unidade de cena via paraUnidadeCena.
export const MILIMETROS_POR_UNIDADE_CENA = 1000;
export function paraUnidadeCena(valorMilimetros: number): number { return valorMilimetros / MILIMETROS_POR_UNIDADE_CENA; };

export function mundoX(x: number, largura: number): number { return paraUnidadeCena(x - largura / 2) + 0.5; };
// Z-up: o plano do chão é XY e a altura é Z. A 1ª coordenada lógica (x) vai pro eixo X do mundo; a 2ª (y) vai pro eixo Y do mundo (era Z no Y-up antigo).
export function mundoY(y: number, altura: number): number { return paraUnidadeCena(y - altura / 2) + 0.5; };
export function celulaDoMundo(pontoX: number, pontoY: number, largura: number, altura: number): DestinoMovimentacaoSalaJogo {
    const x = Math.min(Math.max(Math.round((pontoX - 0.5) * MILIMETROS_POR_UNIDADE_CENA + largura / 2), 0), largura);
    const y = Math.min(Math.max(Math.round((pontoY - 0.5) * MILIMETROS_POR_UNIDADE_CENA + altura / 2), 0), altura);
    return { x, y };
};
export function projetaMomentoFiccional(momentoMs: number, momentoLimiteMs: number | null): number { return momentoLimiteMs === null ? momentoMs : Math.min(momentoMs, momentoLimiteMs); };

export type ReferenciaTempoFiccionalControlado = { momentoMs: number; recebidoMs: number; limiteMs: number | null; };

// Movimento em andamento do Ser controlado (a acao temporal de mover que ainda tem impacto previsto). Fonte unica pro marcador E pra mascara de visao seguirem a MESMA posicao ficcional.
export function encontraMovimentoAtivoControlado(estadoTemporal: EstadoTemporalSalaDeJogoRuntime | null): AcaoTemporalSalaDeJogoRuntime | null {
    if (!estadoTemporal) return null;
    return estadoTemporal.acoesTemporais.find(acao => acao.tipo === 'mover' && acao.status === 'EM_ANDAMENTO' && acao.movimento !== null && acao.momentoFimPrevistoMs !== null) ?? null;
};

// Posicao logica (mm) interpolada do controlado no instante ficcional atual: sem movimento ativo devolve a posicao base; com movimento, interpola origem->destino pelo progresso temporal.
export function posicaoLogicaControladoFiccional(posicaoBase: { x: number; y: number; }, movimentoAtivo: AcaoTemporalSalaDeJogoRuntime | null, referencia: ReferenciaTempoFiccionalControlado): { x: number; y: number; } {
    if (!movimentoAtivo || !movimentoAtivo.movimento || movimentoAtivo.momentoFimPrevistoMs === null) return posicaoBase;
    const projetadoMs = projetaMomentoFiccional(referencia.momentoMs + Math.max(0, Date.now() - referencia.recebidoMs), referencia.limiteMs);
    const duracaoMs = movimentoAtivo.momentoFimPrevistoMs - movimentoAtivo.momentoInicioMs;
    const progresso = duracaoMs <= 0 ? 1 : Math.min(1, Math.max(0, (projetadoMs - movimentoAtivo.momentoInicioMs) / duracaoMs));
    return {
        x: movimentoAtivo.movimento.origem.x + (movimentoAtivo.movimento.destino.x - movimentoAtivo.movimento.origem.x) * progresso,
        y: movimentoAtivo.movimento.origem.y + (movimentoAtivo.movimento.destino.y - movimentoAtivo.movimento.origem.y) * progresso,
    };
};

// O shell do app anima a escala do container na entrada; o R3F mede o canvas antes do layout assentar e fica em tamanho zero (cena preta). Reforcamos a remedicao depois que assenta.
export function useReforcaRedimensionamentoCanvas() {
    useEffect(() => {
        const tempos = [120, 360, 720].map(ms => window.setTimeout(() => window.dispatchEvent(new Event('resize')), ms));
        return () => tempos.forEach(window.clearTimeout);
    }, []);
};
