'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree, useFrame, type ThreeEvent } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, useGizmoContext } from '@react-three/drei';
import { CanvasTexture, Quaternion, Vector3, type Camera } from 'three';

import { CORES_EIXOS_EDITOR3D } from './editor3D.tipos';

// Cores dos eixos (X vermelho, Y verde, Z azul) — fonte única compartilhada com o painel Transform.
const [COR_X, COR_Y, COR_Z] = CORES_EIXOS_EDITOR3D;

type EixoGizmo = 'x' | 'y' | 'z';
type SinalGizmo = 1 | -1;
// Só o mínimo do OrbitControls que precisamos tocar: drenar o damping, suspender/religar durante o tween, e atualizar.
type ControlesOrbitaGizmo = { enableDamping: boolean; enabled: boolean; update: () => void };

// As 6 direções do gizmo. Diferente do GizmoViewport do drei (que deixa as negativas SEM rótulo, menores e translúcidas),
// aqui TODAS as bolinhas são rotuladas e sólidas — o negativo mostra "-X"/"-Y"/"-Z" (pedido de usabilidade).
const CABECAS_GIZMO: readonly { eixo: EixoGizmo; sinal: SinalGizmo; posicao: [number, number, number]; rotulo: string; cor: string }[] = [
    { eixo: 'x', sinal: 1, posicao: [1, 0, 0], rotulo: 'X', cor: COR_X },
    { eixo: 'x', sinal: -1, posicao: [-1, 0, 0], rotulo: '-X', cor: COR_X },
    { eixo: 'y', sinal: 1, posicao: [0, 1, 0], rotulo: 'Y', cor: COR_Y },
    { eixo: 'y', sinal: -1, posicao: [0, -1, 0], rotulo: '-Y', cor: COR_Y },
    { eixo: 'z', sinal: 1, posicao: [0, 0, 1], rotulo: 'Z', cor: COR_Z },
    { eixo: 'z', sinal: -1, posicao: [0, 0, -1], rotulo: '-Z', cor: COR_Z },
];

// Vetor de trabalho pra ler a direção atual da câmera principal + limiar (cosseno ~3.6°) do "já estou olhando deste eixo".
const FRENTE_CAMERA_AUX = new Vector3();
const LIMIAR_JA_ALINHADO = 0.998;

// Bolinha clicável de uma direção: círculo na cor do eixo + rótulo preto em bold (legível também nas negativas).
function CabecaEixoGizmo({ posicao, rotulo, cor, aoClicar }: { posicao: [number, number, number]; rotulo: string; cor: string; aoClicar: (evento: ThreeEvent<PointerEvent>) => void }) {
    const gl = useThree(estado => estado.gl);
    const [ativo, setAtivo] = useState(false);

    const textura = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const contexto = canvas.getContext('2d');
        if (contexto === null) return new CanvasTexture(canvas);
        contexto.beginPath();
        contexto.arc(64, 64, 40, 0, 2 * Math.PI);
        contexto.closePath();
        contexto.fillStyle = cor;
        contexto.fill();
        contexto.font = `bold ${rotulo.length > 1 ? 44 : 60}px Inter var, Arial, sans-serif`;
        contexto.textAlign = 'center';
        contexto.textBaseline = 'middle';
        contexto.fillStyle = '#000000';
        contexto.fillText(rotulo, 64, 66);
        return new CanvasTexture(canvas);
    }, [cor, rotulo]);

    useEffect(() => () => textura.dispose(), [textura]);

    return (
        <sprite
            position={posicao}
            scale={ativo ? 1.25 : 1}
            onPointerOver={evento => { evento.stopPropagation(); setAtivo(true); }}
            onPointerOut={evento => { evento.stopPropagation(); setAtivo(false); }}
            onPointerDown={aoClicar}
        >
            <spriteMaterial map={textura} alphaTest={0.3} toneMapped={false} map-anisotropy={gl.capabilities.getMaxAnisotropy() || 1} />
        </sprite>
    );
};

