import { BufferAttribute, BufferGeometry, MeshStandardMaterial } from 'three';
import { MarchingCubes } from 'three-stdlib';
import type { CorpoPersonagemCenaCanonicaEditor3D, MembroPersonagemEditor3D, ParametrosMembroPersonagemEditor3D } from 'types-nora-api';

// Gerador do corpo contínuo do Personagem: parâmetros por região → influenciadores esféricos (metaballs) → casca única via marching cubes.
// É a MESMA técnica provada no FiguraSerR3F (Sala de Jogo) — este módulo é o ponto de convergência editor↔jogo: a malha NUNCA persiste, é derivada daqui.
// Conexão por construção: as cadeias de bolas compartilham as juntas (ombro/quadril/pescoço) e são caminhadas com passo fixo — nenhum valor de slider abre vão.

export const PARAMETROS_REGIAO_NEUTROS_EDITOR3D: ParametrosMembroPersonagemEditor3D = { comprimento: 1, larguraSuperior: 1, larguraMedial: 1, larguraInferior: 1, profundidade: 1 };

export const CORPO_PERSONAGEM_PADRAO_EDITOR3D: CorpoPersonagemCenaCanonicaEditor3D = {
    cor: [0.455, 0.518, 0.706],
    global: PARAMETROS_REGIAO_NEUTROS_EDITOR3D,
    regioes: {
        CABECA: PARAMETROS_REGIAO_NEUTROS_EDITOR3D,
        TRONCO: PARAMETROS_REGIAO_NEUTROS_EDITOR3D,
        BRACO_ESQUERDO: PARAMETROS_REGIAO_NEUTROS_EDITOR3D,
        BRACO_DIREITO: PARAMETROS_REGIAO_NEUTROS_EDITOR3D,
        PERNA_ESQUERDA: PARAMETROS_REGIAO_NEUTROS_EDITOR3D,
        PERNA_DIREITA: PARAMETROS_REGIAO_NEUTROS_EDITOR3D,
    },
};

// Bola no campo escalar [0,1]³ (convenção do MarchingCubes cru): força = massa; subtração = queda (maior = membro mais fino/definido).
type BolaCorpo = { x: number; y: number; z: number; forca: number; subtracao: number; };

const ISOLAMENTO_CAMPO_CORPO = 80;

// Raio da superfície-iso de uma bola isolada: onde força/d² - subtração = iso.
function raioIsoBolaCorpo(bola: BolaCorpo): number { return Math.sqrt(bola.forca / (ISOLAMENTO_CAMPO_CORPO + bola.subtracao)); };

// Ponte por construção: centros consecutivos a no máximo 0.8×raio-iso da bola mais fina — as superfícies SEMPRE se sobrepõem,
// para qualquer força/comprimento de slider. Pontes finas (0.55×força, +6 subtração) para não engordar axila/entrepernas.
function ponte(bolas: BolaCorpo[], de: BolaCorpo, ate: BolaCorpo): void {
    bolas.push(de);
    const distancia = Math.hypot(ate.x - de.x, ate.y - de.y, ate.z - de.z);
    const passo = 0.8 * Math.min(raioIsoBolaCorpo(de), raioIsoBolaCorpo(ate));
    const intermediarias = Math.max(0, Math.ceil(distancia / passo) - 1);
    for (let n = 1; n <= intermediarias; n++) {
        const t = n / (intermediarias + 1);
        bolas.push({ x: de.x + (ate.x - de.x) * t, y: de.y + (ate.y - de.y) * t, z: de.z + (ate.z - de.z) * t, forca: (de.forca + (ate.forca - de.forca) * t) * 0.55, subtracao: de.subtracao + (ate.subtracao - de.subtracao) * t + 6 });
    }
};

