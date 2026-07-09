import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, type Material, type Mesh, type MeshStandardMaterial } from 'three';
import { TIPOS_INTERACAO, type EstadoTemporalSalaDeJogoRuntime, type OcupanteMapaLogicoSalaJogoWsDto, type SerNaSalaJogoWsDto } from 'types-nora-api';

import { ALTURA_OLHOS, encontraMovimentoAtivoControlado, mundoX, mundoZ, paraUnidadeCena, posicaoLogicaControladoFiccional, type ReferenciaTempoFiccionalControlado } from './cenaSalaJogo.helpers';

// Alcance "infinito" em unidade de cena: sem Percepcao Visual autorada nao mascaramos (ve tudo). O estado logico de nao-ver e responsabilidade da camada de percepcao, nao do render.
const ALCANCE_SEM_MASCARA = 100000;
// Borda suave da esfera de visao, em unidade de cena.
const SUAVIZACAO_PADRAO = 0.8;

type UniformesMascaraVisao = { uCabecaVisao: { value: Vector3 }; uAlcanceVisao: { value: number }; uSuavizacaoVisao: { value: number }; };

function criaUniformesMascaraVisao(): UniformesMascaraVisao {
    return { uCabecaVisao: { value: new Vector3() }, uAlcanceVisao: { value: ALCANCE_SEM_MASCARA }, uSuavizacaoVisao: { value: SUAVIZACAO_PADRAO } };
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

function ehMaterialMascaravel(material: Material): material is MeshStandardMaterial {
    return material.type === 'MeshStandardMaterial' || material.type === 'MeshPhysicalMaterial';
};

// Injeta a esfera de visao no shader nativo do material (sem recriar material): varying de posicao-mundo no vertex + escurecimento por distancia 3D a cabeca no fragment. Os uniforms sao COMPARTILHADOS por referencia com o controlador, que os atualiza por frame.
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
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vPosicaoMundoVisao;')
            .replace('#include <project_vertex>', 'vPosicaoMundoVisao = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#include <project_vertex>');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uCabecaVisao;\nuniform float uAlcanceVisao;\nuniform float uSuavizacaoVisao;\nvarying vec3 vPosicaoMundoVisao;')
            .replace('#include <dithering_fragment>', 'float _distanciaVisao = distance(vPosicaoMundoVisao, uCabecaVisao);\nfloat _visibilidadeVisao = 1.0 - smoothstep(uAlcanceVisao - uSuavizacaoVisao, uAlcanceVisao, _distanciaVisao);\ngl_FragColor.rgb *= _visibilidadeVisao;\n#include <dithering_fragment>');
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

interface MascaraVisaoControladorProps {
    alcanceLinhaVisaoMilimetros: number | null;
    ocupanteControlado: OcupanteMapaLogicoSalaJogoWsDto | null;
    estadoTemporal: EstadoTemporalSalaDeJogoRuntime | null;
    largura: number;
    altura: number;
    // Vista tatica: a cabeca do Ser controlado e projetada da posicao logica. Vista primeira pessoa: a camera E a cabeca.
    seguirCamera: boolean;
};

// Componente logico (nao renderiza nada): a cada frame patcha os materiais novos da cena e atualiza a esfera de visao (cabeca + alcance). Uma instancia por Canvas.
export function MascaraVisaoControlador({ alcanceLinhaVisaoMilimetros, ocupanteControlado, estadoTemporal, largura, altura, seguirCamera }: MascaraVisaoControladorProps) {
    const cena = useThree(estado => estado.scene);
    const camera = useThree(estado => estado.camera);
    const uniformes = useMemo(() => criaUniformesMascaraVisao(), []);
    const patchados = useMemo(() => new WeakSet<Material>(), []);
    const referencia = useMemo<ReferenciaTempoFiccionalControlado>(() => ({ momentoMs: estadoTemporal?.momentoAtualMs ?? 0, recebidoMs: Date.now(), limiteMs: estadoTemporal?.momentoLimiteProjecaoMs ?? null }), [estadoTemporal]);

    useFrame(() => {
        aplicaMascaraVisaoNaCena(cena, uniformes, patchados);

        if (alcanceLinhaVisaoMilimetros === null) { uniformes.uAlcanceVisao.value = ALCANCE_SEM_MASCARA; return; }
        uniformes.uAlcanceVisao.value = paraUnidadeCena(alcanceLinhaVisaoMilimetros);

        if (seguirCamera) { uniformes.uCabecaVisao.value.copy(camera.position); return; }
        if (!ocupanteControlado) { uniformes.uAlcanceVisao.value = ALCANCE_SEM_MASCARA; return; }
        const movimentoAtivo = encontraMovimentoAtivoControlado(estadoTemporal);
        const posicao = posicaoLogicaControladoFiccional(ocupanteControlado.posicao, movimentoAtivo, referencia);
        uniformes.uCabecaVisao.value.set(mundoX(posicao.x, largura), ALTURA_OLHOS, mundoZ(posicao.y, altura));
    });

    return null;
};
