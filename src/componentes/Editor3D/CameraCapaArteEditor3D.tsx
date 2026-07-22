'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Line, OrbitControls, PerspectiveCamera as PerspectiveCameraDrei, TransformControls } from '@react-three/drei';
import { Color, Object3D, PerspectiveCamera, Quaternion, Vector3, WebGLRenderTarget } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { PerspectiveCamera as PerspectiveCameraTipo, Scene, WebGLRenderer } from 'three';

import { ALTURA_ARTE_DE_CAPA, LARGURA_ARTE_DE_CAPA } from 'Funcionalidades/ArteDeCapa/arteDeCapa.types';
import { LONGE_CAMERA_CAPA_ARTE_EDITOR3D, PERTO_CAMERA_CAPA_ARTE_EDITOR3D, type CameraEditor3D } from './editor3D.projeto.serializacao';

const ASPECTO_CAPA_ARTE_EDITOR3D = LARGURA_ARTE_DE_CAPA / ALTURA_ARTE_DE_CAPA;
const TIPOS_OCULTOS_NA_CAPA = new Set(['CameraHelper', 'TransformControlsGizmo', 'TransformControlsPlane']);
const TIPOS_RENDERAVEIS_CAPA_ARTE = new Set(['Mesh', 'SkinnedMesh', 'InstancedMesh', 'Line', 'LineSegments', 'LineLoop', 'Line2', 'LineSegments2', 'Points', 'Sprite']);

// Render do output final em DUAS camadas para o título poder ser exibido/ocultado: base (cena sem o título) e título (só o texto, fundo transparente).
export type RenderCapaArteEditor3D = { readonly base: string; readonly titulo: string | null; };
// Resolução reduzida do preview ao vivo (mesmo aspecto 16:9): leve o bastante para rodar todo frame.
const LARGURA_PREVIEW_CAPA = 320;
const ALTURA_PREVIEW_CAPA = 180;

function ocultaAuxiliaresDaCapa(scene: Scene): Object3D[] {
    const ocultados: Object3D[] = [];
    scene.traverse(objeto => {
        if (objeto.visible && (objeto.userData.naoExibirNaCapa === true || TIPOS_OCULTOS_NA_CAPA.has(objeto.type))) { objeto.visible = false; ocultados.push(objeto); }
    });
    return ocultados;
};

type ArestaFrustumCapa = readonly [Vector3, Vector3];

// Calcula as 8 arestas do frustum-guia: 4 do ápice (posição) aos cantos no plano do alvo + as 4 bordas da base.
function calculaArestasFrustumCapa(camera: CameraEditor3D): ArestaFrustumCapa[] {
    const pos = new Vector3(camera.posicao[0], camera.posicao[1], camera.posicao[2]);
    const alvo = new Vector3(camera.alvo[0], camera.alvo[1], camera.alvo[2]);
    const frente = alvo.clone().sub(pos);
    const distancia = Math.max(2, frente.length());
    frente.normalize();
    const cima = Math.abs(frente.z) > 0.99 ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1);
    const direita = new Vector3().crossVectors(frente, cima).normalize();
    const topo = new Vector3().crossVectors(direita, frente).normalize();
    const meiaAltura = distancia * Math.tan((camera.fov * Math.PI / 180) / 2);
    const meiaLargura = meiaAltura * ASPECTO_CAPA_ARTE_EDITOR3D;
    const centro = pos.clone().add(frente.clone().multiplyScalar(distancia));
    const ti = centro.clone().add(topo.clone().multiplyScalar(meiaAltura)).sub(direita.clone().multiplyScalar(meiaLargura));
    const td = centro.clone().add(topo.clone().multiplyScalar(meiaAltura)).add(direita.clone().multiplyScalar(meiaLargura));
    const bi = centro.clone().sub(topo.clone().multiplyScalar(meiaAltura)).sub(direita.clone().multiplyScalar(meiaLargura));
    const bd = centro.clone().sub(topo.clone().multiplyScalar(meiaAltura)).add(direita.clone().multiplyScalar(meiaLargura));
    return [[pos, ti], [pos, td], [pos, bi], [pos, bd], [ti, td], [td, bd], [bd, bi], [bi, ti]];
};

