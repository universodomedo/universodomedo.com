// -------------------------------------------------------------------------------------------------------------------
// VERIFICAÇÃO DE COMPLETUDE DO VOCABULÁRIO (Programa Receita Única)
//
// Toda alteração de PRODUTO no Editor 3D — o que o desfazer/refazer reconhece — tem que nascer como operação do
// vocabulário, senão o roteiro fica cego para ela e ninguém percebe. Foi assim que o vocabulário ficou em 6 de 45
// sem ninguém notar.
//
// Esta verificação acusa todo ponto que muta estado de produto SEM passar pelo despacho de operação. Ela não testa
// comportamento (isso é o roteiro, que é dado): é uma checagem estrutural do código, como um lint.
//
// Ponto autorizado é o que muda estado de produto por um motivo que NÃO é "o usuário executou uma ação": repor uma
// cena inteira (abrir projeto, trocar de aba, desfazer) e repor o estado da reexecução de um roteiro. Cada exceção
// mora aqui com a justificativa — a lista é curta de propósito, e crescer nela deve doer.
// -------------------------------------------------------------------------------------------------------------------

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIRETORIO_EDITOR = 'src/componentes/Editor3D';

// Setters do estado que É produto (entra na cena canônica / no projeto salvo). Câmera de navegação, modos e seleção
// ficam de fora: mudam a vista, não o produto.
const SETTERS_DE_PRODUTO = ['setObjetos', 'setColecoes', 'setLuzes', 'setFiacao', 'setPecas', 'setCamera', 'setCapaArte', 'setCorpoPersonagem'];

// Dívida conhecida: quantos pontos ainda alteram produto fora do despacho. O comando NÃO falha por eles existirem —
// falharia todo dia até a migração terminar, e sinal sempre vermelho ninguém olha. Falha se o número SUBIR: aí alguém
// acrescentou mutação nova fora do vocabulário, e o roteiro nasceu cego para ela. Este número só desce; ao migrar um
// lote, baixe-o junto (a própria saída do comando diz o valor).
const DIVIDA_ESPERADA_VOCABULARIO = 30;

const PONTOS_AUTORIZADOS = {
    executaOperacaoNoEditor: 'É o despacho de operação — o caminho único pelo qual o produto muda por ação do usuário.',
    aplicaCenaAtiva: 'Reposição de cena inteira (abrir projeto, trocar de aba, desfazer/refazer): não é ação sobre o produto, é troca do produto inteiro.',
    aplicaCenaNova: 'Idem, com histórico zerado.',
    aplicaEstadoRoteiroNoEditor: 'Reposição do estado vindo da reexecução do roteiro (stepping): o produto é o resultado das operações, não de uma ação nova.',
};

function arquivosDoEditor() {
    return readdirSync(DIRETORIO_EDITOR).filter(nome => nome.endsWith('.tsx') || nome.endsWith('.ts')).map(nome => join(DIRETORIO_EDITOR, nome));
};

