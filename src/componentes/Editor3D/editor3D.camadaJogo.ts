import type { CamadaJogoMapa, CamadaJogoMapaPersistida, CorrenteMapa, FonteDeLuzMapa, IntermitenciaCorrenteMapa, InterruptorMapa, NoDistribuicaoMapa, PadraoCriseCorrenteMapa, TipoFonteDeLuzMapa } from 'types-nora-api';

import { corHexParaVetor3Editor3D, vetor3ParaCorHexEditor3D } from './editor3D.cor';
import { elementosDoMapa } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';
import { normalizaCamadaJogoMapaPersistidaMapa } from 'Funcionalidades/MapaJogavel/mapaJogavel.corrente';
import type { CenaCanonicaEditor3D } from 'types-nora-api';

// CAMADA DE JOGO do mapa no ESTADO do editor. Espelha o contrato v2 (árvore de distribuição) ACHATADO para a autoria da
// fase 1: a ENTREGA de cada luz vira campos da própria luz (correnteEntrega + idCircuito) e os nós de tronco são os
// CIRCUITOS (raízes com corrente própria, alternados por interruptores). A cor vira hex (o `<input type="color">` fala hex,
// o contrato fala Vetor3). O domínio LÓGICO vive aqui, separado da cena 3D — que segue sendo só geometria e material.
export type FonteDeLuzEditor3D = {
    readonly idLocal: string;
    readonly nome: string;
    readonly tipo: TipoFonteDeLuzMapa;
    readonly posicao: [number, number, number];
    readonly cor: string;
    readonly intensidade: number;
    readonly alcanceMetros: number;
    // ENTREGA da luz na distribuição — a derivação que mora FISICAMENTE junto da lâmpada: corrente própria (o dano/regime
    // de UMA lâmpada) e o circuito de que ela pende (null = ligada direto na alimentação, sempre energizada).
    readonly correnteEntrega: CorrenteMapa;
    readonly idCircuito: string | null;
};

// Circuito: nó de TRONCO da distribuição — a corrente que ele entrega vale para todas as luzes penduradas nele, e o gate
// dele é o que os interruptores alternam. Vários interruptores no mesmo circuito = paralelo (three-way).
export type CircuitoEditor3D = {
    readonly idLocal: string;
    readonly nome: string;
    readonly corrente: CorrenteMapa;
    readonly ligadoInicialmente: boolean;
};

// Interruptor no estado do editor: corpo físico que alterna UM circuito. Posição/dimensões NÃO moram aqui — derivadas do
// elemento da cena a cada salvamento, para nunca ficarem velhas quando o artista mover o interruptor.
export type InterruptorEditor3D = {
    readonly idLocal: string;
    readonly nome: string;
    readonly descricao: string;
    readonly idElementoCena: string;
    readonly idCircuito: string;
    readonly alcanceMilimetros: number;
};

export type FiacaoEditor3D = {
    readonly circuitos: readonly CircuitoEditor3D[];
    readonly interruptores: readonly InterruptorEditor3D[];
};

export type CamadaJogoEditor3D = {
    readonly fontesDeLuz: readonly FonteDeLuzEditor3D[];
    readonly fiacao: FiacaoEditor3D;
};

export const CORRENTE_PLENA_EDITOR3D: CorrenteMapa = { nivelPercentual: 100, intermitencia: null };
export const FIACAO_VAZIA_EDITOR3D: FiacaoEditor3D = { circuitos: [], interruptores: [] };
export const CAMADA_JOGO_VAZIA_EDITOR3D: CamadaJogoEditor3D = { fontesDeLuz: [], fiacao: FIACAO_VAZIA_EDITOR3D };

export const TIPOS_FONTE_DE_LUZ_EDITOR3D: readonly TipoFonteDeLuzMapa[] = ['PONTO', 'AMBIENTE'];
export const ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D: Record<TipoFonteDeLuzMapa, string> = { PONTO: 'Ponto (lâmpada, abajur, LED)', AMBIENTE: 'Ambiente iluminado (sem objeto)' };
export const ROTULO_CURTO_TIPO_FONTE_DE_LUZ_EDITOR3D: Record<TipoFonteDeLuzMapa, string> = { PONTO: 'Ponto', AMBIENTE: 'Ambiente' };
// PONTO e AMBIENTE medem intensidade em escalas diferentes (PERCENTUAL do alcance vs banho uniforme): trocar o tipo troca o valor junto.
export const INTENSIDADE_PADRAO_POR_TIPO_FONTE_EDITOR3D: Record<TipoFonteDeLuzMapa, number> = { PONTO: 100, AMBIENTE: 0.6 };
export const MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D: Record<TipoFonteDeLuzMapa, number> = { PONTO: 100, AMBIENTE: 3 };

