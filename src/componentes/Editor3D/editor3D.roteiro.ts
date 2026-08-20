import { caminhoMenuDaOperacaoEditor3D, chaveCoalescenciaDaOperacaoEditor3D, executaPassosRoteiroEditor3D, operacaoNasceDeMenuEditor3D } from './editor3D.operacoes';
import { serializaCamadaJogoEditor3D } from './editor3D.camadaJogo';
import { serializaCenaCanonicaDeEstadoEditor3D } from './editor3D.projeto.serializacao';
import type { EstadoRoteiroEditor3D } from './editor3D.operacoes';
import type { CamadaJogoMapa, CenaCanonicaEditor3D, ColecaoRoteiroEditor3D, GoldenRoteiroEditor3D, OperacaoRoteiroEditor3D, PassoRoteiroEditor3D } from 'types-nora-api';

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

// A camada de jogo serializada usa a MESMA função do salvamento de projeto (posição do interruptor derivada do elemento
// da cena) — sem réplica, pelo mesmo motivo de todo o resto.
export function serializaCamadaJogoDoEstadoRoteiroEditor3D(estado: EstadoRoteiroEditor3D): CamadaJogoMapa {
    return serializaCamadaJogoEditor3D(estado.camadaJogo, serializaEstadoRoteiroEditor3D(estado));
};

