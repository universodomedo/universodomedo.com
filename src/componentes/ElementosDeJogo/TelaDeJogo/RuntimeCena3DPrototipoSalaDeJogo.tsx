'use client';

import styles from './styles.module.css';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState, type Dispatch, type MouseEvent as ReactMouseEvent, type MutableRefObject, type RefObject, type SetStateAction } from 'react';
import { Matrix4, Vector3, type Group } from 'three';

import { comandoMouseAreaInterativa3DEstaAtivo, comandoTecladoAreaInterativa3DEstaAtivo, obtemDirecaoMovimentoSala3DComandoAreaInterativa3D } from '../../ElementosDeInteratividade3D/comandos/editor3D.comandos';
import type { DocumentoCena3DPrototipo, ObjetoCena3DPrototipo, Vetor3Cena3DPrototipo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.types';

type ModoCameraSalaJogoPrototipo = 'PRIMEIRA_PESSOA' | 'TERCEIRA_PESSOA';
type Vetor3Three = [number, number, number];

interface EstadoJogadorSalaJogoPrototipo {
    posicao: Vetor3Cena3DPrototipo;
    yaw: number;
    pitch: number;
};

interface RuntimeCena3DPrototipoSalaDeJogoProps {
    documento: DocumentoCena3DPrototipo;
};

interface CenaSalaJogoPrototipoProps {
    documento: DocumentoCena3DPrototipo;
    elementoControleRef: RefObject<HTMLDivElement | null>;
    jogadorRef: MutableRefObject<EstadoJogadorSalaJogoPrototipo>;
    modoCamera: ModoCameraSalaJogoPrototipo;
};

interface ControladorJogadorSalaJogoPrototipoProps {
    elementoControleRef: RefObject<HTMLDivElement | null>;
    jogadorRef: MutableRefObject<EstadoJogadorSalaJogoPrototipo>;
    modoCamera: ModoCameraSalaJogoPrototipo;
};

interface PersonagemTerceiraPessoaSalaJogoPrototipoProps {
    jogadorRef: MutableRefObject<EstadoJogadorSalaJogoPrototipo>;
    modoCamera: ModoCameraSalaJogoPrototipo;
};

const velocidadeMovimentoJogadorSalaJogoPrototipo = 4;
const sensibilidadeMouseSalaJogoPrototipo = 0.0024;
const limitePitchSalaJogoPrototipo = Math.PI / 2.7;
const matrizConversaoEditorParaThreeSalaJogoPrototipo = new Matrix4().fromArray([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
const matrizConversaoThreeParaEditorSalaJogoPrototipo = new Matrix4().fromArray([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]);

function limitaValorSalaJogoPrototipo(valor: number, minimo: number, maximo: number): number { return Math.min(maximo, Math.max(minimo, valor)); };
function criaPosicaoThree(vetor: Vetor3Cena3DPrototipo): Vetor3Three { return [vetor[0], vetor[2], -vetor[1]]; };
function criaRotacaoThree(vetor: Vetor3Cena3DPrototipo): Vetor3Three { return [vetor[0], vetor[2], -vetor[1]]; };
function criaEscalaThree(vetor: Vetor3Cena3DPrototipo): Vetor3Three { return [Math.max(0.01, vetor[0]), Math.max(0.01, vetor[2]), Math.max(0.01, vetor[1])]; };
function converteVetorEditorParaThree(vetor: Vetor3Cena3DPrototipo): Vector3 { return new Vector3(vetor[0], vetor[2], -vetor[1]); };

function criaDirecaoOlharEditor(yaw: number, pitch: number): Vetor3Cena3DPrototipo {
    const cosPitch = Math.cos(pitch);

    return [Math.sin(yaw) * cosPitch, Math.cos(yaw) * cosPitch, Math.sin(pitch)];
};

function criaCorMaterial(cor: Vetor3Cena3DPrototipo): string {
    const r = Math.round(limitaValorSalaJogoPrototipo(cor[0], 0, 1) * 255);
    const g = Math.round(limitaValorSalaJogoPrototipo(cor[1], 0, 1) * 255);
    const b = Math.round(limitaValorSalaJogoPrototipo(cor[2], 0, 1) * 255);

    return `rgb(${r}, ${g}, ${b})`;
};

function somaVetor3Cena3D(a: Vetor3Cena3DPrototipo, b: Vetor3Cena3DPrototipo): Vetor3Cena3DPrototipo { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };
function multiplicaVetor3Cena3D(vetor: Vetor3Cena3DPrototipo, multiplicador: number): Vetor3Cena3DPrototipo { return [vetor[0] * multiplicador, vetor[1] * multiplicador, vetor[2] * multiplicador]; };
function criaMatrizBaseThreeSalaJogoPrototipo(matrizBase: readonly number[]): Matrix4 { return matrizConversaoEditorParaThreeSalaJogoPrototipo.clone().multiply(new Matrix4().fromArray([...matrizBase])).multiply(matrizConversaoThreeParaEditorSalaJogoPrototipo); };

function criaEstadoInicialJogador(documento: DocumentoCena3DPrototipo): EstadoJogadorSalaJogoPrototipo {
    return { posicao: documento.pontoEntradaJogador.posicao, yaw: documento.pontoEntradaJogador.rotacaoZ, pitch: 0 };
};

function solicitaPointerLock(event: ReactMouseEvent<HTMLDivElement>, elementoControleRef: RefObject<HTMLDivElement | null>): void {
    if (!comandoMouseAreaInterativa3DEstaAtivo('mouse-sala-3d', event)) return;
    if (event.target instanceof HTMLElement && event.target.closest('button') !== null) return;

    elementoControleRef.current?.requestPointerLock();
};

function alternaModoCamera(setModoCamera: Dispatch<SetStateAction<ModoCameraSalaJogoPrototipo>>): void {
    setModoCamera(modoAtual => modoAtual === 'PRIMEIRA_PESSOA' ? 'TERCEIRA_PESSOA' : 'PRIMEIRA_PESSOA');
};

function GeometriaObjetoSalaJogoPrototipo({ objeto }: { objeto: ObjetoCena3DPrototipo }) {
    const segmentos = Math.max(3, Math.min(96, Math.floor(objeto.quantidadeVertices)));

    if (objeto.tipo === 'VERTICE') return <sphereGeometry args={[0.08, 8, 8]} />;
    if (objeto.tipo === 'PLANO_2D') return <boxGeometry args={[1.2, 0.04, 1.2]} />;
    if (objeto.tipo === 'CIRCULO_2D') return <cylinderGeometry args={[0.6, 0.6, 0.04, segmentos]} />;
    if (objeto.tipo === 'CUBO_3D') return <boxGeometry args={[1, 1, 1]} />;
    if (objeto.tipo === 'CILINDRO_3D') return <cylinderGeometry args={[0.5, 0.5, 1, segmentos]} />;

    return <sphereGeometry args={[0.55, segmentos, Math.max(8, Math.floor(segmentos / 2))]} />;
};

function ObjetoCenaSalaJogoPrototipo({ objeto }: { objeto: ObjetoCena3DPrototipo }) {
    const grupoMatrizBaseRef = useRef<Group | null>(null);

    useEffect(() => {
        const grupo = grupoMatrizBaseRef.current;

        if (grupo === null) return;

        grupo.matrix.copy(criaMatrizBaseThreeSalaJogoPrototipo(objeto.transform.matrizBase));
        grupo.matrixAutoUpdate = false;
    }, [objeto.transform.matrizBase, objeto.visivel]);

    if (!objeto.visivel) return null;

    return (
        <group position={criaPosicaoThree(objeto.transform.posicao)} rotation={criaRotacaoThree(objeto.transform.rotacao)} scale={criaEscalaThree(objeto.transform.escala)}>
            <group ref={grupoMatrizBaseRef}>
                <mesh castShadow receiveShadow>
                    <GeometriaObjetoSalaJogoPrototipo objeto={objeto} />
                    <meshStandardMaterial color={criaCorMaterial(objeto.material.corBase)} roughness={0.72} metalness={0.02} />
                </mesh>
            </group>
        </group>
    );
};

function ControladorJogadorSalaJogoPrototipo({ elementoControleRef, jogadorRef, modoCamera }: ControladorJogadorSalaJogoPrototipoProps) {
    const teclasPressionadasRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        function pressionaTecla(event: KeyboardEvent): void {
            if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]') !== null) return;

            const tecla = event.key.toLowerCase();

            if (!comandoTecladoAreaInterativa3DEstaAtivo('wasd-sala-3d', event)) return;
            if (document.pointerLockElement !== elementoControleRef.current) return;

            teclasPressionadasRef.current.add(tecla);
            event.preventDefault();
        };

        function soltaTecla(event: KeyboardEvent): void { teclasPressionadasRef.current.delete(event.key.toLowerCase()); };
        function limpaTeclasPressionadas(): void { teclasPressionadasRef.current.clear(); };
        function atualizaPointerLock(): void {
            if (document.pointerLockElement !== elementoControleRef.current) limpaTeclasPressionadas();
        };

        function moveMouse(event: MouseEvent): void {
            if (document.pointerLockElement !== elementoControleRef.current) return;

            const jogador = jogadorRef.current;

            jogador.yaw -= event.movementX * sensibilidadeMouseSalaJogoPrototipo;
            jogador.pitch = limitaValorSalaJogoPrototipo(jogador.pitch - (event.movementY * sensibilidadeMouseSalaJogoPrototipo), -limitePitchSalaJogoPrototipo, limitePitchSalaJogoPrototipo);
        };

        window.addEventListener('keydown', pressionaTecla);
        window.addEventListener('keyup', soltaTecla);
        window.addEventListener('blur', limpaTeclasPressionadas);
        document.addEventListener('mousemove', moveMouse);
        document.addEventListener('pointerlockchange', atualizaPointerLock);

        return () => {
            window.removeEventListener('keydown', pressionaTecla);
            window.removeEventListener('keyup', soltaTecla);
            window.removeEventListener('blur', limpaTeclasPressionadas);
            document.removeEventListener('mousemove', moveMouse);
            document.removeEventListener('pointerlockchange', atualizaPointerLock);
        };
    }, [elementoControleRef, jogadorRef]);

    useFrame(({ camera }, delta) => {
        const jogador = jogadorRef.current;
        const teclas = teclasPressionadasRef.current;
        const frente: Vetor3Cena3DPrototipo = [Math.sin(jogador.yaw), Math.cos(jogador.yaw), 0];
        const direita: Vetor3Cena3DPrototipo = [Math.cos(jogador.yaw), -Math.sin(jogador.yaw), 0];
        let movimento: Vetor3Cena3DPrototipo = [0, 0, 0];

        for (const tecla of teclas) {
            const direcao = obtemDirecaoMovimentoSala3DComandoAreaInterativa3D(tecla);

            if (direcao === 'FRENTE') movimento = somaVetor3Cena3D(movimento, frente);
            if (direcao === 'TRAS') movimento = somaVetor3Cena3D(movimento, multiplicaVetor3Cena3D(frente, -1));
            if (direcao === 'DIREITA') movimento = somaVetor3Cena3D(movimento, direita);
            if (direcao === 'ESQUERDA') movimento = somaVetor3Cena3D(movimento, multiplicaVetor3Cena3D(direita, -1));
        }

        const magnitude = Math.hypot(movimento[0], movimento[1]);

        if (magnitude > 0) {
            const escalaMovimento = (velocidadeMovimentoJogadorSalaJogoPrototipo * delta) / magnitude;

            jogador.posicao = somaVetor3Cena3D(jogador.posicao, multiplicaVetor3Cena3D(movimento, escalaMovimento));
        }

        const direcaoOlhar = criaDirecaoOlharEditor(jogador.yaw, jogador.pitch);
        const posicaoCameraEditor = modoCamera === 'PRIMEIRA_PESSOA' ? jogador.posicao : somaVetor3Cena3D(jogador.posicao, [-direcaoOlhar[0] * 4, -direcaoOlhar[1] * 4, 1.4]);
        const alvoCameraEditor = somaVetor3Cena3D(jogador.posicao, direcaoOlhar);

        camera.position.copy(converteVetorEditorParaThree(posicaoCameraEditor));
        camera.lookAt(converteVetorEditorParaThree(alvoCameraEditor));
    });

    return null;
};