// Limites das faixas de intermitência (MS, como o contrato) — os MESMOS do validador da Nora-Api, para o save nunca ser recusado.
export const LIMITES_INTERMITENCIA_EDITOR3D = { cicloMs: { minimo: 500, maximo: 3600000 }, flicks: { minimo: 1, maximo: 20 }, duracaoFlickMs: { minimo: 10, maximo: 3600000 }, intervaloEntreFlicksMs: { minimo: 1, maximo: 60000 }, maximoPadroes: 8 } as const;

// A corrente NÃO tem modos prontos: os cenários (rajada de corredor, apagão, temporizador, lâmpada fraca) são
// COMBINAÇÕES dos mesmos parâmetros — nível entregue + ciclo + PADRÕES de crise, que o funcionamento mescla ao acaso.
// O ponto de partida do "+ Intermitência" (e do "+ Padrão") é a rajada característica de fiação danificada: a cada
// 5–12s, 3–5 flicks de 30–150ms com pausas acesas de 5–30ms — o autor ajusta a partir daqui.
export const PADRAO_CRISE_PADRAO_EDITOR3D: PadraoCriseCorrenteMapa = { ativo: true, flicks: { minimo: 3, maximo: 5 }, duracaoFlickMs: { minimo: 30, maximo: 150 }, intervaloEntreFlicksMs: { minimo: 5, maximo: 30 } };
export const INTERMITENCIA_PADRAO_EDITOR3D: IntermitenciaCorrenteMapa = { cicloMs: { minimo: 5000, maximo: 12000 }, padroes: [PADRAO_CRISE_PADRAO_EDITOR3D] };

const COR_FONTE_PADRAO_EDITOR3D = '#ffe8c0';
const ALTURA_FONTE_PADRAO_EDITOR3D = 2.6;
const ALCANCE_FONTE_PADRAO_METROS_EDITOR3D = 6;
const ALCANCE_INTERRUPTOR_PADRAO_MILIMETROS_EDITOR3D = 1500;

// idLocal estável e legível, derivado dos existentes — sem relógio nem aleatório, para o mesmo mapa reabrir igual.
function proximoIdLocal(existentes: readonly { readonly idLocal: string }[], prefixo: string): string {
    const maiorSufixo = existentes.reduce((maior, item) => Math.max(maior, Number.parseInt(item.idLocal.replace(`${prefixo}_`, ''), 10) || 0), 0);
    return `${prefixo}_${maiorSufixo + 1}`;
};

// TODO (vínculo luz↔corpo): a Fonte de Luz é um ponto SOLTO — mover o objeto que é o corpo dela (abajur, lâmpada, LED)
// não move a luz junto. A evolução planejada é vincular a luz a um objeto do cenário e ela passar a seguir o bbox/offset
// dele, completando a "fiação elétrica" do mapa (objeto-corpo → luz → interruptor).
export function criaFonteDeLuzEditor3D(fontes: readonly FonteDeLuzEditor3D[]): FonteDeLuzEditor3D {
    const idLocal = proximoIdLocal(fontes, 'LUZ');
    return { idLocal, nome: `Luz ${idLocal.replace('LUZ_', '')}`, tipo: 'PONTO', posicao: [0, 0, ALTURA_FONTE_PADRAO_EDITOR3D], cor: COR_FONTE_PADRAO_EDITOR3D, intensidade: INTENSIDADE_PADRAO_POR_TIPO_FONTE_EDITOR3D.PONTO, alcanceMetros: Math.min(ALCANCE_FONTE_PADRAO_METROS_EDITOR3D, ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D), correnteEntrega: CORRENTE_PLENA_EDITOR3D, idCircuito: null };
};

// DUAS esferas de alcance regem a fonte PONTO, e nenhuma mente:
// - Esfera do ALCANCE (o campo autorado, cor da fonte): o corte da luz — o TAMANHO dela, até onde pode iluminar.
// - Esfera da INTENSIDADE (laranja): a intensidade é PERCENTUAL do alcance — 100% ilumina até o corte, 60% até 60% do
//   caminho. Mudar o ALCANCE move as duas juntas (a laranja é fração dele); mudar a INTENSIDADE só a laranja.
// A física do motor (candela) é DERIVADA desse modelo em intensidadeFisicaFonteDeLuzPontoMapa — o mesmo helper do
// render de jogo, para autoria e Partida nunca divergirem. O contrato persiste o percentual (0-100).
export const ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D = 50;

