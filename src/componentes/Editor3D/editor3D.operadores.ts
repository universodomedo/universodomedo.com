import { matrizDoTransformEditor3D, transformAssentadoNoEstadoEditor3D } from './editor3D.assentamento';
import { aplicaTransformNaMalha, chanframaAresta, cortaAnelAresta, criaMalhaCilindro, criaMalhaCubo, criaMalhaEsfera, espelhaMalhaX, excluiFacesDaMalha, excluiVerticesDaMalha, extrudaFace, fundeVerticesDaMalha, insetaFacesDaMalha, MAXIMO_SUBDIVISAO_MALHA_EDITOR3D } from './editor3D.malha';
import { COR_OBJETO_PADRAO_EDITOR3D } from './editor3D.projeto.serializacao';
import { ESQUEMA_OPERACOES_EDITOR3D } from 'types-nora-api';
import type { MalhaEditavelLocal } from './editor3D.malha';
import type { TipoPrimitivaEditor3D, TransformEditor3D } from './editor3D.projeto.serializacao';
import type { ObjetoEditor3D } from './Editor3D';
import type { OperacaoRoteiroEditor3D } from 'types-nora-api';

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
};

export const ESTADO_INICIAL_ROTEIRO_EDITOR3D: EstadoRoteiroEditor3D = { objetos: [], contadorObjetos: 0 };

export type ResultadoOperacaoRoteiroEditor3D = { readonly ok: true; readonly estado: EstadoRoteiroEditor3D } | { readonly ok: false; readonly motivo: string };

type OperacaoDoTipoEditor3D<TTipo extends TipoOperacaoEditor3D> = Extract<OperacaoRoteiroEditor3D, { tipo: TTipo }>;

// Por onde a operação é invocada na interface. É declaração do OPERADOR (não do menu): é ela que permite afirmar
// "esta operação deveria ter uma entrada de menu" e, portanto, acusar quando a entrada some. Operações de PAINEL
// nascem de campos/botões do inspetor ou de gestos no viewport e não têm porta de menu a conferir.
type AfordanciaOperadorEditor3D = 'MENU' | 'PAINEL';

type OperadorEditor3D<TTipo extends TipoOperacaoEditor3D> = {
    // Rótulo humano do passo. Recebe o estado ANTERIOR para nomear o alvo como ele se chamava naquele momento.
    readonly rotulo: (operacao: OperacaoDoTipoEditor3D<TTipo>, estadoAntes: EstadoRoteiroEditor3D) => string;
    readonly afordancia: AfordanciaOperadorEditor3D;
    readonly executa: (estado: EstadoRoteiroEditor3D, operacao: OperacaoDoTipoEditor3D<TTipo>) => ResultadoOperacaoRoteiroEditor3D;
};

export function operacaoNasceDeMenuEditor3D(tipo: TipoOperacaoEditor3D): boolean {
    return OPERADORES_EDITOR3D[tipo].afordancia === 'MENU';
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

    return { ok: true, estado: { objetos: [...estado.objetos, { ...nascente, transformInicial }], contadorObjetos: id } };
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
        rotulo: (operacao, antes) => `Cor base de ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → ${operacao.cor}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => alteraObjetoEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto, cor: operacao.cor })),
    },
    ESCALAR: {
        rotulo: (operacao, antes) => `Escalar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → ${operacao.escala[0]} × ${operacao.escala[1]} × ${operacao.escala[2]}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => aplicaTransformEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto.transformInicial, escala: [operacao.escala[0], operacao.escala[1], operacao.escala[2]] })),
    },
    SOLIDIFICAR: {
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
            return { ok: true, estado: { ...estado, objetos: estado.objetos.filter(atual => atual.id !== operacao.idObjeto) } };
        },
    },
    POSICIONAR: {
        rotulo: (operacao, antes) => `Posicionar ${nomeDoAlvoEditor3D(antes, operacao.idObjeto)} → ${operacao.posicao[0]}, ${operacao.posicao[1]}, ${operacao.posicao[2]}`,
        afordancia: 'PAINEL',
        executa: (estado, operacao) => aplicaTransformEditor3D(estado, operacao.idObjeto, objeto => ({ ...objeto.transformInicial, posicao: [operacao.posicao[0], operacao.posicao[1], operacao.posicao[2]] })),
    },
    ROTACIONAR: {
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

            return { ok: true, estado: { objetos: [...estado.objetos, { ...copia, transformInicial: transformAssentadoNoEstadoEditor3D(copia, transformDeslocado, estado.objetos) }], contadorObjetos: id } };
        },
    },
};

// Ponto ÚNICO de execução: tela e reexecução entram por aqui. O operador é procurado pelo tipo; operação fora do
// registro é recusada (o roteiro não pode carregar passo que a ferramenta não sabe executar).
export function aplicaOperacaoRoteiroEditor3D(estado: EstadoRoteiroEditor3D, operacao: OperacaoRoteiroEditor3D): ResultadoOperacaoRoteiroEditor3D {
    const operador = OPERADORES_EDITOR3D[operacao.tipo] as OperadorEditor3D<TipoOperacaoEditor3D> | undefined;
    if (operador === undefined) return { ok: false, motivo: 'Operação não registrada na camada de operações' };

    return operador.executa(estado, operacao);
};

// Rótulo humano DERIVADO da operação (o roteiro não guarda rótulo): resolve o nome do objeto no estado ANTERIOR ao passo.
export function rotuloDoOperadorEditor3D(operacao: OperacaoRoteiroEditor3D, estadoAntes: EstadoRoteiroEditor3D): string {
    const operador = OPERADORES_EDITOR3D[operacao.tipo] as OperadorEditor3D<TipoOperacaoEditor3D> | undefined;

    return operador === undefined ? `Operação desconhecida (${operacao.tipo})` : operador.rotulo(operacao, estadoAntes);
};