// Valores calibrados no harness ASCII (silhueta com pescoço, axila aberta, braços em A-pose, coxas separadas) e validados
// por flood-fill 3D: 1 componente em todos os extremos de slider. Subtrações altas encurtam as caudas 1/d² (evitam fusões espúrias).
function montaBolasCorpoPersonagem(corpo: CorpoPersonagemCenaCanonicaEditor3D): BolaCorpo[] {
    const bolas: BolaCorpo[] = [];
    const tronco = corpo.regioes.TRONCO;
    const cabeca = corpo.regioes.CABECA;

    // Tronco: quadril .52 / cintura .605 / peito .70; o comprimento estica a coluna a partir do quadril; o resto ancora no peito.
    const quadrilY = 0.52;
    const alturaTronco = (y: number): number => quadrilY + (y - quadrilY) * tronco.comprimento;
    const cinturaY = alturaTronco(0.605);
    const peitoY = alturaTronco(0.7);
    const quadril: BolaCorpo = { x: 0.5, y: quadrilY, z: 0.5, forca: 0.52 * tronco.larguraInferior, subtracao: 19 };
    const cintura: BolaCorpo = { x: 0.5, y: cinturaY, z: 0.5, forca: 0.38 * tronco.larguraMedial, subtracao: 21 };
    const peito: BolaCorpo = { x: 0.5, y: peitoY, z: 0.5, forca: 0.6 * (0.6 * tronco.larguraSuperior + 0.4), subtracao: 20 };
    ponte(bolas, quadril, cintura);
    ponte(bolas, cintura, peito);
    bolas.push(peito);

    // Pescoço fino + cabeça alta (queixo/crânio pequenos dão efeito aos sliders inferior/superior).
    const pescocoY = peitoY + 0.075;
    const cabecaY = pescocoY + 0.11 * cabeca.comprimento;
    const pescoco: BolaCorpo = { x: 0.5, y: pescocoY, z: 0.5, forca: 0.14, subtracao: 34 };
    const centroCabeca: BolaCorpo = { x: 0.5, y: cabecaY, z: 0.5, forca: 0.84 * cabeca.larguraMedial, subtracao: 15 };
    ponte(bolas, pescoco, centroCabeca);
    bolas.push(centroCabeca);
    bolas.push({ x: 0.5, y: cabecaY - 0.048, z: 0.512, forca: 0.2 * cabeca.larguraInferior, subtracao: 26 });
    bolas.push({ x: 0.5, y: cabecaY + 0.045, z: 0.5, forca: 0.34 * cabeca.larguraSuperior, subtracao: 20 });

    // Braços em A-pose (flare progressivo .13 → .225 do centro): a axila fica ABERTA; a conexão é só pelo ombro.
    const bracos: { lado: 1 | -1; regiao: ParametrosMembroPersonagemEditor3D }[] = [
        { lado: 1, regiao: corpo.regioes.BRACO_DIREITO },
        { lado: -1, regiao: corpo.regioes.BRACO_ESQUERDO },
    ];
    for (const braco of bracos) {
        const ombroX = 0.5 + braco.lado * 0.13 * (0.55 + 0.45 * tronco.larguraSuperior);
        const ombroY = alturaTronco(0.715);
        const ombro: BolaCorpo = { x: ombroX, y: ombroY, z: 0.5, forca: 0.26 * braco.regiao.larguraSuperior, subtracao: 26 };
        const bracoSuperior: BolaCorpo = { x: 0.5 + braco.lado * 0.19, y: ombroY - 0.085 * braco.regiao.comprimento, z: 0.5, forca: 0.26 * braco.regiao.larguraSuperior, subtracao: 24 };
        const antebraco: BolaCorpo = { x: 0.5 + braco.lado * 0.208, y: ombroY - 0.17 * braco.regiao.comprimento, z: 0.5, forca: 0.22 * braco.regiao.larguraMedial, subtracao: 24 };
        // O braço termina no PUNHO (bola discreta): a mão de verdade é MODELADA (gaiola + subdivisão, corpoPersonagem.maos) e ancora aqui.
        const punho: BolaCorpo = { x: 0.5 + braco.lado * 0.22, y: ombroY - 0.24 * braco.regiao.comprimento, z: 0.5, forca: 0.16 * braco.regiao.larguraInferior, subtracao: 26 };
        ponte(bolas, peito, ombro);
        ponte(bolas, ombro, bracoSuperior);
        ponte(bolas, bracoSuperior, antebraco);
        ponte(bolas, antebraco, punho);
        bolas.push(punho);
    }

    // Pernas: coxas afastadas (±.095) com subtrações altas — separam logo abaixo do quadril; pé aponta para +z.
    const pernas: { lado: 1 | -1; regiao: ParametrosMembroPersonagemEditor3D }[] = [
        { lado: 1, regiao: corpo.regioes.PERNA_DIREITA },
        { lado: -1, regiao: corpo.regioes.PERNA_ESQUERDA },
    ];
    for (const perna of pernas) {
        const coxa: BolaCorpo = { x: 0.5 + perna.lado * 0.095, y: quadrilY - 0.11 * perna.regiao.comprimento, z: 0.5, forca: 0.4 * perna.regiao.larguraSuperior, subtracao: 22 };
        const joelho: BolaCorpo = { x: 0.5 + perna.lado * 0.096, y: quadrilY - 0.25 * perna.regiao.comprimento, z: 0.5, forca: 0.34 * perna.regiao.larguraMedial, subtracao: 23 };
        const canela: BolaCorpo = { x: 0.5 + perna.lado * 0.096, y: quadrilY - 0.37 * perna.regiao.comprimento, z: 0.5, forca: 0.3 * perna.regiao.larguraMedial, subtracao: 24 };
        const pe: BolaCorpo = { x: 0.5 + perna.lado * 0.096, y: quadrilY - 0.452 * perna.regiao.comprimento, z: 0.555, forca: 0.32 * perna.regiao.larguraInferior, subtracao: 24 };
        ponte(bolas, quadril, coxa);
        ponte(bolas, coxa, joelho);
        ponte(bolas, joelho, canela);
        ponte(bolas, canela, pe);
        bolas.push(pe);
    }

    // Global: larguraMedial = massa geral; superior/inferior = massa acima/abaixo da cintura.
    for (const bola of bolas) {
        const regional = bola.y > cinturaY ? corpo.global.larguraSuperior : corpo.global.larguraInferior;
        bola.forca *= corpo.global.larguraMedial * (0.5 + 0.5 * regional);
        // Piso físico: raio-iso nunca abaixo de ~2 células do campo (bolas menores somem entre amostras do marching cubes e quebrariam o corpo).
        bola.forca = Math.max(bola.forca, 0.0013 * (ISOLAMENTO_CAMPO_CORPO + bola.subtracao));
    }

    return bolas;
};

