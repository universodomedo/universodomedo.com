export type ModoRenderizacaoEditor3D = 'EDICAO' | 'EXPORTACAO' | 'JOGO';

export function renderizacaoEditor3DExibeAmbienteEdicao(modoRenderizacao: ModoRenderizacaoEditor3D): boolean { return modoRenderizacao === 'EDICAO'; };