export function alcanceEfetivoMetrosFonteEditor3D(fonte: FonteDeLuzEditor3D): number {
    return (fonte.alcanceMetros * Math.max(0, fonte.intensidade)) / 100;
};

// Toda mutação de intensidade/alcance passa por aqui, para os limites nunca escaparem.
export function aplicaCampoLuzEditor3D(luz: FonteDeLuzEditor3D, campo: 'intensidade' | 'alcanceMetros', valor: number): FonteDeLuzEditor3D {
    if (campo === 'intensidade') return { ...luz, intensidade: Math.min(valor, MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D[luz.tipo]) };

    return { ...luz, alcanceMetros: Math.min(valor, ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D) };
};

function clampFaixaEditor3D(valor: number, minimo: number, maximo: number): number { return Math.min(maximo, Math.max(minimo, valor)); };

// Toda mutação de corrente passa por aqui: níveis em 0-100, faixas dentro dos limites do validador e mínimo <= máximo —
// o save nunca é recusado por corrente fora da régua.
export function sanitizaCorrenteEditor3D(corrente: CorrenteMapa): CorrenteMapa {
    const nivelPercentual = clampFaixaEditor3D(corrente.nivelPercentual, 0, 100);
    if (corrente.intermitencia === null) return { nivelPercentual, intermitencia: null };

    const limites = LIMITES_INTERMITENCIA_EDITOR3D;
    const cicloMinimo = clampFaixaEditor3D(corrente.intermitencia.cicloMs.minimo, limites.cicloMs.minimo, limites.cicloMs.maximo);
    const padroes = corrente.intermitencia.padroes.slice(0, limites.maximoPadroes).map(sanitizaPadraoCriseEditor3D);
    return {
        nivelPercentual,
        intermitencia: {
            cicloMs: { minimo: cicloMinimo, maximo: clampFaixaEditor3D(corrente.intermitencia.cicloMs.maximo, cicloMinimo, limites.cicloMs.maximo) },
            padroes: padroes.length > 0 ? padroes : [PADRAO_CRISE_PADRAO_EDITOR3D],
        },
    };
};

function sanitizaPadraoCriseEditor3D(padrao: PadraoCriseCorrenteMapa): PadraoCriseCorrenteMapa {
    const limites = LIMITES_INTERMITENCIA_EDITOR3D;
    const flicksMinimo = Math.round(clampFaixaEditor3D(padrao.flicks.minimo, limites.flicks.minimo, limites.flicks.maximo));
    const duracaoMinimo = clampFaixaEditor3D(padrao.duracaoFlickMs.minimo, limites.duracaoFlickMs.minimo, limites.duracaoFlickMs.maximo);
    const intervaloMinimo = clampFaixaEditor3D(padrao.intervaloEntreFlicksMs.minimo, limites.intervaloEntreFlicksMs.minimo, limites.intervaloEntreFlicksMs.maximo);
    return {
        ativo: padrao.ativo,
        flicks: { minimo: flicksMinimo, maximo: Math.round(clampFaixaEditor3D(padrao.flicks.maximo, flicksMinimo, limites.flicks.maximo)) },
        duracaoFlickMs: { minimo: duracaoMinimo, maximo: clampFaixaEditor3D(padrao.duracaoFlickMs.maximo, duracaoMinimo, limites.duracaoFlickMs.maximo) },
        intervaloEntreFlicksMs: { minimo: intervaloMinimo, maximo: clampFaixaEditor3D(padrao.intervaloEntreFlicksMs.maximo, intervaloMinimo, limites.intervaloEntreFlicksMs.maximo) },
    };
};

function descricaoPadraoInterruptorEditor3D(nomeElemento: string): string { return `${nomeElemento}. Aproxime-se para acionar.`; };

function criaInterruptorEditor3D(interruptores: readonly InterruptorEditor3D[], idElementoCena: string, nomeElemento: string, idCircuito: string): InterruptorEditor3D {
    const idLocal = proximoIdLocal(interruptores, 'INTERRUPTOR');
    return { idLocal, nome: nomeElemento, descricao: descricaoPadraoInterruptorEditor3D(nomeElemento), idElementoCena, idCircuito, alcanceMilimetros: ALCANCE_INTERRUPTOR_PADRAO_MILIMETROS_EDITOR3D };
};

