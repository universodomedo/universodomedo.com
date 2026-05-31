import type { Editor3DState } from './editor3D.estado.types';

export function obtemMotivoBloqueioInsetFacesEditor3D(estado: Editor3DState): string | null {
    if (estado.modoOperacao !== 'EDICAO') return 'Entre no Edit Mode para usar Inset Faces.';
    if (estado.tipoSelecaoEdicao !== 'FACE') return 'Inset Faces exige Selecao de Face. Pressione 3 e selecione uma face.';
    if (estado.modoAtual.tipo !== 'NENHUM') return 'Finalize a transformacao atual antes de usar Inset Faces.';
    if (estado.malhaEmCriacao !== null) return 'Finalize a criacao de mesh antes de usar Inset Faces.';
    if (estado.escopoEdicao === null) return 'Selecione um objeto editavel antes de usar Inset Faces.';
    if (estado.insetFaceEdicao !== null) return 'Inset Faces em andamento: mova o mouse e confirme com clique esquerdo ou Enter.';
    if (estado.bevelEdicao !== null) return 'Bevel em andamento: confirme ou cancele antes de usar Inset Faces.';
    if (estado.faceSelecionadaEdicao === null) return 'Selecione uma face para usar Inset Faces.';
    if (estado.faceSelecionadaEdicao.idObjeto !== estado.escopoEdicao.idObjetoAtivo) return 'Selecione uma face do objeto ativo para usar Inset Faces.';

    return null;
};

export function obtemMotivoBloqueioBevelEditor3D(estado: Editor3DState): string | null {
    if (estado.modoOperacao !== 'EDICAO') return 'Bevel so pode ser usado em Edit Mode.';
    if (estado.modoAtual.tipo !== 'NENHUM') return 'Finalize a transformacao atual antes de usar Bevel.';
    if (estado.malhaEmCriacao !== null) return 'Finalize a criacao de mesh antes de usar Bevel.';
    if (estado.escopoEdicao === null) return 'Selecione um objeto editavel antes de usar Bevel.';
    if (estado.insetFaceEdicao !== null) return 'Inset Faces em andamento: confirme ou cancele antes de usar Bevel.';
    if (estado.bevelEdicao !== null) return 'Bevel em andamento: mova o mouse e confirme com clique esquerdo ou Enter.';
    if (estado.tipoSelecaoEdicao !== 'ARESTA' && estado.tipoSelecaoEdicao !== 'FACE') return 'Selecione uma aresta ou face para usar Bevel.';
    if (estado.tipoSelecaoEdicao === 'ARESTA' && (estado.arestaSelecionadaEdicao === null || estado.arestaSelecionadaEdicao.idObjeto !== estado.escopoEdicao.idObjetoAtivo)) return 'Selecione uma aresta do objeto ativo para usar Bevel.';
    if (estado.tipoSelecaoEdicao === 'FACE' && (estado.faceSelecionadaEdicao === null || estado.faceSelecionadaEdicao.idObjeto !== estado.escopoEdicao.idObjetoAtivo)) return 'Selecione uma face do objeto ativo para usar Bevel.';

    return null;
};