// Alvo de clique INVISÍVEL sobre cada aresta do frustum: cilindro grosso (raycast confiável) com material transparente — o visual fino fica por conta do CameraHelper.
function AlvoCliqueArestaEditor3D({ de, para, aoClicar }: { readonly de: Vector3; readonly para: Vector3; readonly aoClicar: (evento: ThreeEvent<MouseEvent>) => void }) {
    const { posicao, quaternion, comprimento } = useMemo(() => {
        const direcao = para.clone().sub(de);
        const comp = Math.max(0.0001, direcao.length());
        const meio = de.clone().add(para).multiplyScalar(0.5);
        const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direcao.clone().normalize());
        return { posicao: meio, quaternion: quat, comprimento: comp };
    }, [de, para]);

    return (
        <mesh position={posicao} quaternion={quaternion} onClick={aoClicar}>
            <cylinderGeometry args={[0.1, 0.1, comprimento, 5]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
    );
};

interface CameraCapaArteEditor3DProps {
    readonly camera: CameraEditor3D;
    readonly selecionada: boolean;
    readonly ocultarGizmo: boolean;
    readonly povAtiva: boolean;
    readonly aoSelecionarCamera: () => void;
    readonly aoMoverPosicao: (posicao: [number, number, number]) => void;
    readonly aoMoverAlvo: (alvo: [number, number, number]) => void;
};

// Frustum-guia clicável (selecionar a câmera clicando nas linhas/corpo, estilo Blender) + gizmos 3D de posição e alvo quando selecionada. No POV (dentro da câmera) tudo isto some.
export function CameraCapaArteEditor3D({ camera, selecionada, ocultarGizmo, povAtiva, aoSelecionarCamera, aoMoverPosicao, aoMoverAlvo }: CameraCapaArteEditor3DProps) {
    const proxyPosicao = useMemo(() => { const objeto = new Object3D(); objeto.userData.naoExibirNaCapa = true; return objeto; }, []);
    const proxyAlvo = useMemo(() => { const objeto = new Object3D(); objeto.userData.naoExibirNaCapa = true; return objeto; }, []);
    const proxyArrastandoRef = useRef<'posicao' | 'alvo' | null>(null);
    const arestas = useMemo(() => calculaArestasFrustumCapa(camera), [camera]);
    const pontosLinha = useMemo(() => arestas.flatMap(aresta => [aresta[0], aresta[1]]), [arestas]);

    // Sync por-proxy: sincroniza só o proxy que NÃO está em arrasto (o outro precisa acompanhar — ex.: alvo destravado segue a posição).
    useEffect(() => {
        if (proxyArrastandoRef.current !== 'posicao') proxyPosicao.position.set(camera.posicao[0], camera.posicao[1], camera.posicao[2]);
        if (proxyArrastandoRef.current !== 'alvo') proxyAlvo.position.set(camera.alvo[0], camera.alvo[1], camera.alvo[2]);
    }, [camera, proxyPosicao, proxyAlvo]);

    function aoClicarCamera(evento: ThreeEvent<MouseEvent>): void { evento.stopPropagation(); aoSelecionarCamera(); };
    function aoMoverProxyPosicao(): void { aoMoverPosicao([proxyPosicao.position.x, proxyPosicao.position.y, proxyPosicao.position.z]); };
    function aoMoverProxyAlvo(): void { aoMoverAlvo([proxyAlvo.position.x, proxyAlvo.position.y, proxyAlvo.position.z]); };

    if (povAtiva || ocultarGizmo) return null;

    return (
        <>
            {/* Alvos de clique INVISÍVEIS sobre as linhas do frustum + no corpo → selecionam a câmera (estilo Blender). O visual fino é o CameraHelper. */}
            <group userData={{ naoExibirNaCapa: true }}>
                <Line points={pontosLinha} segments lineWidth={selecionada ? 1.8 : 1.2} color={selecionada ? '#ffcf6e' : '#9aa6c4'} />
                {arestas.map((aresta, indice) => <AlvoCliqueArestaEditor3D key={indice} de={aresta[0]} para={aresta[1]} aoClicar={aoClicarCamera} />)}
                <mesh position={[camera.posicao[0], camera.posicao[1], camera.posicao[2]]} onClick={aoClicarCamera}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
            </group>

            {selecionada && (
                <>
                    <primitive object={proxyPosicao} />
                    <primitive object={proxyAlvo} />
                    <mesh position={[camera.alvo[0], camera.alvo[1], camera.alvo[2]]} userData={{ naoExibirNaCapa: true }}>
                        <sphereGeometry args={[0.09, 12, 12]} />
                        <meshBasicMaterial color="#ffb43c" depthTest={false} transparent opacity={0.85} />
                    </mesh>
                    <TransformControls object={proxyPosicao} mode="translate" onObjectChange={aoMoverProxyPosicao} onMouseDown={() => { proxyArrastandoRef.current = 'posicao'; }} onMouseUp={() => { proxyArrastandoRef.current = null; }} />
                    <TransformControls object={proxyAlvo} mode="translate" onObjectChange={aoMoverProxyAlvo} onMouseDown={() => { proxyArrastandoRef.current = 'alvo'; }} onMouseUp={() => { proxyArrastandoRef.current = null; }} />
                </>
            )}
        </>
    );
};

