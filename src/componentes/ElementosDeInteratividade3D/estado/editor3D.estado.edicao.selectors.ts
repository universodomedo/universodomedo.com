import type { Editor3DState } from './editor3D.estado.types';

export function obtemMotivoBloqueioInsetFacesEditor3D(estado: Editor3DState): string | null {
    if (estado.modoOperacao !== 'EDICAO') return 'Entre no Edit Mode para usar Inset Faces.';
    if (estado.tipoSelecaoEdicao !== 'FACE') return 'Inset Faces exige Selecao de Face. Pressione 3 e selecione uma face.';
    if (estado.modoAtual.tipo !== 'NENHUM') return 'Finalize a transformacao atual antes de usar Inset Faces.';
    if (estado.malhaEmCriacao !== null) return 'Finalize a criacao de mesh antes de usar Inset Faces.';
    if (estado.escopoEdicao === null) return 'Selecione um objeto editavel antes de usar Inset Faces.';
    if (estado.insetFaceEdicao !== null) return 'Inset Faces em andamento: mova o mouse e confirme com clique esquerdo ou Enter.';
    if (estado.faceSelecionadaEdicao === null) return 'Selecione uma face para usar Inset Faces.';
    if (estado.faceSelecionadaEdicao.idObjeto !== estado.escopoEdicao.idObjetoAtivo) return 'Selecione uma face do objeto ativo para usar Inset Faces.';

    return null;
};
