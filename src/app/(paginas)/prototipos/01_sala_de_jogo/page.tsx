'use client';

import { useRef, useState, useEffect, type PointerEvent as ReactPointerEvent, type CSSProperties } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import { MOUSE, Vector3, type Camera } from 'three';

export default function PagePrototipo() {
    // Essa página vai ser o recipiente de uma Sala de Jogo Fake. Ela vai precisar abrir um Sessao_Solo, já que a lógica de Sala fica no backend
    // Mas essa Sala de Jogo deve ser aberta assim q essa página abrir, apenas para um teste rápido de funcionalidade

    return (
        <>
            <Componente_ConteudoPrototipo />
        </>
    );
};

const GRAO = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const PROJ = new Vector3();

const PIP_M = 16;
const PIP_W = 320;
const PIP_H = 180;

const CABECA_JOGADOR: [number, number, number] = [0, 1.55, 0];

interface PersonagemDados { id: string; position: [number, number, number]; corRoupa: string; corPele: string; };

const PERSONAGENS: PersonagemDados[] = [
    { id: 'jogador', position: [0, 0, 0], corRoupa: '#2f6f86', corPele: '#e0b48f' },
    { id: 'inimigo', position: [1.7, 0, -2.2], corRoupa: '#a8473d', corPele: '#d8a87f' }
];

interface Marquee { x: number; y: number; w: number; h: number; };

