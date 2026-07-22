import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, type Material, type Mesh, type MeshStandardMaterial } from 'three';
import { TIPOS_INTERACAO, type EstadoTemporalSalaDeJogoRuntime, type InteragivelPercebidoSalaJogoWsDto, type OcupanteMapaLogicoSalaJogoWsDto, type SerNaSalaJogoWsDto } from 'types-nora-api';

import { ALTURA_OLHOS, dimensoesInteragivelCena, encontraMovimentoAtivoControlado, mundoX, mundoY, paraUnidadeCena, posicaoLogicaControladoFiccional, type ReferenciaTempoFiccionalControlado } from './cenaSalaJogo.helpers';

// Alcance "infinito" em unidade de cena: sem Percepcao Visual autorada nao mascaramos (ve tudo). O estado logico de nao-ver e responsabilidade da camada de percepcao, nao do render.
const ALCANCE_SEM_MASCARA = 100000;
// Borda suave da esfera de visao, em unidade de cena.
const SUAVIZACAO_PADRAO = 0.8;
// Maximo de oclusores (caixas de objeto) considerados por frame. Loop de bound constante no shader.
const MAX_OCLUSORES = 8;

type UniformesMascaraVisao = {
    uCabecaVisao: { value: Vector3 };
    uAlcanceVisao: { value: number };
    uSuavizacaoVisao: { value: number };
    uOclusorMin: { value: Vector3[] };
    uOclusorMax: { value: Vector3[] };
    uOclusorQtd: { value: number };
};

function criaUniformesMascaraVisao(): UniformesMascaraVisao {
    const min: Vector3[] = [];
    const max: Vector3[] = [];
    for (let i = 0; i < MAX_OCLUSORES; i++) { min.push(new Vector3()); max.push(new Vector3()); }
    return {
        uCabecaVisao: { value: new Vector3() },
        uAlcanceVisao: { value: ALCANCE_SEM_MASCARA },
        uSuavizacaoVisao: { value: SUAVIZACAO_PADRAO },
        uOclusorMin: { value: min },
        uOclusorMax: { value: max },
        uOclusorQtd: { value: 0 },
    };
};

// Maior alcance de Linha de Visao (mm) entre as capacidades VISUAIS do Ser controlado. SSOT do quanto ele enxerga; null = sem meio de visao autorado.
export function obtemAlcanceLinhaVisaoMilimetros(ser: SerNaSalaJogoWsDto | null): number | null {
    if (!ser) return null;
    const alcances = ser.membros
        .flatMap(membro => membro.capacidades)
        .filter(capacidade => capacidade.nomeInteracao === TIPOS_INTERACAO.VISUAL.chave)
        .map(capacidade => capacidade.parametros.alcanceLinhaVisaoMilimetros)
        .filter((valor): valor is number => typeof valor === 'number' && Number.isFinite(valor) && valor > 0);
    return alcances.length === 0 ? null : Math.max(...alcances);
};

// Menor dependencia de iluminacao (%) entre as capacidades VISUAIS do Ser controlado — a melhor visao vence (um olho que ve no escuro domina). 100 = so ve com luz real; 0 = ve no escuro. null = sem visao autorada.
export function obtemDependenciaIluminacaoPercentual(ser: SerNaSalaJogoWsDto | null): number | null {
    if (!ser) return null;
    const dependencias = ser.membros
        .flatMap(membro => membro.capacidades)
        .filter(capacidade => capacidade.nomeInteracao === TIPOS_INTERACAO.VISUAL.chave)
        .map(capacidade => capacidade.parametros.dependenciaIluminacaoPercentual)
        .filter((valor): valor is number => typeof valor === 'number' && Number.isFinite(valor));
    return dependencias.length === 0 ? null : Math.min(...dependencias);
};

function ehMaterialMascaravel(material: Material): material is MeshStandardMaterial {
    return material.type === 'MeshStandardMaterial' || material.type === 'MeshPhysicalMaterial';
};