// "Definir interruptor" (o gesto armado) só ADICIONA na árvore — remover é sempre ação explícita (◉ nos painéis).
// As quatro saídas do gesto, todas fiéis à física de residência:
// - objeto sem interruptor + luz sem circuito → nasce circuito novo com o interruptor, e a luz pendura nele;
// - objeto sem interruptor + luz com circuito → o objeto vira MAIS um interruptor do circuito da luz (three-way);
// - objeto já interruptor + luz sem circuito → a luz pendura no circuito dele;
// - objeto já interruptor + luz em OUTRO circuito → os circuitos se FUNDEM (a fiação agora é uma só).
// Devolve null quando nada muda (luz já no circuito do objeto), para o chamador não registrar histórico à toa.
export function vinculaLuzInterruptorEditor3D(fiacao: FiacaoEditor3D, luzes: readonly FonteDeLuzEditor3D[], idElementoCena: string, nomeElemento: string, idFonte: string): { fiacao: FiacaoEditor3D; luzes: readonly FonteDeLuzEditor3D[] } | null {
    const luz = luzes.find(fonte => fonte.idLocal === idFonte);
    if (luz === undefined) return null;

    const existente = fiacao.interruptores.find(interruptor => interruptor.idElementoCena === idElementoCena);
    if (existente !== undefined) {
        if (luz.idCircuito === existente.idCircuito) return null;
        if (luz.idCircuito === null) return { fiacao, luzes: luzes.map(fonte => fonte.idLocal === idFonte ? { ...fonte, idCircuito: existente.idCircuito } : fonte) };

        const idCircuitoMorto = luz.idCircuito;
        return {
            fiacao: { circuitos: fiacao.circuitos.filter(circuito => circuito.idLocal !== idCircuitoMorto), interruptores: fiacao.interruptores.map(interruptor => interruptor.idCircuito === idCircuitoMorto ? { ...interruptor, idCircuito: existente.idCircuito } : interruptor) },
            luzes: luzes.map(fonte => fonte.idCircuito === idCircuitoMorto ? { ...fonte, idCircuito: existente.idCircuito } : fonte),
        };
    }

    if (luz.idCircuito !== null) return { fiacao: { circuitos: fiacao.circuitos, interruptores: [...fiacao.interruptores, criaInterruptorEditor3D(fiacao.interruptores, idElementoCena, nomeElemento, luz.idCircuito)] }, luzes };

    const idCircuito = proximoIdLocal(fiacao.circuitos, 'CIRCUITO');
    const circuito: CircuitoEditor3D = { idLocal: idCircuito, nome: nomeElemento, corrente: CORRENTE_PLENA_EDITOR3D, ligadoInicialmente: true };
    return {
        fiacao: { circuitos: [...fiacao.circuitos, circuito], interruptores: [...fiacao.interruptores, criaInterruptorEditor3D(fiacao.interruptores, idElementoCena, nomeElemento, idCircuito)] },
        luzes: luzes.map(fonte => fonte.idLocal === idFonte ? { ...fonte, idCircuito } : fonte),
    };
};

// Remove o CORPO do circuito (o ◉ na lista da luz / excluir na árvore). O circuito só dissolve se ficou sem interruptor E
// com corrente trivial — regime autorado sustenta o circuito mesmo sem corpo (a alimentação com dano do hospital).
export function removeInterruptorEditor3D(fiacao: FiacaoEditor3D, luzes: readonly FonteDeLuzEditor3D[], idInterruptor: string): { fiacao: FiacaoEditor3D; luzes: readonly FonteDeLuzEditor3D[] } {
    const interruptor = fiacao.interruptores.find(atual => atual.idLocal === idInterruptor);
    if (interruptor === undefined) return { fiacao, luzes };

    const interruptores = fiacao.interruptores.filter(atual => atual.idLocal !== idInterruptor);
    const circuito = fiacao.circuitos.find(atual => atual.idLocal === interruptor.idCircuito);
    const circuitoSustentado = interruptores.some(atual => atual.idCircuito === interruptor.idCircuito) || (circuito !== undefined && !(circuito.corrente.nivelPercentual === 100 && circuito.corrente.intermitencia === null && circuito.ligadoInicialmente));
    if (circuitoSustentado) return { fiacao: { circuitos: fiacao.circuitos, interruptores }, luzes };

    return {
        fiacao: { circuitos: fiacao.circuitos.filter(atual => atual.idLocal !== interruptor.idCircuito), interruptores },
        luzes: luzes.map(fonte => fonte.idCircuito === interruptor.idCircuito ? { ...fonte, idCircuito: null } : fonte),
    };
};

