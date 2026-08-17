import type { CamadaJogoMapa, CamadaJogoMapaLegadoV1, CamadaJogoMapaPersistida, CorrenteMapa, FonteDeLuzMapa, IntermitenciaCorrenteMapa, InterruptorMapa, NoDistribuicaoMapa } from 'types-nora-api';

// CORRENTE da distribuição elétrica do mapa — avaliação DETERMINÍSTICA no tempo. A intermitência autorada é um cronograma
// derivado por função pura de (id do nó, âncora, instante): todos os clientes computam as MESMAS janelas de queda no mesmo
// instante — a piscada nunca trafega pela rede. O servidor usa a mesma regra quando a visão precisar (mesma âncora, vinda
// da Sala). Editor e jogo consomem ESTE módulo — autoria e Partida nunca divergem.

// Nó do caminho raiz→luz já resolvido para avaliação: corrente autorada + gate desligado (estado da Sala ou preview do editor).
export type NoCorrenteAvaliacao = {
    readonly idLocal: string;
    readonly corrente: CorrenteMapa;
    readonly desligado: boolean;
};

// FNV-1a 32 bits: semente estável e barata por (nó, ciclo, âncora) — sem Math.random, sem estado global.
function hashTextoDeterministico(texto: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < texto.length; i++) {
        hash ^= texto.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
};

