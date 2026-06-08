import type { Editor3DState } from '../estado/editor3D.estado.types';

export function obtemBloqueioCarregamentoCenaCanonicaEditor3D(state: Editor3DState): string | null {
    if (state.malhaEmCriacao !== null) return 'Finalize ou cancele a malha em criacao antes de carregar o projeto.';
    if (state.modoAtual.tipo !== 'NENHUM') return 'Confirme ou cancele a transformacao em andamento antes de carregar o projeto.';
    if (state.insetFaceEdicao !== null) return 'Confirme ou cancele o inset em edicao antes de carregar o projeto.';
    if (state.bevelEdicao !== null) return 'Confirme ou cancele o bevel em edicao antes de carregar o projeto.';
    if (state.modoOperacao !== 'OBJETO') return 'Saia do modo de edicao antes de carregar o projeto.';

    return null;
};