// Solta a ENTREGA da luz do circuito ("Remover do circuito" no painel dela). Circuito sem nenhuma luz dissolve — e leva os
// interruptores junto: interruptor de circuito vazio não aciona nada.
export function removeLuzDoCircuitoEditor3D(fiacao: FiacaoEditor3D, luzes: readonly FonteDeLuzEditor3D[], idFonte: string): { fiacao: FiacaoEditor3D; luzes: readonly FonteDeLuzEditor3D[] } {
    const luz = luzes.find(fonte => fonte.idLocal === idFonte);
    if (luz === undefined || luz.idCircuito === null) return { fiacao, luzes };

    const idCircuito = luz.idCircuito;
    const luzesNovas = luzes.map(fonte => fonte.idLocal === idFonte ? { ...fonte, idCircuito: null } : fonte);
    if (luzesNovas.some(fonte => fonte.idCircuito === idCircuito)) return { fiacao, luzes: luzesNovas };

    return { fiacao: { circuitos: fiacao.circuitos.filter(circuito => circuito.idLocal !== idCircuito), interruptores: fiacao.interruptores.filter(interruptor => interruptor.idCircuito !== idCircuito) }, luzes: luzesNovas };
};

// id do nó de ENTREGA no contrato, derivado da luz — estável entre salvamentos (o cronograma determinístico usa o id).
export function idNoEntregaDaLuzEditor3D(idFonte: string): string { return `ENTREGA_${idFonte}`; };

// Serialização v2: circuitos viram nós-raiz, cada luz ganha seu nó de ENTREGA, interruptores apontam o circuito. O corpo
// físico do interruptor é DERIVADO do bbox do elemento AGORA — mover o interruptor no Editor e salvar já regrava a posição
// que o runtime usa. Interruptor cujo elemento sumiu e circuito que ficou sem luz são descartados.
export function serializaCamadaJogoEditor3D(camadaJogo: CamadaJogoEditor3D, cena: CenaCanonicaEditor3D): CamadaJogoMapa {
    const elementosPorId = new Map(elementosDoMapa(cena).map(elemento => [elemento.idLocal, elemento]));
    const idsCircuitosComLuz = new Set(camadaJogo.fontesDeLuz.map(fonte => fonte.idCircuito).filter((id): id is string => id !== null));
    const circuitosVivos = camadaJogo.fiacao.circuitos.filter(circuito => idsCircuitosComLuz.has(circuito.idLocal));
    const idsCircuitosVivos = new Set(circuitosVivos.map(circuito => circuito.idLocal));

    const interruptores: InterruptorMapa[] = [];
    for (const interruptor of camadaJogo.fiacao.interruptores) {
        const elemento = elementosPorId.get(interruptor.idElementoCena);
        if (elemento === undefined || !idsCircuitosVivos.has(interruptor.idCircuito)) continue;

        interruptores.push({
            idLocal: interruptor.idLocal,
            nome: interruptor.nome.trim().length > 0 ? interruptor.nome.trim() : elemento.nome,
            descricao: interruptor.descricao.trim().length > 0 ? interruptor.descricao.trim() : descricaoPadraoInterruptorEditor3D(elemento.nome),
            idElementoCena: interruptor.idElementoCena,
            idNo: interruptor.idCircuito,
            alcanceMilimetros: interruptor.alcanceMilimetros,
            posicao: { x: elemento.posicao.x, y: elemento.posicao.y },
            larguraMilimetros: elemento.larguraMilimetros,
            alturaMilimetros: elemento.alturaMilimetros,
            profundidadeMilimetros: elemento.profundidadeMilimetros,
        });
    }

    const nosDistribuicao: NoDistribuicaoMapa[] = [
        ...circuitosVivos.map(circuito => ({ idLocal: circuito.idLocal, nome: circuito.nome, idNoPai: null, corrente: sanitizaCorrenteEditor3D(circuito.corrente), ligadoInicialmente: circuito.ligadoInicialmente, idFonteDeLuz: null })),
        ...camadaJogo.fontesDeLuz.map(fonte => ({ idLocal: idNoEntregaDaLuzEditor3D(fonte.idLocal), nome: fonte.nome.trim().length > 0 ? fonte.nome.trim() : fonte.idLocal, idNoPai: fonte.idCircuito !== null && idsCircuitosVivos.has(fonte.idCircuito) ? fonte.idCircuito : null, corrente: sanitizaCorrenteEditor3D(fonte.correnteEntrega), ligadoInicialmente: true, idFonteDeLuz: fonte.idLocal })),
    ];

    const fontesDeLuz: FonteDeLuzMapa[] = camadaJogo.fontesDeLuz.map(fonte => ({
        idLocal: fonte.idLocal,
        nome: fonte.nome.trim().length > 0 ? fonte.nome.trim() : fonte.idLocal,
        tipo: fonte.tipo,
        posicao: [fonte.posicao[0], fonte.posicao[1], fonte.posicao[2]],
        cor: corHexParaVetor3Editor3D(fonte.cor),
        intensidade: fonte.intensidade,
        alcanceMetros: fonte.alcanceMetros,
    }));

    return { versao: 2, fontesDeLuz, nosDistribuicao, interruptores };
};