// Declaracoes no topo do fragment: uniforms da visao + oclusores + o teste ray-box (slab method). _ocluidoPorCaixaVisao devolve true se a caixa esta ENTRE a cabeca e o fragmento (com margem, pra nao auto-ocluir a face de frente da propria caixa).
const DECLARACOES_FRAGMENTO = [
    '#include <common>',
    '#define MAX_OCLUSORES 8',
    'uniform vec3 uCabecaVisao;',
    'uniform float uAlcanceVisao;',
    'uniform float uSuavizacaoVisao;',
    'uniform vec3 uOclusorMin[MAX_OCLUSORES];',
    'uniform vec3 uOclusorMax[MAX_OCLUSORES];',
    'uniform int uOclusorQtd;',
    'varying vec3 vPosicaoMundoVisao;',
    'bool _ocluidoPorCaixaVisao(vec3 mn, vec3 mx) {',
    '  vec3 d = vPosicaoMundoVisao - uCabecaVisao;',
    '  float distFrag = length(d);',
    '  vec3 dir = d / distFrag;',
    '  dir += vec3(equal(dir, vec3(0.0))) * 1e-5;',
    '  vec3 inv = 1.0 / dir;',
    '  vec3 t0 = (mn - uCabecaVisao) * inv;',
    '  vec3 t1 = (mx - uCabecaVisao) * inv;',
    '  float tN = max(max(min(t0.x, t1.x), min(t0.y, t1.y)), min(t0.z, t1.z));',
    '  float tF = min(min(max(t0.x, t1.x), max(t0.y, t1.y)), max(t0.z, t1.z));',
    '  if (tF < tN || tF < 0.0) return false;',
    '  return tN > 0.02 && tN < distFrag - 0.02;',
    '}',
    'bool _ocluidoVisao() {',
    '  for (int i = 0; i < MAX_OCLUSORES; i++) {',
    '    if (i >= uOclusorQtd) break;',
    '    if (_ocluidoPorCaixaVisao(uOclusorMin[i], uOclusorMax[i])) return true;',
    '  }',
    '  return false;',
    '}',
].join('\n');

// Aplicacao no fim do fragment: distancia (esfera) E oclusao (estrita). Se ocluido, zera a visibilidade.
const OCLUSAO_FRAGMENTO = [
    'float _distanciaVisao = distance(vPosicaoMundoVisao, uCabecaVisao);',
    'float _visibilidadeVisao = 1.0 - smoothstep(uAlcanceVisao - uSuavizacaoVisao, uAlcanceVisao, _distanciaVisao);',
    'if (_visibilidadeVisao > 0.0 && _ocluidoVisao()) _visibilidadeVisao = 0.0;',
    'gl_FragColor.rgb *= _visibilidadeVisao;',
    '#include <dithering_fragment>',
].join('\n');

// Injeta a visao no shader nativo do material (sem recriar material): varying de posicao-mundo no vertex + esfera de alcance + oclusao estrita por caixa no fragment. Uniforms COMPARTILHADOS por referencia com o controlador, que os atualiza por frame.
function aplicaMascaraVisaoAoMaterial(material: Material, uniformes: UniformesMascaraVisao, patchados: WeakSet<Material>): void {
    if (!ehMaterialMascaravel(material)) return;
    if (patchados.has(material)) return;
    patchados.add(material);

    const compilacaoAnterior = material.onBeforeCompile;
    material.onBeforeCompile = (shader, renderer) => {
        compilacaoAnterior.call(material, shader, renderer);
        shader.uniforms.uCabecaVisao = uniformes.uCabecaVisao;
        shader.uniforms.uAlcanceVisao = uniformes.uAlcanceVisao;
        shader.uniforms.uSuavizacaoVisao = uniformes.uSuavizacaoVisao;
        shader.uniforms.uOclusorMin = uniformes.uOclusorMin;
        shader.uniforms.uOclusorMax = uniformes.uOclusorMax;
        shader.uniforms.uOclusorQtd = uniformes.uOclusorQtd;
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vPosicaoMundoVisao;')
            .replace('#include <project_vertex>', 'vPosicaoMundoVisao = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#include <project_vertex>');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', DECLARACOES_FRAGMENTO)
            .replace('#include <dithering_fragment>', OCLUSAO_FRAGMENTO);
    };
    material.needsUpdate = true;
};