function Componente_ConteudoPrototipo() {
    // absolute inset:0 preenche o container da própria página (o ancestral com transform do shell vira o containing block), sem cobrir o layout
    const [selecionados, setSelecionados] = useState<string[]>(['jogador']);
    const [principal, setPrincipal] = useState<'tatico' | 'fp'>('tatico');

    const estiloFull: CSSProperties = { position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 };
    const estiloPip: CSSProperties = { position: 'absolute', left: PIP_M, bottom: PIP_M, width: PIP_W, height: PIP_H, overflow: 'hidden', borderRadius: 10, border: '2px solid #c79a3f', zIndex: 3 };

    return (
        <div style={{ position: 'absolute', inset: 0, background: '#0e0c14', overflow: 'hidden' }}>
            <VistaTatica selecionados={selecionados} setSelecionados={setSelecionados} estilo={principal === 'tatico' ? estiloFull : estiloPip} />
            <VistaPrimeiraPessoa selecionados={selecionados} estilo={principal === 'fp' ? estiloFull : estiloPip} />

            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, backgroundImage: GRAO, opacity: 0.06, mixBlendMode: 'overlay' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 54%, rgba(0,0,0,0.5) 100%)' }} />

            <button onClick={() => setPrincipal(p => (p === 'tatico' ? 'fp' : 'tatico'))} title="Trocar visão principal" aria-label="Trocar visão principal" style={{ position: 'absolute', left: PIP_M + PIP_W - 17, bottom: PIP_M + PIP_H - 17, width: 34, height: 34, padding: 0, borderRadius: '50%', background: '#171019', border: '2px solid #e8c074', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 4 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f0d28a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 8 17 8" />
                    <polyline points="14 5 17 8 14 11" />
                    <polyline points="21 16 7 16" />
                    <polyline points="10 13 7 16 10 19" />
                </svg>
            </button>
        </div>
    );
};

interface VistaTaticaProps { selecionados: string[]; setSelecionados: (ids: string[]) => void; estilo: CSSProperties; };

function VistaTatica({ selecionados, setSelecionados, estilo }: VistaTaticaProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<Camera | null>(null);
    const domRef = useRef<HTMLCanvasElement | null>(null);
    const dragRef = useRef({ active: false, moved: false, x0: 0, y0: 0 });
    const [marquee, setMarquee] = useState<Marquee | null>(null);

    function projetar(position: [number, number, number]): { x: number; y: number } | null {
        const cam = cameraRef.current;
        const dom = domRef.current;
        if (!cam || !dom) return null;
        const r = dom.getBoundingClientRect();
        PROJ.set(position[0], position[1] + 1.0, position[2]).project(cam);
        return { x: r.left + (PROJ.x * 0.5 + 0.5) * r.width, y: r.top + (-PROJ.y * 0.5 + 0.5) * r.height };
    };

    function aoApertar(e: ReactPointerEvent<HTMLDivElement>) {
        if (e.button !== 0) return;
        dragRef.current = { active: true, moved: false, x0: e.clientX, y0: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    function aoMover(e: ReactPointerEvent<HTMLDivElement>) {
        const d = dragRef.current;
        if (!d.active) return;
        const dx = e.clientX - d.x0;
        const dy = e.clientY - d.y0;
        if (!d.moved && Math.hypot(dx, dy) > 5) d.moved = true;
        if (!d.moved) return;
        const cont = wrapRef.current;
        if (!cont) return;
        const cr = cont.getBoundingClientRect();
        setMarquee({ x: Math.min(d.x0, e.clientX) - cr.left, y: Math.min(d.y0, e.clientY) - cr.top, w: Math.abs(dx), h: Math.abs(dy) });
    };

    function aoSoltar(e: ReactPointerEvent<HTMLDivElement>) {
        const d = dragRef.current;
        if (!d.active) return;
        d.active = false;
        setMarquee(null);
        if (d.moved) {
            const x1 = Math.min(d.x0, e.clientX);
            const x2 = Math.max(d.x0, e.clientX);
            const y1 = Math.min(d.y0, e.clientY);
            const y2 = Math.max(d.y0, e.clientY);
            const dentro = PERSONAGENS.filter(p => { const s = projetar(p.position); return s !== null && s.x >= x1 && s.x <= x2 && s.y >= y1 && s.y <= y2; }).map(p => p.id);
            setSelecionados(dentro);
            return;
        }
        let melhor: string | null = null;
        let melhorDist = 44;
        for (const p of PERSONAGENS) {
            const s = projetar(p.position);
            if (s === null) continue;
            const dist = Math.hypot(s.x - e.clientX, s.y - e.clientY);
            if (dist < melhorDist) { melhorDist = dist; melhor = p.id; }
        }
        setSelecionados(melhor === null ? [] : [melhor]);
    };

    return (
        <div ref={wrapRef} onPointerDown={aoApertar} onPointerMove={aoMover} onPointerUp={aoSoltar} onContextMenu={e => e.preventDefault()} style={{ ...estilo, userSelect: 'none', touchAction: 'none' }}>
            <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [7, 10, 7], fov: 34, near: 0.1, far: 100 }} onCreated={({ camera, gl }) => { cameraRef.current = camera; domRef.current = gl.domElement; }}>
                <Cena selecionados={selecionados} />
                <OrbitControls
                    makeDefault
                    target={[0, 0.6, 0]}
                    enableDamping
                    enablePan
                    minDistance={6}
                    maxDistance={26}
                    minPolarAngle={Math.PI * 0.15}
                    maxPolarAngle={Math.PI * 0.46}
                    mouseButtons={{ MIDDLE: MOUSE.ROTATE, RIGHT: MOUSE.PAN }}
                />
            </Canvas>

            {marquee && <div style={{ position: 'absolute', left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h, border: '1px solid rgba(232,192,116,0.9)', background: 'rgba(232,192,116,0.12)', pointerEvents: 'none' }} />}
        </div>
    );
};

interface VistaPrimeiraPessoaProps { selecionados: string[]; estilo: CSSProperties; };

function VistaPrimeiraPessoa({ selecionados, estilo }: VistaPrimeiraPessoaProps) {
    return (
        <div style={estilo}>
            <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ fov: 72, near: 0.05, far: 100, position: CABECA_JOGADOR }}>
                <Cena selecionados={selecionados} ocultar="jogador" />
                <ControladorPrimeiraPessoa cabeca={CABECA_JOGADOR} />
            </Canvas>
        </div>
    );
};

interface ControladorPrimeiraPessoaProps { cabeca: [number, number, number]; };

