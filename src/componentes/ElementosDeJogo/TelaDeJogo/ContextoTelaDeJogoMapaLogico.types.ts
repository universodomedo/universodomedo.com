import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type { MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto, SerNaSalaJogoWsDto } from 'types-nora-api';

export type EstadoCarregamentoMapaLogicoTelaJogo = 'carregando' | 'erro' | 'pronto';

export type OcupanteVisualMapaLogicoTelaJogo = OcupanteMapaLogicoSalaJogoWsDto & {
    rotuloCurto: string;
};

export type SerVisualMapaLogicoTelaJogo = SerNaSalaJogoWsDto & {
    rotuloCurto: string;
};

export type RegiaoVisualMapaLogicoTelaJogo = {
    key: string;
    xIndice: number;
    yIndice: number;
    xInicialMetros: number;
    xFinalMetros: number;
    yInicialMetros: number;
    yFinalMetros: number;
    rotuloMetrico: string;
    ocupantes: readonly OcupanteVisualMapaLogicoTelaJogo[];
    seres: readonly SerVisualMapaLogicoTelaJogo[];
};

export type EstiloTransformacaoMapaLogicoTelaJogo = CSSProperties & {
    '--mapa-logico-regioes-x': number;
    '--mapa-logico-regioes-y': number;
    '--mapa-logico-pan-x': string;
    '--mapa-logico-pan-y': string;
    '--mapa-logico-zoom': number;
    '--mapa-logico-rotacao': string;
};

export type ArrasteMapaLogicoTelaJogo = {
    pointerId: number;
    clientXInicial: number;
    clientYInicial: number;
    panXInicialEm: number;
    panYInicialEm: number;
};

export type EstadoVisualMapaLogicoTelaJogo = {
    panXEm: number;
    panYEm: number;
    zoom: number;
    rotacaoGraus: number;
    arrastando: boolean;
};

export type ControleVisualMapaLogicoTelaJogo = {
    estiloMapa: EstiloTransformacaoMapaLogicoTelaJogo | undefined;
    arrastando: boolean;
    iniciaPan: (event: ReactPointerEvent<HTMLDivElement>) => void;
    atualizaPan: (event: ReactPointerEvent<HTMLDivElement>) => void;
    finalizaPan: (event: ReactPointerEvent<HTMLDivElement>) => void;
    aproximaZoom: () => void;
    afastaZoom: () => void;
    rotacionaMapa: () => void;
    resetaVisualizacao: () => void;
};

export type SelecaoOcupanteMapaLogicoTelaJogo = {
    keyOcupanteSelecionado: string | null;
    ocupanteSelecionado: OcupanteMapaLogicoSalaJogoWsDto | null;
    selecionaOcupante: (keySer: string) => void;
    limpaSelecaoOcupante: () => void;
    impedeInicioPanOcupante: (event: ReactPointerEvent<HTMLButtonElement>) => void;
};

export type ContextoTelaDeJogoMapaLogicoProps = ControleVisualMapaLogicoTelaJogo & SelecaoOcupanteMapaLogicoTelaJogo & {
    estadoCarregamento: EstadoCarregamentoMapaLogicoTelaJogo;
    erro: string | null;
    mapaLogicoSalaJogo: MapaLogicoSalaJogoPayloadWsDto | null;
    seresNaSala: readonly SerNaSalaJogoWsDto[];
    regioesVisuais: readonly RegiaoVisualMapaLogicoTelaJogo[];
};