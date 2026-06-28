'use client';

import styles from './Editor3D.module.css';

import { type MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls } from '@react-three/drei';
import { Box3, BoxGeometry, Color, EdgesGeometry, Vector3 } from 'three';
import type { LineBasicMaterial, Mesh } from 'three';

type ModoTransformEditor3D = 'translate' | 'rotate' | 'scale';
type TipoPrimitivaEditor3D = 'CUBO' | 'CILINDRO';
type ObjetoEditor3D = { id: number; tipo: TipoPrimitivaEditor3D; posicaoInicial: [number, number, number]; };

const ROTULO_MODO: Record<ModoTransformEditor3D, string> = { translate: 'Mover', rotate: 'Rotacionar', scale: 'Escalar' };

// Tamanho fixo do volume normativo da Insígnia (X, Y, Z). Placeholder: os números reais de proporção/ocupação ainda não foram definidos.
const VOLUME_NORMATIVO_EXTENSAO: [number, number, number] = [2, 2, 2];
const VOLUME_NORMATIVO_CENTRO: [number, number, number] = [0, 1, 0];

// O shell do app anima a escala do container na entrada; o R3F mede o canvas antes do layout assentar e fica em tamanho zero (cena preta). Reforçamos a remedição depois que assenta (mesmo padrão da Sala de Jogo R3F).
function useReforcaRedimensionamentoCanvas() {
    useEffect(() => {
        const tempos = [120, 360, 720].map(ms => window.setTimeout(() => window.dispatchEvent(new Event('resize')), ms));
        return () => tempos.forEach(window.clearTimeout);
    }, []);
};

function calculaPosicaoInicialObjeto(indice: number): [number, number, number] {
    return [(indice % 3 - 1) * 0.5, 0.5, (Math.floor(indice / 3) % 3 - 1) * 0.5];
};

export function Editor3D() {
    useReforcaRedimensionamentoCanvas();
    const [objetos, setObjetos] = useState<readonly ObjetoEditor3D[]>([]);
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
    const [modo, setModo] = useState<ModoTransformEditor3D>('translate');
    const contadorRef = useRef(0);
    const refMeshSelecionada = useRef<Mesh | null>(null);
    const registraMeshSelecionada = useCallback((mesh: Mesh | null) => { refMeshSelecionada.current = mesh; }, []);

    function adicionaObjeto(tipo: TipoPrimitivaEditor3D): void {
        contadorRef.current += 1;
        const id = contadorRef.current;
        setObjetos(atuais => [...atuais, { id, tipo, posicaoInicial: calculaPosicaoInicialObjeto(atuais.length) }]);
        setIdSelecionado(id);
    };

    useEffect(() => {
        if (idSelecionado === null) return;
        function aoTeclar(evento: KeyboardEvent): void {
            if (evento.key === 'g') setModo('translate');
            if (evento.key === 'r') setModo('rotate');
            if (evento.key === 's') setModo('scale');
        };
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [idSelecionado]);

    return (
        <div className={styles.recipiente_editor_3d}>
            <div className={styles.painel_ferramentas}>
                <div className={styles.grupo_botoes}>
                    <button type="button" className={styles.botao} onClick={() => adicionaObjeto('CUBO')}>+ Cubo</button>
                    <button type="button" className={styles.botao} onClick={() => adicionaObjeto('CILINDRO')}>+ Cilindro</button>
                </div>
                <div className={styles.grupo_botoes}>
                    {(Object.keys(ROTULO_MODO) as ModoTransformEditor3D[]).map(modoAtual => (
                        <button key={modoAtual} type="button" className={`${styles.botao} ${modo === modoAtual ? styles.botao_ativo : ''}`} onClick={() => setModo(modoAtual)}>{ROTULO_MODO[modoAtual]}</button>
                    ))}
                </div>
            </div>

            <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [6, 5, 6], fov: 38, near: 0.1, far: 200 }} onPointerMissed={() => setIdSelecionado(null)}>
                <color attach="background" args={['#0e0c14']} />
                <ambientLight intensity={0.6} color="#eef2f6" />
                <hemisphereLight intensity={0.5} color="#f4f7fb" groundColor="#9aa1ad" />
                <directionalLight castShadow position={[8, 12, 6]} intensity={1.1} color="#fff4e2" />

                <ChaoEditor3D />
                <VolumeNormativoEditor3D refMeshSelecionada={refMeshSelecionada} />

                {objetos.map(objeto => <ObjetoEditavelEditor3D key={objeto.id} objeto={objeto} selecionado={objeto.id === idSelecionado} modo={modo} aoSelecionar={setIdSelecionado} registraMeshSelecionada={registraMeshSelecionada} />)}

                <OrbitControls makeDefault enablePan enableZoom enableRotate enableDamping target={[0, 1, 0]} minDistance={2} maxDistance={60} />
            </Canvas>
        </div>
    );
};