function aplicaMascaraVisaoNaCena(cena: { traverse: (retorno: (objeto: object) => void) => void }, uniformes: UniformesMascaraVisao, patchados: WeakSet<Material>): void {
    cena.traverse(objeto => {
        const malha = objeto as Mesh;
        if (!malha.isMesh) return;
        const material = malha.material;
        if (Array.isArray(material)) { for (const parte of material) aplicaMascaraVisaoAoMaterial(parte, uniformes, patchados); return; }
        aplicaMascaraVisaoAoMaterial(material, uniformes, patchados);
    });
};

// Preenche os uniforms de oclusores com as caixas dos interagiveis-objeto percebidos (AABB em unidade de cena). Ate MAX_OCLUSORES.
function preencheOclusores(interagiveis: readonly InteragivelPercebidoSalaJogoWsDto[], largura: number, altura: number, uniformes: UniformesMascaraVisao): void {
    let quantidade = 0;
    for (const interagivel of interagiveis) {
        if (quantidade >= MAX_OCLUSORES) break;
        if (interagivel.tipo !== 'objeto' || interagivel.posicao === null) continue;
        const dims = dimensoesInteragivelCena(interagivel);
        const centroX = mundoX(interagivel.posicao.x, largura);
        const centroY = mundoY(interagivel.posicao.y, altura);
        // Z-up: AABB no plano XY + altura em Z. vPosicaoMundoVisao (shader) já é posição-mundo nativa, então bate direto.
        uniformes.uOclusorMin.value[quantidade].set(centroX - dims.largura / 2, centroY - dims.profundidade / 2, 0);
        uniformes.uOclusorMax.value[quantidade].set(centroX + dims.largura / 2, centroY + dims.profundidade / 2, dims.altura);
        quantidade++;
    }
    uniformes.uOclusorQtd.value = quantidade;
};

interface MascaraVisaoControladorProps {
    alcanceLinhaVisaoMilimetros: number | null;
    ocupanteControlado: OcupanteMapaLogicoSalaJogoWsDto | null;
    interagiveisPercebidos: readonly InteragivelPercebidoSalaJogoWsDto[];
    estadoTemporal: EstadoTemporalSalaDeJogoRuntime | null;
    largura: number;
    altura: number;
    // Vista tatica: a cabeca do Ser controlado e projetada da posicao logica. Vista primeira pessoa: a camera E a cabeca.
    seguirCamera: boolean;
};

// Componente logico (nao renderiza nada): a cada frame patcha os materiais novos da cena e atualiza a visao (cabeca + alcance + oclusores). Uma instancia por Canvas.
export function MascaraVisaoControlador({ alcanceLinhaVisaoMilimetros, ocupanteControlado, interagiveisPercebidos, estadoTemporal, largura, altura, seguirCamera }: MascaraVisaoControladorProps) {
    const cena = useThree(estado => estado.scene);
    const camera = useThree(estado => estado.camera);
    const uniformes = useMemo(() => criaUniformesMascaraVisao(), []);
    const patchados = useMemo(() => new WeakSet<Material>(), []);
    const referencia = useMemo<ReferenciaTempoFiccionalControlado>(() => ({ momentoMs: estadoTemporal?.momentoAtualMs ?? 0, recebidoMs: Date.now(), limiteMs: estadoTemporal?.momentoLimiteProjecaoMs ?? null }), [estadoTemporal]);

    useFrame(() => {
        aplicaMascaraVisaoNaCena(cena, uniformes, patchados);

        if (alcanceLinhaVisaoMilimetros === null) { uniformes.uAlcanceVisao.value = ALCANCE_SEM_MASCARA; uniformes.uOclusorQtd.value = 0; return; }
        uniformes.uAlcanceVisao.value = paraUnidadeCena(alcanceLinhaVisaoMilimetros);
        preencheOclusores(interagiveisPercebidos, largura, altura, uniformes);

        if (seguirCamera) { uniformes.uCabecaVisao.value.copy(camera.position); return; }
        if (!ocupanteControlado) { uniformes.uAlcanceVisao.value = ALCANCE_SEM_MASCARA; uniformes.uOclusorQtd.value = 0; return; }
        const movimentoAtivo = encontraMovimentoAtivoControlado(estadoTemporal);
        const posicao = posicaoLogicaControladoFiccional(ocupanteControlado.posicao, movimentoAtivo, referencia);
        uniformes.uCabecaVisao.value.set(mundoX(posicao.x, largura), mundoY(posicao.y, altura), ALTURA_OLHOS);
    });

    return null;
};