function montaCameraOutputCapaArte(camera: CameraEditor3D): PerspectiveCamera {
    const cam = new PerspectiveCamera(camera.fov, ASPECTO_CAPA_ARTE_EDITOR3D, PERTO_CAMERA_CAPA_ARTE_EDITOR3D, LONGE_CAMERA_CAPA_ARTE_EDITOR3D);
    cam.up.set(0, 0, 1);
    cam.position.set(camera.posicao[0], camera.posicao[1], camera.posicao[2]);
    cam.lookAt(camera.alvo[0], camera.alvo[1], camera.alvo[2]);
    cam.updateMatrixWorld(true);
    return cam;
};

// Lê o render-target (origem embaixo-à-esquerda → inverte Y) e devolve PNG data-URL (preserva alfa para a camada transparente do título).
function capturaDataUrlDoAlvoCapaArte(gl: WebGLRenderer, alvoRender: WebGLRenderTarget): string {
    const pixels = new Uint8Array(LARGURA_ARTE_DE_CAPA * ALTURA_ARTE_DE_CAPA * 4);
    gl.readRenderTargetPixels(alvoRender, 0, 0, LARGURA_ARTE_DE_CAPA, ALTURA_ARTE_DE_CAPA, pixels);

    const destino = document.createElement('canvas');
    destino.width = LARGURA_ARTE_DE_CAPA;
    destino.height = ALTURA_ARTE_DE_CAPA;
    const contexto = destino.getContext('2d');
    if (!contexto) return '';
    const imagem = contexto.createImageData(LARGURA_ARTE_DE_CAPA, ALTURA_ARTE_DE_CAPA);
    const bytesPorLinha = LARGURA_ARTE_DE_CAPA * 4;
    for (let linha = 0; linha < ALTURA_ARTE_DE_CAPA; linha += 1) {
        const origem = (ALTURA_ARTE_DE_CAPA - 1 - linha) * bytesPorLinha;
        imagem.data.set(pixels.subarray(origem, origem + bytesPorLinha), linha * bytesPorLinha);
    }
    contexto.putImageData(imagem, 0, 0);
    return destino.toDataURL('image/png');
};

// Camada base: a cena vista pela câmera-output (1280x720), sem grade/helpers E sem o título.
function renderizaCamadaBaseCapaArte(gl: WebGLRenderer, scene: Scene, camera: CameraEditor3D): string {
    const cam = montaCameraOutputCapaArte(camera);
    const ocultados: Object3D[] = [];
    scene.traverse(objeto => {
        if (objeto.visible && (objeto.userData.naoExibirNaCapa === true || TIPOS_OCULTOS_NA_CAPA.has(objeto.type) || objeto.userData.ehCamadaTituloCapaArte === true)) { objeto.visible = false; ocultados.push(objeto); }
    });

    const alvoRender = new WebGLRenderTarget(LARGURA_ARTE_DE_CAPA, ALTURA_ARTE_DE_CAPA);
    gl.setRenderTarget(alvoRender);
    gl.render(scene, cam);
    gl.setRenderTarget(null);
    const url = capturaDataUrlDoAlvoCapaArte(gl, alvoRender);

    for (const objeto of ocultados) objeto.visible = true;
    alvoRender.dispose();
    return url;
};

