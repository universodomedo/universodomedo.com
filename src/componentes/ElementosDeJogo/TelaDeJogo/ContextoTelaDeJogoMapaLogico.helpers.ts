import type { CapacidadeInataSerNaSalaJogoWsDto, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto, PosicaoMapaLogicoSalaJogoWsDto, RESPONSE__EmitirMapaLogicoSalaJogo, SerNaSalaJogoWsDto } from 'types-nora-api';

import type { OcupanteVisualMapaLogicoTelaJogo, RegiaoVisualMapaLogicoTelaJogo, SerVisualMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';

export const QUANTIDADE_REGIOES_VISUAIS_MAPA_LOGICO_TRANSICAO = 10;

export function validaRespostaMapaLogicoSalaJogo(resposta: RESPONSE__EmitirMapaLogicoSalaJogo): string | null {
    const payload = resposta.mapaLogicoSalaJogo;

    if (!payload) return 'Resposta do mapa lógico veio sem payload.';
    if (!payload.mapaLogico) return 'Resposta do mapa lógico veio sem dimensões.';
    if (!Array.isArray(payload.ocupantesMapaLogico)) return 'Resposta do mapa lógico veio sem ocupantes válidos.';
    if (!Array.isArray(payload.seresNaSala)) return 'Resposta do mapa lógico veio sem seres persistidos válidos.';
    if (payload.mapaLogico.larguraMetros <= 0 || !Number.isFinite(payload.mapaLogico.larguraMetros) || !Number.isInteger(payload.mapaLogico.larguraMetros)) return 'Mapa lógico veio com largura em metros inválida.';
    if (payload.mapaLogico.alturaMetros <= 0 || !Number.isFinite(payload.mapaLogico.alturaMetros) || !Number.isInteger(payload.mapaLogico.alturaMetros)) return 'Mapa lógico veio com altura em metros inválida.';

    for (const ocupante of payload.ocupantesMapaLogico) {
        if (!ocupante.keySer || !ocupante.nomeExibicao) return 'Ocupante do mapa veio sem identificação pública válida.';
        if (!Number.isInteger(ocupante.idFicha) || ocupante.idFicha <= 0) return `Ocupante ${ocupante.nomeExibicao} veio sem vínculo válido com ficha.`;
        if (!ocupante.perfilFuncional?.key || !ocupante.perfilFuncional.nome) return `Ocupante ${ocupante.nomeExibicao} veio sem perfil funcional válido.`;
        if (!Number.isFinite(ocupante.posicao.x) || !Number.isInteger(ocupante.posicao.x)) return `Ocupante ${ocupante.nomeExibicao} veio com posição X inválida.`;
        if (!Number.isFinite(ocupante.posicao.y) || !Number.isInteger(ocupante.posicao.y)) return `Ocupante ${ocupante.nomeExibicao} veio com posição Y inválida.`;
        if (ocupante.posicao.x < 0 || ocupante.posicao.y < 0 || ocupante.posicao.x >= payload.mapaLogico.larguraMetros || ocupante.posicao.y >= payload.mapaLogico.alturaMetros) return `Ocupante ${ocupante.nomeExibicao} veio fora dos limites métricos do mapa.`;
        if (!Array.isArray(ocupante.recursosFuncionais)) return `Ocupante ${ocupante.nomeExibicao} veio sem recursos funcionais válidos.`;
        if (!Array.isArray(ocupante.capacidadesFuncionais)) return `Ocupante ${ocupante.nomeExibicao} veio sem capacidades funcionais válidas.`;
        if (!Array.isArray(ocupante.acoesDisponiveis)) return `Ocupante ${ocupante.nomeExibicao} veio sem ações disponíveis válidas.`;

        for (const recurso of ocupante.recursosFuncionais) {
            if (!recurso.key || !recurso.nome || !recurso.nomeLogico || !recurso.descricaoEstado) return `Ocupante ${ocupante.nomeExibicao} veio com recurso funcional inválido.`;
            if (!recurso.grupoFuncional?.nome || !recurso.estadoResumo?.nome) return `Recurso ${recurso.nome} veio sem leitura funcional válida.`;
            if (!Array.isArray(recurso.capacidadesFuncionais)) return `Recurso ${recurso.nome} veio sem capacidades funcionais válidas.`;
        }
    }

    for (const ser of payload.seresNaSala) {
        if (!Number.isInteger(ser.id) || ser.id <= 0 || !ser.nome) return 'Ser persistido da sala veio sem identificação válida.';
        if (!ser.posicao) return `Ser ${ser.nome} veio sem posição lógica.`;
        if (!Number.isFinite(ser.posicao.x) || !Number.isInteger(ser.posicao.x)) return `Ser ${ser.nome} veio com posição X inválida.`;
        if (!Number.isFinite(ser.posicao.y) || !Number.isInteger(ser.posicao.y)) return `Ser ${ser.nome} veio com posição Y inválida.`;
        if (ser.posicao.x < 0 || ser.posicao.y < 0 || ser.posicao.x >= payload.mapaLogico.larguraMetros || ser.posicao.y >= payload.mapaLogico.alturaMetros) return `Ser ${ser.nome} veio fora dos limites métricos do mapa.`;
        if (!Array.isArray(ser.membros)) return `Ser ${ser.nome} veio sem membros válidos.`;

        for (const membro of ser.membros) {
            if (!Number.isInteger(membro.id) || membro.id <= 0 || !membro.nome) return `Ser ${ser.nome} veio com membro inválido.`;
            if (!Array.isArray(membro.capacidades)) return `Membro ${membro.nome} veio sem capacidades inatas válidas.`;
            if (!Array.isArray(membro.acoesDisponiveis)) return `Membro ${membro.nome} veio sem ações disponíveis válidas.`;

            for (const capacidade of membro.capacidades) {
                if (!Number.isInteger(capacidade.id) || capacidade.id <= 0 || !capacidade.nome) return `Membro ${membro.nome} veio com capacidade inata inválida.`;
            }

            for (const acao of membro.acoesDisponiveis) {
                if (!acao.key || !acao.nome || acao.estado !== 'DISPONIVEL') return `Membro ${membro.nome} veio com ação disponível inválida.`;
                if (!acao.origem) return `Ação ${acao.nome} veio sem origem.`;
                if (acao.origem.idSer !== ser.id || acao.origem.nomeSer !== ser.nome) return `Ação ${acao.nome} veio com origem de ser inconsistente.`;
                if (acao.origem.idMembro !== membro.id || acao.origem.nomeMembro !== membro.nome) return `Ação ${acao.nome} veio com origem de membro inconsistente.`;
                if (!Number.isInteger(acao.origem.idCapacidadeInata) || acao.origem.idCapacidadeInata <= 0 || !acao.origem.nomeCapacidadeInata) return `Ação ${acao.nome} veio com origem de capacidade inata inválida.`;

                const capacidadeOrigem = obtemCapacidadeOrigemAcaoSerNaSala(membro.capacidades, acao.origem.idCapacidadeInata);
                if (!capacidadeOrigem || capacidadeOrigem.nome !== acao.origem.nomeCapacidadeInata) return `Ação ${acao.nome} veio sem capacidade inata correspondente no membro.`;
            }
        }
    }

    return null;
};

export function criaRegioesVisuaisMapaLogico(payload: MapaLogicoSalaJogoPayloadWsDto): RegiaoVisualMapaLogicoTelaJogo[] {
    const regioesVisuais: RegiaoVisualMapaLogicoTelaJogo[] = [];

    for (let yIndice = 0; yIndice < QUANTIDADE_REGIOES_VISUAIS_MAPA_LOGICO_TRANSICAO; yIndice++) {
        for (let xIndice = 0; xIndice < QUANTIDADE_REGIOES_VISUAIS_MAPA_LOGICO_TRANSICAO; xIndice++) {
            const xInicialMetros = calculaInicioFaixaMetricaRegiaoVisual(xIndice, payload.mapaLogico.larguraMetros);
            const xFinalMetros = calculaFimFaixaMetricaRegiaoVisual(xIndice, payload.mapaLogico.larguraMetros);
            const yInicialMetros = calculaInicioFaixaMetricaRegiaoVisual(yIndice, payload.mapaLogico.alturaMetros);
            const yFinalMetros = calculaFimFaixaMetricaRegiaoVisual(yIndice, payload.mapaLogico.alturaMetros);

            regioesVisuais.push({ key: `${xIndice}:${yIndice}`, xIndice, yIndice, xInicialMetros, xFinalMetros, yInicialMetros, yFinalMetros, rotuloMetrico: `${xInicialMetros}m,${yInicialMetros}m`, ocupantes: payload.ocupantesMapaLogico.filter(ocupante => estaNaRegiaoVisualMapaLogico(ocupante.posicao, payload, xIndice, yIndice)).map(criaOcupanteVisualMapaLogico), seres: payload.seresNaSala.filter(ser => estaNaRegiaoVisualMapaLogico(ser.posicao, payload, xIndice, yIndice)).map(criaSerVisualMapaLogico) });
        }
    }

    return regioesVisuais;
};

function calculaInicioFaixaMetricaRegiaoVisual(indice: number, tamanhoMetros: number): number {
    return Math.floor(indice * tamanhoMetros / QUANTIDADE_REGIOES_VISUAIS_MAPA_LOGICO_TRANSICAO);
};

function calculaFimFaixaMetricaRegiaoVisual(indice: number, tamanhoMetros: number): number {
    return Math.max(calculaInicioFaixaMetricaRegiaoVisual(indice, tamanhoMetros), Math.ceil((indice + 1) * tamanhoMetros / QUANTIDADE_REGIOES_VISUAIS_MAPA_LOGICO_TRANSICAO) - 1);
};

function estaNaRegiaoVisualMapaLogico(posicao: PosicaoMapaLogicoSalaJogoWsDto, payload: MapaLogicoSalaJogoPayloadWsDto, xIndice: number, yIndice: number): boolean {
    return obtemIndiceRegiaoVisualMapaLogico(posicao.x, payload.mapaLogico.larguraMetros) === xIndice && obtemIndiceRegiaoVisualMapaLogico(posicao.y, payload.mapaLogico.alturaMetros) === yIndice;
};

function obtemIndiceRegiaoVisualMapaLogico(coordenadaMetros: number, tamanhoMetros: number): number {
    const indice = Math.floor(coordenadaMetros * QUANTIDADE_REGIOES_VISUAIS_MAPA_LOGICO_TRANSICAO / tamanhoMetros);
    return Math.min(Math.max(indice, 0), QUANTIDADE_REGIOES_VISUAIS_MAPA_LOGICO_TRANSICAO - 1);
};

function criaOcupanteVisualMapaLogico(ocupante: OcupanteMapaLogicoSalaJogoWsDto): OcupanteVisualMapaLogicoTelaJogo {
    return { ...ocupante, rotuloCurto: criaRotuloCurtoNome(ocupante.nomeExibicao) };
};

function obtemCapacidadeOrigemAcaoSerNaSala(capacidades: readonly CapacidadeInataSerNaSalaJogoWsDto[], idCapacidadeInata: number): CapacidadeInataSerNaSalaJogoWsDto | null {
    return capacidades.find((capacidade: CapacidadeInataSerNaSalaJogoWsDto) => capacidade.id === idCapacidadeInata) ?? null;
};

function criaSerVisualMapaLogico(ser: SerNaSalaJogoWsDto): SerVisualMapaLogicoTelaJogo {
    return { ...ser, posicao: { ...ser.posicao }, membros: ser.membros.map(membro => ({ id: membro.id, nome: membro.nome, capacidades: membro.capacidades.map(capacidade => ({ id: capacidade.id, nome: capacidade.nome })), acoesDisponiveis: membro.acoesDisponiveis.map(acao => ({ key: acao.key, nome: acao.nome, estado: acao.estado, origem: { ...acao.origem } })) })), rotuloCurto: criaRotuloCurtoNome(ser.nome) };
};

function criaRotuloCurtoNome(nome: string): string {
    const partes = nome.trim().split(/\s+/).filter(parte => parte.length > 0);
    if (partes.length === 0) return '?';

    return partes.slice(0, 2).map(parte => parte[0]?.toUpperCase() ?? '').join('');
};