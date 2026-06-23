'use client';

import styles from './CenaSalaJogoR3F.module.css';

import { useEffect, useState } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import type { InteragivelPercebidoSalaJogoWsDto, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import { ControlesCameraJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControlesCameraJogo';
import { PERFIL_CAMERA_TATICA } from 'Componentes/ElementosDeJogo/Cena3D/cena3D.controles';
import { ControladorPrimeiraPessoaJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControladorPrimeiraPessoaJogo';

const ALTURA_PAREDE = 3.6;
const ESPESSURA_PAREDE = 0.3;
const ALTURA_OLHOS = 1.55;

interface CenaSalaJogoR3FProps {
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysInteragiveisPercebidosNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly aoSelecionarOcupante: (keySer: string) => void;
    readonly aoSelecionarInteragivel: (key: string) => void;
    readonly aoLimparSelecao: () => void;
};

function mundoX(x: number, largura: number): number { return x + 0.5 - largura / 2; };
function mundoZ(y: number, altura: number): number { return y + 0.5 - altura / 2; };

// O shell do app anima a escala do container na entrada; o R3F mede o canvas antes do layout assentar e fica em tamanho zero (cena preta). Reforçamos a remedição depois que assenta.
function useReforcaRedimensionamentoCanvas() {
    useEffect(() => {
        const tempos = [120, 360, 720].map(ms => window.setTimeout(() => window.dispatchEvent(new Event('resize')), ms));
        return () => tempos.forEach(window.clearTimeout);
    }, []);
};

export function CenaSalaJogoR3F({ payload, keysInteragiveisPercebidosNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, aoSelecionarOcupante, aoSelecionarInteragivel, aoLimparSelecao }: CenaSalaJogoR3FProps) {
    const [principal, setPrincipal] = useState<'tatico' | 'fp'>('tatico');

    // Modo Solo: o jogador é o único ocupante (o primeiro). Quando houver multiplayer/identidade, casar por idFicha da ficha do jogador.
    const ocupanteJogador = payload.ocupantesMapaLogico[0] ?? null;

    const classeTatica = principal === 'tatico' ? styles.vista_principal : styles.vista_secundaria;
    const classeFp = principal === 'fp' ? styles.vista_principal : styles.vista_secundaria;

    return (
        <div className={styles.recipiente_cena_r3f}>
            <VistaTaticaSalaJogo className={classeTatica} payload={payload} keysNovos={keysInteragiveisPercebidosNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} aoSelecionarOcupante={aoSelecionarOcupante} aoSelecionarInteragivel={aoSelecionarInteragivel} aoLimparSelecao={aoLimparSelecao} />
            <VistaPrimeiraPessoaSalaJogo className={classeFp} payload={payload} keysNovos={keysInteragiveisPercebidosNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} ocupanteJogador={ocupanteJogador} />

            <div className={styles.moldura_secundaria}>
                <button type="button" className={styles.botao_troca_visao} onClick={() => setPrincipal(p => (p === 'tatico' ? 'fp' : 'tatico'))} title="Trocar visão principal" aria-label="Trocar visão principal">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f0d28a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 8 17 8" />
                        <polyline points="14 5 17 8 14 11" />
                        <polyline points="21 16 7 16" />
                        <polyline points="10 13 7 16 10 19" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

interface VistaTaticaSalaJogoProps {
    readonly className: string;
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly aoSelecionarOcupante: (keySer: string) => void;
    readonly aoSelecionarInteragivel: (key: string) => void;
    readonly aoLimparSelecao: () => void;
};

function VistaTaticaSalaJogo({ className, payload, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, aoSelecionarOcupante, aoSelecionarInteragivel, aoLimparSelecao }: VistaTaticaSalaJogoProps) {
    useReforcaRedimensionamentoCanvas();
    const extensao = Math.max(payload.mapaLogico.larguraMetros, payload.mapaLogico.alturaMetros);
    const distancia = Math.max(8, extensao * 1.15);

    function aoErrarClique(e: MouseEvent) { if (e.button === 0) aoLimparSelecao(); };

    return (
        <div className={className}>
            <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [distancia * 0.62, distancia * 0.8, distancia * 0.62], fov: 34, near: 0.1, far: distancia * 8 }} onPointerMissed={aoErrarClique}>
                <ConteudoCena3DSalaJogo payload={payload} keysNovos={keysNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} aoSelecionarOcupante={aoSelecionarOcupante} aoSelecionarInteragivel={aoSelecionarInteragivel} />
                <ControlesCameraJogo perfil={PERFIL_CAMERA_TATICA} alvo={[0, 0.6, 0]} distanciaMin={Math.max(4, extensao * 0.35)} distanciaMax={extensao * 1.9} />
            </Canvas>
        </div>
    );
};

interface VistaPrimeiraPessoaSalaJogoProps {
    readonly className: string;
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly ocupanteJogador: OcupanteMapaLogicoSalaJogoWsDto | null;
};

function VistaPrimeiraPessoaSalaJogo({ className, payload, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, ocupanteJogador }: VistaPrimeiraPessoaSalaJogoProps) {
    useReforcaRedimensionamentoCanvas();
    const largura = payload.mapaLogico.larguraMetros;
    const altura = payload.mapaLogico.alturaMetros;
    const extensao = Math.max(largura, altura);
    const cabecaX = ocupanteJogador === null ? 0 : mundoX(ocupanteJogador.posicao.x, largura);
    const cabecaZ = ocupanteJogador === null ? 0 : mundoZ(ocupanteJogador.posicao.y, altura);

    return (
        <div className={className}>
            <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [cabecaX, ALTURA_OLHOS, cabecaZ], fov: 72, near: 0.05, far: Math.max(120, extensao * 6) }}>
                <ConteudoCena3DSalaJogo payload={payload} keysNovos={keysNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} ocultarKeyOcupante={ocupanteJogador?.keySer ?? null} />
                <ControladorPrimeiraPessoaJogo cabecaX={cabecaX} cabecaY={ALTURA_OLHOS} cabecaZ={cabecaZ} />
            </Canvas>
        </div>
    );
};

interface ConteudoCena3DSalaJogoProps {
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly aoSelecionarOcupante?: (keySer: string) => void;
    readonly aoSelecionarInteragivel?: (key: string) => void;
    readonly ocultarKeyOcupante?: string | null;
};

function ConteudoCena3DSalaJogo({ payload, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, aoSelecionarOcupante, aoSelecionarInteragivel, ocultarKeyOcupante }: ConteudoCena3DSalaJogoProps) {
    const largura = payload.mapaLogico.larguraMetros;
    const altura = payload.mapaLogico.alturaMetros;
    const extensao = Math.max(largura, altura);
    const limiteSombra = Math.max(9, extensao * 0.75);

    return (
        <>
            <color attach="background" args={['#0e0c14']} />
            <fog attach="fog" args={['#0e0c14', extensao * 1.7, extensao * 4.2]} />

            <ambientLight intensity={0.55} color="#eef2f6" />
            <hemisphereLight intensity={0.55} color="#f4f7fb" groundColor="#9aa1ad" />
            <directionalLight
                castShadow
                position={[extensao * 0.55, extensao * 1.1, extensao * 0.4]}
                intensity={1.25}
                color="#fff4e2"
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0005}
                shadow-camera-near={0.5}
                shadow-camera-far={extensao * 4}
                shadow-camera-left={-limiteSombra}
                shadow-camera-right={limiteSombra}
                shadow-camera-top={limiteSombra}
                shadow-camera-bottom={-limiteSombra}
            />
            <directionalLight position={[-extensao * 0.4, extensao * 0.7, -extensao * 0.3]} intensity={0.35} color="#cfe0ff" />
            <pointLight position={[0, ALTURA_PAREDE - 0.4, 0]} intensity={4} distance={extensao * 1.6} decay={2} color="#eaf1ff" />

            <SalaLaboratorio largura={largura} altura={altura} />

            {payload.ocupantesMapaLogico.filter(ocupante => ocupante.keySer !== ocultarKeyOcupante).map(ocupante => <OcupanteR3F key={ocupante.keySer} ocupante={ocupante} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />)}
            {payload.interagiveisPercebidos.map(interagivel => <InteragivelR3F key={interagivel.key} interagivel={interagivel} novo={keysNovos.includes(interagivel.key)} selecionado={keyInteragivelSelecionado === interagivel.key} largura={largura} altura={altura} aoSelecionar={aoSelecionarInteragivel} />)}
        </>
    );
};

