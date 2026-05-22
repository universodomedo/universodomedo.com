import type { ColecaoCenaEditor3D } from './editor3D.estado.types';

export const ID_COLECAO_PRINCIPAL_EDITOR3D = 'colecao-principal';

export function criaColecaoPrincipalEditor3D(): ColecaoCenaEditor3D { return { id: ID_COLECAO_PRINCIPAL_EDITOR3D, nome: 'Coleção', idsObjetos: [] }; };

export function criaColecaoCenaEditor3D(proximoIdColecao: number): ColecaoCenaEditor3D { return { id: `colecao-${proximoIdColecao}`, nome: `Coleção ${proximoIdColecao}`, idsObjetos: [] }; };

export function colecaoExisteEditor3D(colecoes: readonly ColecaoCenaEditor3D[], idColecao: string): boolean { return colecoes.some(colecao => colecao.id === idColecao); };

function garanteColecaoPrincipalEditor3D(colecoes: readonly ColecaoCenaEditor3D[]): ColecaoCenaEditor3D[] { return colecaoExisteEditor3D(colecoes, ID_COLECAO_PRINCIPAL_EDITOR3D) ? [...colecoes] : [criaColecaoPrincipalEditor3D(), ...colecoes]; };

function obtemIdColecaoDestinoEditor3D(colecoes: readonly ColecaoCenaEditor3D[], idColecaoPreferencial: string | null): string { return idColecaoPreferencial !== null && colecaoExisteEditor3D(colecoes, idColecaoPreferencial) ? idColecaoPreferencial : ID_COLECAO_PRINCIPAL_EDITOR3D; };

export function adicionaObjetoEmColecaoCenaEditor3D(colecoes: readonly ColecaoCenaEditor3D[], idColecaoPreferencial: string | null, idObjeto: string): ColecaoCenaEditor3D[] {
    const colecoesBase = garanteColecaoPrincipalEditor3D(colecoes);
    const idColecaoDestino = obtemIdColecaoDestinoEditor3D(colecoesBase, idColecaoPreferencial);

    return colecoesBase.map(colecao => colecao.id === idColecaoDestino && !colecao.idsObjetos.includes(idObjeto) ? { ...colecao, idsObjetos: [...colecao.idsObjetos, idObjeto] } : colecao);
};

export function removeObjetosDasColecoesEditor3D(colecoes: readonly ColecaoCenaEditor3D[], idsObjetos: readonly string[]): ColecaoCenaEditor3D[] {
    const idsRemovidos = new Set(idsObjetos);

    return colecoes.map(colecao => ({ ...colecao, idsObjetos: colecao.idsObjetos.filter(idObjeto => !idsRemovidos.has(idObjeto)) }));
};

export function obtemIdsObjetosColecaoEditor3D(colecao: ColecaoCenaEditor3D, idsObjetosExistentes: readonly string[]): string[] { return colecao.idsObjetos.filter(idObjeto => idsObjetosExistentes.includes(idObjeto)); };