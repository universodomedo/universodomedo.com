import type { AreaPercentual, ComposicaoVisualTutorial } from 'types-nora-api';

// Etapa 8: estado local do editor de Tutoriais (sem identidade persistida; idLocal só para key/targeting na UI).
export type BlocoLocalTutorial = { idLocal: number; tipo: 'texto' | 'imagem'; markdown: string; idArquivoTipadoArte: number | null; area: AreaPercentual };
export type PassoLocalTutorial = { idLocal: number; blocos: readonly BlocoLocalTutorial[]; textoBotaoVoltar?: string; textoBotaoAvancar?: string; textoBotaoConcluir?: string; textoBotaoFechar?: string };
export type DirecaoReordenar = 'cima' | 'baixo';
export type DirecaoResizeTutorial = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type CampoTextoBotaoTutorial = 'textoBotaoVoltar' | 'textoBotaoAvancar' | 'textoBotaoConcluir' | 'textoBotaoFechar';
export type ResultadoAdicionaBlocoTutorial = { ok: true; passos: readonly PassoLocalTutorial[] } | { ok: false; motivo: string };
export type ResultadoMontaComposicaoTutorial = { ok: true; composicao: ComposicaoVisualTutorial } | { ok: false; motivo: string };
