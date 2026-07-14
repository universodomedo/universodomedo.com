'use client';

import { useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Color, MeshStandardMaterial, Object3D, Raycaster, Vector3 } from 'three';
import type { CenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D } from 'types-nora-api';

import { criaGeometriaDeMalha, solidificaMalha, subdivideMalhaCatmullClark, type MalhaEditavelLocal } from 'Componentes/Editor3D/editor3D.malha';
import { MILIMETROS_POR_METRO_MAPA, dimensoesMapaDaCena } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';

// Cenário AUTORADO da sala: renderiza a cena do Projeto 3D (tipo MAPA) alinhada ao espaço lógico do jogo. A origem
// lógica (0,0) é o canto mínimo do bbox XZ do mapa; o alinhamento segue a MESMA convenção dos atores (mundoX/mundoZ,
// com o +0.5). A geometria de exibição reusa os helpers PUROS do Editor 3D (gaiola + subdivisão + espessura + slots).
export function MapaProjetoR3F({ cena, largura, altura }: { cena: CenaCanonicaEditor3D; largura: number; altura: number }) {
    const dimensoes = useMemo(() => dimensoesMapaDaCena(cena), [cena]);
    if (dimensoes === null) return null;

    const offsetX = -dimensoes.origemXMetros - largura / (2 * MILIMETROS_POR_METRO_MAPA) + 0.5;
    const offsetZ = -dimensoes.origemZMetros - altura / (2 * MILIMETROS_POR_METRO_MAPA) + 0.5;
    // Y NÃO desloca: o grid do Editor 3D (y=0) É o chão do jogo — o que o autor pousa no grid, pousa no chão lógico.
    // Realinhar pelo Y mínimo do bbox "consertava" mapa enterrado e fazia objetos pousados no grid flutuarem em jogo
    // (bug real 12/07: cubo no grid do editor aparecia 1.28m acima do piso da sala enterrada no preview/partida).
    return (
        <group position={[offsetX, 0, offsetZ]} userData={{ superficieMapa: true }}>
            {cena.objetos.map(objeto => <ObjetoMapaR3F key={objeto.idLocal} objeto={objeto} />)}
        </group>
    );
};

// ASSENTAMENTO no runtime (mesma "gravidade de camadas" do Editor): a altura de apoio de um ator/marcador no seu XZ é
// a superfície mais alta do MAPA naquele ponto (raycast para baixo contra os groups marcados com superficieMapa);
// sem mapa/sem impacto = chão lógico y=0. Ex.: Ser em pé SOBRE o piso interno da sala, não enterrado na espessura.
export function useAlturaApoioNoMapa(x: number, z: number): number {
    const scene = useThree(estado => estado.scene);
    const [alturaApoio, setAlturaApoio] = useState(0);

    useEffect(() => {
        const alvos: Object3D[] = [];
        scene.traverse(objeto => { if (objeto.userData.superficieMapa === true) alvos.push(objeto); });
        if (alvos.length === 0) { setAlturaApoio(0); return; }
        const raycaster = new Raycaster();
        raycaster.set(new Vector3(x, ALTURA_ORIGEM_RAIO_APOIO_MAPA, z), new Vector3(0, -1, 0));
        const impacto = raycaster.intersectObjects(alvos, true)[0];
        setAlturaApoio(impacto ? Math.max(0, impacto.point.y) : 0);
    }, [scene, x, z]);

    return alturaApoio;
};

// Bem acima de qualquer mapa autorável — o raio desce a partir daqui e o PRIMEIRO impacto é a superfície mais alta.
const ALTURA_ORIGEM_RAIO_APOIO_MAPA = 500;

// Fallback p/ config LEGADA sem mapa: só um plano de chão neutro na extensão lógica — sem paredes (o protótipo procedural foi aposentado).
export function ChaoSemMapaR3F({ largura, altura }: { largura: number; altura: number }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
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
