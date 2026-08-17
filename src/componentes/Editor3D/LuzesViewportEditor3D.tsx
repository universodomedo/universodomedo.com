'use client';

import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Plane, Vector3 } from 'three';
import type { EventDispatcher } from 'three';
import type { ThreeEvent } from '@react-three/fiber';

import { intensidadeFisicaFonteDeLuzPontoMapa } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';
import type { FonteDeLuzEditor3D } from './editor3D.camadaJogo';

type ControleOrbitaEditor3D = EventDispatcher & { enabled: boolean };

// Fontes de Luz no viewport do Editor: cada luz é a luz REAL (o autor precisa VER o que está acendendo, não um ícone) mais um
// marcador clicável que a torna selecionável como qualquer nó da cena. 'AMBIENTE' não tem marcador: é fonte sem corpo nem
// posição — seleciona-se pela árvore.
interface LuzesViewportEditor3DProps {
    readonly luzes: readonly FonteDeLuzEditor3D[];
    readonly idLuzSelecionada: string | null;
    // Mover segue o MESMO padrão modal dos objetos ("grab"): selecionada + modo Mover + arrastar o corpo do marcador —
    // nenhum gizmo próprio, que fugia do padrão do editor.
    readonly modoMover: boolean;
    // Preview do acionamento (botão ⏻ do interruptor): luz apagada não emite e o marcador esmaece. Estado do EDITOR — nada disto persiste.
    readonly idsApagadas: ReadonlySet<string>;
    readonly aoSelecionar: (idLocal: string) => void;
    readonly aoMover: (idLocal: string, posicao: [number, number, number]) => void;
};

// Selecionável e arrastável em TODAS as coleções do MAPA: posicionar o objeto de iluminação faz parte de construir o
// cenário; o que as lentes restringem são as propriedades de jogo (no painel), não o mover.
export function LuzesViewportEditor3D({ luzes, idLuzSelecionada, modoMover, idsApagadas, aoSelecionar, aoMover }: LuzesViewportEditor3DProps) {
    return (
        <>
            {luzes.map(luz => luz.tipo === 'AMBIENTE'
                ? (idsApagadas.has(luz.idLocal) ? null : <ambientLight key={luz.idLocal} intensity={luz.intensidade} color={luz.cor} />)
                : <LuzPontoViewportEditor3D key={luz.idLocal} luz={luz} selecionada={luz.idLocal === idLuzSelecionada} modoMover={modoMover} apagada={idsApagadas.has(luz.idLocal)} aoSelecionar={aoSelecionar} aoMover={aoMover} />)}
        </>
    );
};

interface LuzPontoViewportEditor3DProps {
    readonly luz: FonteDeLuzEditor3D;
    readonly selecionada: boolean;
    readonly modoMover: boolean;
    readonly apagada: boolean;
    readonly aoSelecionar: (idLocal: string) => void;
    readonly aoMover: (idLocal: string, posicao: [number, number, number]) => void;
};

const RAIO_MARCADOR_LUZ_EDITOR3D = 0.12;

function LuzPontoViewportEditor3D({ luz, selecionada, modoMover, apagada, aoSelecionar, aoMover }: LuzPontoViewportEditor3DProps) {
    const camera = useThree(estado => estado.camera);
    const controles = useThree(estado => estado.controls);
    // Arrasto DIRETO no marcador (o "grab" dos objetos): botão seguro move num plano paralelo à câmera passando pela luz;
    // soltou, acabou. O plano é fixado no INÍCIO do gesto — refixar por movimento faria a luz "fugir" do cursor.
    const arrastandoRef = useRef(false);
    const planoRef = useRef(new Plane());
    const pontoRef = useRef(new Vector3());

    function aoClicar(evento: ThreeEvent<MouseEvent>): void { evento.stopPropagation(); aoSelecionar(luz.idLocal); };

    function aoPressionar(evento: ThreeEvent<PointerEvent>): void {
        if (!selecionada || !modoMover) return;
        evento.stopPropagation();
        arrastandoRef.current = true;
        (evento.target as Element).setPointerCapture(evento.pointerId);
        const normal = new Vector3();
        camera.getWorldDirection(normal);
        planoRef.current.setFromNormalAndCoplanarPoint(normal, new Vector3(luz.posicao[0], luz.posicao[1], luz.posicao[2]));
        // O OrbitControls escuta o canvas direto: sem desligar aqui, o arrasto do marcador giraria a câmera junto.
        if (controles) (controles as ControleOrbitaEditor3D).enabled = false;
    };

    function aoArrastar(evento: ThreeEvent<PointerEvent>): void {
        if (!arrastandoRef.current) return;
        evento.stopPropagation();
        if (evento.ray.intersectPlane(planoRef.current, pontoRef.current) !== null) aoMover(luz.idLocal, [pontoRef.current.x, pontoRef.current.y, pontoRef.current.z]);
    };

    function aoSoltar(evento: ThreeEvent<PointerEvent>): void {
        if (!arrastandoRef.current) return;
        arrastandoRef.current = false;
        (evento.target as Element).releasePointerCapture(evento.pointerId);
        if (controles) (controles as ControleOrbitaEditor3D).enabled = true;
    };

    return (
        <group position={[luz.posicao[0], luz.posicao[1], luz.posicao[2]]}>
            {/* A intensidade autorada é PERCENTUAL do alcance — a física (candela) deriva do MESMO helper do render de jogo. */}
            {!apagada && <pointLight intensity={intensidadeFisicaFonteDeLuzPontoMapa(luz.alcanceMetros, luz.intensidade)} distance={luz.alcanceMetros} decay={2} color={luz.cor} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0008} shadow-camera-near={0.1} shadow-camera-far={Math.max(1, luz.alcanceMetros)} />}
            <mesh onClick={aoClicar} onPointerDown={aoPressionar} onPointerMove={aoArrastar} onPointerUp={aoSoltar} userData={{ naoExibirNaCapa: true }}>
                <sphereGeometry args={[RAIO_MARCADOR_LUZ_EDITOR3D, 16, 16]} />
                <meshBasicMaterial color={selecionada ? '#ffcf6e' : luz.cor} toneMapped={false} transparent={apagada} opacity={apagada ? 0.3 : 1} />
            </mesh>
        </group>
    );
};
