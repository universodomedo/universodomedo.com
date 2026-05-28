import type { DocumentoCena3DPrototipo, ObjetoCena3DPrototipo, PontoEntradaJogadorCena3DPrototipo, Vetor3Cena3DPrototipo } from './cena3DPrototipo.types';
import type { Editor3DState } from 'Componentes/ElementosDeInteratividade3D/estado/editor3D.estado.types';
import type { ObjetoCenaEditor3D, Vetor3 } from 'Componentes/ElementosDeInteratividade3D/editor/editor3D.tipos';

const alturaPadraoJogadorCena3DPrototipo = 1.7;
const afastamentoPadraoEntradaCena3DPrototipo = 6;

function clonaVetor3(vetor: Vetor3): Vetor3Cena3DPrototipo { return [vetor[0], vetor[1], vetor[2]]; };
function serializaMatrizBase(matriz: Float32Array): number[] { return Array.from(matriz); };

function obtemIdColecaoObjeto(state: Editor3DState, idObjeto: string): string | null {
    const colecao = state.colecoes.find(colecaoCena => colecaoCena.idsObjetos.includes(idObjeto)) ?? null;

    return colecao?.id ?? null;
};

function criaObjetoCena3DPrototipo(state: Editor3DState, objeto: ObjetoCenaEditor3D): ObjetoCena3DPrototipo {
    return {
        id: objeto.id,
        nome: objeto.nome,
        tipo: objeto.tipo,
        quantidadeVertices: objeto.quantidadeVertices,
        transform: {
            posicao: clonaVetor3(objeto.posicao),
            rotacao: clonaVetor3(objeto.rotacao),
            escala: clonaVetor3(objeto.escala),
            matrizBase: serializaMatrizBase(objeto.matrizBase),
        },
        material: {
            corBase: clonaVetor3(objeto.corBase),
            corLuz: clonaVetor3(objeto.corLuz),
        },
        visivel: !state.idsObjetosOcultos.includes(objeto.id),
        colisao: objeto.tipo !== 'VERTICE',
        colecaoId: obtemIdColecaoObjeto(state, objeto.id),
    };
};

function obtemObjetosSerializaveis(state: Editor3DState): ObjetoCenaEditor3D[] { return state.malhaEmCriacao === null ? state.objetos : [...state.objetos, state.malhaEmCriacao]; };

function criaPontoEntradaJogador(objetos: readonly ObjetoCena3DPrototipo[]): PontoEntradaJogadorCena3DPrototipo {
    const objetosVisiveis = objetos.filter(objeto => objeto.visivel);

    if (objetosVisiveis.length === 0) return { posicao: [0, -afastamentoPadraoEntradaCena3DPrototipo, alturaPadraoJogadorCena3DPrototipo], rotacaoZ: 0 };

    let minimoX = Number.POSITIVE_INFINITY;
    let maximoX = Number.NEGATIVE_INFINITY;
    let minimoY = Number.POSITIVE_INFINITY;
    let maximoY = Number.NEGATIVE_INFINITY;

    objetosVisiveis.forEach(objeto => {
        const posicao = objeto.transform.posicao;
        const escala = objeto.transform.escala;
        const metadeX = Math.max(0.5, Math.abs(escala[0]) / 2);
        const metadeY = Math.max(0.5, Math.abs(escala[1]) / 2);

        minimoX = Math.min(minimoX, posicao[0] - metadeX);
        maximoX = Math.max(maximoX, posicao[0] + metadeX);
        minimoY = Math.min(minimoY, posicao[1] - metadeY);
        maximoY = Math.max(maximoY, posicao[1] + metadeY);
    });

    const centroX = (minimoX + maximoX) / 2;
    const centroY = (minimoY + maximoY) / 2;
    const entradaX = centroX;
    const entradaY = minimoY - afastamentoPadraoEntradaCena3DPrototipo;
    const rotacaoZ = Math.atan2(centroX - entradaX, centroY - entradaY);

    return { posicao: [entradaX, entradaY, alturaPadraoJogadorCena3DPrototipo], rotacaoZ };
};

export function serializaEditor3DParaCena3DPrototipo(state: Editor3DState): DocumentoCena3DPrototipo {
    const objetos = obtemObjetosSerializaveis(state).map(objeto => criaObjetoCena3DPrototipo(state, objeto));

    return {
        versao: 1,
        objetos,
        colecoes: state.colecoes.map(colecao => ({ id: colecao.id, nome: colecao.nome, idsObjetos: [...colecao.idsObjetos], visivel: !state.idsColecoesOcultas.includes(colecao.id) })),
        pontoEntradaJogador: criaPontoEntradaJogador(objetos),
        configuracaoAmbiente: {
            corFundo: '#101014',
            luzAmbiente: 0.72,
            mostrarGrade: true,
        },
    };
};
