import type { InteragivelPercebidoSalaJogoWsDto, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto, PosicaoMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import type { DocumentoCena3DPrototipo, ObjetoCena3DPrototipo, Vetor3Cena3DPrototipo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.types';

const matrizBaseIdentidadeCena3DSalaJogo: readonly number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const alturaParedeCena3DSalaJogo = 3.2;
const espessuraParedeCena3DSalaJogo = 0.22;
const alturaCameraSerCena3DSalaJogo = 1.55;

export function criaDocumentoCena3DSalaJogo(payload: MapaLogicoSalaJogoPayloadWsDto, keysInteragiveisNovos: readonly string[]): DocumentoCena3DPrototipo {
    const largura = payload.mapaLogico.larguraMetros;
    const altura = payload.mapaLogico.alturaMetros;
    const posicaoEntrada = payload.ocupantesMapaLogico[0]?.posicao ?? { x: Math.floor(largura / 2), y: Math.floor(altura / 2) };

    return {
        versao: 1,
        objetos: [
            ...criaObjetosSalaTesteCena3D(largura, altura),
            ...payload.ocupantesMapaLogico.flatMap(criaObjetosOcupanteCena3D),
            ...payload.interagiveisPercebidos.flatMap(interagivel => criaObjetosInteragivelCena3D(interagivel, keysInteragiveisNovos.includes(interagivel.key))),
        ],
        colecoes: [],
        pontoEntradaJogador: {
            posicao: [posicaoEntrada.x + 0.5, posicaoEntrada.y + 0.5, alturaCameraSerCena3DSalaJogo],
            rotacaoZ: calculaYawOlhandoParaCentroCena3D(posicaoEntrada, largura, altura),
        },
        configuracaoAmbiente: {
            corFundo: '#111318',
            luzAmbiente: 0.72,
            mostrarGrade: false,
        },
    };
};

function criaObjetosSalaTesteCena3D(largura: number, altura: number): ObjetoCena3DPrototipo[] {
    return [
        criaObjetoCena3D('sala:piso', 'Piso da sala de testes', 'CUBO_3D', [largura / 2, altura / 2, -0.05], [largura, altura, 0.1], [0.25, 0.27, 0.31]),
        criaObjetoCena3D('sala:parede:norte', 'Parede norte da sala de testes', 'CUBO_3D', [largura / 2, -espessuraParedeCena3DSalaJogo / 2, alturaParedeCena3DSalaJogo / 2], [largura + espessuraParedeCena3DSalaJogo, espessuraParedeCena3DSalaJogo, alturaParedeCena3DSalaJogo], [0.36, 0.38, 0.43]),
        criaObjetoCena3D('sala:parede:sul', 'Parede sul da sala de testes', 'CUBO_3D', [largura / 2, altura + espessuraParedeCena3DSalaJogo / 2, alturaParedeCena3DSalaJogo / 2], [largura + espessuraParedeCena3DSalaJogo, espessuraParedeCena3DSalaJogo, alturaParedeCena3DSalaJogo], [0.36, 0.38, 0.43]),
        criaObjetoCena3D('sala:parede:oeste', 'Parede oeste da sala de testes', 'CUBO_3D', [-espessuraParedeCena3DSalaJogo / 2, altura / 2, alturaParedeCena3DSalaJogo / 2], [espessuraParedeCena3DSalaJogo, altura + espessuraParedeCena3DSalaJogo, alturaParedeCena3DSalaJogo], [0.32, 0.34, 0.39]),
        criaObjetoCena3D('sala:parede:leste', 'Parede leste da sala de testes', 'CUBO_3D', [largura + espessuraParedeCena3DSalaJogo / 2, altura / 2, alturaParedeCena3DSalaJogo / 2], [espessuraParedeCena3DSalaJogo, altura + espessuraParedeCena3DSalaJogo, alturaParedeCena3DSalaJogo], [0.32, 0.34, 0.39]),
    ];
};

function criaObjetosOcupanteCena3D(ocupante: OcupanteMapaLogicoSalaJogoWsDto): ObjetoCena3DPrototipo[] {
    const x = ocupante.posicao.x + 0.5;
    const y = ocupante.posicao.y + 0.5;

    return [
        criaObjetoCena3D(`ocupante:${ocupante.keySer}:base`, `${ocupante.nomeExibicao} - base`, 'CILINDRO_3D', [x, y, 0.08], [0.92, 0.92, 0.16], [0.58, 0.13, 0.17]),
        criaObjetoCena3D(`ocupante:${ocupante.keySer}:corpo`, `${ocupante.nomeExibicao} - corpo`, 'CILINDRO_3D', [x, y, 0.78], [0.5, 0.5, 1.22], [0.68, 0.2, 0.24]),
        criaObjetoCena3D(`ocupante:${ocupante.keySer}:cabeca`, `${ocupante.nomeExibicao} - cabeca`, 'ESFERA_3D', [x, y, 1.58], [0.32, 0.32, 0.32], [0.82, 0.62, 0.46]),
    ];
};

function criaObjetosInteragivelCena3D(interagivel: InteragivelPercebidoSalaJogoWsDto, ehNovo: boolean): ObjetoCena3DPrototipo[] {
    if (interagivel.posicao === null) return [];

    if (interagivel.tipo === 'ser') return criaObjetosSerInteragivelCena3D(interagivel, ehNovo);

    const cor: Vetor3Cena3DPrototipo = ehNovo ? [0.92, 0.76, 0.28] : [0.54, 0.64, 0.84];
    return [criaObjetoCena3D(`interagivel:${interagivel.key}:volume`, interagivel.nome, 'CUBO_3D', [interagivel.posicao.x + 0.5, interagivel.posicao.y + 0.5, 0.45], [0.8, 0.8, 0.9], cor)];
};

function criaObjetosSerInteragivelCena3D(interagivel: InteragivelPercebidoSalaJogoWsDto, ehNovo: boolean): ObjetoCena3DPrototipo[] {
    if (interagivel.posicao === null) return [];

    const corCorpo: Vetor3Cena3DPrototipo = ehNovo ? [0.88, 0.68, 0.24] : [0.45, 0.55, 0.78];
    const corCabeca: Vetor3Cena3DPrototipo = ehNovo ? [0.95, 0.8, 0.48] : [0.78, 0.68, 0.56];
    const x = interagivel.posicao.x + 0.5;
    const y = interagivel.posicao.y + 0.5;

    return [
        criaObjetoCena3D(`interagivel:${interagivel.key}:corpo`, `${interagivel.nome} - corpo`, 'CILINDRO_3D', [x, y, 0.75], [0.58, 0.58, 1.2], corCorpo),
        criaObjetoCena3D(`interagivel:${interagivel.key}:cabeca`, `${interagivel.nome} - cabeca`, 'ESFERA_3D', [x, y, 1.52], [0.34, 0.34, 0.34], corCabeca),
    ];
};

function criaObjetoCena3D(id: string, nome: string, tipo: ObjetoCena3DPrototipo['tipo'], posicao: Vetor3Cena3DPrototipo, escala: Vetor3Cena3DPrototipo, corBase: Vetor3Cena3DPrototipo): ObjetoCena3DPrototipo {
    return {
        id,
        nome,
        tipo,
        quantidadeVertices: 24,
        transform: {
            posicao,
            rotacao: [0, 0, 0],
            escala,
            matrizBase: matrizBaseIdentidadeCena3DSalaJogo,
        },
        material: {
            corBase,
            corLuz: [0, 0, 0],
        },
        visivel: true,
        colisao: true,
        colecaoId: null,
    };
};

function calculaYawOlhandoParaCentroCena3D(posicaoEntrada: PosicaoMapaLogicoSalaJogoWsDto, largura: number, altura: number): number {
    const destinoX = largura / 2;
    const destinoY = altura / 2;
    const direcaoX = destinoX - (posicaoEntrada.x + 0.5);
    const direcaoY = destinoY - (posicaoEntrada.y + 0.5);

    return Math.atan2(direcaoX, direcaoY);
};