function PersonagemTerceiraPessoaSalaJogoPrototipo({ jogadorRef, modoCamera }: PersonagemTerceiraPessoaSalaJogoPrototipoProps) {
    const grupoRef = useRef<Group | null>(null);

    useFrame(() => {
        const grupo = grupoRef.current;

        if (grupo === null) return;

        const posicao = jogadorRef.current.posicao;

        grupo.position.copy(converteVetorEditorParaThree([posicao[0], posicao[1], 0.75]));
        grupo.rotation.y = jogadorRef.current.yaw;
        grupo.visible = modoCamera === 'TERCEIRA_PESSOA';
    });

    return (
        <group ref={grupoRef} visible={modoCamera === 'TERCEIRA_PESSOA'}>
            <mesh castShadow>
                <cylinderGeometry args={[0.22, 0.28, 1.1, 16]} />
                <meshStandardMaterial color="#b74c55" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.72, 0]} castShadow>
                <sphereGeometry args={[0.24, 16, 12]} />
                <meshStandardMaterial color="#d9b076" roughness={0.7} />
            </mesh>
        </group>
    );
};

function CenaSalaJogoPrototipo({ documento, elementoControleRef, jogadorRef, modoCamera }: CenaSalaJogoPrototipoProps) {
    return (
        <>
            <color attach="background" args={[documento.configuracaoAmbiente.corFundo]} />
            <ambientLight intensity={documento.configuracaoAmbiente.luzAmbiente} />
            <directionalLight position={[4, 8, 6]} intensity={1.2} castShadow />

            {documento.configuracaoAmbiente.mostrarGrade && <gridHelper args={[32, 32, '#4a4a4a', '#2b2b2b']} />}

            {documento.objetos.map(objeto => <ObjetoCenaSalaJogoPrototipo key={objeto.id} objeto={objeto} />)}

            <PersonagemTerceiraPessoaSalaJogoPrototipo jogadorRef={jogadorRef} modoCamera={modoCamera} />

            <ControladorJogadorSalaJogoPrototipo elementoControleRef={elementoControleRef} jogadorRef={jogadorRef} modoCamera={modoCamera} />
        </>
    );
};

