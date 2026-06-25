import type { CapacidadeInataSerNaSalaJogoWsDto, InteragivelPercebidoSalaJogoWsDto, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto, PosicaoMapaLogicoSalaJogoWsDto, RESPONSE__EmitirMapaLogicoSalaJogo, SerNaSalaJogoWsDto } from 'types-nora-api';

import type { TipoInteragivelPercebidoSalaDeJogoRuntime } from 'types-nora-api';

import type { EstiloMarcadorMapaLogicoTelaJogo, InteragivelVisualMapaLogicoTelaJogo, OcupanteVisualMapaLogicoTelaJogo, SerVisualMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';

export function validaRespostaMapaLogicoSalaJogo(resposta: RESPONSE__EmitirMapaLogicoSalaJogo): string | null {
    const payload = resposta.mapaLogicoSalaJogo;

    if (!payload) return 'Resposta do mapa lógico veio sem payload.';
    if (!payload.mapaLogico) return 'Resposta do mapa lógico veio sem dimensões.';
    if (!Array.isArray(payload.ocupantesMapaLogico)) return 'Resposta do mapa lógico veio sem ocupantes válidos.';
    if (!Array.isArray(payload.seresNaSala)) return 'Resposta do mapa lógico veio sem seres persistidos válidos.';
    if (!Array.isArray(payload.interagiveisPercebidos)) return 'Resposta do mapa lógico veio sem interagíveis percebidos válidos.';
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
        if (!ser.keyInstancia || !Number.isInteger(ser.id) || ser.id <= 0 || !ser.nome) return 'Ser persistido da sala veio sem identificação válida.';
        if (ser.papel !== 'controlado' && ser.papel !== 'inimigo') return `Ser ${ser.nome} veio com papel inválido.`;
        if (!ser.posicao) return `Ser ${ser.nome} veio sem posição lógica.`;
        if (!Number.isFinite(ser.posicao.x) || !Number.isInteger(ser.posicao.x)) return `Ser ${ser.nome} veio com posição X inválida.`;
        if (!Number.isFinite(ser.posicao.y) || !Number.isInteger(ser.posicao.y)) return `Ser ${ser.nome} veio com posição Y inválida.`;
        if (ser.posicao.x < 0 || ser.posicao.y < 0 || ser.posicao.x >= payload.mapaLogico.larguraMetros || ser.posicao.y >= payload.mapaLogico.alturaMetros) return `Ser ${ser.nome} veio fora dos limites métricos do mapa.`;
        if (!Array.isArray(ser.estatisticasDanificaveis)) return `Ser ${ser.nome} veio sem estatísticas danificáveis válidas.`;
        if (!Array.isArray(ser.membros)) return `Ser ${ser.nome} veio sem membros válidos.`;

        for (const estatistica of ser.estatisticasDanificaveis) {
            if (!Number.isInteger(estatistica.id) || estatistica.id <= 0 || !estatistica.nome) return `Ser ${ser.nome} veio com estatística danificável inválida.`;
            if (!Number.isFinite(estatistica.valorAtual) || !Number.isFinite(estatistica.valorMaximo)) return `Estatística ${estatistica.nome} veio com valores inválidos.`;
        }

        for (const membro of ser.membros) {
            if (!Number.isInteger(membro.id) || membro.id <= 0 || !membro.nome) return `Ser ${ser.nome} veio com membro inválido.`;
            if (!Array.isArray(membro.capacidades)) return `Membro ${membro.nome} veio sem capacidades inatas válidas.`;
            if (!Array.isArray(membro.acoesDisponiveis)) return `Membro ${membro.nome} veio sem ações disponíveis válidas.`;

            for (const capacidade of membro.capacidades) {
                if (!Number.isInteger(capacidade.id) || capacidade.id <= 0 || !capacidade.nome || !capacidade.nomeInteracao) return `Membro ${membro.nome} veio com capacidade inata inválida.`;
            }

            for (const acao of membro.acoesDisponiveis) {
                if (!acao.key || !acao.nome || (acao.estado !== 'DISPONIVEL' && acao.estado !== 'EXECUTANDO')) return `Membro ${membro.nome} veio com ação disponível inválida.`;
                if (!acao.origem) return `Ação ${acao.nome} veio sem origem.`;
                if (acao.origem.keyInstanciaSer !== ser.keyInstancia) return `Ação ${acao.nome} veio com origem de instância inconsistente.`;
                if (acao.origem.idSer !== ser.id || acao.origem.nomeSer !== ser.nome) return `Ação ${acao.nome} veio com origem de ser inconsistente.`;
                if (acao.origem.idMembro !== membro.id || acao.origem.nomeMembro !== membro.nome) return `Ação ${acao.nome} veio com origem de membro inconsistente.`;
                if (!Number.isInteger(acao.origem.idCapacidadeInata) || acao.origem.idCapacidadeInata <= 0 || !acao.origem.nomeCapacidadeInata || !acao.origem.nomeInteracaoCapacidadeInata) return `Ação ${acao.nome} veio com origem de capacidade inata inválida.`;

                const capacidadeOrigem = obtemCapacidadeOrigemAcaoSerNaSala(membro.capacidades, acao.origem.idCapacidadeInata);
                if (!capacidadeOrigem || capacidadeOrigem.nome !== acao.origem.nomeCapacidadeInata || capacidadeOrigem.nomeInteracao !== acao.origem.nomeInteracaoCapacidadeInata) return `Ação ${acao.nome} veio sem capacidade inata correspondente no membro.`;
            }
        }
    }

    for (const interagivel of payload.interagiveisPercebidos) {
        if (!interagivel.key || !interagivel.nome || !interagivel.descricao || !ehTipoInteragivelPercebidoValido(interagivel.tipo)) return 'Interagível percebido veio sem identificação válida.';

        if (interagivel.posicao !== null) {
            if (!Number.isFinite(interagivel.posicao.x) || !Number.isInteger(interagivel.posicao.x)) return `Interagível ${interagivel.nome} veio com posição X inválida.`;
            if (!Number.isFinite(interagivel.posicao.y) || !Number.isInteger(interagivel.posicao.y)) return `Interagível ${interagivel.nome} veio com posição Y inválida.`;
            if (interagivel.posicao.x < 0 || interagivel.posicao.y < 0 || interagivel.posicao.x >= payload.mapaLogico.larguraMetros || interagivel.posicao.y >= payload.mapaLogico.alturaMetros) return `Interagível ${interagivel.nome} veio fora dos limites métricos do mapa.`;
        }
    }

    return null;
};

