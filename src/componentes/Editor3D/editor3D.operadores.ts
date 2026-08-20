import { matrizDoTransformEditor3D, transformAssentadoNoEstadoEditor3D } from './editor3D.assentamento';
import { aplicaTransformNaMalha, chanframaAresta, cortaAnelAresta, criaMalhaCilindro, criaMalhaCubo, criaMalhaEsfera, espelhaMalhaX, excluiFacesDaMalha, excluiVerticesDaMalha, extrudaFace, fundeVerticesDaMalha, insetaFacesDaMalha, MAXIMO_SUBDIVISAO_MALHA_EDITOR3D } from './editor3D.malha';
import { CAMADA_JOGO_VAZIA_EDITOR3D, criaFonteDeLuzEditor3D, removeInterruptorEditor3D, removeLuzDoCircuitoEditor3D, sanitizaCorrenteEditor3D, vinculaLuzInterruptorEditor3D, type CamadaJogoEditor3D, type CircuitoEditor3D, type FonteDeLuzEditor3D, type InterruptorEditor3D } from './editor3D.camadaJogo';
import { COR_OBJETO_PADRAO_EDITOR3D } from './editor3D.projeto.serializacao';
import { ESQUEMA_OPERACOES_EDITOR3D } from 'types-nora-api';
import type { MalhaEditavelLocal, Vetor3Malha } from './editor3D.malha';
import type { TipoPrimitivaEditor3D, TransformEditor3D } from './editor3D.projeto.serializacao';
import type { ObjetoEditor3D } from './Editor3D';
import type { ColecaoRoteiroEditor3D, OperacaoRoteiroEditor3D } from 'types-nora-api';

// -------------------------------------------------------------------------------------------------------------------
// REGISTRO DE OPERADORES — a API única do Editor 3D, no modelo do `bpy.types.Operator` do Blender: um operador declara
// num lugar só o seu rótulo, se pode rodar agora e o que faz. Quem invoca — clique de menu, botão de painel, atalho ou
// a reexecução de um roteiro sem tela — chama SEMPRE esta mesma definição. Não existe caminho paralelo.
//
// Correspondência com o Blender, para quem for mexer aqui:
//   bl_idname  → a chave do registro (o `tipo` da operação, declarado no ESQUEMA_OPERACOES_EDITOR3D do Nora-Api)
//   bl_label   → `rotulo` (serve ao item de menu e ao passo do roteiro)
//   bpy.props  → os parâmetros do esquema (uma declaração que vira tipo + validação do backend)
//   poll()     → `disponivel` (a pergunta "esta etapa é realizável agora?")
//   execute()  → `executa` (a implementação, pura: estado + operação → estado)
//
// O registro é EXAUSTIVO por construção: seu tipo exige uma entrada para cada operação do esquema, então declarar uma
// operação nova sem implementá-la (ou implementar uma que não existe no vocabulário) é erro de compilação.
// -------------------------------------------------------------------------------------------------------------------

export type TipoOperacaoEditor3D = keyof typeof ESQUEMA_OPERACOES_EDITOR3D;

// Estado puro da execução: o subconjunto da cena que o vocabulário manipula. `contadorObjetos` espelha a regra do
// contadorRef do editor (incrementa a cada criação, NUNCA reusa id) — é o que mantém os ids do roteiro determinísticos.
export type EstadoRoteiroEditor3D = {
    readonly objetos: readonly ObjetoEditor3D[];
    readonly contadorObjetos: number;
    // Camada de JOGO (luz, distribuição, interruptores). A cena canônica é só geometria e material, então sem ela um
    // roteiro de MAPA compararia metade do resultado — dá para quebrar a iluminação inteira sem a validação notar.
    readonly camadaJogo: CamadaJogoEditor3D;
    // Coleções DO USUÁRIO (pastas da árvore). Não persistem no projeto salvo, mas são produto do gesto (entram no
    // undo) — então o roteiro as executa e o golden as compara. Contador próprio, mesma regra do de objetos.
    readonly colecoes: readonly ColecaoRoteiroEditor3D[];
    readonly contadorColecoes: number;
};

export const ESTADO_INICIAL_ROTEIRO_EDITOR3D: EstadoRoteiroEditor3D = { objetos: [], contadorObjetos: 0, camadaJogo: CAMADA_JOGO_VAZIA_EDITOR3D, colecoes: [], contadorColecoes: 0 };

export type ResultadoOperacaoRoteiroEditor3D = { readonly ok: true; readonly estado: EstadoRoteiroEditor3D } | { readonly ok: false; readonly motivo: string };

type OperacaoDoTipoEditor3D<TTipo extends TipoOperacaoEditor3D> = Extract<OperacaoRoteiroEditor3D, { tipo: TTipo }>;

// Por onde a operação é invocada na interface. É declaração do OPERADOR (não do menu): é ela que permite afirmar
// "esta operação deveria ter uma entrada de menu" e, portanto, acusar quando a entrada some. Operações de PAINEL
// nascem de campos/botões do inspetor ou de gestos no viewport e não têm porta de menu a conferir.
type AfordanciaOperadorEditor3D = 'MENU' | 'PAINEL';

