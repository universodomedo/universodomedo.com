import type { CamadaJogoMapa, ComandoMapa, FonteDeLuzMapa, TipoFonteDeLuzMapa } from 'types-nora-api';

import { corHexParaVetor3Editor3D, vetor3ParaCorHexEditor3D } from './editor3D.cor';
import { elementosDoMapa } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';
import type { CenaCanonicaEditor3D } from 'types-nora-api';

// CAMADA DE JOGO do mapa no ESTADO do editor. Espelha o contrato trocando a cor por hex (o `<input type="color">` fala hex,
// o contrato fala Vetor3) e SEM `alternavel`: no editor isso não se autora — luz é alternável se, e somente se, algum
// interruptor a aciona, e o flag do contrato é DERIVADO dos vínculos na serialização. Sem interruptor, a luz é fixa
// (sempre acesa em jogo): não há o que alternar. O domínio LÓGICO vive aqui, separado da cena 3D — que segue sendo só
// geometria e material.
export type FonteDeLuzEditor3D = {
    readonly idLocal: string;
    readonly nome: string;
    readonly tipo: TipoFonteDeLuzMapa;
    readonly posicao: [number, number, number];
    readonly cor: string;
    readonly intensidade: number;
    readonly alcanceMetros: number;
};

// Comando no estado do editor: o corpo físico (posição/dimensões) NÃO mora aqui — é derivado do elemento da cena a cada
// salvamento, para nunca ficar velho quando o artista mover o interruptor.
export type ComandoEditor3D = {
    readonly idLocal: string;
    readonly nome: string;
    readonly descricao: string;
    readonly idElementoCena: string;
    readonly idsFontesDeLuz: readonly string[];
    readonly alcanceMilimetros: number;
};

export type CamadaJogoEditor3D = {
    readonly fontesDeLuz: readonly FonteDeLuzEditor3D[];
    readonly comandos: readonly ComandoEditor3D[];
};

export const CAMADA_JOGO_VAZIA_EDITOR3D: CamadaJogoEditor3D = { fontesDeLuz: [], comandos: [] };

export const TIPOS_FONTE_DE_LUZ_EDITOR3D: readonly TipoFonteDeLuzMapa[] = ['PONTO', 'AMBIENTE'];
export const ROTULO_TIPO_FONTE_DE_LUZ_EDITOR3D: Record<TipoFonteDeLuzMapa, string> = { PONTO: 'Ponto (lâmpada, abajur, LED)', AMBIENTE: 'Ambiente iluminado (sem objeto)' };
export const ROTULO_CURTO_TIPO_FONTE_DE_LUZ_EDITOR3D: Record<TipoFonteDeLuzMapa, string> = { PONTO: 'Ponto', AMBIENTE: 'Ambiente' };
// PONTO e AMBIENTE medem intensidade em escalas diferentes (PERCENTUAL do alcance vs banho uniforme): trocar o tipo troca o valor junto.
export const INTENSIDADE_PADRAO_POR_TIPO_FONTE_EDITOR3D: Record<TipoFonteDeLuzMapa, number> = { PONTO: 100, AMBIENTE: 0.6 };
export const MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D: Record<TipoFonteDeLuzMapa, number> = { PONTO: 100, AMBIENTE: 3 };

const COR_FONTE_PADRAO_EDITOR3D = '#ffe8c0';
const ALTURA_FONTE_PADRAO_EDITOR3D = 2.6;
const ALCANCE_FONTE_PADRAO_METROS_EDITOR3D = 6;
const ALCANCE_COMANDO_PADRAO_MILIMETROS_EDITOR3D = 1500;

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
    return { idLocal, nome: `Luz ${idLocal.replace('LUZ_', '')}`, tipo: 'PONTO', posicao: [0, 0, ALTURA_FONTE_PADRAO_EDITOR3D], cor: COR_FONTE_PADRAO_EDITOR3D, intensidade: INTENSIDADE_PADRAO_POR_TIPO_FONTE_EDITOR3D.PONTO, alcanceMetros: Math.min(ALCANCE_FONTE_PADRAO_METROS_EDITOR3D, ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D) };
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

function descricaoPadraoComandoEditor3D(nomeElemento: string): string { return `${nomeElemento}. Aproxime-se para acionar.`; };

function criaComandoEditor3D(comandos: readonly ComandoEditor3D[], idElementoCena: string, nomeElemento: string, idFonte: string): ComandoEditor3D {
    const idLocal = proximoIdLocal(comandos, 'COMANDO');
    return { idLocal, nome: nomeElemento, descricao: descricaoPadraoComandoEditor3D(nomeElemento), idElementoCena, idsFontesDeLuz: [idFonte], alcanceMilimetros: ALCANCE_COMANDO_PADRAO_MILIMETROS_EDITOR3D };
};

// O Interruptor não é entidade autorada solta: é a ARESTA objeto↔luz vista do lado do objeto. Alternar um vínculo cria
// o interruptor no PRIMEIRO vínculo (nome/descrição derivados do objeto), agrupa vínculos seguintes no mesmo objeto
// (circuito) e o DISSOLVE quando o último vínculo sai — a lista de interruptores é derivada, nunca se cria vazia.
export function alternaVinculoLuzInterruptorEditor3D(comandos: readonly ComandoEditor3D[], idElementoCena: string, nomeElemento: string, idFonte: string): ComandoEditor3D[] {
    const existente = comandos.find(comando => comando.idElementoCena === idElementoCena);
    if (existente === undefined) return [...comandos, criaComandoEditor3D(comandos, idElementoCena, nomeElemento, idFonte)];

    const idsFontesDeLuz = existente.idsFontesDeLuz.includes(idFonte) ? existente.idsFontesDeLuz.filter(id => id !== idFonte) : [...existente.idsFontesDeLuz, idFonte];
    if (idsFontesDeLuz.length === 0) return comandos.filter(comando => comando.idLocal !== existente.idLocal);

    return comandos.map(comando => comando.idLocal === existente.idLocal ? { ...comando, idsFontesDeLuz } : comando);
};

