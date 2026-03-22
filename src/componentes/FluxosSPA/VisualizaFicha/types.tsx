import SPA__VisualizaFicha__VisualizacaoInicial from "./paginas/visualizacaoInicial";
import SPA__ExibirFicha__FichaTemporaria from "./paginas/exibirFicha";

export const PAGINAS_VISUALIZA_FICHA = {
    INICIAL: SPA__VisualizaFicha__VisualizacaoInicial,
    EXIBIR_FICHA: SPA__ExibirFicha__FichaTemporaria,
} as const;

export type PAGINAS_SPA__VISUALIZA_FICHA = keyof typeof PAGINAS_VISUALIZA_FICHA;

export const enum PAGINA_FICHA_TEMPORARIA {
    INICIAL,
    EXIBIR_FICHA,
};