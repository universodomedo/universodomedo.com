'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { Center, Text3D, TransformControls, type OnCenterCallbackProps } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { DoubleSide, Group, Matrix4, Quaternion, Vector3, type Object3D } from 'three';
import fonteHelvetikerJson from 'three/examples/fonts/helvetiker_regular.typeface.json';

import { restringeTextoNaCameraEditor3D, type CameraEditor3D, type TextoCapaArteEditor3D } from './editor3D.projeto.serializacao';

type FonteText3D = ComponentProps<typeof Text3D>['font'];
const FONTE_TITULO_CAPA_ARTE_EDITOR3D = fonteHelvetikerJson as unknown as FonteText3D;
const TAMANHO_BASE_TITULO_CAPA_ARTE_EDITOR3D = 0.5;
const PROFUNDIDADE_TITULO_CAPA_ARTE_EDITOR3D = 0.12;
const MARGEM_CLIQUE_TITULO_CAPA_ARTE_EDITOR3D = 0.3;
const CIMA_TITULO_CAPA_ARTE_EDITOR3D = new Vector3(0, 1, 0);

// Marca a malha do texto para o render por camadas (base oculta esta malha; a camada do título mostra só ela).
function marcaCamadaTituloCapaArte(objeto: Object3D): void { objeto.userData.ehCamadaTituloCapaArte = true; };

interface TituloCapaArteEditor3DProps {
    readonly camera: CameraEditor3D;
    readonly titulo: TextoCapaArteEditor3D;
    readonly mostrarGizmo: boolean;
    readonly aoSelecionar: () => void;
    readonly aoMover: (posicao: [number, number, number]) => void;
};

// Título da Capa de Arte = texto 3D real, filho da câmera-output (transform em espaço da câmera → acompanha o enquadramento e aparece no POV). Selecionável (plano de clique invisível sobre a área) e arrastável por gizmo, com a posição SEMPRE restrita ao frustum (não sai da área da câmera). Some só com texto vazio.
export function TituloCapaArteEditor3D({ camera, titulo, mostrarGizmo, aoSelecionar, aoMover }: TituloCapaArteEditor3DProps) {
    // Proxy que o gizmo arrasta; o conteúdo do título é filho dele. Evita o conflito gizmo-vs-prop (estado).
    const proxyTitulo = useMemo(() => new Group(), []);
    const arrastandoRef = useRef(false);
    const [tamanhoTexto, setTamanhoTexto] = useState<readonly [number, number] | null>(null);

    // Transform do grupo-pai = câmera-output (lookAt), DECLARATIVO (props position/quaternion); recalcula quando a câmera muda. -Z = para frente.
    const { posicaoGrupo, quaternionGrupo } = useMemo(() => {
        const pos = new Vector3(camera.posicao[0], camera.posicao[1], camera.posicao[2]);
        const alvo = new Vector3(camera.alvo[0], camera.alvo[1], camera.alvo[2]);
        const quat = new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(pos, alvo, CIMA_TITULO_CAPA_ARTE_EDITOR3D));
        return { posicaoGrupo: [pos.x, pos.y, pos.z] as [number, number, number], quaternionGrupo: [quat.x, quat.y, quat.z, quat.w] as [number, number, number, number] };
    }, [camera.posicao, camera.alvo]);

    // Posição restrita ao frustum da câmera (não sai da área da câmera), recalculada com profundidade/FOV atuais.
    const posicaoRestrita = useMemo(() => restringeTextoNaCameraEditor3D(titulo.posicao, camera.fov), [titulo.posicao, camera.fov]);

    // Sincroniza o proxy com o estado, exceto durante o arrasto (senão o estado brigaria com o gizmo).
    useEffect(() => {
        if (arrastandoRef.current) return;
        proxyTitulo.position.set(posicaoRestrita[0], posicaoRestrita[1], posicaoRestrita[2]);
    }, [posicaoRestrita, proxyTitulo]);

    if (titulo.texto.trim().length === 0) return null;

    function aoClicar(evento: ThreeEvent<MouseEvent>): void { evento.stopPropagation(); aoSelecionar(); };

    function medeTexto(props: OnCenterCallbackProps): void {
        setTamanhoTexto(atual => (atual !== null && Math.abs(atual[0] - props.width) < 0.001 && Math.abs(atual[1] - props.height) < 0.001) ? atual : [props.width, props.height]);
    };

    // Arrasto: restringe ao frustum (clampa o próprio proxy p/ não exceder visualmente) e devolve a posição ao estado.
    function aoArrastar(): void {
        const restrito = restringeTextoNaCameraEditor3D([proxyTitulo.position.x, proxyTitulo.position.y, proxyTitulo.position.z], camera.fov);
        proxyTitulo.position.set(restrito[0], restrito[1], restrito[2]);
        aoMover(restrito);
    };

    return (
        <>
        <group position={posicaoGrupo} quaternion={quaternionGrupo}>
            <primitive object={proxyTitulo}>
                <group rotation={titulo.rotacao} scale={titulo.escala}>
                    <Suspense fallback={null}>
                        <Center onCentered={medeTexto}>
                            <Text3D font={FONTE_TITULO_CAPA_ARTE_EDITOR3D} size={TAMANHO_BASE_TITULO_CAPA_ARTE_EDITOR3D} height={PROFUNDIDADE_TITULO_CAPA_ARTE_EDITOR3D} curveSegments={6} bevelEnabled bevelThickness={0.02} bevelSize={0.012} bevelSegments={2} onUpdate={marcaCamadaTituloCapaArte} onClick={aoClicar}>
                                {titulo.texto}
                                <meshStandardMaterial color={titulo.cor} metalness={0.15} roughness={0.45} />
                            </Text3D>
                        </Center>
                    </Suspense>
                    {tamanhoTexto !== null && (
                        // Alvo de clique invisível sobre a área do título (raycast confiável — o Text3D fino não pega bem).
                        <mesh onClick={aoClicar}>
                            <planeGeometry args={[tamanhoTexto[0] + MARGEM_CLIQUE_TITULO_CAPA_ARTE_EDITOR3D, tamanhoTexto[1] + MARGEM_CLIQUE_TITULO_CAPA_ARTE_EDITOR3D]} />
                            <meshBasicMaterial transparent opacity={0} depthWrite={false} side={DoubleSide} />
                        </mesh>
                    )}
                </group>
            </primitive>
        </group>
        {mostrarGizmo && <TransformControls object={proxyTitulo} mode="translate" space="local" size={0.7} onMouseDown={() => { arrastandoRef.current = true; }} onMouseUp={() => { arrastandoRef.current = false; }} onObjectChange={aoArrastar} />}
        </>
    );
};