// Camada do título: só a malha do título (fundo transparente, sem background da cena), mantendo as luzes para iluminar o material.
function renderizaCamadaTituloCapaArte(gl: WebGLRenderer, scene: Scene, camera: CameraEditor3D): string {
    const cam = montaCameraOutputCapaArte(camera);
    const ocultados: Object3D[] = [];
    scene.traverse(objeto => {
        if (!objeto.visible) return;
        if (objeto.userData.ehCamadaTituloCapaArte === true) return;
        if (TIPOS_RENDERAVEIS_CAPA_ARTE.has(objeto.type)) { objeto.visible = false; ocultados.push(objeto); }
    });

    const fundoAnterior = scene.background;
    const corClearAnterior = gl.getClearColor(new Color());
    const alphaClearAnterior = gl.getClearAlpha();
    scene.background = null;
    gl.setClearColor(0x000000, 0);

    const alvoRender = new WebGLRenderTarget(LARGURA_ARTE_DE_CAPA, ALTURA_ARTE_DE_CAPA);
    gl.setRenderTarget(alvoRender);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(null);
    const url = capturaDataUrlDoAlvoCapaArte(gl, alvoRender);

    scene.background = fundoAnterior;
    gl.setClearColor(corClearAnterior, alphaClearAnterior);
    for (const objeto of ocultados) objeto.visible = true;
    alvoRender.dispose();
    return url;
};

function haTituloCapaArte(scene: Scene): boolean {
    let achou = false;
    scene.traverse(objeto => { if (objeto.visible && objeto.userData.ehCamadaTituloCapaArte === true) achou = true; });
    return achou;
};

// Modo POV (primeira pessoa): o viewport passa a renderizar pela própria câmera-output, e a navegação (orbit/pan/zoom) move a câmera, escrevendo posição/alvo de volta no estado. Convive com o gizmo (alterna-se entre os dois).
export function CameraPovEditor3D({ camera, permitePan, aoNavegar }: { readonly camera: CameraEditor3D; readonly permitePan: boolean; readonly aoNavegar: (posicao: [number, number, number], alvo: [number, number, number]) => void }) {
    const tamanho = useThree(estado => estado.size);
    const refCamera = useRef<PerspectiveCameraTipo>(null);
    const refControles = useRef<OrbitControlsImpl>(null);
    const prontoRef = useRef(false);

    // FOV do POV adaptado: quando o viewport é mais estreito que 16:9, amplia o FOV vertical para a largura inteira da saída caber (letterbox em cima/baixo = o guia 16:9). Mais largo que 16:9 → o FOV da própria câmera.
    const fovPov = useMemo(() => {
        const aspectoViewport = tamanho.width / Math.max(1, tamanho.height);
        const aspectoSaida = ASPECTO_CAPA_ARTE_EDITOR3D;
        if (aspectoViewport >= aspectoSaida) return camera.fov;
        const vFovSaida = (camera.fov * Math.PI) / 180;
        return (2 * Math.atan(Math.tan(vFovSaida / 2) * (aspectoSaida / aspectoViewport)) * 180) / Math.PI;
    }, [tamanho.width, tamanho.height, camera.fov]);

    // Inicializa uma vez (na entrada do POV) a partir do estado, num rAF para rodar depois que o drei estabelece a câmera default e os controles (senão o target volta a 0,0,0). Depois, a navegação é a fonte da verdade.
    useEffect(() => {
        if (prontoRef.current) return;
        let raf = 0;
        function inicia(): void {
            const cam = refCamera.current;
            const controles = refControles.current;
            if (!cam || !controles) { raf = requestAnimationFrame(inicia); return; }
            cam.position.set(camera.posicao[0], camera.posicao[1], camera.posicao[2]);
            controles.target.set(camera.alvo[0], camera.alvo[1], camera.alvo[2]);
            controles.update();
            prontoRef.current = true;
        };
        raf = requestAnimationFrame(inicia);
        return () => cancelAnimationFrame(raf);
    }, [camera]);

    // Mantém o FOV adaptado em sincronia com o redimensionamento do viewport.
    useEffect(() => {
        const cam = refCamera.current;
        if (!cam) return;
        cam.fov = fovPov;
        cam.updateProjectionMatrix();
    }, [fovPov]);

    function aoMudar(): void {
        const cam = refCamera.current;
        const controles = refControles.current;
        if (!prontoRef.current || !cam || !controles) return;
        aoNavegar([cam.position.x, cam.position.y, cam.position.z], [controles.target.x, controles.target.y, controles.target.z]);
    };

    return (
        <>
            <PerspectiveCameraDrei ref={refCamera} makeDefault fov={fovPov} near={PERTO_CAMERA_CAPA_ARTE_EDITOR3D} far={LONGE_CAMERA_CAPA_ARTE_EDITOR3D} position={[camera.posicao[0], camera.posicao[1], camera.posicao[2]]} />
            <OrbitControls ref={refControles} makeDefault enablePan={permitePan} enableZoom enableRotate enableDamping onChange={aoMudar} />
        </>
    );
};