type OperadorEditor3D<TTipo extends TipoOperacaoEditor3D> = {
    // OPCIONAL: sem ele o rótulo é INFERIDO do tipo e do alvo ("Definir luz (LUZ_1)"). Declare só quando a frase
    // genérica não basta — operação nova não exige texto à mão.
    readonly rotulo?: (operacao: OperacaoDoTipoEditor3D<TTipo>, estadoAntes: EstadoRoteiroEditor3D) => string;
    // OPCIONAL: default PAINEL. Declare MENU quando a operação nasce de item de menu (é o que permite acusar a
    // porta que sumiu).
    readonly afordancia?: AfordanciaOperadorEditor3D;
    // OPCIONAL: operações de VALOR em rajada (slider, digitação por eixo) declaram a chave do alvo — passos
    // consecutivos do mesmo tipo com a mesma chave coalescem num só, como no histórico.
    readonly chaveCoalescencia?: (operacao: OperacaoDoTipoEditor3D<TTipo>) => string;
    readonly executa: (estado: EstadoRoteiroEditor3D, operacao: OperacaoDoTipoEditor3D<TTipo>) => ResultadoOperacaoRoteiroEditor3D;
};

export function operacaoNasceDeMenuEditor3D(tipo: TipoOperacaoEditor3D): boolean {
    return (OPERADORES_EDITOR3D[tipo].afordancia ?? 'PAINEL') === 'MENU';
};

export function chaveCoalescenciaDaOperacaoEditor3D(operacao: OperacaoRoteiroEditor3D): string | null {
    const operador = OPERADORES_EDITOR3D[operacao.tipo] as OperadorEditor3D<TipoOperacaoEditor3D> | undefined;
    const chave = operador?.chaveCoalescencia;

    return chave === undefined ? null : chave(operacao);
};

// -------------------------------------------------------------------------------------------------------------------
// Nascimento de primitiva — fonte ÚNICA do nome, da malha e do transform inicial. A TELA importa daqui: trocar "Cubo"
// por "Caixa" muda os dois lados de uma vez, por construção.
// -------------------------------------------------------------------------------------------------------------------

const ROTULO_PRIMITIVA_EDITOR3D: Record<TipoPrimitivaEditor3D, string> = { CUBO: 'Cubo', CILINDRO: 'Cilindro', ESFERA: 'Esfera' };

export function rotuloTipoPrimitivaEditor3D(tipo: TipoPrimitivaEditor3D): string { return ROTULO_PRIMITIVA_EDITOR3D[tipo]; };

export function criaMalhaPrimitivaEditor3D(tipo: TipoPrimitivaEditor3D, segmentos = 24): MalhaEditavelLocal {
    return tipo === 'CUBO' ? criaMalhaCubo() : tipo === 'CILINDRO' ? criaMalhaCilindro(segmentos) : criaMalhaEsfera(segmentos);
};

function objetoDaOperacaoEditor3D(estado: EstadoRoteiroEditor3D, idObjeto: number): ObjetoEditor3D | null {
    return estado.objetos.find(objeto => objeto.id === idObjeto) ?? null;
};

function nomeDoAlvoEditor3D(estadoAntes: EstadoRoteiroEditor3D, idObjeto: number): string {
    const objeto = objetoDaOperacaoEditor3D(estadoAntes, idObjeto);
    return objeto === null ? `objeto ${idObjeto}` : `"${objeto.nome}"`;
};

// Aplica uma mudança a UM objeto do estado, preservando o resto. Recusa se o alvo não existe — a recusa é o que faz a
// validação acusar "não executou" em vez de seguir com uma cena errada.
function alteraObjetoEditor3D(estado: EstadoRoteiroEditor3D, idObjeto: number, altera: (objeto: ObjetoEditor3D) => ObjetoEditor3D | { readonly recusa: string }): ResultadoOperacaoRoteiroEditor3D {
    const objeto = objetoDaOperacaoEditor3D(estado, idObjeto);
    if (objeto === null) return { ok: false, motivo: `Objeto ${idObjeto} não existe na cena` };

    const alterado = altera(objeto);
    if ('recusa' in alterado) return { ok: false, motivo: alterado.recusa };

    return { ok: true, estado: { ...estado, objetos: estado.objetos.map(atual => atual.id === idObjeto ? alterado : atual) } };
};

// Objeto novo nasce na ORIGEM do mundo (0,0,0), como no Blender — sem escalonamento anti-sobreposição; o assentamento
// em camadas ajusta o Z (base no apoio).
function acrescentaPrimitivaEditor3D(estado: EstadoRoteiroEditor3D, tipo: TipoPrimitivaEditor3D): ResultadoOperacaoRoteiroEditor3D {
    const id = estado.contadorObjetos + 1;
    const nascente: ObjetoEditor3D = { id, tipo, nome: `${rotuloTipoPrimitivaEditor3D(tipo)} ${id}`, cor: COR_OBJETO_PADRAO_EDITOR3D, materiaisExtras: [], idPeca: null, visivel: true, malha: criaMalhaPrimitivaEditor3D(tipo), subdivisao: 0, espessura: 0, transformInicial: { posicao: [0, 0, 0], rotacao: [0, 0, 0], escala: [1, 1, 1] } };
    const transformInicial = transformAssentadoNoEstadoEditor3D(nascente, nascente.transformInicial, estado.objetos);

    return { ok: true, estado: { ...estado, objetos: [...estado.objetos, { ...nascente, transformInicial }], contadorObjetos: id } };
};