// mulberry32: PRNG determinístico minúsculo — o suficiente para sortear durações dentro das faixas autoradas.
function criaAleatorioDeterministico(semente: number): () => number {
    let estado = semente >>> 0;
    return () => {
        estado = (estado + 0x6D2B79F5) >>> 0;
        let t = estado;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

function sorteiaNaFaixa(aleatorio: () => number, minimo: number, maximo: number): number {
    return minimo + (maximo - minimo) * aleatorio();
};

// BARALHO de padrões (shuffle bag): os ciclos são agrupados em MÃOS de N ciclos (N = padrões ativos); cada mão é uma
// permutação embaralhada dos padrões, consumida um por ciclo. Garante que numa mão TODOS os padrões aparecem, nenhum
// repete — sorteio independente repetia o mesmo padrão várias crises seguidas e "matava" a mescla percebida. A mão é
// determinística (semente por nó + índice da mão + âncora): todo cliente embaralha igual.
function sorteiaPadraoNoBaralho(idNo: string, totalPadroes: number, indiceCiclo: number, ancoraEpochMs: number): number {
    if (totalPadroes <= 1) return 0;
    const indiceMao = Math.floor(indiceCiclo / totalPadroes);
    const aleatorioMao = criaAleatorioDeterministico(hashTextoDeterministico(`${idNo}#MAO${indiceMao}#${ancoraEpochMs}`));
    const ordem = Array.from({ length: totalPadroes }, (_, posicao) => posicao);
    for (let i = ordem.length - 1; i > 0; i--) {
        const j = Math.floor(aleatorioMao() * (i + 1));
        [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
    }
    return ordem[indiceCiclo % totalPadroes];
};

// O cronograma trabalha numa GRADE FIXA por nó: o passo é o MÁXIMO da faixa de ciclo, então o ciclo que contém um instante
// sai por DIVISÃO — O(1), imune à distância da âncora. (A versão cumulativa — somar durações ciclo a ciclo desde a âncora —
// congelava a aba: âncora antiga exigia andar milhões de ciclos até o presente. Nunca voltar a ela.)
// Em cada passo acontece UMA CRISE: um dos PADRÕES autorados é sorteado (vários padrões se mesclam aleatoriamente ao
// longo do tempo) e resolvido como RAJADA — N flicks encadeados com pausas acesas entre eles — posicionada dentro da
// janela ativa sorteada do ciclo; o resto do passo é normalidade. Cada avaliação re-deriva a MESMA sequência de sorteios
// da semente (nó + índice do passo + âncora): puro, sem estado, igual em todo cliente. Tudo em MS, como o contrato.
export function correnteEstaEmQuedaNoInstante(idNo: string, intermitencia: IntermitenciaCorrenteMapa | null, ancoraEpochMs: number, instanteEpochMs: number): boolean {
    if (intermitencia === null || instanteEpochMs < ancoraEpochMs) return false;

    // Só padrões ATIVOS entram no sorteio; o inativo fica gravado, fora da mescla. Nenhum ativo = corrente contínua.
    const padroes = intermitencia.padroes.filter(padrao => padrao.ativo);
    if (padroes.length === 0) return false;

    const passoMs = intermitencia.cicloMs.maximo;
    if (passoMs <= 0) return false;

    const indice = Math.floor((instanteEpochMs - ancoraEpochMs) / passoMs);
    const inicioPassoMs = ancoraEpochMs + indice * passoMs;
    const aleatorio = criaAleatorioDeterministico(hashTextoDeterministico(`${idNo}#${indice}#${ancoraEpochMs}`));
    const janelaAtivaMs = sorteiaNaFaixa(aleatorio, intermitencia.cicloMs.minimo, intermitencia.cicloMs.maximo);
    const padrao = padroes[sorteiaPadraoNoBaralho(idNo, padroes.length, indice, ancoraEpochMs)];

    // Resolve a rajada inteira ANTES de posicioná-la: a duração total define onde a crise cabe na janela ativa.
    const totalFlicks = Math.max(1, Math.round(sorteiaNaFaixa(aleatorio, padrao.flicks.minimo, padrao.flicks.maximo)));
    const duracoesMs: number[] = [];
    const pausasMs: number[] = [];
    let duracaoCriseMs = 0;
    for (let i = 0; i < totalFlicks; i++) {
        const duracaoMs = sorteiaNaFaixa(aleatorio, padrao.duracaoFlickMs.minimo, padrao.duracaoFlickMs.maximo);
        duracoesMs.push(duracaoMs);
        duracaoCriseMs += duracaoMs;
        if (i < totalFlicks - 1) {
            const pausaMs = sorteiaNaFaixa(aleatorio, padrao.intervaloEntreFlicksMs.minimo, padrao.intervaloEntreFlicksMs.maximo);
            pausasMs.push(pausaMs);
            duracaoCriseMs += pausaMs;
        }
    }
    // ENVELOPE da rajada: as mesmas pausas sorteadas, ORDENADAS crescentes — a rajada começa densa e vai morrendo
    // (tick-tick—tick——tick), como contato de relé assentando. Pausas independentes soam "embaralhadas", não físicas;
    // ordenar preserva a distribuição autorada (mesmos valores) e dá o decaimento que o ouvido/olho espera.
    pausasMs.sort((a, b) => a - b);

    // Posição da crise na janela com densidade em U (viés para as BORDAS): crise no fim de um passo e no começo do
    // seguinte = duas quase coladas; nas outras vezes, bem afastadas. Uniforme raramente produz extremos e o intervalo
    // entre crises fica "morno", quase periódico — o U cria o cluster-e-silêncio dos fenômenos reais sem mudar a média.
    const posicaoNaJanela = Math.sin(aleatorio() * Math.PI / 2) ** 2;
    let cursorMs = inicioPassoMs + posicaoNaJanela * Math.max(0, janelaAtivaMs - duracaoCriseMs);
    for (let i = 0; i < totalFlicks; i++) {
        if (instanteEpochMs >= cursorMs && instanteEpochMs < cursorMs + duracoesMs[i]) return true;
        cursorMs += duracoesMs[i] + (i < totalFlicks - 1 ? pausasMs[i] : 0);
    }
    return false;
};

// Fator (0..1) que chega ao fim de um caminho raiz→luz no instante: gate desligado ou queda em QUALQUER nó corta; os níveis
// percentuais MULTIPLICAM. É a regra única de composição do domínio — a mesma no editor, no jogo e no servidor.
export function fatorCorrenteCaminhoNoInstante(caminho: readonly NoCorrenteAvaliacao[], ancoraEpochMs: number, instanteEpochMs: number): number {
    let fator = 1;
    for (const no of caminho) {
        if (no.desligado) return 0;
        if (correnteEstaEmQuedaNoInstante(no.idLocal, no.corrente.intermitencia, ancoraEpochMs, instanteEpochMs)) return 0;
        fator *= Math.min(100, Math.max(0, no.corrente.nivelPercentual)) / 100;
    }
    return fator;
};

// O caminho tem intermitência? Sem ela o fator é constante — quem renderiza pode pular a reavaliação por frame.
export function caminhoCorrenteTemIntermitencia(caminho: readonly NoCorrenteAvaliacao[]): boolean {
    return caminho.some(no => no.corrente.intermitencia !== null);
};

// A camada GRAVADA pode ser v1 (fiação booleana, legado) ou v2 (árvore): o front consome SEMPRE v2 — migra na leitura,
// ESPELHANDO o normalizador do runtime da Partida na Nora-Api: mesmos componentes conexos e MESMOS ids derivados
// (NO_CIRCUITO:/NO_ENTREGA:) — enquanto o projeto não for re-salvo, os gates que a Sala emite em `nosDesligados` apontam
// os nós que o servidor derivou, e o cliente precisa derivar exatamente os mesmos. Nunca regrava.
export function normalizaCamadaJogoMapaPersistidaMapa(camada: CamadaJogoMapaPersistida | null | undefined): CamadaJogoMapa | null {
    if (!camada) return null;

    return camada.versao === 2 ? camada : migraCamadaJogoMapaV1(camada);
};

function migraCamadaJogoMapaV1(camada: CamadaJogoMapaLegadoV1): CamadaJogoMapa {
    const circuitoPorComando = new Map<string, string>();
    const circuitoPorFonte = new Map<string, string>();
    const nomePorCircuito = new Map<string, string>();

    for (const comando of camada.comandos) {
        const circuitosDasFontes = [...new Set(comando.idsFontesDeLuz.map(idFonte => circuitoPorFonte.get(idFonte)).filter((id): id is string => id !== undefined))];
        const idCircuito = circuitosDasFontes[0] ?? `NO_CIRCUITO:${comando.idLocal}`;
        if (!nomePorCircuito.has(idCircuito)) nomePorCircuito.set(idCircuito, comando.nome);
        for (const idOutro of circuitosDasFontes.slice(1)) {
            for (const [idFonte, id] of circuitoPorFonte) if (id === idOutro) circuitoPorFonte.set(idFonte, idCircuito);
            for (const [idComando, id] of circuitoPorComando) if (id === idOutro) circuitoPorComando.set(idComando, idCircuito);
        }
        circuitoPorComando.set(comando.idLocal, idCircuito);
        for (const idFonte of comando.idsFontesDeLuz) circuitoPorFonte.set(idFonte, idCircuito);
    }

    const nosCircuito: NoDistribuicaoMapa[] = [...new Set(circuitoPorComando.values())].map(idCircuito => ({ idLocal: idCircuito, nome: nomePorCircuito.get(idCircuito) ?? 'Circuito', idNoPai: null, corrente: { nivelPercentual: 100, intermitencia: null }, ligadoInicialmente: true, idFonteDeLuz: null }));
    const nosEntrega: NoDistribuicaoMapa[] = camada.fontesDeLuz.map(fonte => ({ idLocal: `NO_ENTREGA:${fonte.idLocal}`, nome: fonte.nome, idNoPai: circuitoPorFonte.get(fonte.idLocal) ?? null, corrente: { nivelPercentual: 100, intermitencia: null }, ligadoInicialmente: true, idFonteDeLuz: fonte.idLocal }));
    const interruptores: InterruptorMapa[] = camada.comandos.map(comando => ({ idLocal: comando.idLocal, nome: comando.nome, descricao: comando.descricao, idElementoCena: comando.idElementoCena, idNo: circuitoPorComando.get(comando.idLocal) ?? `NO_CIRCUITO:${comando.idLocal}`, alcanceMilimetros: comando.alcanceMilimetros, posicao: comando.posicao, larguraMilimetros: comando.larguraMilimetros, alturaMilimetros: comando.alturaMilimetros, profundidadeMilimetros: comando.profundidadeMilimetros }));
    // `alternavel` era derivado e morreu com a v1: na árvore, quem alterna é o gate do nó — a fonte só reflete.
    const fontesDeLuz: FonteDeLuzMapa[] = camada.fontesDeLuz.map(fonte => ({ idLocal: fonte.idLocal, nome: fonte.nome, tipo: fonte.tipo, posicao: fonte.posicao, cor: fonte.cor, intensidade: fonte.intensidade, alcanceMetros: fonte.alcanceMetros }));

    return { versao: 2, fontesDeLuz, nosDistribuicao: [...nosCircuito, ...nosEntrega], interruptores };
};

// Resolve a ÁRVORE do contrato em caminhos por fonte de luz (entrega → ... → raiz), com o estado dos gates da Sala
// (`nosDesligados`) já aplicado. Luz sem nó de entrega cai em caminho vazio — fator 1, sempre energizada (defensivo;
// o Editor sempre grava a entrega). O laço se protege de ciclo por visitados — o validador já os recusa na gravação.
export function caminhosCorrentePorFonteMapa(nosDistribuicao: readonly NoDistribuicaoMapa[], nosDesligados: readonly string[]): ReadonlyMap<string, readonly NoCorrenteAvaliacao[]> {
    const nosPorId = new Map(nosDistribuicao.map(no => [no.idLocal, no]));
    const desligados = new Set(nosDesligados);
    const caminhos = new Map<string, readonly NoCorrenteAvaliacao[]>();
    for (const no of nosDistribuicao) {
        if (no.idFonteDeLuz === null) continue;
        const caminho: NoCorrenteAvaliacao[] = [];
        const visitados = new Set<string>();
        let atual: NoDistribuicaoMapa | undefined = no;
        while (atual !== undefined && !visitados.has(atual.idLocal)) {
            visitados.add(atual.idLocal);
            caminho.push({ idLocal: atual.idLocal, corrente: atual.corrente, desligado: desligados.has(atual.idLocal) });
            atual = atual.idNoPai === null ? undefined : nosPorId.get(atual.idNoPai);
        }
        caminhos.set(no.idFonteDeLuz, caminho);
    }
    return caminhos;
};