interface SalaLaboratorioProps { largura: number; altura: number; };

function SalaLaboratorio({ largura, altura }: SalaLaboratorioProps) {
    const meioParede = ALTURA_PAREDE / 2;
    const recuoPainel = ESPESSURA_PAREDE * 0.6;
    const alturaPainel = ALTURA_PAREDE * 0.74;

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[largura, altura]} />
                <meshStandardMaterial color="#cdd4db" roughness={0.55} metalness={0.12} />
            </mesh>

            <Grid position={[0, 0.012, 0]} args={[largura, altura]} cellSize={1} cellThickness={0.6} cellColor="#9aa3ad" sectionSize={5} sectionThickness={1} sectionColor="#6c7682" fadeDistance={Math.max(largura, altura) * 2.6} fadeStrength={1} followCamera={false} infiniteGrid={false} />

            <Parede position={[0, meioParede, -altura / 2]} args={[largura, ALTURA_PAREDE, ESPESSURA_PAREDE]} />
            <Parede position={[0, meioParede, altura / 2]} args={[largura, ALTURA_PAREDE, ESPESSURA_PAREDE]} />
            <Parede position={[largura / 2, meioParede, 0]} args={[ESPESSURA_PAREDE, ALTURA_PAREDE, altura]} />
            <Parede position={[-largura / 2, meioParede, 0]} args={[ESPESSURA_PAREDE, ALTURA_PAREDE, altura]} />

            <PainelLuz position={[0, alturaPainel, -altura / 2 + recuoPainel]} args={[largura * 0.55, 0.5, 0.06]} />
            <PainelLuz position={[0, alturaPainel, altura / 2 - recuoPainel]} args={[largura * 0.55, 0.5, 0.06]} />
            <PainelLuz position={[largura / 2 - recuoPainel, alturaPainel, 0]} args={[0.06, 0.5, altura * 0.55]} />
            <PainelLuz position={[-largura / 2 + recuoPainel, alturaPainel, 0]} args={[0.06, 0.5, altura * 0.55]} />

            <Reforco position={[-largura / 2, meioParede, -altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[largura / 2, meioParede, -altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[-largura / 2, meioParede, altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[largura / 2, meioParede, altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />

            <Reforco position={[0, 0.12, -altura / 2]} args={[largura + 0.1, 0.24, 0.4]} />
            <Reforco position={[0, 0.12, altura / 2]} args={[largura + 0.1, 0.24, 0.4]} />
            <Reforco position={[largura / 2, 0.12, 0]} args={[0.4, 0.24, altura + 0.1]} />
            <Reforco position={[-largura / 2, 0.12, 0]} args={[0.4, 0.24, altura + 0.1]} />

            <Reforco position={[0, ALTURA_PAREDE - 0.1, -altura / 2]} args={[largura + 0.1, 0.2, 0.42]} />
            <Reforco position={[0, ALTURA_PAREDE - 0.1, altura / 2]} args={[largura + 0.1, 0.2, 0.42]} />
            <Reforco position={[largura / 2, ALTURA_PAREDE - 0.1, 0]} args={[0.42, 0.2, altura + 0.1]} />
            <Reforco position={[-largura / 2, ALTURA_PAREDE - 0.1, 0]} args={[0.42, 0.2, altura + 0.1]} />
        </group>
    );
};

interface OcupanteR3FProps { ocupante: OcupanteMapaLogicoSalaJogoWsDto; largura: number; altura: number; selecionado: boolean; aoSelecionar?: (keySer: string) => void; };

function OcupanteR3F({ ocupante, largura, altura, selecionado, aoSelecionar }: OcupanteR3FProps) {
    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(ocupante.keySer); };
    return <FiguraHumana position={[mundoX(ocupante.posicao.x, largura), 0, mundoZ(ocupante.posicao.y, altura)]} corRoupa="#2f6f86" corPele="#e0b48f" selecionado={selecionado} aoClicar={aoClicar} />;
};

interface InteragivelR3FProps { interagivel: InteragivelPercebidoSalaJogoWsDto; novo: boolean; selecionado: boolean; largura: number; altura: number; aoSelecionar?: (key: string) => void; };

function InteragivelR3F({ interagivel, novo, selecionado, largura, altura, aoSelecionar }: InteragivelR3FProps) {
    if (interagivel.posicao === null) return null;

    const x = mundoX(interagivel.posicao.x, largura);
    const z = mundoZ(interagivel.posicao.y, altura);
    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(interagivel.key); };

    if (interagivel.tipo === 'ser') return <FiguraHumana position={[x, 0, z]} corRoupa={novo ? '#c79a3f' : '#7484b4'} corPele="#d8b48c" selecionado={selecionado} aoClicar={aoClicar} />;

    return (
        <group position={[x, 0, z]} onClick={aoClicar}>
            {selecionado && <AnelSelecao />}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[1.1, 1.2, 1.1]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh castShadow position={[0, 0.45, 0]}>
                <boxGeometry args={[0.8, 0.9, 0.8]} />
                <meshStandardMaterial color={novo ? '#e8c074' : '#8aa0d0'} emissive={selecionado ? '#e8c074' : novo ? '#e8c074' : '#000000'} emissiveIntensity={selecionado ? 0.55 : novo ? 0.25 : 0} roughness={0.5} metalness={0.1} />
            </mesh>
        </group>
    );
};

function AnelSelecao() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <torusGeometry args={[0.6, 0.05, 14, 56]} />
            <meshStandardMaterial color="#e8c074" emissive="#e8c074" emissiveIntensity={0.85} roughness={0.4} metalness={0.2} />
        </mesh>
    );
};

