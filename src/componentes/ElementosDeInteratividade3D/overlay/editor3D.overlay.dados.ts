import { subtraiVetoresEditor3D } from '../editor/editor3D.objetos';
import { formataDeltaEditor3D, formataDeltaRotacaoEditor3D } from './editor3D.overlay.formatacao';
import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { ObjetoCenaEditor3D, Vetor3 } from '../editor/editor3D.tipos';

export interface DadosOverlayModoEditor3D {
    readonly titulo: string;
    readonly nomeObjeto: string;
    readonly detalhes: readonly string[];
};

function obtemObjetoModoEditor3D(state: Editor3DState): ObjetoCenaEditor3D | null {
    const modoAtual = state.modoAtual;

    if (modoAtual.tipo === 'NENHUM') return null;

    return state.objetos.find(objeto => objeto.id === modoAtual.idObjeto) ?? null;
};

function obtemNomeObjetosModoEditor3D(state: Editor3DState, objeto: ObjetoCenaEditor3D): string {
    if (state.modoAtual.tipo === 'NENHUM' || state.modoAtual.idsObjetos.length <= 1) return objeto.nome;

    return `${objeto.nome} + ${state.modoAtual.idsObjetos.length - 1}`;
};

function criaDetalhesVetores(prefixo: string, delta: Vetor3, formatador: (valor: number) => string): string[] { return [`X ${formatador(delta[0])}`, `Y ${formatador(delta[1])}`, `Z ${formatador(delta[2])}`, prefixo]; };
function criaTextoEntradaNumericaRotate(entrada: string): string { return entrada === '' ? 'Digite valor em graus + Enter' : `Valor digitado: ${entrada}°`; };

export function criaDadosOverlayModoEditor3D(state: Editor3DState): DadosOverlayModoEditor3D | null {
    const objeto = obtemObjetoModoEditor3D(state);

    if (objeto === null) return null;

    const nomeObjeto = obtemNomeObjetosModoEditor3D(state, objeto);

    if (state.modoAtual.tipo === 'GRAB') {
        const delta = subtraiVetoresEditor3D(objeto.posicao, state.modoAtual.posicaoInicial);
        const eixo = state.modoAtual.eixo === null ? 'Livre' : state.modoAtual.eixo;

        return { titulo: 'Grab', nomeObjeto, detalhes: [`Eixo: ${eixo}`, ...criaDetalhesVetores('LMB confirma · RMB cancela', delta, formataDeltaEditor3D)] };
    }

    if (state.modoAtual.tipo === 'ROTATE') {
        const delta = subtraiVetoresEditor3D(objeto.rotacao, state.modoAtual.rotacaoInicial);
        const eixo = state.modoAtual.eixo === null ? state.modoAtual.livre ? 'Livre total' : 'Vista' : state.modoAtual.eixo;
        const instrucoes = state.modoAtual.eixo === null ? 'R R livre · R X/Y/Z trava · LMB confirma · RMB cancela' : 'Enter aplica valor · LMB confirma · RMB cancela';
        const entradaNumerica = state.modoAtual.eixo === null ? [] : [criaTextoEntradaNumericaRotate(state.modoAtual.entradaNumerica)];

        return { titulo: 'Rotate', nomeObjeto, detalhes: [`Eixo: ${eixo}`, ...entradaNumerica, ...criaDetalhesVetores(instrucoes, delta, formataDeltaRotacaoEditor3D)] };
    }

    if (state.modoAtual.tipo === 'SCALE') {
        const delta = subtraiVetoresEditor3D(objeto.escala, state.modoAtual.escalaInicial);
        const eixo = state.modoAtual.eixo === null ? 'Livre' : state.modoAtual.eixo;

        return { titulo: 'Scale', nomeObjeto, detalhes: [`Eixo: ${eixo}`, ...criaDetalhesVetores('S X/Y/Z trava · LMB confirma · RMB cancela', delta, formataDeltaEditor3D)] };
    }

    return null;
};