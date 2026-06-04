'use client';

import styles from './styles.module.css';

import { useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react';

import { aplicaResetAbsolutoVistaCameraEditor3D, interpolaCameraEditor3D, obtemResetAbsolutoVistaAtualCameraEditor3D, type CameraEditor3D, type ResetAbsolutoVistaEditor3D } from '../editor/editor3D.camera';
import { comandoMouseAreaInterativa3DEstaAtivo } from '../comandos/editor3D.comandos';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { projetaMarcadoresGizmoEixosEditor3D, type MarcadorGizmoEixosEditor3D } from './editor3D.renderizador.gizmo';

interface OverlayGizmoEixosEditor3DProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
};

const duracaoAnimacaoResetAbsolutoGizmoEditor3D = 260;

function obtemClasseMarcadorGizmoEditor3D(eixo: ResetAbsolutoVistaEditor3D): string {
    if (eixo === 'X' || eixo === '-X') return styles.marcadorGizmoEixoX;
    if (eixo === 'Y' || eixo === '-Y') return styles.marcadorGizmoEixoY;

    return styles.marcadorGizmoEixoZ;
};

function obtemVistaOpostaMarcadorGizmoEditor3D(eixo: ResetAbsolutoVistaEditor3D): ResetAbsolutoVistaEditor3D {
    if (eixo === 'X') return '-X';
    if (eixo === '-X') return 'X';
    if (eixo === 'Y') return '-Y';
    if (eixo === '-Y') return 'Y';
    if (eixo === 'Z') return '-Z';

    return 'Z';
};

function marcadorGizmoEstaTraseiroEditor3D(marcador: MarcadorGizmoEixosEditor3D, vistaAtual: ResetAbsolutoVistaEditor3D): boolean { return marcador.eixoFisico === obtemVistaOpostaMarcadorGizmoEditor3D(vistaAtual); };

function obtemZIndexMarcadorGizmoEditor3D(marcador: MarcadorGizmoEixosEditor3D, vistaAtual: ResetAbsolutoVistaEditor3D): number {
    const profundidadeBase = Math.max(1, Math.round(marcador.profundidade * 100000));

    if (marcador.eixoFisico === vistaAtual) return profundidadeBase + 300000;
    if (marcadorGizmoEstaTraseiroEditor3D(marcador, vistaAtual)) return profundidadeBase;

    return profundidadeBase + 100000;
};

function aplicaVistaMarcadorGizmoEditor3D(camera: CameraEditor3D, eixoClicado: ResetAbsolutoVistaEditor3D): CameraEditor3D {
    const vistaAtual = obtemResetAbsolutoVistaAtualCameraEditor3D(camera);
    const destinoClique = vistaAtual === eixoClicado ? obtemVistaOpostaMarcadorGizmoEditor3D(eixoClicado) : eixoClicado;

    return aplicaResetAbsolutoVistaCameraEditor3D(camera, destinoClique);
};

export function OverlayGizmoEixosEditor3D({ canvasRef }: OverlayGizmoEixosEditor3DProps) {
    const { estado, acoes } = useEditor3DContexto();
    const [marcadores, setMarcadores] = useState<MarcadorGizmoEixosEditor3D[]>([]);
    const animacaoFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        let atualizacaoFrameId: number | null = null;

        function atualizaMarcadores(): void {
            if (atualizacaoFrameId !== null) cancelAnimationFrame(atualizacaoFrameId);

            atualizacaoFrameId = requestAnimationFrame(() => {
                const canvas = canvasRef.current;

                atualizacaoFrameId = null;

                if (canvas === null) {
                    setMarcadores([]);

                    return;
                }

                setMarcadores(projetaMarcadoresGizmoEixosEditor3D(estado.camera, canvas.clientWidth, canvas.clientHeight));
            });
        };

        const canvas = canvasRef.current;
        const resizeObserver = canvas === null ? null : new ResizeObserver(atualizaMarcadores);

        atualizaMarcadores();
        if (canvas !== null) resizeObserver?.observe(canvas);
        window.addEventListener('resize', atualizaMarcadores);

        return () => {
            window.removeEventListener('resize', atualizaMarcadores);
            resizeObserver?.disconnect();
            if (atualizacaoFrameId !== null) cancelAnimationFrame(atualizacaoFrameId);
        };
    }, [canvasRef, estado.camera]);

    useEffect(() => {
        return () => {
            if (animacaoFrameIdRef.current !== null) {
                cancelAnimationFrame(animacaoFrameIdRef.current);
                animacaoFrameIdRef.current = null;
                acoes.finalizaOcultacaoGuiasCenaTemporaria();
            }
        };
    }, [acoes]);

    function bloqueiaMouseMarcador(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        event.stopPropagation();
    };

    function animaCameraAteVista(destino: CameraEditor3D): void {
        const origem = estado.camera;
        const inicio = performance.now();

        if (animacaoFrameIdRef.current !== null) {
            cancelAnimationFrame(animacaoFrameIdRef.current);
            animacaoFrameIdRef.current = null;
            acoes.finalizaOcultacaoGuiasCenaTemporaria();
        }

        acoes.iniciaOcultacaoGuiasCenaTemporaria();

        function animaFrame(agora: number): void {
            const progresso = Math.min(1, (agora - inicio) / duracaoAnimacaoResetAbsolutoGizmoEditor3D);

            acoes.atualizaCamera(interpolaCameraEditor3D(origem, destino, progresso));

            if (progresso < 1) {
                animacaoFrameIdRef.current = requestAnimationFrame(animaFrame);

                return;
            }

            animacaoFrameIdRef.current = null;
            acoes.finalizaOcultacaoGuiasCenaTemporaria();
        };

        animacaoFrameIdRef.current = requestAnimationFrame(animaFrame);
    };

    function aplicaVistaMarcador(event: MouseEvent<HTMLButtonElement>, eixoClicado: ResetAbsolutoVistaEditor3D): void {
        event.preventDefault();
        event.stopPropagation();
        if (!comandoMouseAreaInterativa3DEstaAtivo('gizmo-viewport', event)) return;

        animaCameraAteVista(aplicaVistaMarcadorGizmoEditor3D(estado.camera, eixoClicado));
    };

    if (marcadores.length === 0) return null;

    const vistaAtual = obtemResetAbsolutoVistaAtualCameraEditor3D(estado.camera);

    return (
        <div className={styles.overlayGizmoEixosEditor3D}>
            {marcadores.map(marcador => (
                <button key={marcador.chave} className={`${styles.marcadorGizmoEixosEditor3D} ${obtemClasseMarcadorGizmoEditor3D(marcador.eixoFisico)} ${marcador.negativo ? styles.marcadorGizmoEixosEditor3DNegativo : ''} ${marcadorGizmoEstaTraseiroEditor3D(marcador, vistaAtual) ? styles.marcadorGizmoEixosEditor3DTraseiro : ''}`} type="button" style={{ left: `${marcador.x}px`, top: `${marcador.y}px`, zIndex: obtemZIndexMarcadorGizmoEditor3D(marcador, vistaAtual) }} onMouseDown={bloqueiaMouseMarcador} onClick={event => aplicaVistaMarcador(event, marcador.destinoClique)} aria-label={`Aplicar Reset Absoluto para a Vista ${marcador.destinoClique}`} title={`Vista ${marcador.destinoClique}`}>
                    <span>{marcador.rotulo}</span>
                </button>
            ))}
        </div>
    );
};