function ControladorPrimeiraPessoa({ cabeca }: ControladorPrimeiraPessoaProps) {
    const { camera, gl } = useThree();
    const estadoRef = useRef({ yaw: Math.PI, pitch: 0, zoom: 0, drag: false, x: 0, y: 0 });

    useEffect(() => {
        const dom = gl.domElement;
        const dir = new Vector3();
        const aplica = () => {
            const s = estadoRef.current;
            dir.set(Math.sin(s.yaw) * Math.cos(s.pitch), Math.sin(s.pitch), Math.cos(s.yaw) * Math.cos(s.pitch));
            camera.position.set(cabeca[0] + dir.x * s.zoom, cabeca[1] + dir.y * s.zoom, cabeca[2] + dir.z * s.zoom);
            camera.lookAt(camera.position.x + dir.x, camera.position.y + dir.y, camera.position.z + dir.z);
        };
        aplica();
        const aoApertar = (e: PointerEvent) => { if (e.button !== 1) return; e.preventDefault(); const s = estadoRef.current; s.drag = true; s.x = e.clientX; s.y = e.clientY; dom.setPointerCapture(e.pointerId); };
        const aoMover = (e: PointerEvent) => { const s = estadoRef.current; if (!s.drag) return; s.yaw -= (e.clientX - s.x) * 0.005; s.pitch = Math.max(-1.3, Math.min(1.3, s.pitch - (e.clientY - s.y) * 0.005)); s.x = e.clientX; s.y = e.clientY; aplica(); };
        const aoSoltar = (e: PointerEvent) => { if (e.button === 1) estadoRef.current.drag = false; };
        const aoRolar = (e: WheelEvent) => { e.preventDefault(); const s = estadoRef.current; s.zoom = Math.max(0, Math.min(2.2, s.zoom + (e.deltaY < 0 ? 0.2 : -0.2))); aplica(); };
        const aoMenu = (e: Event) => e.preventDefault();
        dom.addEventListener('pointerdown', aoApertar);
        dom.addEventListener('pointermove', aoMover);
        dom.addEventListener('pointerup', aoSoltar);
        dom.addEventListener('wheel', aoRolar, { passive: false });
        dom.addEventListener('contextmenu', aoMenu);
        return () => {
            dom.removeEventListener('pointerdown', aoApertar);
            dom.removeEventListener('pointermove', aoMover);
            dom.removeEventListener('pointerup', aoSoltar);
            dom.removeEventListener('wheel', aoRolar);
            dom.removeEventListener('contextmenu', aoMenu);
        };
    }, [camera, gl, cabeca]);

    return null;
};

interface CenaProps { selecionados: string[]; ocultar?: string; };

function Cena({ selecionados, ocultar }: CenaProps) {
    return (
        <>
            <color attach="background" args={['#0e0c14']} />
            <fog attach="fog" args={['#0e0c14', 24, 54]} />

            <ambientLight intensity={0.55} color="#eef2f6" />
            <hemisphereLight intensity={0.55} color="#f4f7fb" groundColor="#9aa1ad" />
            <directionalLight
                castShadow
                position={[7, 13, 5]}
                intensity={1.25}
                color="#fff4e2"
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0005}
                shadow-camera-near={0.5}
                shadow-camera-far={44}
                shadow-camera-left={-9}
                shadow-camera-right={9}
                shadow-camera-top={9}
                shadow-camera-bottom={-9}
            />
            <directionalLight position={[-6, 8, -4]} intensity={0.35} color="#cfe0ff" />
            <pointLight position={[0, 3.6, 0]} intensity={4} distance={14} decay={2} color="#eaf1ff" />

            <Laboratorio />

            {PERSONAGENS.filter(p => p.id !== ocultar).map(p => (
                <Personagem key={p.id} position={p.position} corRoupa={p.corRoupa} corPele={p.corPele} selecionado={selecionados.includes(p.id)} />
            ))}
        </>
    );
};

