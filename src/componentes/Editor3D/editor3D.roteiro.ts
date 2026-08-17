import { executaPassosRoteiroEditor3D } from './editor3D.operacoes';
import { serializaCenaCanonicaDeEstadoEditor3D } from './editor3D.projeto.serializacao';
import type { EstadoRoteiroEditor3D } from './editor3D.operacoes';
import type { CenaCanonicaEditor3D, GoldenRoteiroEditor3D, OperacaoRoteiroEditor3D, PassoRoteiroEditor3D } from 'types-nora-api';

// -------------------------------------------------------------------------------------------------------------------
// ROTEIRO — helpers PUROS de golden e validação. A aprovação e a validação usam SEMPRE a reexecução na camada de
// operações (nunca o estado vivo do editor): o golden reflete o que a camada produz, que é o que a validação compara.
// -------------------------------------------------------------------------------------------------------------------

export type ModoRoteiroEditor3D = 'MONTAGEM' | 'VISUALIZACAO';

export type ResultadoValidacaoRoteiroEditor3D =
    | { readonly desfecho: 'VALIDO' }
    | { readonly desfecho: 'DIVERGENTE'; readonly indicePasso: number }
    | { readonly desfecho: 'FALHOU'; readonly indicePasso: number; readonly motivo: string };

export function serializaEstadoRoteiroEditor3D(estado: EstadoRoteiroEditor3D): CenaCanonicaEditor3D {
    const entradas = estado.objetos.map(objeto => ({ id: objeto.id, nome: objeto.nome, tipo: objeto.tipo, cor: objeto.cor, materiaisExtras: objeto.materiaisExtras, idPeca: objeto.idPeca, malha: objeto.malha, subdivisao: objeto.subdivisao, espessura: objeto.espessura, transform: objeto.transformInicial, visivel: objeto.visivel }));
    return serializaCenaCanonicaDeEstadoEditor3D(entradas, 'PADRAO');
};

type JsonValorRoteiroEditor3D = string | number | boolean | null | undefined | readonly JsonValorRoteiroEditor3D[] | { readonly [chave: string]: JsonValorRoteiroEditor3D };

// Guarda própria: Array.isArray não estreita ReadonlyArray dentro de união — o predicado explícito resolve o narrowing.
function ehObjetoPlanoJsonRoteiroEditor3D(valor: JsonValorRoteiroEditor3D): valor is { readonly [chave: string]: JsonValorRoteiroEditor3D } {
    return valor !== null && valor !== undefined && typeof valor === 'object' && !Array.isArray(valor);
};

function ordenaChavesJsonRoteiroEditor3D(valor: JsonValorRoteiroEditor3D): JsonValorRoteiroEditor3D {
    if (!ehObjetoPlanoJsonRoteiroEditor3D(valor)) return valor;
    const ordenado: { [chave: string]: JsonValorRoteiroEditor3D } = {};
    for (const chave of Object.keys(valor).sort()) ordenado[chave] = valor[chave];
    return ordenado;
};

// JSON canônico (chaves ordenadas recursivamente): a comparação do golden é byte a byte, e o jsonb do Postgres não
// preserva a ordem de chaves do objeto original — canonizar os DOIS lados tira a ordem da equação sem afrouxar valores.
export function stringifyCanonicoRoteiroEditor3D(cena: CenaCanonicaEditor3D): string {
    return JSON.stringify(cena, (chave: string, valor: JsonValorRoteiroEditor3D) => ordenaChavesJsonRoteiroEditor3D(valor));
};

export type MontagemGoldenRoteiroEditor3D =
    | { readonly ok: true; readonly golden: GoldenRoteiroEditor3D }
    | { readonly ok: false; readonly indicePasso: number; readonly motivo: string };

export function montaGoldenRoteiroEditor3D(passos: readonly PassoRoteiroEditor3D[]): MontagemGoldenRoteiroEditor3D {
    const execucao = executaPassosRoteiroEditor3D(passos);
    if (execucao.falha !== null) return { ok: false, indicePasso: execucao.falha.indicePasso, motivo: execucao.falha.motivo };
    return { ok: true, golden: { versao: 1, estadosPorPasso: execucao.estados.map(serializaEstadoRoteiroEditor3D) } };
};

// Os três desfechos: completa e bate (VALIDO) / completa e diverge (DIVERGENTE, apontando o passo) / não completa
// (FALHOU — operação sumiu da camada ou recusou os parâmetros).
export function validaRoteiroContraGoldenEditor3D(passos: readonly PassoRoteiroEditor3D[], golden: GoldenRoteiroEditor3D): ResultadoValidacaoRoteiroEditor3D {
    const execucao = executaPassosRoteiroEditor3D(passos);
    if (execucao.falha !== null) return { desfecho: 'FALHOU', indicePasso: execucao.falha.indicePasso, motivo: execucao.falha.motivo };
    if (golden.estadosPorPasso.length !== execucao.estados.length) return { desfecho: 'DIVERGENTE', indicePasso: Math.min(golden.estadosPorPasso.length, execucao.estados.length) };
    for (let indice = 0; indice < execucao.estados.length; indice++) {
        if (stringifyCanonicoRoteiroEditor3D(serializaEstadoRoteiroEditor3D(execucao.estados[indice])) !== stringifyCanonicoRoteiroEditor3D(golden.estadosPorPasso[indice])) return { desfecho: 'DIVERGENTE', indicePasso: indice };
    }
    return { desfecho: 'VALIDO' };
};

// Coalescência de gravação: SÓ para operações de VALOR em rajada (color picker, digitação por eixo, slider) — a
// consecutiva do mesmo tipo sobre o mesmo alvo substitui o último passo pelo valor resultante (como na janela de
// coalescência do histórico). Criação e atribuição NUNCA coalescem: duas seguidas são passos distintos de verdade.
// O comentário do passo substituído é preservado.
export function acrescentaPassoComCoalescenciaRoteiroEditor3D(passos: readonly PassoRoteiroEditor3D[], operacao: OperacaoRoteiroEditor3D): readonly PassoRoteiroEditor3D[] {
    if ((operacao.tipo === 'DEFINIR_COR_BASE' || operacao.tipo === 'ESCALAR' || operacao.tipo === 'SOLIDIFICAR') && passos.length > 0) {
        const ultimo = passos[passos.length - 1];
        if ((ultimo.operacao.tipo === 'DEFINIR_COR_BASE' || ultimo.operacao.tipo === 'ESCALAR' || ultimo.operacao.tipo === 'SOLIDIFICAR') && ultimo.operacao.tipo === operacao.tipo && ultimo.operacao.idObjeto === operacao.idObjeto) return [...passos.slice(0, -1), { ...ultimo, operacao }];
    }
    return [...passos, { operacao }];
};