// Rastreia em qual função cada linha está: o editor declara handlers como `const nome = useCallback(` ou `function nome(`.
function funcaoDaLinha(linhas, indice) {
    for (let atual = indice; atual >= 0; atual--) {
        const declaracao = linhas[atual].match(/^\s*(?:const|function)\s+([A-Za-z0-9_]+)\s*(?::[^=]*)?=?\s*(?:useCallback|\(|async)/);
        if (declaracao) return declaracao[1];
    }

    return '(escopo de módulo)';
};

const achados = [];
for (const arquivo of arquivosDoEditor()) {
    const linhas = readFileSync(arquivo, 'utf8').split('\n');
    linhas.forEach((linha, indice) => {
        if (linha.trimStart().startsWith('//')) return;
        const setter = SETTERS_DE_PRODUTO.find(nome => linha.includes(`${nome}(`));
        if (setter === undefined) return;
        // A própria declaração do useState não é mutação.
        if (linha.includes(`, ${setter}]`) || linha.includes(`,${setter}]`)) return;
        const funcao = funcaoDaLinha(linhas, indice);
        if (funcao in PONTOS_AUTORIZADOS) return;
        achados.push({ arquivo, linha: indice + 1, funcao, setter });
    });
}

const porFuncao = new Map();
for (const achado of achados) {
    if (!porFuncao.has(achado.funcao)) porFuncao.set(achado.funcao, { linha: achado.linha, setters: new Set() });
    porFuncao.get(achado.funcao).setters.add(achado.setter);
}

console.log(`Vocabulário do Editor 3D — pontos que alteram produto fora do despacho de operação: ${porFuncao.size}`);
if (porFuncao.size > 0) {
    console.log('');
    for (const [funcao, info] of [...porFuncao.entries()].sort((a, b) => a[1].linha - b[1].linha)) {
        console.log(`  ${funcao} (linha ${info.linha}) — ${[...info.setters].join(', ')}`);
    }
    console.log('');
    console.log('Cada um destes precisa virar operação do vocabulário (registro em editor3D.operadores) ou entrar em');
    console.log('PONTOS_AUTORIZADOS deste script COM justificativa. Enquanto estiverem aqui, o roteiro é cego para eles.');
}

const dividaAumentou = porFuncao.size > DIVIDA_ESPERADA_VOCABULARIO;
if (dividaAumentou) {
    console.log('');
    console.log(`REGRESSÃO: a dívida subiu de ${DIVIDA_ESPERADA_VOCABULARIO} para ${porFuncao.size}. Alguma alteração de produto`);
    console.log('nasceu fora do vocabulário — o roteiro não a enxerga e ninguém seria avisado.');
} else if (porFuncao.size < DIVIDA_ESPERADA_VOCABULARIO) {
    console.log('');
    console.log(`A dívida caiu para ${porFuncao.size}: baixe DIVIDA_ESPERADA_VOCABULARIO neste script para travar o ganho.`);
}


// -------------------------------------------------------------------------------------------------------------------
// VERIFICAÇÃO DA FIAÇÃO — "o botão declarado realmente chega na operação?"
//
// A validação de roteiro responde "esta sequência de operações produz o mesmo resultado?" executando as operações.
// Ela NÃO enxerga o fio que liga o clique à operação: isso é fiação de interface, e vê-la exigiria abrir uma tela —
// justamente o que não pode ser exigido, porque o roteiro tem que ser validável sem interface e em qualquer device.
// Foi esse o furo que sobrou dos cenários do caso mínimo: cortando o despacho, o editor para de criar o cubo e a
// validação segue dizendo "válido".
//
// O que dá para provar sem tela é a LIGAÇÃO no código: o item de menu que declara uma operação dispara o handler, e o
// handler chega no despacho. É análise estática — não prova que o React renderizou nem que o clique chegou —, mas
// pega exatamente o caso real: alguém neutralizar o handler e ninguém notar.
//
// O que NÃO é coberto aqui continua sendo coberto por quem GRAVA um roteiro: com o fio cortado, o passo não aparece
// no painel na hora. Revalidar prova que a receita não mudou; regravar prova que a ferramenta ainda a entrega.
// -------------------------------------------------------------------------------------------------------------------

const LIGACOES_EXIGIDAS = [
    {
        descricao: 'Item de menu com `operacao` dispara o handler da barra',
        arquivo: join(DIRETORIO_EDITOR, 'BarraMenusEditor3D.tsx'),
        exige: [
            { padrao: /item\.operacao/, oQueProva: 'a barra lê a operação declarada no item' },
            { padrao: /onClick=\{\(\)\s*=>\s*acionaOperacao\(operacao\)\}/, oQueProva: 'o clique do item chama o acionador' },
            { padrao: /aoOperacao\(tipo\)/, oQueProva: 'o acionador repassa para a prop de despacho' },
        ],
    },
    {
        descricao: 'O editor liga a prop de despacho ao executor de operação',
        arquivo: join(DIRETORIO_EDITOR, 'Editor3D.tsx'),
        exige: [
            { padrao: /aoOperacao=\{aoOperacaoDoMenu\}/, oQueProva: 'a barra recebe o despachante do editor' },
            { padrao: /const aoOperacaoDoMenu[\s\S]{0,400}?executaOperacaoNoEditor\(/, oQueProva: 'o despachante chama o executor de operação' },
        ],
    },
];

const rompidas = [];
for (const ligacao of LIGACOES_EXIGIDAS) {
    const conteudo = readFileSync(ligacao.arquivo, 'utf8');
    for (const item of ligacao.exige) {
        if (!item.padrao.test(conteudo)) rompidas.push({ ligacao: ligacao.descricao, arquivo: ligacao.arquivo, oQueProva: item.oQueProva });
    }
}

console.log('');
console.log(`Fiação do menu — ligações rompidas: ${rompidas.length}`);
if (rompidas.length > 0) {
    console.log('');
    for (const rompida of rompidas) {
        console.log(`  ${rompida.arquivo}`);
        console.log(`    deixou de valer: ${rompida.oQueProva}`);
    }
    console.log('');
    console.log('Um item de menu que declara operação mas não chega ao despacho é um botão morto: a validação de');
    console.log('roteiro continuaria dizendo "válido" com o editor sem funcionar.');
}

// Falha por DEFEITO (fio rompido) ou por REGRESSÃO (dívida subiu) — nunca pela dívida existir.
process.exit(dividaAumentou || rompidas.length > 0 ? 1 : 0);
