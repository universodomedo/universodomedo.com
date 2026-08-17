'use client';

import { useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Color, MeshStandardMaterial, Object3D, Raycaster, Vector3 } from 'three';
import type { CamadaJogoMapa, CenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D } from 'types-nora-api';

import { criaGeometriaDeMalha, solidificaMalha, subdivideMalhaCatmullClark, type MalhaEditavelLocal } from 'Componentes/Editor3D/editor3D.malha';
import { MILIMETROS_POR_METRO_MAPA, dimensoesMapaDaCena } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';
import { LuzesMapaR3F } from './LuzesMapaR3F';

// Cenário AUTORADO da sala: renderiza a cena do Projeto 3D (tipo MAPA) alinhada ao espaço lógico do jogo. Z-up: o chão é
// o plano XY e a altura é Z. A origem lógica (0,0) é o canto mínimo do bbox XY do mapa; o alinhamento segue a MESMA
// convenção dos atores (mundoX/mundoY, com o +0.5). A geometria reusa os helpers PUROS do Editor 3D (gaiola + subdiv + espessura + slots).
export function MapaProjetoR3F({ cena, camadaJogo = null, largura, altura, luzesApagadas = [] }: { cena: CenaCanonicaEditor3D; camadaJogo?: CamadaJogoMapa | null; largura: number; altura: number; luzesApagadas?: readonly string[] }) {
    const dimensoes = useMemo(() => dimensoesMapaDaCena(cena), [cena]);
    if (dimensoes === null) return null;

    const offsetX = -dimensoes.origemXMetros - largura / (2 * MILIMETROS_POR_METRO_MAPA) + 0.5;
    const offsetY = -dimensoes.origemYMetros - altura / (2 * MILIMETROS_POR_METRO_MAPA) + 0.5;
    // Z-up: o plano do chão é XY; alinhamos nos eixos X e Y. Z (a altura) NÃO desloca — o grid do Editor 3D (z=0) É o chão
    // do jogo — o que o autor pousa no grid, pousa no chão lógico. Realinhar pelo Z mínimo do bbox faria objetos pousados
    // no grid flutuarem em jogo (bug real: cubo no grid do editor aparecia acima do piso da sala enterrada no preview/partida).
    // As luzes autoradas moram DENTRO deste grupo: posição de luz e de objeto vêm do mesmo espaço do mapa, então o alinhamento é o mesmo.
    return (
        <group position={[offsetX, offsetY, 0]} userData={{ superficieMapa: true }}>
            {cena.objetos.map(objeto => <ObjetoMapaR3F key={objeto.idLocal} objeto={objeto} />)}
            <LuzesMapaR3F luzes={camadaJogo?.fontesDeLuz ?? []} luzesApagadas={luzesApagadas} />
        </group>
    );
};

// ASSENTAMENTO no runtime (mesma "gravidade de camadas" do Editor): a altura de apoio de um ator/marcador no seu XZ é
// a superfície mais alta do MAPA naquele ponto (raycast para baixo contra os groups marcados com superficieMapa);
// sem mapa/sem impacto = chão lógico y=0. Ex.: Ser em pé SOBRE o piso interno da sala, não enterrado na espessura.
export function useAlturaApoioNoMapa(x: number, y: number): number {
    const scene = useThree(estado => estado.scene);
    const [alturaApoio, setAlturaApoio] = useState(0);

    useEffect(() => {
        const alvos: Object3D[] = [];
        scene.traverse(objeto => { if (objeto.userData.superficieMapa === true) alvos.push(objeto); });
        if (alvos.length === 0) { setAlturaApoio(0); return; }
        const raycaster = new Raycaster();
        // Z-up: o par (x,y) é o ponto no plano do chão; o raio desce em -Z e o apoio é a altura Z do impacto.
        raycaster.set(new Vector3(x, y, ALTURA_ORIGEM_RAIO_APOIO_MAPA), new Vector3(0, 0, -1));
        const impacto = raycaster.intersectObjects(alvos, true)[0];
        setAlturaApoio(impacto ? Math.max(0, impacto.point.z) : 0);
    }, [scene, x, y]);

    return alturaApoio;
};

// Bem acima de qualquer mapa autorável — o raio desce a partir daqui e o PRIMEIRO impacto é a superfície mais alta.
const ALTURA_ORIGEM_RAIO_APOIO_MAPA = 500;

// Fallback p/ config LEGADA sem mapa: só um plano de chão neutro na extensão lógica — sem paredes (o protótipo procedural foi aposentado).
export function ChaoSemMapaR3F({ largura, altura }: { largura: number; altura: number }) {
    return (
        <mesh position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[largura / MILIMETROS_POR_METRO_MAPA, altura / MILIMETROS_POR_METRO_MAPA]} />
            <meshStandardMaterial color="#3a3648" roughness={0.85} metalness={0.05} />
        </mesh>
    );
};

function ObjetoMapaR3F({ objeto }: { objeto: ObjetoCenaCanonicaEditor3D }) {
    const geometria = useMemo(() => {
        if (!objeto.malhaEditavel) return null;
        const malha: MalhaEditavelLocal = {
            vertices: objeto.malhaEditavel.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]]),
            faces: objeto.malhaEditavel.faces.map(face => ({ id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices], ...(face.slotMaterial === undefined ? {} : { slotMaterial: face.slotMaterial }) })),
            proximoIdFace: objeto.malhaEditavel.proximoIdFace,
        };
        const nivelSubdivisao = objeto.subdivisao ?? 0;
        const espessura = objeto.espessura ?? 0;
        const malhaSubdividida = nivelSubdivisao > 0 ? subdivideMalhaCatmullClark(malha, nivelSubdivisao) : malha;
        const malhaExibicao = espessura > 0 ? solidificaMalha(malhaSubdividida, espessura) : malhaSubdividida;
        return criaGeometriaDeMalha(malhaExibicao, 1 + (objeto.materiaisExtras?.length ?? 0));
    }, [objeto]);

    // Slot 0 = corBase; extras na ordem — casando com os groups da geometria (material único quando não há extras).
    const materiais = useMemo(() => {
        const cores = [objeto.corBase, ...(objeto.materiaisExtras ?? []).map(material => material.cor)];
        return cores.map(cor => new MeshStandardMaterial({ color: new Color(cor[0], cor[1], cor[2]), roughness: 0.6, metalness: 0.08 }));
    }, [objeto]);

    useEffect(() => () => { geometria?.dispose(); for (const material of materiais) material.dispose(); }, [geometria, materiais]);

    if (geometria === null || !objeto.visivel) return null;

    return <mesh geometry={geometria} material={materiais.length === 1 ? materiais[0] : materiais} position={[objeto.posicao[0], objeto.posicao[1], objeto.posicao[2]]} rotation={[objeto.rotacao[0], objeto.rotacao[1], objeto.rotacao[2]]} scale={[objeto.escala[0], objeto.escala[1], objeto.escala[2]]} castShadow receiveShadow />;
};