export function RuntimeCena3DPrototipoSalaDeJogo({ documento }: RuntimeCena3DPrototipoSalaDeJogoProps) {
    const elementoControleRef = useRef<HTMLDivElement | null>(null);
    const jogadorRef = useRef<EstadoJogadorSalaJogoPrototipo>(criaEstadoInicialJogador(documento));
    const [modoCamera, setModoCamera] = useState<ModoCameraSalaJogoPrototipo>('PRIMEIRA_PESSOA');

    useEffect(() => {
        jogadorRef.current = criaEstadoInicialJogador(documento);
    }, [documento]);

    return (
        <div ref={elementoControleRef} className={styles.runtimeCena3DPrototipo} onMouseDown={event => solicitaPointerLock(event, elementoControleRef)} tabIndex={0}>
            <Canvas shadows camera={{ fov: 70, near: 0.1, far: 500 }}>
                <CenaSalaJogoPrototipo documento={documento} elementoControleRef={elementoControleRef} jogadorRef={jogadorRef} modoCamera={modoCamera} />
            </Canvas>

            <button className={styles.botaoAlternarCameraCena3DPrototipo} type="button" onMouseDown={event => event.stopPropagation()} onClick={() => alternaModoCamera(setModoCamera)} aria-label="Alternar camera da cena 3D" title="Alternar camera">
                {modoCamera === 'PRIMEIRA_PESSOA' ? '1P' : '3P'}
            </button>

            <div className={styles.miraCena3DPrototipo} aria-hidden="true" />
        </div>
    );
};
