import SPA_PaginaJogadorCriarFicha_Inicial from "./paginas/inicial";
import SPA_PaginaJogadorCriarFicha_EvolucaoInicial from "./paginas/evolucaoInicial";

export const PAGINAS_CRIA_FICHA = {
    INICIAL: <SPA_PaginaJogadorCriarFicha_Inicial />,
    EVOLUCAO_INICIAL: <SPA_PaginaJogadorCriarFicha_EvolucaoInicial />,
} as const;

export type PAGINAS_SPA__CRIA_FICHA = keyof typeof PAGINAS_CRIA_FICHA;