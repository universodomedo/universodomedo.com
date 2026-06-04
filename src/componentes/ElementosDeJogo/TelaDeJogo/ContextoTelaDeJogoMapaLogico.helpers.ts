import type { MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto, RESPONSE__EmitirMapaLogicoSalaJogo } from 'types-nora-api';

import type { CelulaMapaLogicoTelaJogo, OcupanteVisualMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';

export function validaRespostaMapaLogicoSalaJogo(resposta: RESPONSE__EmitirMapaLogicoSalaJogo): string | null {
    const payload = resposta.mapaLogicoSalaJogo;

    if (!payload) return 'Resposta do mapa lógico veio sem payload.';
    if (!payload.mapaLogico) return 'Resposta do mapa lógico veio sem dimensões.';
    if (!Array.isArray(payload.ocupantesMapaLogico)) return 'Resposta do mapa lógico veio sem ocupantes válidos.';
    if (payload.mapaLogico.largura <= 0 || !Number.isFinite(payload.mapaLogico.largura) || !Number.isInteger(payload.mapaLogico.largura)) return 'Mapa lógico veio com largura inválida.';
    if (payload.mapaLogico.altura <= 0 || !Number.isFinite(payload.mapaLogico.altura) || !Number.isInteger(payload.mapaLogico.altura)) return 'Mapa lógico veio com altura inválida.';

    for (const ocupante of payload.ocupantesMapaLogico) {
        if (!ocupante.keySer || !ocupante.nomeExibicao) return 'Ocupante do mapa veio sem identificação pública válida.';
        if (!Number.isInteger(ocupante.idFicha) || ocupante.idFicha <= 0) return `Ocupante ${ocupante.nomeExibicao} veio sem vínculo válido com ficha.`;
        if (ocupante.perfilFuncional?.key !== 'policial_funcional_mvp' || !ocupante.perfilFuncional.nome) return `Ocupante ${ocupante.nomeExibicao} veio sem perfil funcional válido.`;
        if (!Number.isFinite(ocupante.posicao.x) || !Number.isInteger(ocupante.posicao.x)) return `Ocupante ${ocupante.nomeExibicao} veio com posição X inválida.`;
        if (!Number.isFinite(ocupante.posicao.y) || !Number.isInteger(ocupante.posicao.y)) return `Ocupante ${ocupante.nomeExibicao} veio com posição Y inválida.`;
        if (ocupante.posicao.x < 0 || ocupante.posicao.y < 0 || ocupante.posicao.x >= payload.mapaLogico.largura || ocupante.posicao.y >= payload.mapaLogico.altura) return `Ocupante ${ocupante.nomeExibicao} veio fora dos limites do mapa.`;
        if (!Array.isArray(ocupante.recursosFuncionais)) return `Ocupante ${ocupante.nomeExibicao} veio sem recursos funcionais válidos.`;
        if (!Array.isArray(ocupante.capacidadesFuncionais)) return `Ocupante ${ocupante.nomeExibicao} veio sem capacidades funcionais válidas.`;
        if (!Array.isArray(ocupante.acoesDisponiveis)) return `Ocupante ${ocupante.nomeExibicao} veio sem ações disponíveis válidas.`;

        for (const recurso of ocupante.recursosFuncionais) {
            if (!recurso.key || !recurso.nome || !recurso.nomeLogico || !recurso.descricaoEstado) return `Ocupante ${ocupante.nomeExibicao} veio com recurso funcional inválido.`;
            if (!recurso.grupoFuncional?.nome || !recurso.estadoResumo?.nome) return `Recurso ${recurso.nome} veio sem leitura funcional válida.`;
            if (!Array.isArray(recurso.capacidadesFuncionais)) return `Recurso ${recurso.nome} veio sem capacidades funcionais válidas.`;
        }
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
