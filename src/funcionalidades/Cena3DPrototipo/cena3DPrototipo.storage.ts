import type { ColecaoCena3DPrototipo, ConfiguracaoAmbienteCena3DPrototipo, DocumentoCena3DPrototipo, ObjetoCena3DPrototipo, TipoObjetoCena3DPrototipo, Vetor3Cena3DPrototipo } from './cena3DPrototipo.types';

export const CHAVE_DOCUMENTO_CENA_3D_PROTOTIPO_SALA_DE_JOGO = 'udm:mvp-editor-3d:sala-de-jogo:cena:v1';

const tiposObjetoCena3DPrototipoValidos: readonly TipoObjetoCena3DPrototipo[] = ['VERTICE', 'PLANO_2D', 'CIRCULO_2D', 'CUBO_3D', 'CILINDRO_3D', 'ESFERA_3D'];

function numeroCena3DPrototipoEhValido(valor: number): boolean { return typeof valor === 'number' && Number.isFinite(valor); };
function vetor3Cena3DPrototipoEhValido(vetor: Vetor3Cena3DPrototipo): boolean { return Array.isArray(vetor) && vetor.length === 3 && vetor.every(valor => typeof valor === 'number' && Number.isFinite(valor)); };
function matrizBaseCena3DPrototipoEhValida(matriz: readonly number[]): boolean { return Array.isArray(matriz) && matriz.length === 16 && matriz.every(numeroCena3DPrototipoEhValido); };
function tipoObjetoCena3DPrototipoEhValido(tipo: TipoObjetoCena3DPrototipo): boolean { return tiposObjetoCena3DPrototipoValidos.includes(tipo); };
function listaIdsCena3DPrototipoEhValida(ids: readonly string[]): boolean { return Array.isArray(ids) && ids.every(id => typeof id === 'string'); };

function colecaoCena3DPrototipoEhValida(colecao: ColecaoCena3DPrototipo | null): boolean {
    if (colecao === null || typeof colecao !== 'object') return false;
    if (typeof colecao.id !== 'string' || typeof colecao.nome !== 'string') return false;
    if (typeof colecao.visivel !== 'boolean') return false;

    return listaIdsCena3DPrototipoEhValida(colecao.idsObjetos);
};

function configuracaoAmbienteCena3DPrototipoEhValida(configuracaoAmbiente: ConfiguracaoAmbienteCena3DPrototipo | null): boolean {
    if (configuracaoAmbiente === null || typeof configuracaoAmbiente !== 'object') return false;
    if (typeof configuracaoAmbiente.corFundo !== 'string' || configuracaoAmbiente.corFundo.trim() === '') return false;
    if (!numeroCena3DPrototipoEhValido(configuracaoAmbiente.luzAmbiente)) return false;

    return typeof configuracaoAmbiente.mostrarGrade === 'boolean';
};

function objetoCena3DPrototipoEhValido(objeto: ObjetoCena3DPrototipo | null): boolean {
    if (objeto === null || typeof objeto !== 'object') return false;
    if (typeof objeto.id !== 'string' || typeof objeto.nome !== 'string') return false;
    if (!tipoObjetoCena3DPrototipoEhValido(objeto.tipo)) return false;
    if (!numeroCena3DPrototipoEhValido(objeto.quantidadeVertices) || objeto.quantidadeVertices < 1) return false;
    if (typeof objeto.visivel !== 'boolean' || typeof objeto.colisao !== 'boolean') return false;
    if (objeto.colecaoId !== null && typeof objeto.colecaoId !== 'string') return false;
    if (objeto.transform === null || typeof objeto.transform !== 'object') return false;
    if (!vetor3Cena3DPrototipoEhValido(objeto.transform.posicao)) return false;
    if (!vetor3Cena3DPrototipoEhValido(objeto.transform.rotacao)) return false;
    if (!vetor3Cena3DPrototipoEhValido(objeto.transform.escala)) return false;
    if (!matrizBaseCena3DPrototipoEhValida(objeto.transform.matrizBase)) return false;
    if (objeto.material === null || typeof objeto.material !== 'object') return false;
    if (!vetor3Cena3DPrototipoEhValido(objeto.material.corBase)) return false;

    return vetor3Cena3DPrototipoEhValido(objeto.material.corLuz);
};

function documentoCena3DPrototipoEhValido(documento: DocumentoCena3DPrototipo | null): documento is DocumentoCena3DPrototipo {
    if (documento === null || typeof documento !== 'object') return false;
    if (documento.versao !== 1) return false;
    if (!Array.isArray(documento.objetos) || !Array.isArray(documento.colecoes)) return false;
    if (documento.pontoEntradaJogador === null || typeof documento.pontoEntradaJogador !== 'object') return false;
    if (!vetor3Cena3DPrototipoEhValido(documento.pontoEntradaJogador.posicao)) return false;
    if (!numeroCena3DPrototipoEhValido(documento.pontoEntradaJogador.rotacaoZ)) return false;
    if (!documento.colecoes.every(colecao => colecaoCena3DPrototipoEhValida(colecao))) return false;
    if (!configuracaoAmbienteCena3DPrototipoEhValida(documento.configuracaoAmbiente)) return false;

    return documento.objetos.every(objeto => objetoCena3DPrototipoEhValido(objeto));
};

export function salvaDocumentoCena3DPrototipoSalaDeJogo(documento: DocumentoCena3DPrototipo): void {
    if (typeof window === 'undefined') return;

    window.sessionStorage.setItem(CHAVE_DOCUMENTO_CENA_3D_PROTOTIPO_SALA_DE_JOGO, JSON.stringify(documento));
};

export function carregaDocumentoCena3DPrototipoSalaDeJogo(): DocumentoCena3DPrototipo | null {
    if (typeof window === 'undefined') return null;

    const documentoSerializado = window.sessionStorage.getItem(CHAVE_DOCUMENTO_CENA_3D_PROTOTIPO_SALA_DE_JOGO);

    if (documentoSerializado === null) return null;

    try {
        const documento = JSON.parse(documentoSerializado) as DocumentoCena3DPrototipo | null;

        return documentoCena3DPrototipoEhValido(documento) ? documento : null;
    } catch {
        return null;
    }
};