// Coleções canônicas do estado: ordenadas por id (a ordem de exibição é da view; o produto é o conjunto).
export function serializaColecoesDoEstadoRoteiroEditor3D(estado: EstadoRoteiroEditor3D): readonly ColecaoRoteiroEditor3D[] {
    return [...estado.colecoes].sort((a, b) => a.id - b.id).map(colecao => ({ id: colecao.id, nome: colecao.nome, idsObjetos: colecao.idsObjetos, visivel: colecao.visivel }));
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

// A camada de jogo só entra no golden quando o roteiro realmente mexe em luz/fiação: roteiro de geometria pura grava o
// mesmo golden de antes desta ampliação, e golden aprovado antes dela continua válido sem regravação.
function camadaJogoVaziaRoteiroEditor3D(camada: CamadaJogoMapa): boolean {
    return camada.fontesDeLuz.length === 0 && camada.nosDistribuicao.length === 0 && camada.interruptores.length === 0;
};

export function montaGoldenRoteiroEditor3D(passos: readonly PassoRoteiroEditor3D[]): MontagemGoldenRoteiroEditor3D {
    const execucao = executaPassosRoteiroEditor3D(passos);
    if (execucao.falha !== null) return { ok: false, indicePasso: execucao.falha.indicePasso, motivo: execucao.falha.motivo };

    const estadosPorPasso = execucao.estados.map(serializaEstadoRoteiroEditor3D);
    const camadaJogoPorPasso = execucao.estados.map(serializaCamadaJogoDoEstadoRoteiroEditor3D);
    const colecoesPorPasso = execucao.estados.map(serializaColecoesDoEstadoRoteiroEditor3D);
    // Cada anexo do golden entra só quando o roteiro realmente o toca — o golden de sempre continua igual a si mesmo.
    const golden: { versao: 1; estadosPorPasso: typeof estadosPorPasso; camadaJogoPorPasso?: typeof camadaJogoPorPasso; colecoesPorPasso?: typeof colecoesPorPasso } = { versao: 1, estadosPorPasso };
    if (!camadaJogoPorPasso.every(camadaJogoVaziaRoteiroEditor3D)) golden.camadaJogoPorPasso = camadaJogoPorPasso;
    if (!colecoesPorPasso.every(colecoes => colecoes.length === 0)) golden.colecoesPorPasso = colecoesPorPasso;

    return { ok: true, golden };
};

// -------------------------------------------------------------------------------------------------------------------
// VALIDAÇÃO POR ETAPA — cada passo responde por si (especificação do Caio): "aplicar a operação atual sobre a malha de
// ENTRADA gravada tem que produzir EXATAMENTE a malha de SAÍDA gravada". Como o golden guarda o estado APÓS cada passo,
// a entrada gravada da etapa i é golden[i-1] (e o estado inicial vazio para a primeira).
//
// A etapa só é um teste legítimo quando a entrada REAL bate com a entrada GRAVADA — aí comparar a saída isola de fato
// aquela operação. Quando a entrada já vem diferente (uma etapa anterior regrediu), a etapa é declarada CONTAMINADA em
// vez de acusada: culpar quem herdou lixo é ruído, e some a informação de quem realmente quebrou.
// Limite honesto: depois de uma quebra, as etapas seguintes não têm como ser avaliadas — a entrada gravada é uma cena
// canônica (lossy: cor vira vetor, contador não é serializado), não um estado reconstruível. Avaliá-las exigiria o
// golden guardar estado reidratável, o que muda o contrato — decisão em aberto.
// -------------------------------------------------------------------------------------------------------------------

export type DesfechoEtapaRoteiroEditor3D =
    // A entrada bateu e a saída bateu: a operação continua produzindo exatamente o resultado aprovado.
    | 'CONFERE'
    // A entrada bateu e a saída NÃO bateu: esta operação regrediu. É a culpada.
    | 'REGREDIU'
    // A operação não executou (sumiu da camada, recusou parâmetros) ou perdeu a afordância na interface.
    | 'NAO_EXECUTOU'
    // Uma etapa anterior quebrou: esta partiu de entrada diferente da gravada e não pôde ser avaliada.
    | 'CONTAMINADA';

export type EtapaValidadaRoteiroEditor3D = {
    readonly indice: number;
    readonly desfecho: DesfechoEtapaRoteiroEditor3D;
    readonly motivo: string | null;
};

export type RelatorioValidacaoRoteiroEditor3D = {
    readonly resultado: ResultadoValidacaoRoteiroEditor3D;
    readonly etapas: readonly EtapaValidadaRoteiroEditor3D[];
};

// O canônico comparado abraça o PRODUTO inteiro: cena (geometria e material) e camada de jogo (luz, distribuição,
// interruptores). A camada só entra quando o golden a tem — golden aprovado antes desta ampliação compara só a cena,
// exatamente como quando foi gravado, e segue válido.
function canonicoDoEstadoRoteiroEditor3D(estado: EstadoRoteiroEditor3D, comCamadaJogo: boolean, comColecoes: boolean): string {
    const partes = [stringifyCanonicoRoteiroEditor3D(serializaEstadoRoteiroEditor3D(estado))];
    if (comCamadaJogo) partes.push(stringifyCanonicoRoteiroEditor3D(serializaCamadaJogoDoEstadoRoteiroEditor3D(estado) as unknown as CenaCanonicaEditor3D));
    if (comColecoes) partes.push(stringifyCanonicoRoteiroEditor3D(serializaColecoesDoEstadoRoteiroEditor3D(estado) as unknown as CenaCanonicaEditor3D));

    return partes.join('|');
};

function canonicoDoGoldenRoteiroEditor3D(golden: GoldenRoteiroEditor3D, indice: number, comCamadaJogo: boolean, comColecoes: boolean): string {
    const partes = [stringifyCanonicoRoteiroEditor3D(golden.estadosPorPasso[indice])];
    if (comCamadaJogo) partes.push(stringifyCanonicoRoteiroEditor3D((golden.camadaJogoPorPasso ?? [])[indice] as unknown as CenaCanonicaEditor3D));
    if (comColecoes) partes.push(stringifyCanonicoRoteiroEditor3D((golden.colecoesPorPasso ?? [])[indice] as unknown as CenaCanonicaEditor3D));

    return partes.join('|');
};

// Fonte ÚNICA da validação: o desfecho do roteiro inteiro é derivado deste relatório (não há segunda travessia).
export function relatorioValidacaoRoteiroEditor3D(passos: readonly PassoRoteiroEditor3D[], golden: GoldenRoteiroEditor3D): RelatorioValidacaoRoteiroEditor3D {
    const execucao = executaPassosRoteiroEditor3D(passos);
    // Golden com camada de jogo (ou coleções) cobra o anexo; golden sem ele compara só a cena, como no dia em que foi gravado.
    const comCamadaJogo = golden.camadaJogoPorPasso !== undefined;
    const comColecoes = golden.colecoesPorPasso !== undefined;
    const etapas: EtapaValidadaRoteiroEditor3D[] = [];
    // Enquanto verdadeiro, o executado ainda é idêntico ao gravado — só aí a etapa é avaliável isoladamente.
    let cadeiaIntegra = true;
    let primeiroProblema: { indice: number; desfecho: DesfechoEtapaRoteiroEditor3D; motivo: string | null } | null = null;

    for (let indice = 0; indice < passos.length; indice++) {
        const tipo = passos[indice].operacao.tipo;
        // Só quem nasce de menu tem porta a conferir: o passo era alcançável quando foi gravado (o golden prova), então
        // a entrada ter sumido do menu significa que a operação deixou de ser executável por um humano.
        const semAfordancia = operacaoNasceDeMenuEditor3D(tipo) && caminhoMenuDaOperacaoEditor3D(tipo) === null;
        const falhouAqui = execucao.falha !== null && execucao.falha.indicePasso === indice;
        const naoExecutou = semAfordancia || falhouAqui;

        if (!cadeiaIntegra && !naoExecutou) { etapas.push({ indice, desfecho: 'CONTAMINADA', motivo: 'Etapa anterior regrediu: a entrada desta etapa já veio diferente do resultado aprovado' }); continue; }

        if (naoExecutou) {
            const motivo = semAfordancia
                ? `Operação ${tipo} sem entrada no menu do editor: o passo deixou de ser alcançável pela interface`
                : (execucao.falha?.motivo ?? 'Operação não executou');
            etapas.push({ indice, desfecho: 'NAO_EXECUTOU', motivo });
            if (primeiroProblema === null) primeiroProblema = { indice, desfecho: 'NAO_EXECUTOU', motivo };
            cadeiaIntegra = false;
            continue;
        }

        const executado = execucao.estados[indice];
        const gravado = golden.estadosPorPasso[indice];
        // Passo sem saída gravada: o golden é de uma sequência mais curta — o roteiro cresceu sem reaprovar.
        if (executado === undefined || gravado === undefined) {
            const motivo = 'Passo sem resultado aprovado correspondente (o roteiro mudou de tamanho desde a aprovação)';
            etapas.push({ indice, desfecho: 'REGREDIU', motivo });
            if (primeiroProblema === null) primeiroProblema = { indice, desfecho: 'REGREDIU', motivo };
            cadeiaIntegra = false;
            continue;
        }

        if (canonicoDoEstadoRoteiroEditor3D(executado, comCamadaJogo, comColecoes) === canonicoDoGoldenRoteiroEditor3D(golden, indice, comCamadaJogo, comColecoes)) { etapas.push({ indice, desfecho: 'CONFERE', motivo: null }); continue; }

        const motivo = 'Aplicar esta operação sobre a entrada aprovada produziu um resultado diferente do aprovado';
        etapas.push({ indice, desfecho: 'REGREDIU', motivo });
        if (primeiroProblema === null) primeiroProblema = { indice, desfecho: 'REGREDIU', motivo };
        cadeiaIntegra = false;
    }

    // Golden com MAIS estados que passos: a sequência encolheu sem reaprovar — divergência no primeiro passo ausente.
    if (primeiroProblema === null && golden.estadosPorPasso.length !== passos.length) return { resultado: { desfecho: 'DIVERGENTE', indicePasso: Math.min(golden.estadosPorPasso.length, passos.length) }, etapas };
    if (primeiroProblema === null) return { resultado: { desfecho: 'VALIDO' }, etapas };
    if (primeiroProblema.desfecho === 'NAO_EXECUTOU') return { resultado: { desfecho: 'FALHOU', indicePasso: primeiroProblema.indice, motivo: primeiroProblema.motivo ?? 'Operação não executou' }, etapas };
    return { resultado: { desfecho: 'DIVERGENTE', indicePasso: primeiroProblema.indice }, etapas };
};

// Os três desfechos do roteiro inteiro: completa e bate (VALIDO) / completa e diverge (DIVERGENTE, apontando o passo) /
// não completa (FALHOU). Derivado do relatório por etapa — uma travessia só, um veredito só.
export function validaRoteiroContraGoldenEditor3D(passos: readonly PassoRoteiroEditor3D[], golden: GoldenRoteiroEditor3D): ResultadoValidacaoRoteiroEditor3D {
    return relatorioValidacaoRoteiroEditor3D(passos, golden).resultado;
};

// Coalescência de gravação: quem decide é o OPERADOR (chaveCoalescencia declarada no registro) — operações de VALOR
// em rajada (color picker, digitação por eixo, slider) substituem o último passo do mesmo tipo sobre o mesmo alvo.
// Criação e atribuição não declaram chave e nunca coalescem. O comentário do passo substituído é preservado.
export function acrescentaPassoComCoalescenciaRoteiroEditor3D(passos: readonly PassoRoteiroEditor3D[], operacao: OperacaoRoteiroEditor3D): readonly PassoRoteiroEditor3D[] {
    const chave = chaveCoalescenciaDaOperacaoEditor3D(operacao);
    if (chave !== null && passos.length > 0) {
        const ultimo = passos[passos.length - 1];
        if (ultimo.operacao.tipo === operacao.tipo && chaveCoalescenciaDaOperacaoEditor3D(ultimo.operacao) === chave) return [...passos.slice(0, -1), { ...ultimo, operacao }];
    }

    return [...passos, { operacao }];
};