// "Definir interruptor" (o gesto armado) só ADICIONA: clicar num objeto que já aciona a luz não desfaz nada — remover
// vínculo é sempre ação explícita (o ◉ nos painéis). Devolve a MESMA referência quando nada muda, para o chamador não
// registrar histórico nem sujar o projeto à toa.
export function vinculaLuzInterruptorEditor3D(comandos: readonly ComandoEditor3D[], idElementoCena: string, nomeElemento: string, idFonte: string): readonly ComandoEditor3D[] {
    const existente = comandos.find(comando => comando.idElementoCena === idElementoCena);
    if (existente !== undefined && existente.idsFontesDeLuz.includes(idFonte)) return comandos;

    return alternaVinculoLuzInterruptorEditor3D(comandos, idElementoCena, nomeElemento, idFonte);
};

// Serialização: o corpo físico do comando é DERIVADO do bbox do elemento AGORA — assim mover o interruptor no Editor e salvar
// já regrava a posição que o runtime usa para validar alcance. Comando cujo elemento sumiu da cena é descartado.
export function serializaCamadaJogoEditor3D(camadaJogo: CamadaJogoEditor3D, cena: CenaCanonicaEditor3D): CamadaJogoMapa {
    const elementosPorId = new Map(elementosDoMapa(cena).map(elemento => [elemento.idLocal, elemento]));
    const idsFontesExistentes = new Set(camadaJogo.fontesDeLuz.map(fonte => fonte.idLocal));
    const comandos: ComandoMapa[] = [];

    for (const comando of camadaJogo.comandos) {
        const elemento = elementosPorId.get(comando.idElementoCena);
        const idsFontesDeLuz = comando.idsFontesDeLuz.filter(idFonte => idsFontesExistentes.has(idFonte));
        if (elemento === undefined || idsFontesDeLuz.length === 0) continue;

        comandos.push({
            idLocal: comando.idLocal,
            nome: comando.nome.trim().length > 0 ? comando.nome.trim() : elemento.nome,
            descricao: comando.descricao.trim().length > 0 ? comando.descricao.trim() : `${elemento.nome}. Aproxime-se para acionar.`,
            idElementoCena: comando.idElementoCena,
            idsFontesDeLuz,
            alcanceMilimetros: comando.alcanceMilimetros,
            posicao: { x: elemento.posicao.x, y: elemento.posicao.y },
            larguraMilimetros: elemento.larguraMilimetros,
            alturaMilimetros: elemento.alturaMilimetros,
            profundidadeMilimetros: elemento.profundidadeMilimetros,
        });
    }

    // `alternavel` do contrato é DERIVADO da fiação: luz é alternável ⟺ algum interruptor a aciona. Sem interruptor,
    // não há o que alternar — a luz vai fixa (sempre acesa em jogo).
    const idsAlternaveis = new Set(comandos.flatMap(comando => comando.idsFontesDeLuz));
    const fontesDeLuz: FonteDeLuzMapa[] = camadaJogo.fontesDeLuz.map(fonte => ({
        idLocal: fonte.idLocal,
        nome: fonte.nome.trim().length > 0 ? fonte.nome.trim() : fonte.idLocal,
        tipo: fonte.tipo,
        posicao: [fonte.posicao[0], fonte.posicao[1], fonte.posicao[2]],
        cor: corHexParaVetor3Editor3D(fonte.cor),
        intensidade: fonte.intensidade,
        alcanceMetros: fonte.alcanceMetros,
        alternavel: idsAlternaveis.has(fonte.idLocal),
    }));

    return { versao: 1, fontesDeLuz, comandos };
};

export function camadaJogoDoProjeto(camadaJogo: CamadaJogoMapa | null | undefined): CamadaJogoEditor3D {
    if (!camadaJogo) return CAMADA_JOGO_VAZIA_EDITOR3D;

    // O `alternavel` salvo não entra no estado do editor: ele é derivado dos vínculos e regravado a cada salvamento.
    // Intensidade (percentual) e alcance salvos entram clampados aos limites autoráveis.
    return {
        fontesDeLuz: camadaJogo.fontesDeLuz.map(fonte => ({ idLocal: fonte.idLocal, nome: fonte.nome, tipo: fonte.tipo, posicao: [fonte.posicao[0], fonte.posicao[1], fonte.posicao[2]], cor: vetor3ParaCorHexEditor3D(fonte.cor), intensidade: Math.min(fonte.intensidade, MAXIMO_INTENSIDADE_POR_TIPO_FONTE_EDITOR3D[fonte.tipo]), alcanceMetros: fonte.tipo === 'PONTO' ? Math.min(fonte.alcanceMetros, ALCANCE_MAXIMO_AUTORAVEL_METROS_EDITOR3D) : fonte.alcanceMetros })),
        comandos: camadaJogo.comandos.map(comando => ({ idLocal: comando.idLocal, nome: comando.nome, descricao: comando.descricao, idElementoCena: comando.idElementoCena, idsFontesDeLuz: [...comando.idsFontesDeLuz], alcanceMilimetros: comando.alcanceMilimetros })),
    };
};