interface FiguraHumanaProps { position: [number, number, number]; corRoupa: string; corPele: string; selecionado?: boolean; aoClicar?: (e: ThreeEvent<MouseEvent>) => void; };

function FiguraHumana({ position, corRoupa, corPele, selecionado = false, aoClicar }: FiguraHumanaProps) {
    const emissiva = selecionado ? '#e8c074' : '#000000';
    const intensidade = selecionado ? 0.5 : 0;

    return (
        <group position={position} onClick={aoClicar}>
            {selecionado && <AnelSelecao />}

            <mesh position={[0, 1.0, 0]}>
                <cylinderGeometry args={[0.7, 0.7, 2.0, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <mesh castShadow position={[-0.14, 0.36, 0]}>
                <capsuleGeometry args={[0.12, 0.42, 6, 14]} />
                <meshStandardMaterial color={corRoupa} emissive={emissiva} emissiveIntensity={intensidade} roughness={0.55} metalness={0.05} />
            </mesh>
            <mesh castShadow position={[0.14, 0.36, 0]}>
                <capsuleGeometry args={[0.12, 0.42, 6, 14]} />
                <meshStandardMaterial color={corRoupa} emissive={emissiva} emissiveIntensity={intensidade} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh castShadow position={[0, 0.74, 0]}>
                <boxGeometry args={[0.4, 0.24, 0.26]} />
                <meshStandardMaterial color={corRoupa} emissive={emissiva} emissiveIntensity={intensidade} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh castShadow position={[0, 1.04, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 0.52, 18]} />
                <meshStandardMaterial color={corRoupa} emissive={emissiva} emissiveIntensity={intensidade} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh castShadow position={[-0.32, 1.0, 0]} rotation={[0, 0, 0.09]}>
                <capsuleGeometry args={[0.08, 0.44, 6, 12]} />
                <meshStandardMaterial color={corRoupa} emissive={emissiva} emissiveIntensity={intensidade} roughness={0.55} metalness={0.05} />
            </mesh>
            <mesh castShadow position={[0.32, 1.0, 0]} rotation={[0, 0, -0.09]}>
                <capsuleGeometry args={[0.08, 0.44, 6, 12]} />
                <meshStandardMaterial color={corRoupa} emissive={emissiva} emissiveIntensity={intensidade} roughness={0.55} metalness={0.05} />
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