// Miolo do gizmo: as 6 bolinhas, usando o tweenCamera PÚBLICO do GizmoHelper (a animação da câmera continua sendo do drei).
// A decisão flip-vs-alinhar sai da orientação REAL da câmera principal: se ela já está olhando deste eixo/sinal, clicar
// inverte 180° (estilo Blender); se saiu do eixo (orbitou pra longe), clicar só RE-ALINHA àquele eixo — não inverte.
function CabecasEixosGizmo({ cameraPrincipal, aoIniciarTween }: { cameraPrincipal: Camera; aoIniciarTween: () => void }) {
    const { tweenCamera } = useGizmoContext();

    const aoClicarEixo = (eixo: EixoGizmo, sinal: SinalGizmo) => (evento: ThreeEvent<PointerEvent>) => {
        evento.stopPropagation();
        // Drena o resíduo do damping e SUSPENDE o OrbitControls antes de ler a orientação e disparar o tween (ver
        // aoIniciarTween) — assim o slerp do drei anima a câmera sozinho, sem o lookAt por-frame do controle brigando.
        aoIniciarTween();
        // A câmera "olha para dentro" da cena; o eixo de onde ela OLHA é o oposto da frente. Se esse eixo já bate com a
        // direção clicada (dentro do limiar), invertemos; senão, alinhamos direto — assim orbitar cancela o toggle.
        cameraPrincipal.getWorldDirection(FRENTE_CAMERA_AUX);
        const frenteNoEixo = eixo === 'x' ? FRENTE_CAMERA_AUX.x : eixo === 'y' ? FRENTE_CAMERA_AUX.y : FRENTE_CAMERA_AUX.z;
        const jaOlhandoDesteEixo = -frenteNoEixo * sinal > LIMIAR_JA_ALINHADO;
        const sinalAlvo: SinalGizmo = jaOlhandoDesteEixo ? (sinal === 1 ? -1 : 1) : sinal;
        tweenCamera(new Vector3(eixo === 'x' ? sinalAlvo : 0, eixo === 'y' ? sinalAlvo : 0, eixo === 'z' ? sinalAlvo : 0));
    };

    // scale 40 = mesma escala do grupo interno do GizmoViewport, para as bolinhas casarem com as pontas das barras.
    return (
        <group scale={40}>
            {CABECAS_GIZMO.map(cabeca => <CabecaEixoGizmo key={cabeca.rotulo} posicao={cabeca.posicao} rotulo={cabeca.rotulo} cor={cabeca.cor} aoClicar={aoClicarEixo(cabeca.eixo, cabeca.sinal)} />)}
        </group>
    );
};

// Gizmo de navegação do Editor 3D. Mantém o máximo no drei: o GizmoHelper (posição no canto + animação da câmera) e as
// BARRAS do GizmoViewport (via hideAxisHeads). A única coisa nossa são as 6 CABEÇAS clicáveis — para rotular as negativas
// e trazer o toggle 180° do Blender, que a lib não expõe.
export function GizmoNavegacaoEditor3D() {
    const cameraPrincipal = useThree(estado => estado.camera);
    const controlesOrbita = useThree(estado => estado.controls) as unknown as ControlesOrbitaGizmo | null;
    const tweenAtivoRef = useRef(false);
    const framesParadoRef = useRef(0);
    const framesTotalRef = useRef(0);
    const quatAnteriorRef = useRef(new Quaternion());

    // Enquanto o tween do gizmo anima, o OrbitControls fica SUSPENSO (enabled=false + onUpdate no-op no GizmoHelper): o slerp
    // do drei é o ÚNICO a mexer na câmera. Senão, o update() do controle roda a cada frame e faz lookAt(alvo) com o "up" que
    // o tween está girando — perto dos polos isso desestabiliza quando o tween começa em movimento. Aqui religamos quando a
    // câmera assenta (3 frames parada) — com um teto de segurança pra nunca deixar o controle preso desligado.
    useFrame(() => {
        if (!tweenAtivoRef.current || controlesOrbita === null) return;
        framesTotalRef.current += 1;
        const mudanca = cameraPrincipal.quaternion.angleTo(quatAnteriorRef.current);
        quatAnteriorRef.current.copy(cameraPrincipal.quaternion);
        framesParadoRef.current = mudanca < 0.0002 ? framesParadoRef.current + 1 : 0;
        if (framesParadoRef.current >= 3 || framesTotalRef.current > 90) {
            controlesOrbita.enabled = true;
            tweenAtivoRef.current = false;
        }
    });

    // Chamado no clique, ANTES do tween: drena o resíduo do damping (senão volta como "pulo" ao religar) e suspende o
    // controle. O detector acima religa quando a animação termina.
    const aoIniciarTween = () => {
        if (controlesOrbita === null) return;
        const dampingAtivo = controlesOrbita.enableDamping;
        controlesOrbita.enableDamping = false;
        controlesOrbita.update();
        controlesOrbita.enableDamping = dampingAtivo;
        controlesOrbita.enabled = false;
        tweenAtivoRef.current = true;
        framesParadoRef.current = 0;
        framesTotalRef.current = 0;
        quatAnteriorRef.current.copy(cameraPrincipal.quaternion);
    };

    return (
        <GizmoHelper alignment="top-right" margin={[72, 72]} onUpdate={() => {}}>
            <GizmoViewport axisColors={[COR_X, COR_Y, COR_Z]} hideAxisHeads />
            <CabecasEixosGizmo cameraPrincipal={cameraPrincipal} aoIniciarTween={aoIniciarTween} />
        </GizmoHelper>
    );
};
