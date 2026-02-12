import SPA__VisualizaPersonagem__VisualizacaoInicial from './paginas/visualizacaoInicial.tsx';
import SPA__VisualizaPersonagem__EditavelInicial from './paginas/editavelInicial.tsx';
import SPA__VisualizaPersonagem__EditavelEvoluir from './paginas/editavelEvoluir.tsx';

export const PAGINAS_VISUALIZA_PERSONAGEM = {
    VISUALIZACAO_INICIAL: SPA__VisualizaPersonagem__VisualizacaoInicial,
    EDITAVEL_INICIAL: SPA__VisualizaPersonagem__EditavelInicial,
    EDITAVEL_EVOLUIR: SPA__VisualizaPersonagem__EditavelEvoluir,
} as const;

export type PAGINAS_SPA__VISUALIZA_PERSONAGEM = keyof typeof PAGINAS_VISUALIZA_PERSONAGEM;


export const enum TIPO_PAGINA_PERSONAGEM {
    EDITAVEL,
    VISUALIZACAO,
};

export const enum PAGINA_PERSONAGEM {
    INICIAL,
    EVOLUIR,
};