// Transform absoluto + assentamento em camadas: os apoios são os OUTROS objetos (um objeto não se apoia em si mesmo).
function aplicaTransformEditor3D(estado: EstadoRoteiroEditor3D, idObjeto: number, transformPedido: (objeto: ObjetoEditor3D) => TransformEditor3D): ResultadoOperacaoRoteiroEditor3D {
    return alteraObjetoEditor3D(estado, idObjeto, objeto => ({ ...objeto, transformInicial: transformAssentadoNoEstadoEditor3D(objeto, transformPedido(objeto), estado.objetos.filter(outro => outro.id !== idObjeto)) }));
};

export const OPERADORES_EDITOR3D: { readonly [TTipo in TipoOperacaoEditor3D]: OperadorEditor3D<TTipo> } = {
    ADD_CUBO: {
        rotulo: () => 'Adicionar cubo',
        afordancia: 'MENU',
        executa: estado => acrescentaPrimitivaEditor3D(estado, 'CUBO'),
    },
    ADD_CILINDRO: {
        rotulo: () => 'Adicionar cilindro',
        afordancia: 'MENU',
        executa: estado => acrescentaPrimitivaEditor3D(estado, 'CILINDRO'),
    },
    ADD_ESFERA: {
        rotulo: () => 'Adicionar esfera',
        afordancia: 'MENU',
        executa: estado => acrescentaPrimitivaEditor3D(estado, 'ESFERA'),
    },
    DEFINIR_COR_BASE: {
        chaveCoalescencia: operacao => String(operacao.idObjeto),
        rotulo: (operacao, antes) => `Cor base de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → ${operacao.cor}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto, cor: operacao.cor })),
    },
    ESCALAR: {
        chaveCoalescencia: operacao => String(operacao.idObjeto),
        rotulo: (operacao, antes) => `Escalar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → ${operacao.escala[0]} × ${operacao.escala[1]} × ${operacao.escala[2]}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => aplicaTransformEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto.transformInicial, escala: [operacao.escala[0], operacao.escala[1], operacao.escala[2]] })),
    },
    SOLIDIFICAR: {
        chaveCoalescencia: operacao => String(operacao.idObjeto),
        rotulo: (operacao, antes) => operacao.espessura === 0 ? `Paredes desligadas em ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}` : `Paredes de ${operacao.espessura} m em ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        // Solidify é de EXIBIÇÃO e cresce para dentro: a gaiola (e o bbox do assentamento) não muda — sem re-assentar.
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto, espessura: operacao.espessura })),
    },
    NOVO_MATERIAL: {
        rotulo: (operacao, antes) => `Novo material em ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        // Nome sequencial (a base é o material 1) e cor clara padrão.
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto, materiaisExtras: [...objeto.materiaisExtras, { nome: `Material ${objeto.materiaisExtras.length + 2}`, cor: '#ede8d0' }] })),
    },
    ATRIBUIR_MATERIAL: {
        rotulo: (operacao, antes) => `${operacao.slot === 0 ? 'Material base' : `Material ${operacao.slot}`} → ${operacao.idsFaces.length} ${operacao.idsFaces.length === 1 ? 'face' : 'faces'} de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            const idsExistentes = new Set(objeto.malha.faces.map(face => face.id));
            const faceInexistente = operacao.idsFaces.find(idFace => !idsExistentes.has(idFace));
            if (faceInexistente !== undefined) return { recusa: `Face ${faceInexistente} não existe em "${objeto.nome}"` };
            if (operacao.slot > objeto.materiaisExtras.length) return { recusa: `Material ${operacao.slot} não existe em "${objeto.nome}"` };
            const alvo = new Set(operacao.idsFaces);
            return { ...objeto, malha: { ...objeto.malha, faces: objeto.malha.faces.map(face => alvo.has(face.id) ? { ...face, slotMaterial: operacao.slot <= 0 ? undefined : operacao.slot } : face) } };
        }),
    },
    RENOMEAR_OBJETO: {
        rotulo: (operacao, antes) => `Renomear ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → "${operacao.nome}"`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            // Mesma recusa do editor: nome vazio não altera nada (nem entra no histórico).
            const nome = operacao.nome.trim();
            return nome.length === 0 ? { recusa: 'Nome do objeto não pode ser vazio' } : { ...objeto, nome };
        }),
    },
    DEFINIR_VISIBILIDADE: {
        rotulo: (operacao, antes) => `${operacao.visivel ? 'Mostrar' : 'Ocultar'} ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto, visivel: operacao.visivel })),
    },
    DEFINIR_SUBDIVISAO: {
        rotulo: (operacao, antes) => operacao.subdivisao === 0 ? `Subdivisão desligada em ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}` : `Subdivisão ${operacao.subdivisao} em ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => (
            !Number.isInteger(operacao.subdivisao) || operacao.subdivisao < 0 || operacao.subdivisao > MAXIMO_SUBDIVISAO_MALHA_EDITOR3D
                ? { recusa: `Subdivisão deve ser inteiro entre 0 e ${MAXIMO_SUBDIVISAO_MALHA_EDITOR3D}` }
                : { ...objeto, subdivisao: operacao.subdivisao }
        )),
    },
    REMOVER_OBJETO: {
        rotulo: (operacao, antes) => `Remover ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => {
            const objeto = objetoDaOperacaoEditor3D(estado, operacao.idObjeto);
            if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
            // Parte de peça não se remove sozinha (remove-se a peça inteira) — mesma recusa do editor.
            if (objeto.idPeca !== null) return { ok: false, motivo: `"${objeto.nome}" é parte de uma peça e não pode ser removido isoladamente` };
            // O contador NÃO recua: id de objeto removido não é reaproveitado (ids do roteiro seguem densos e estáveis).
            // O objeto sai das coleções junto — o efeito de organização é da PRÓPRIA operação, não do chamador.
            return { ok: true, estado: { ...estado, objetos: estado.objetos.filter(atual => atual.id !== operacao.idObjeto), colecoes: estado.colecoes.map(colecao => colecao.idsObjetos.includes(operacao.idObjeto) ? { ...colecao, idsObjetos: colecao.idsObjetos.filter(id => id !== operacao.idObjeto) } : colecao) } };
        },
    },
    POSICIONAR: {
        chaveCoalescencia: operacao => String(operacao.idObjeto),
        rotulo: (operacao, antes) => `Posicionar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → ${operacao.posicao[0]}, ${operacao.posicao[1]}, ${operacao.posicao[2]}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => aplicaTransformEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto.transformInicial, posicao: [operacao.posicao[0], operacao.posicao[1], operacao.posicao[2]] })),
    },
    ROTACIONAR: {
        chaveCoalescencia: operacao => String(operacao.idObjeto),
        rotulo: (operacao, antes) => `Rotacionar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → ${operacao.rotacao.map(radianos => `${Math.round(radianos * 180 / Math.PI)}°`).join(', ')}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => aplicaTransformEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto.transformInicial, rotacao: [operacao.rotacao[0], operacao.rotacao[1], operacao.rotacao[2]] })),
    },
    ASSENTAR: {
        rotulo: (operacao, antes) => `Assentar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} no apoio`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => aplicaTransformEditor3D(estado, operacao.idObjeto, objeto => objeto.transformInicial),
    },
    APLICAR_TRANSFORMACOES: {
        rotulo: (operacao, antes) => `Aplicar transformações em ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        // Bake: o transform entra nos vértices da gaiola e zera — sem mudança visual. As medidas reais viram a condição
        // inicial do objeto (operações absolutas passam a valer sobre elas).
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto, malha: aplicaTransformNaMalha(objeto.malha, matrizDoTransformEditor3D(objeto.transformInicial)), transformInicial: { posicao: [0, 0, 0], rotacao: [0, 0, 0], escala: [1, 1, 1] } })),
    },
    // ---------------------------------------------------------------------------------------------------------------
    // MODELAGEM DE MALHA — todas operam na GAIOLA editável e delegam para as funções puras de editor3D.malha (que já
    // eram a fonte única da geometria). A recusa quando a operação não produz resultado é o que faz a validação
    // distinguir "a ferramenta mudou" de "a malha era outra": a função de malha devolve vazio/null e o passo falha.
    // ---------------------------------------------------------------------------------------------------------------
    EXTRUDAR_FACE: {
        rotulo: (operacao, antes) => `Extrudar face ${operacao.idFace} de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            if (!objeto.malha.faces.some(face => face.id === operacao.idFace)) return { recusa: `Face ${operacao.idFace} não existe em "${objeto.nome}"` };
            return { ...objeto, malha: extrudaFace(objeto.malha, operacao.idFace).malha };
        }),
    },
    CHANFRAR_ARESTA: {
        rotulo: (operacao, antes) => `Chanfrar aresta de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} em ${operacao.quantidade} m`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            if (operacao.indicesVertices.length !== 2) return { recusa: 'Chanfrar exige exatamente uma aresta (dois vértices)' };
            const resultado = chanframaAresta(objeto.malha, operacao.indicesVertices[0], operacao.indicesVertices[1], operacao.quantidade);
            // Mesma recusa do editor: sem chanfro produzido, nada muda (a aresta não existe ou não é chanfrável).
            return resultado.indicesChanfro.length === 0 ? { recusa: 'A aresta indicada não produziu chanfro' } : { ...objeto, malha: resultado.malha };
        }),
    },
    CORTAR_ANEL: {
        rotulo: (operacao, antes) => `Cortar anel em ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            if (operacao.indicesVertices.length !== 2) return { recusa: 'Cortar anel exige exatamente uma aresta (dois vértices)' };
            const resultado = cortaAnelAresta(objeto.malha, operacao.indicesVertices[0], operacao.indicesVertices[1]);
            return resultado === null ? { recusa: 'A aresta indicada não produziu anel' } : { ...objeto, malha: resultado.malha };
        }),
    },
    INSETAR_FACES: {
        rotulo: (operacao, antes) => `Inset de ${operacao.distancia} m em ${operacao.idsFaces.length} ${operacao.idsFaces.length === 1 ? 'face' : 'faces'} de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            const idsExistentes = new Set(objeto.malha.faces.map(face => face.id));
            const faceInexistente = operacao.idsFaces.find(idFace => !idsExistentes.has(idFace));
            if (faceInexistente !== undefined) return { recusa: `Face ${faceInexistente} não existe em "${objeto.nome}"` };
            const resultado = insetaFacesDaMalha(objeto.malha, operacao.idsFaces, operacao.distancia);
            return resultado.idsNovasFaces.length === 0 ? { recusa: 'O inset não produziu faces novas' } : { ...objeto, malha: resultado.malha };
        }),
    },
    ESPELHAR_X: {
        rotulo: (operacao, antes) => `Espelhar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} em X`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto, malha: espelhaMalhaX(objeto.malha) })),
    },
    EXCLUIR_FACES: {
        rotulo: (operacao, antes) => `Excluir ${operacao.idsFaces.length} ${operacao.idsFaces.length === 1 ? 'face' : 'faces'} de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            const malha = excluiFacesDaMalha(objeto.malha, operacao.idsFaces);
            // null = a exclusão deixaria a malha sem geometria; o editor recusa igual.
            return malha === null ? { recusa: 'A exclusão não deixaria geometria válida' } : { ...objeto, malha };
        }),
    },
    EXCLUIR_VERTICES: {
        rotulo: (operacao, antes) => `Excluir ${operacao.indicesVertices.length} ${operacao.indicesVertices.length === 1 ? 'vértice' : 'vértices'} de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            const malha = excluiVerticesDaMalha(objeto.malha, operacao.indicesVertices);
            return malha === null ? { recusa: 'A exclusão não deixaria geometria válida' } : { ...objeto, malha };
        }),
    },
    FUNDIR_VERTICES: {
        rotulo: (operacao, antes) => `Fundir ${operacao.indicesVertices.length} vértices de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            const resultado = fundeVerticesDaMalha(objeto.malha, operacao.indicesVertices);
            return resultado === null ? { recusa: 'Os vértices indicados não puderam ser fundidos' } : { ...objeto, malha: resultado.malha };
        }),
    },
    MOVER_VERTICES: {
        // Commit do arrasto de vértices: posições ABSOLUTAS finais, par a par com os índices — arrastos consecutivos
        // sobre a mesma seleção coalescem (mesma razão do POSICIONAR: o passo é o valor final do gesto).
        chaveCoalescencia: operacao => `${operacao.idObjeto}:${[...operacao.indicesVertices].join(',')}`,
        rotulo: (operacao, antes) => `Mover ${operacao.indicesVertices.length} ${operacao.indicesVertices.length === 1 ? 'vértice' : 'vértices'} de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            if (operacao.posicoes.length !== operacao.indicesVertices.length) return { recusa: 'Índices e posições dos vértices não andam par a par' };
            const foraDaMalha = operacao.indicesVertices.find(indice => indice < 0 || indice >= objeto.malha.vertices.length);
            if (foraDaMalha !== undefined) return { recusa: `Vértice ${foraDaMalha} não existe em "${objeto.nome}"` };
            const posicaoPorIndice = new Map(operacao.indicesVertices.map((indice, posicao) => [indice, operacao.posicoes[posicao]]));

            return { ...objeto, malha: { ...objeto.malha, vertices: objeto.malha.vertices.map((vertice, indice) => { const nova = posicaoPorIndice.get(indice); return nova === undefined ? vertice : [nova[0], nova[1], nova[2]] as Vetor3Malha; }) } };
        }),
    },
    // ---------------------------------------------------------------------------------------------------------------
    // LUZ E FIAÇÃO — camada de jogo do MAPA. Registros são ABSOLUTOS e o vínculo luz↔interruptor é SEMÂNTICO
    // (vincular/desvincular), nunca campo de registro. Os operadores delegam aos helpers de editor3D.camadaJogo — os
    // MESMOS que a tela sempre usou. Nenhum declara rótulo: o inferido ("Definir luz (LUZ_1)") cobre.
    // ---------------------------------------------------------------------------------------------------------------
    ADD_LUZ: {
        afordancia: 'MENU',
        // Id determinístico (LUZ_N pelo maior sufixo) e defaults do domínio — a mesma criação da tela.
        executa: estado => {
            const nova = criaFonteDeLuzEditor3D(estado.camadaJogo.fontesDeLuz);

            return { ok: true, estado: { ...estado, camadaJogo: { ...estado.camadaJogo, fontesDeLuz: [...estado.camadaJogo.fontesDeLuz, nova] } } };
        },
    },
    DEFINIR_LUZ: {
        chaveCoalescencia: operacao => operacao.luz.idLocal,
        executa: (estado, operacao) => {
            const existente = estado.camadaJogo.fontesDeLuz.find(luz => luz.idLocal === operacao.luz.idLocal);
            if (existente === undefined) return { ok: false, motivo: `Luz ${operacao.luz.idLocal} não existe no mapa` };
            // O vínculo (idCircuito) NÃO viaja no registro: preserva o existente — só vincular/desvincular o mudam.
            const luz: FonteDeLuzEditor3D = { idLocal: existente.idLocal, nome: operacao.luz.nome, tipo: operacao.luz.tipo, posicao: [operacao.luz.posicao[0], operacao.luz.posicao[1], operacao.luz.posicao[2]], cor: operacao.luz.cor, intensidade: operacao.luz.intensidade, alcanceMetros: operacao.luz.alcanceMetros, correnteEntrega: sanitizaCorrenteEditor3D(operacao.luz.correnteEntrega), idCircuito: existente.idCircuito };

            return { ok: true, estado: { ...estado, camadaJogo: { ...estado.camadaJogo, fontesDeLuz: estado.camadaJogo.fontesDeLuz.map(atual => atual.idLocal === luz.idLocal ? luz : atual) } } };
        },
    },
    EXCLUIR_LUZ: {
        executa: (estado, operacao) => {
            if (!estado.camadaJogo.fontesDeLuz.some(luz => luz.idLocal === operacao.idLuz)) return { ok: false, motivo: `Luz ${operacao.idLuz} não existe no mapa` };
            // Solta a ENTREGA primeiro: circuito que ficou sem luz dissolve (leva os interruptores junto).
            const solto = removeLuzDoCircuitoEditor3D(estado.camadaJogo.fiacao, estado.camadaJogo.fontesDeLuz, operacao.idLuz);

            return { ok: true, estado: { ...estado, camadaJogo: { fiacao: solto.fiacao, fontesDeLuz: solto.luzes.filter(luz => luz.idLocal !== operacao.idLuz) } } };
        },
    },
    VINCULAR_LUZ_INTERRUPTOR: {
        executa: (estado, operacao) => {
            if (!estado.camadaJogo.fontesDeLuz.some(luz => luz.idLocal === operacao.idLuz)) return { ok: false, motivo: `Luz ${operacao.idLuz} não existe no mapa` };
            const elemento = estado.objetos.find(objeto => String(objeto.id) === operacao.idElementoCena);
            if (elemento === undefined) return { ok: false, motivo: `Elemento ${operacao.idElementoCena} não existe na cena` };
            const resultado = vinculaLuzInterruptorEditor3D(estado.camadaJogo.fiacao, estado.camadaJogo.fontesDeLuz, operacao.idElementoCena, elemento.nome, operacao.idLuz);
            if (resultado === null) return { ok: false, motivo: `Não foi possível vincular a luz ${operacao.idLuz} ao elemento ${operacao.idElementoCena}` };

            return { ok: true, estado: { ...estado, camadaJogo: { fiacao: resultado.fiacao, fontesDeLuz: resultado.luzes } } };
        },
    },
    DESVINCULAR_LUZ: {
        // Solta a ENTREGA da luz: ela volta a ser fixa (alimentação direta); circuito que ficou sem luz dissolve.
        executa: (estado, operacao) => {
            if (!estado.camadaJogo.fontesDeLuz.some(luz => luz.idLocal === operacao.idLuz)) return { ok: false, motivo: `Luz ${operacao.idLuz} não existe no mapa` };
            const solto = removeLuzDoCircuitoEditor3D(estado.camadaJogo.fiacao, estado.camadaJogo.fontesDeLuz, operacao.idLuz);

            return { ok: true, estado: { ...estado, camadaJogo: { fiacao: solto.fiacao, fontesDeLuz: solto.luzes } } };
        },
    },
    DEFINIR_INTERRUPTOR: {
        chaveCoalescencia: operacao => operacao.interruptor.idLocal,
        executa: (estado, operacao) => {
            const existente = estado.camadaJogo.fiacao.interruptores.find(atual => atual.idLocal === operacao.interruptor.idLocal);
            if (existente === undefined) return { ok: false, motivo: `Interruptor ${operacao.interruptor.idLocal} não existe no mapa` };
            // Vínculo estrutural (elemento, circuito) preservado: o registro só traz os campos autoráveis.
            const interruptor: InterruptorEditor3D = { ...existente, nome: operacao.interruptor.nome, descricao: operacao.interruptor.descricao, alcanceMilimetros: operacao.interruptor.alcanceMilimetros };

            return { ok: true, estado: { ...estado, camadaJogo: { ...estado.camadaJogo, fiacao: { circuitos: estado.camadaJogo.fiacao.circuitos, interruptores: estado.camadaJogo.fiacao.interruptores.map(atual => atual.idLocal === interruptor.idLocal ? interruptor : atual) } } } };
        },
    },
    REMOVER_INTERRUPTOR: {
        executa: (estado, operacao) => {
            if (!estado.camadaJogo.fiacao.interruptores.some(interruptor => interruptor.idLocal === operacao.idInterruptor)) return { ok: false, motivo: `Interruptor ${operacao.idInterruptor} não existe no mapa` };
            const resultado = removeInterruptorEditor3D(estado.camadaJogo.fiacao, estado.camadaJogo.fontesDeLuz, operacao.idInterruptor);

            return { ok: true, estado: { ...estado, camadaJogo: { fiacao: resultado.fiacao, fontesDeLuz: resultado.luzes } } };
        },
    },
    DEFINIR_CIRCUITO: {
        chaveCoalescencia: operacao => operacao.circuito.idLocal,
        executa: (estado, operacao) => {
            const existente = estado.camadaJogo.fiacao.circuitos.find(atual => atual.idLocal === operacao.circuito.idLocal);
            if (existente === undefined) return { ok: false, motivo: `Circuito ${operacao.circuito.idLocal} não existe no mapa` };
            const circuito: CircuitoEditor3D = { ...existente, nome: operacao.circuito.nome, corrente: sanitizaCorrenteEditor3D(operacao.circuito.corrente), ligadoInicialmente: operacao.circuito.ligadoInicialmente };

            return { ok: true, estado: { ...estado, camadaJogo: { ...estado.camadaJogo, fiacao: { circuitos: estado.camadaJogo.fiacao.circuitos.map(atual => atual.idLocal === circuito.idLocal ? circuito : atual), interruptores: estado.camadaJogo.fiacao.interruptores } } } };
        },
    },
    DUPLICAR_OBJETO: {
        rotulo: (operacao, antes) => `Duplicar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => {
            const objeto = objetoDaOperacaoEditor3D(estado, operacao.idObjeto);
            if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
            if (objeto.idPeca !== null) return { ok: false, motivo: `"${objeto.nome}" é parte de uma peça e não pode ser duplicado isoladamente` };
            const id = estado.contadorObjetos + 1;
            const malhaCopiada: MalhaEditavelLocal = { vertices: objeto.malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]]), faces: objeto.malha.faces.map(face => ({ ...face, indicesVertices: [...face.indicesVertices] })), proximoIdFace: objeto.malha.proximoIdFace };
            // Deslocada em X e Y para a cópia não nascer sobreposta; o Z sai do assentamento (cai no chão ou empilha).
            const transformDeslocado: TransformEditor3D = { ...objeto.transformInicial, posicao: [objeto.transformInicial.posicao[0] + 0.4, objeto.transformInicial.posicao[1] + 0.4, objeto.transformInicial.posicao[2]] };
            const copia: ObjetoEditor3D = { ...objeto, id, nome: `${objeto.nome} (cópia)`, materiaisExtras: objeto.materiaisExtras.map(material => ({ ...material })), malha: malhaCopiada, transformInicial: transformDeslocado };

            // A cópia entra nas mesmas coleções do original — organização é efeito da própria operação.
            return { ok: true, estado: { ...estado, objetos: [...estado.objetos, { ...copia, transformInicial: transformAssentadoNoEstadoEditor3D(copia, transformDeslocado, estado.objetos) }], contadorObjetos: id, colecoes: estado.colecoes.map(colecao => colecao.idsObjetos.includes(operacao.idObjeto) ? { ...colecao, idsObjetos: [...colecao.idsObjetos, id] } : colecao) } };
        },
    },
    ADD_MALHA: {
        // Espelho fiel do "Novo Mesh": transform digitado é absoluto (NÃO assenta) e o cubo ignora segmentos.
        executa: (estado, operacao) => {
            const id = estado.contadorObjetos + 1;
            const nascente: ObjetoEditor3D = { id, tipo: operacao.primitiva, nome: `${rotuloTipoPrimitivaEditor3D(operacao.primitiva)} ${id}`, cor: COR_OBJETO_PADRAO_EDITOR3D, materiaisExtras: [], idPeca: null, visivel: true, malha: criaMalhaPrimitivaEditor3D(operacao.primitiva, operacao.segmentos), subdivisao: 0, espessura: 0, transformInicial: { posicao: [operacao.posicao[0], operacao.posicao[1], operacao.posicao[2]], rotacao: [operacao.rotacao[0], operacao.rotacao[1], operacao.rotacao[2]], escala: [operacao.escala[0], operacao.escala[1], operacao.escala[2]] } };

            return { ok: true, estado: { ...estado, objetos: [...estado.objetos, nascente], contadorObjetos: id } };
        },
    },
    DEFINIR_COR_MATERIAL: {
        chaveCoalescencia: operacao => `${operacao.idObjeto}-${operacao.slot}`,
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => operacao.slot <= 0 || operacao.slot > objeto.materiaisExtras.length
            ? { recusa: `Material ${operacao.slot} não existe em "${objeto.nome}"` }
            : { ...objeto, materiaisExtras: objeto.materiaisExtras.map((material, indice) => indice === operacao.slot - 1 ? { ...material, cor: operacao.cor } : material) }),
    },
    RENOMEAR_MATERIAL: {
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => {
            const nome = operacao.nome.trim();
            if (nome.length === 0) return { recusa: 'Nome do material não pode ser vazio' };
            if (operacao.slot <= 0 || operacao.slot > objeto.materiaisExtras.length) return { recusa: `Material ${operacao.slot} não existe em "${objeto.nome}"` };

            return { ...objeto, materiaisExtras: objeto.materiaisExtras.map((material, indice) => indice === operacao.slot - 1 ? { ...material, nome } : material) };
        }),
    },
    // COLEÇÕES DO USUÁRIO — sem `rotulo` declarado de propósito: o rótulo é inferido (tipo humanizado + alvo).
    CRIAR_COLECAO: {
        executa: estado => {
            const id = estado.contadorColecoes + 1;

            return { ok: true, estado: { ...estado, colecoes: [...estado.colecoes, { id, nome: `Coleção ${id}`, idsObjetos: [], visivel: true }], contadorColecoes: id } };
        },
    },
    RENOMEAR_COLECAO: {
        executa: (estado, operacao) => alteraColecaoEditor3D(estado, operacao.idColecao, colecao => {
            // Mesma recusa do renomear objeto: nome vazio não altera nada.
            const nome = operacao.nome.trim();
            return nome.length === 0 ? { recusa: 'Nome da coleção não pode ser vazio' } : { ...colecao, nome };
        }),
    },
    MOVER_PARA_COLECAO: {
        executa: (estado, operacao) => {
            const objeto = objetoDaOperacaoEditor3D(estado, operacao.idObjeto);
            if (objeto === null) return { ok: false, motivo: `Objeto ${operacao.idObjeto} não existe na cena` };
            if (operacao.idColecao !== null && !estado.colecoes.some(colecao => colecao.id === operacao.idColecao)) return { ok: false, motivo: `Coleção ${operacao.idColecao} não existe` };
            // Sai de todas e entra na de destino (null = raiz): pertencimento é exclusivo.
            const semObjeto = estado.colecoes.map(colecao => ({ ...colecao, idsObjetos: colecao.idsObjetos.filter(id => id !== operacao.idObjeto) }));

            return { ok: true, estado: { ...estado, colecoes: semObjeto.map(colecao => colecao.id === operacao.idColecao ? { ...colecao, idsObjetos: [...colecao.idsObjetos, operacao.idObjeto] } : colecao) } };
        },
    },
    DEFINIR_VISIBILIDADE_COLECAO: {
        executa: (estado, operacao) => alteraColecaoEditor3D(estado, operacao.idColecao, colecao => ({ ...colecao, visivel: operacao.visivel })),
    },
    REMOVER_COLECAO: {
        // Remover a pasta devolve os objetos à raiz (o pertencimento mora na coleção; nada mais a apagar).
        executa: (estado, operacao) => estado.colecoes.some(colecao => colecao.id === operacao.idColecao)
            ? { ok: true, estado: { ...estado, colecoes: estado.colecoes.filter(colecao => colecao.id !== operacao.idColecao) } }
            : { ok: false, motivo: `Coleção ${operacao.idColecao} não existe` },
    },
};

// Mesmo molde do alteraObjetoEditor3D: localiza a coleção, aplica a alteração, e recusa vira recusa da operação.
function alteraColecaoEditor3D(estado: EstadoRoteiroEditor3D, idColecao: number, altera: (colecao: ColecaoRoteiroEditor3D) => ColecaoRoteiroEditor3D | { recusa: string }): ResultadoOperacaoRoteiroEditor3D {
    const colecao = estado.colecoes.find(atual => atual.id === idColecao);
    if (colecao === undefined) return { ok: false, motivo: `Coleção ${idColecao} não existe` };
    const resultado = altera(colecao);
    if ('recusa' in resultado) return { ok: false, motivo: resultado.recusa };

    return { ok: true, estado: { ...estado, colecoes: estado.colecoes.map(atual => atual.id === idColecao ? resultado : atual) } };
};

// Ponto ÚNICO de execução: tela e reexecução entram por aqui. O operador é procurado pelo tipo; operação fora do
// registro é recusada (o roteiro não pode carregar passo que a ferramenta não sabe executar).
export function aplicaOperacaoRoteiroEditor3D(estado: EstadoRoteiroEditor3D, operacao: OperacaoRoteiroEditor3D): ResultadoOperacaoRoteiroEditor3D {
    const operador = OPERADORES_EDITOR3D[operacao.tipo] as OperadorEditor3D<TipoOperacaoEditor3D> | undefined;
    if (operador === undefined) return { ok: false, motivo: 'Operação não registrada na camada de operações' };

    return operador.executa(estado, operacao);
};

// Alvo genérico da operação, para o rótulo inferido e para a chave de coalescência não exigirem declaração.
function alvoDaOperacaoEditor3D(operacao: OperacaoRoteiroEditor3D, estadoAntes: EstadoRoteiroEditor3D): string | null {
    if ('idColecao' in operacao && operacao.idColecao !== null) return estadoAntes.colecoes.find(colecao => colecao.id === operacao.idColecao)?.nome ?? `Coleção ${operacao.idColecao}`;
    if ('idObjeto' in operacao) return nomeDoAlvoEditor3D(estadoAntes, operacao.idObjeto);
    if ('idLuz' in operacao) return operacao.idLuz;
    if ('idInterruptor' in operacao) return operacao.idInterruptor;
    if ('luz' in operacao) return operacao.luz.idLocal;
    if ('interruptor' in operacao) return operacao.interruptor.idLocal;
    if ('circuito' in operacao) return operacao.circuito.idLocal;

    return null;
};

// Rótulo humano DERIVADO da operação (o roteiro não guarda rótulo). Operador sem `rotulo` declarado ganha o rótulo
// INFERIDO — tipo humanizado + alvo — para que operação nova não exija texto à mão.
export function rotuloDoOperadorEditor3D(operacao: OperacaoRoteiroEditor3D, estadoAntes: EstadoRoteiroEditor3D): string {
    const operador = OPERADORES_EDITOR3D[operacao.tipo] as OperadorEditor3D<TipoOperacaoEditor3D> | undefined;
    if (operador === undefined) return `Operação desconhecida (${operacao.tipo})`;
    if (operador.rotulo !== undefined) return operador.rotulo(operacao, estadoAntes);

    const nome = `${operacao.tipo.charAt(0)}${operacao.tipo.slice(1).toLowerCase()}`.replace(/_/g, ' ');
    const alvo = alvoDaOperacaoEditor3D(operacao, estadoAntes);

    return alvo === null ? nome : `${nome} (${alvo})`;
};
