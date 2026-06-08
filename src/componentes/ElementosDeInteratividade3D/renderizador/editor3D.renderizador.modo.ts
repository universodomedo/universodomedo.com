export type ModoRenderizacaoEditor3D = 'EDICAO' | 'EXPORTACAO';

export function renderizacaoEditor3DExibeAmbienteEdicao(modoRenderizacao: ModoRenderizacaoEditor3D): boolean { return modoRenderizacao === 'EDICAO'; };