interface ObjetoEditavelEditor3DProps {
    readonly objeto: ObjetoEditor3D;
    readonly selecionado: boolean;
    readonly modo: ModoTransformEditor3D;
    readonly aoSelecionar: (id: number) => void;
    readonly registraMeshSelecionada: (mesh: Mesh | null) => void;
};

function ObjetoEditavelEditor3D({ objeto, selecionado, modo, aoSelecionar, registraMeshSelecionada }: ObjetoEditavelEditor3DProps) {
    const meshRef = useRef<Mesh>(null);

    useEffect(() => {
        if (meshRef.current) meshRef.current.position.set(objeto.posicaoInicial[0], objeto.posicaoInicial[1], objeto.posicaoInicial[2]);
    }, [objeto.posicaoInicial]);

    useEffect(() => {
        if (!selecionado) return;
        registraMeshSelecionada(meshRef.current);
        return () => registraMeshSelecionada(null);
    }, [selecionado, registraMeshSelecionada]);

    function aoClicar(evento: ThreeEvent<MouseEvent>): void { evento.stopPropagation(); aoSelecionar(objeto.id); };

    return (
        <>
            <mesh ref={meshRef} castShadow receiveShadow onClick={aoClicar}>
                {objeto.tipo === 'CUBO' ? <boxGeometry args={[1, 1, 1]} /> : <cylinderGeometry args={[0.5, 0.5, 1, 24]} />}
                <meshStandardMaterial color={selecionado ? '#e8c074' : '#7484b4'} emissive={selecionado ? '#e8c074' : '#000000'} emissiveIntensity={selecionado ? 0.18 : 0} roughness={0.55} metalness={0.1} />
            </mesh>
            {selecionado && <TransformControls object={meshRef} mode={modo} />}
        </>
    );
};

interface VolumeNormativoEditor3DProps {
    readonly refMeshSelecionada: MutableRefObject<Mesh | null>;
};

function VolumeNormativoEditor3D({ refMeshSelecionada }: VolumeNormativoEditor3DProps) {
    const materialRef = useRef<LineBasicMaterial>(null);
    const caixaObjeto = useRef(new Box3());
    const corDentro = useMemo(() => new Color('#4ade80'), []);
    const corFora = useMemo(() => new Color('#ef4444'), []);
    const volume = useMemo(() => new Box3().setFromCenterAndSize(new Vector3(...VOLUME_NORMATIVO_CENTRO), new Vector3(...VOLUME_NORMATIVO_EXTENSAO)), []);
    const geometriaArestas = useMemo(() => {
        const caixa = new BoxGeometry(VOLUME_NORMATIVO_EXTENSAO[0], VOLUME_NORMATIVO_EXTENSAO[1], VOLUME_NORMATIVO_EXTENSAO[2]);
        const arestas = new EdgesGeometry(caixa);
        caixa.dispose();
        return arestas;
    }, []);

    useEffect(() => () => geometriaArestas.dispose(), [geometriaArestas]);

    useFrame(() => {
        const material = materialRef.current;
        if (!material) return;
        const mesh = refMeshSelecionada.current;
        let dentro = true;
        if (mesh !== null) { caixaObjeto.current.setFromObject(mesh); dentro = volume.containsBox(caixaObjeto.current); }
        material.color.copy(dentro ? corDentro : corFora);
    });

    return (
        <lineSegments geometry={geometriaArestas} position={VOLUME_NORMATIVO_CENTRO}>
            <lineBasicMaterial ref={materialRef} color="#4ade80" transparent opacity={0.85} />
        </lineSegments>
    );
};

function ChaoEditor3D() {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#16131d" roughness={0.9} metalness={0.05} />
            </mesh>
            <Grid position={[0, 0.002, 0]} args={[40, 40]} cellSize={1} cellThickness={0.6} cellColor="#3a3550" sectionSize={5} sectionThickness={1.1} sectionColor="#6c5f8f" fadeDistance={60} fadeStrength={1} followCamera={false} infiniteGrid={false} />
        </group>
    );
};