// gl/scene só existem dentro do Canvas R3F; este componente registra a função de render no Editor (lado DOM) para o salvar acionar (full 1280x720, em 2 camadas).
export function RenderizadorCapaArteEditor3D({ aoRegistrar }: { readonly aoRegistrar: (render: ((camera: CameraEditor3D) => RenderCapaArteEditor3D) | null) => void }) {
    const gl = useThree(estado => estado.gl);
    const scene = useThree(estado => estado.scene);

    useEffect(() => {
        aoRegistrar((camera: CameraEditor3D) => ({
            base: renderizaCamadaBaseCapaArte(gl, scene, camera),
            titulo: haTituloCapaArte(scene) ? renderizaCamadaTituloCapaArte(gl, scene, camera) : null,
        }));
        return () => aoRegistrar(null);
    }, [gl, scene, aoRegistrar]);

    return null;
};

// Preview ao vivo: a cada ~2 frames, renderiza a cena pela câmera-output em resolução reduzida (320x180) e copia para um canvas 2D do inspetor. Atualiza em tempo real durante arrasto do gizmo/POV sem o custo do toDataURL por frame.
export function PreviewVivoCapaArteEditor3D({ camera, ativo, refCanvas }: { readonly camera: CameraEditor3D; readonly ativo: boolean; readonly refCanvas: RefObject<HTMLCanvasElement | null> }) {
    const gl = useThree(estado => estado.gl);
    const scene = useThree(estado => estado.scene);
    const refCamRender = useRef(new PerspectiveCamera(camera.fov, ASPECTO_CAPA_ARTE_EDITOR3D, PERTO_CAMERA_CAPA_ARTE_EDITOR3D, LONGE_CAMERA_CAPA_ARTE_EDITOR3D));
    const refAlvoRender = useRef<WebGLRenderTarget | null>(null);
    const refPixels = useRef(new Uint8Array(LARGURA_PREVIEW_CAPA * ALTURA_PREVIEW_CAPA * 4));
    const refImagem = useRef<ImageData | null>(null);
    const refCamera = useRef(camera);
    refCamera.current = camera;
    const refContador = useRef(0);

    useEffect(() => {
        refAlvoRender.current = new WebGLRenderTarget(LARGURA_PREVIEW_CAPA, ALTURA_PREVIEW_CAPA);
        return () => { refAlvoRender.current?.dispose(); refAlvoRender.current = null; };
    }, []);

    useFrame(() => {
        if (!ativo) return;
        refContador.current = (refContador.current + 1) % 2;
        if (refContador.current !== 0) return;
        const canvas = refCanvas.current;
        const alvoRender = refAlvoRender.current;
        if (!canvas || !alvoRender) return;
        const contexto = canvas.getContext('2d');
        if (!contexto) return;

        const c = refCamera.current;
        const cam = refCamRender.current;
        cam.fov = c.fov;
        cam.aspect = ASPECTO_CAPA_ARTE_EDITOR3D;
        cam.position.set(c.posicao[0], c.posicao[1], c.posicao[2]);
        cam.lookAt(c.alvo[0], c.alvo[1], c.alvo[2]);
        cam.updateProjectionMatrix();
        cam.updateMatrixWorld(true);

        const ocultados = ocultaAuxiliaresDaCapa(scene);
        const alvoAnterior = gl.getRenderTarget();
        gl.setRenderTarget(alvoRender);
        gl.render(scene, cam);
        gl.setRenderTarget(alvoAnterior);
        gl.readRenderTargetPixels(alvoRender, 0, 0, LARGURA_PREVIEW_CAPA, ALTURA_PREVIEW_CAPA, refPixels.current);
        for (const objeto of ocultados) objeto.visible = true;

        if (!refImagem.current) refImagem.current = contexto.createImageData(LARGURA_PREVIEW_CAPA, ALTURA_PREVIEW_CAPA);
        const imagem = refImagem.current;
        const bytesPorLinha = LARGURA_PREVIEW_CAPA * 4;
        for (let linha = 0; linha < ALTURA_PREVIEW_CAPA; linha += 1) {
            const origem = (ALTURA_PREVIEW_CAPA - 1 - linha) * bytesPorLinha;
            imagem.data.set(refPixels.current.subarray(origem, origem + bytesPorLinha), linha * bytesPorLinha);
        }
        contexto.putImageData(imagem, 0, 0);
    });

    return null;
};