function fonteDoContratoEditor3D(fonte: FonteDeLuzMapa, correnteEntrega: CorrenteMapa, idCircuito: string | null): FonteDeLuzEditor3D {
    // Intensidade (percentual) e alcance salvos entram clampados aos limites autoráveis; corrente passa pela mesma régua.
    return { idLocal: fonte.idLocal, nome: fonte.nome, tipo: fonte.tipo, posicao: [fonte.posicao[0], fonte.posicao[1], fonte.posicao[2]], cor: vetor3ParaCorHexEditor3D(fonte.cor), intensidade: Math.min(fonte.intensidade, MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D[fonte.tipo]), alcanceMetros: fonte.tipo === 'PONTO' ? Math.min(fonte.alcanceMetros, ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D) : fonte.alcanceMetros, correnteEntrega: sanitizaCorrenteEditor3D(correnteEntrega), idCircuito };
};

export function camadaJogoDoProjeto(camadaJogo: CamadaJogoMapaPersistida | null | undefined): CamadaJogoEditor3D {
    // A migração v1→v2 mora no normalizador COMPARTILHADO do front (mapaJogavel.corrente) — o mesmo do jogo, que espelha
    // o do runtime da Partida: um só algoritmo de leitura do legado em toda a plataforma.
    const normalizada = normalizaCamadaJogoMapaPersistidaMapa(camadaJogo);
    if (normalizada === null) return CAMADA_JOGO_VAZIA_EDITOR3D;

    // A árvore ACHATA para a autoria — nós de entrega viram campos da luz; os demais nós são os circuitos. Entrega
    // apontando pai que não é circuito (forma da fase 2) cai para solta — o editor da fase 1 só autora dois níveis.
    const entregaPorFonte = new Map(normalizada.nosDistribuicao.filter(no => no.idFonteDeLuz !== null).map(no => [no.idFonteDeLuz, no]));
    const circuitos = normalizada.nosDistribuicao.filter(no => no.idFonteDeLuz === null);
    const idsCircuitos = new Set(circuitos.map(no => no.idLocal));
    return {
        fontesDeLuz: normalizada.fontesDeLuz.map(fonte => {
            const entrega = entregaPorFonte.get(fonte.idLocal);
            return fonteDoContratoEditor3D(fonte, entrega?.corrente ?? CORRENTE_PLENA_EDITOR3D, entrega !== undefined && entrega.idNoPai !== null && idsCircuitos.has(entrega.idNoPai) ? entrega.idNoPai : null);
        }),
        fiacao: {
            circuitos: circuitos.map(no => ({ idLocal: no.idLocal, nome: no.nome, corrente: sanitizaCorrenteEditor3D(no.corrente), ligadoInicialmente: no.ligadoInicialmente })),
            interruptores: normalizada.interruptores.filter(interruptor => idsCircuitos.has(interruptor.idNo)).map(interruptor => ({ idLocal: interruptor.idLocal, nome: interruptor.nome, descricao: interruptor.descricao, idElementoCena: interruptor.idElementoCena, idCircuito: interruptor.idNo, alcanceMilimetros: interruptor.alcanceMilimetros })),
        },
    };
};