function Laboratorio() {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[12, 12]} />
                <meshStandardMaterial color="#cdd4db" roughness={0.55} metalness={0.12} />
            </mesh>

            <Grid position={[0, 0.012, 0]} args={[12, 12]} cellSize={0.5} cellThickness={0.6} cellColor="#9aa3ad" sectionSize={3} sectionThickness={1} sectionColor="#6c7682" fadeDistance={32} fadeStrength={1} followCamera={false} infiniteGrid={false} />

            <Parede position={[0, 2, -6]} args={[12, 4, 0.3]} />
            <Parede position={[0, 2, 6]} args={[12, 4, 0.3]} />
            <Parede position={[6, 2, 0]} args={[0.3, 4, 12]} />
            <Parede position={[-6, 2, 0]} args={[0.3, 4, 12]} />

            <PainelLuz position={[0, 2.9, -5.83]} args={[6, 0.5, 0.06]} />
            <PainelLuz position={[0, 2.9, 5.83]} args={[6, 0.5, 0.06]} />
            <PainelLuz position={[5.83, 2.9, 0]} args={[0.06, 0.5, 6]} />
            <PainelLuz position={[-5.83, 2.9, 0]} args={[0.06, 0.5, 6]} />

            <Reforco position={[-6, 2, -6]} args={[0.55, 4.1, 0.55]} />
            <Reforco position={[6, 2, -6]} args={[0.55, 4.1, 0.55]} />
            <Reforco position={[-6, 2, 6]} args={[0.55, 4.1, 0.55]} />
            <Reforco position={[6, 2, 6]} args={[0.55, 4.1, 0.55]} />

            <Reforco position={[0, 0.12, -6]} args={[12.1, 0.24, 0.4]} />
            <Reforco position={[0, 0.12, 6]} args={[12.1, 0.24, 0.4]} />
            <Reforco position={[6, 0.12, 0]} args={[0.4, 0.24, 12.1]} />
            <Reforco position={[-6, 0.12, 0]} args={[0.4, 0.24, 12.1]} />

            <Reforco position={[0, 3.9, -6]} args={[12.1, 0.2, 0.42]} />
            <Reforco position={[0, 3.9, 6]} args={[12.1, 0.2, 0.42]} />
            <Reforco position={[6, 3.9, 0]} args={[0.42, 0.2, 12.1]} />
            <Reforco position={[-6, 3.9, 0]} args={[0.42, 0.2, 12.1]} />
        </group>
    );
};

interface ParedeProps { position: [number, number, number]; args: [number, number, number]; };

function Parede({ position, args }: ParedeProps) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#d7dde3" roughness={0.7} metalness={0.05} />
        </mesh>
    );
};

function Reforco({ position, args }: ParedeProps) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#8d96a1" roughness={0.4} metalness={0.65} />
        </mesh>
    );
};

function PainelLuz({ position, args }: ParedeProps) {
    return (
        <mesh position={position}>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#eef4ff" emissive="#dfeaff" emissiveIntensity={0.9} roughness={0.3} />
        </mesh>
    );
};

interface PersonagemProps { position: [number, number, number]; corRoupa: string; corPele: string; selecionado?: boolean; };

function Personagem({ position, corRoupa, corPele, selecionado = false }: PersonagemProps) {
    return (
        <group position={position}>
            {selecionado && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                    <torusGeometry args={[0.55, 0.045, 14, 56]} />
                    <meshStandardMaterial color="#e8c074" emissive="#e8c074" emissiveIntensity={0.7} roughness={0.4} metalness={0.2} />
                </mesh>
            )}

            <mesh castShadow position={[-0.14, 0.36, 0]}>
                <capsuleGeometry args={[0.12, 0.42, 6, 14]} />
                <meshStandardMaterial color={corRoupa} roughness={0.55} metalness={0.05} />
            </mesh>
            <mesh castShadow position={[0.14, 0.36, 0]}>
                <capsuleGeometry args={[0.12, 0.42, 6, 14]} />
                <meshStandardMaterial color={corRoupa} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh castShadow position={[0, 0.74, 0]}>
                <boxGeometry args={[0.4, 0.24, 0.26]} />
                <meshStandardMaterial color={corRoupa} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh castShadow position={[0, 1.04, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 0.52, 18]} />
                <meshStandardMaterial color={corRoupa} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh castShadow position={[-0.32, 1.0, 0]} rotation={[0, 0, 0.09]}>
                <capsuleGeometry args={[0.08, 0.44, 6, 12]} />
                <meshStandardMaterial color={corRoupa} roughness={0.55} metalness={0.05} />
            </mesh>
            <mesh castShadow position={[0.32, 1.0, 0]} rotation={[0, 0, -0.09]}>
                <capsuleGeometry args={[0.08, 0.44, 6, 12]} />
                <meshStandardMaterial color={corRoupa} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh position={[0, 1.35, 0]}>
                <cylinderGeometry args={[0.07, 0.085, 0.1, 12]} />
                <meshStandardMaterial color={corPele} roughness={0.6} metalness={0} />
            </mesh>

            <mesh castShadow position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.17, 28, 28]} />
                <meshStandardMaterial color={corPele} roughness={0.6} metalness={0} />
            </mesh>
        </group>
    );
};