const RESOLUCAO_CAMPO_CORPO = 56;
const MAX_POLIGONOS_CORPO = 120000;
// Escala campo [-1,1] → metros (mesma base provada no FiguraSerR3F: humano ~1.8m).
const ESCALA_BASE_CORPO: readonly [number, number, number] = [0.77, 1.14, 0.585];

// Gera a casca única do corpo em metros, pés no chão (minY = 0), centrada em x/z.
// GOTCHA (three-stdlib): generateBufferGeometry não existe; update() preenche campo.geometry (buffer pré-alocado + drawRange) — extrair fatia de campo.count*3 floats.
export function geraGeometriaCorpoPersonagem(corpo: CorpoPersonagemCenaCanonicaEditor3D): BufferGeometry {
    const campo = new MarchingCubes(RESOLUCAO_CAMPO_CORPO, new MeshStandardMaterial(), false, false, MAX_POLIGONOS_CORPO);
    campo.isolation = ISOLAMENTO_CAMPO_CORPO;
    campo.reset();
    for (const bola of montaBolasCorpoPersonagem(corpo)) campo.addBall(bola.x, bola.y, bola.z, bola.forca, bola.subtracao);
    campo.update();

    const totalFloats = campo.count * 3;
    const posicoes = (campo.geometry.getAttribute('position').array as Float32Array).slice(0, totalFloats);
    const normais = (campo.geometry.getAttribute('normal').array as Float32Array).slice(0, totalFloats);
    campo.geometry.dispose();

    const geometria = new BufferGeometry();
    geometria.setAttribute('position', new BufferAttribute(posicoes, 3));
    geometria.setAttribute('normal', new BufferAttribute(normais, 3));
    geometria.scale(ESCALA_BASE_CORPO[0], ESCALA_BASE_CORPO[1] * corpo.global.comprimento, ESCALA_BASE_CORPO[2] * corpo.global.profundidade);
    geometria.computeBoundingBox();
    const minY = geometria.boundingBox ? geometria.boundingBox.min.y : 0;
    geometria.translate(0, -minY, 0);
    // Anexos derivados (mãos etc.) precisam do mesmo deslocamento vertical para acompanhar os pés-no-chão.
    geometria.userData = { deslocamentoY: -minY };
    return geometria;
};

