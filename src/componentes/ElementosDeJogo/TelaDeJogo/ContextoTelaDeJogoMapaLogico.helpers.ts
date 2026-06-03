import type { MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto, RESPONSE__EmitirMapaLogicoSalaJogo } from 'types-nora-api';

import type { CelulaMapaLogicoTelaJogo, OcupanteVisualMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';

export function validaRespostaMapaLogicoSalaJogo(resposta: RESPONSE__EmitirMapaLogicoSalaJogo): string | null {
    const payload = resposta.mapaLogicoSalaJogo;

    if (!payload) return 'Resposta do mapa lógico veio sem payload.';
    if (payload.mapaLogico.largura <= 0 || !Number.isFinite(payload.mapaLogico.largura) || !Number.isInteger(payload.mapaLogico.largura)) return 'Mapa lógico veio com largura inválida.';
    if (payload.mapaLogico.altura <= 0 || !Number.isFinite(payload.mapaLogico.altura) || !Number.isInteger(payload.mapaLogico.altura)) return 'Mapa lógico veio com altura inválida.';

    for (const ocupante of payload.ocupantesMapaLogico) {
        if (!Number.isFinite(ocupante.posicao.x) || !Number.isInteger(ocupante.posicao.x)) return `Ocupante ${ocupante.nomeExibicao} veio com posição X inválida.`;
        if (!Number.isFinite(ocupante.posicao.y) || !Number.isInteger(ocupante.posicao.y)) return `Ocupante ${ocupante.nomeExibicao} veio com posição Y inválida.`;
        if (ocupante.posicao.x < 0 || ocupante.posicao.y < 0 || ocupante.posicao.x >= payload.mapaLogico.largura || ocupante.posicao.y >= payload.mapaLogico.altura) return `Ocupante ${ocupante.nomeExibicao} veio fora dos limites do mapa.`;
    }

    return null;
};

export function criaCelulasMapaLogico(payload: MapaLogicoSalaJogoPayloadWsDto): CelulaMapaLogicoTelaJogo[] {
    const celulas: CelulaMapaLogicoTelaJogo[] = [];

    for (let y = 0; y < payload.mapaLogico.altura; y++) {
        for (let x = 0; x < payload.mapaLogico.largura; x++) {
            celulas.push({ key: `${x}:${y}`, x, y, ocupantes: payload.ocupantesMapaLogico.filter(ocupante => ocupante.posicao.x === x && ocupante.posicao.y === y).map(criaOcupanteVisualMapaLogico) });
        }
    }

    return celulas;
};

function criaOcupanteVisualMapaLogico(ocupante: OcupanteMapaLogicoSalaJogoWsDto): OcupanteVisualMapaLogicoTelaJogo {
    return { ...ocupante, rotuloCurto: criaRotuloCurtoOcupante(ocupante.nomeExibicao) };
};

function criaRotuloCurtoOcupante(nomeExibicao: string): string {
    const partes = nomeExibicao.trim().split(/\s+/).filter(parte => parte.length > 0);
    if (partes.length === 0) return '?';

    return partes.slice(0, 2).map(parte => parte[0]?.toUpperCase() ?? '').join('');
};