export function criaOcupantesVisuaisMapaLogico(payload: MapaLogicoSalaJogoPayloadWsDto): OcupanteVisualMapaLogicoTelaJogo[] {
    return payload.ocupantesMapaLogico.map(ocupante => criaOcupanteVisualMapaLogico(ocupante, payload));
};

export function criaSeresVisuaisMapaLogico(payload: MapaLogicoSalaJogoPayloadWsDto): SerVisualMapaLogicoTelaJogo[] {
    return payload.seresNaSala.map(ser => criaSerVisualMapaLogico(ser, payload));
};

export function criaInteragiveisVisuaisMapaLogico(payload: MapaLogicoSalaJogoPayloadWsDto): InteragivelVisualMapaLogicoTelaJogo[] {
    return payload.interagiveisPercebidos.map(interagivel => criaInteragivelVisualMapaLogico(interagivel, payload));
};

function obtemCapacidadeOrigemAcaoSerNaSala(capacidades: readonly CapacidadeInataSerNaSalaJogoWsDto[], idCapacidadeInata: number): CapacidadeInataSerNaSalaJogoWsDto | null {
    return capacidades.find((capacidade: CapacidadeInataSerNaSalaJogoWsDto) => capacidade.id === idCapacidadeInata) ?? null;
};

function ehTipoInteragivelPercebidoValido(tipo: string): tipo is TipoInteragivelPercebidoSalaDeJogoRuntime {
    return tipo === 'ser' || tipo === 'objeto' || tipo === 'elemento_sensorial';
};

function criaOcupanteVisualMapaLogico(ocupante: OcupanteMapaLogicoSalaJogoWsDto, payload: MapaLogicoSalaJogoPayloadWsDto): OcupanteVisualMapaLogicoTelaJogo {
    return { ...ocupante, rotuloCurto: criaRotuloCurtoNome(ocupante.nomeExibicao), estiloMarcador: criaEstiloMarcadorMapaLogico(ocupante.posicao, payload) };
};

function criaSerVisualMapaLogico(ser: SerNaSalaJogoWsDto, payload: MapaLogicoSalaJogoPayloadWsDto): SerVisualMapaLogicoTelaJogo {
    return { ...ser, posicao: { ...ser.posicao }, estatisticasDanificaveis: ser.estatisticasDanificaveis.map(estatistica => ({ ...estatistica })), membros: ser.membros.map(membro => ({ id: membro.id, nome: membro.nome, capacidades: membro.capacidades.map(capacidade => ({ id: capacidade.id, nome: capacidade.nome, nomeInteracao: capacidade.nomeInteracao })), acoesDisponiveis: membro.acoesDisponiveis.map(acao => ({ key: acao.key, nome: acao.nome, estado: acao.estado, origem: { ...acao.origem }, parametros: { ...acao.parametros } })) })), rotuloCurto: criaRotuloCurtoNome(ser.nome), estiloMarcador: criaEstiloMarcadorMapaLogico(ser.posicao, payload) };
};

function criaInteragivelVisualMapaLogico(interagivel: InteragivelPercebidoSalaJogoWsDto, payload: MapaLogicoSalaJogoPayloadWsDto): InteragivelVisualMapaLogicoTelaJogo {
    return { ...interagivel, posicao: interagivel.posicao ? { ...interagivel.posicao } : null, rotuloCurto: criaRotuloCurtoNome(interagivel.nome), estiloMarcador: interagivel.posicao ? criaEstiloMarcadorMapaLogico(interagivel.posicao, payload) : null };
};

function criaEstiloMarcadorMapaLogico(posicao: PosicaoMapaLogicoSalaJogoWsDto, payload: MapaLogicoSalaJogoPayloadWsDto): EstiloMarcadorMapaLogicoTelaJogo {
    return { '--mapa-logico-marcador-x': `${posicao.x / payload.mapaLogico.larguraMetros * 100}%`, '--mapa-logico-marcador-y': `${posicao.y / payload.mapaLogico.alturaMetros * 100}%` };
};

function criaRotuloCurtoNome(nome: string): string {
    const partes = nome.trim().split(/\s+/).filter(parte => parte.length > 0);
    if (partes.length === 0) return '?';

    return partes.slice(0, 2).map(parte => parte[0]?.toUpperCase() ?? '').join('');
};