// Posição de mundo do punho (PRÉ-deslocamento vertical — somar o deslocamentoY do userData da geometria): onde a mão modelada ancora.
export function ancoraPunhoCorpoPersonagem(corpo: CorpoPersonagemCenaCanonicaEditor3D, lado: 1 | -1): [number, number, number] {
    const tronco = corpo.regioes.TRONCO;
    const regiao = lado === 1 ? corpo.regioes.BRACO_DIREITO : corpo.regioes.BRACO_ESQUERDO;
    const ombroY = 0.52 + (0.715 - 0.52) * tronco.comprimento;
    const punhoX = 0.5 + lado * 0.22;
    const punhoY = ombroY - 0.24 * regiao.comprimento;
    return [(punhoX - 0.5) * 2 * ESCALA_BASE_CORPO[0], (punhoY - 0.5) * 2 * ESCALA_BASE_CORPO[1] * corpo.global.comprimento, 0];
};

// Escala da mão modelada: acompanha o punho da região do braço.
export function escalaMaoCorpoPersonagem(corpo: CorpoPersonagemCenaCanonicaEditor3D, lado: 1 | -1): number {
    const regiao = lado === 1 ? corpo.regioes.BRACO_DIREITO : corpo.regioes.BRACO_ESQUERDO;
    return 0.75 + 0.25 * regiao.larguraInferior;
};

// Âncora de mundo de cada região (para peças anexadas se posicionarem sobre o corpo): derivada dos MESMOS pontos da cadeia.
export function ancoraRegiaoCorpoPersonagem(corpo: CorpoPersonagemCenaCanonicaEditor3D, membro: MembroPersonagemEditor3D): [number, number, number] {
    const tronco = corpo.regioes.TRONCO;
    const alturaTronco = (y: number): number => 0.5 + (y - 0.5) * tronco.comprimento;
    const peitoY = alturaTronco(0.68);
    const ombroX = 0.115 * tronco.larguraSuperior;
    const pontos: Record<MembroPersonagemEditor3D, [number, number, number]> = {
        CABECA: [0.5, peitoY + 0.02 + 0.1 * corpo.regioes.CABECA.comprimento, 0.5],
        TRONCO: [0.5, alturaTronco(0.6), 0.5],
        BRACO_DIREITO: [0.5 + ombroX + 0.05, alturaTronco(0.7) - 0.12 * corpo.regioes.BRACO_DIREITO.comprimento, 0.5],
        BRACO_ESQUERDO: [0.5 - ombroX - 0.05, alturaTronco(0.7) - 0.12 * corpo.regioes.BRACO_ESQUERDO.comprimento, 0.5],
        PERNA_DIREITA: [0.5 + 0.09, 0.5 - 0.22 * corpo.regioes.PERNA_DIREITA.comprimento, 0.5],
        PERNA_ESQUERDA: [0.5 - 0.09, 0.5 - 0.22 * corpo.regioes.PERNA_ESQUERDA.comprimento, 0.5],
    };
    const ponto = pontos[membro];
    // Campo [0,1] → [-1,1] → metros (mesma transformação da geometria; deslocamento vertical aproximado pelo pé neutro).
    const escalaY = ESCALA_BASE_CORPO[1] * corpo.global.comprimento;
    return [(ponto[0] - 0.5) * 2 * ESCALA_BASE_CORPO[0], (ponto[1] - 0.5) * 2 * escalaY + escalaY * 0.93, (ponto[2] - 0.5) * 2 * ESCALA_BASE_CORPO[2] * corpo.global.profundidade];
};
