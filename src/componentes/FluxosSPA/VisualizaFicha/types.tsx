import SPA__VisualizaFicha__VisualizacaoInicial from "./paginas/visualizacaoInicial";

export const PAGINAS_VISUALIZA_FICHA = {
    INICIAL: SPA__VisualizaFicha__VisualizacaoInicial,
} as const;

export type PAGINAS_SPA__VISUALIZA_FICHA = keyof typeof PAGINAS_VISUALIZA_FICHA;