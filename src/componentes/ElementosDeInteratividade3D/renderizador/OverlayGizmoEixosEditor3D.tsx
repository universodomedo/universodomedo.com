'use client';

import styles from './styles.module.css';

import { useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react';

import { aplicaResetAbsolutoVistaCameraEditor3D, interpolaCameraEditor3D, type CameraEditor3D, type ResetAbsolutoVistaEditor3D } from '../editor/editor3D.camera';
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

function aplicaVistaMarcadorGizmoEditor3D(camera: CameraEditor3D, eixo: ResetAbsolutoVistaEditor3D): CameraEditor3D { return aplicaResetAbsolutoVistaCameraEditor3D(camera, eixo); };

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

    function aplicaVistaMarcador(event: MouseEvent<HTMLButtonElement>, eixo: ResetAbsolutoVistaEditor3D): void {
        event.preventDefault();
        event.stopPropagation();
        if (!comandoMouseAreaInterativa3DEstaAtivo('gizmo-viewport', event)) return;

        animaCameraAteVista(aplicaVistaMarcadorGizmoEditor3D(estado.camera, eixo));
    };

    if (marcadores.length === 0) return null;

    return (
        <div className={styles.overlayGizmoEixosEditor3D}>
            {marcadores.map(marcador => (
                <button key={marcador.eixo} className={`${styles.marcadorGizmoEixosEditor3D} ${obtemClasseMarcadorGizmoEditor3D(marcador.eixo)} ${marcador.negativo ? styles.marcadorGizmoEixosEditor3DNegativo : ''}`} type="button" style={{ left: `${marcador.x}px`, top: `${marcador.y}px` }} onMouseDown={bloqueiaMouseMarcador} onClick={event => aplicaVistaMarcador(event, marcador.eixo)} aria-label={`Aplicar Reset Absoluto para a Vista ${marcador.eixo}`} title={`Vista ${marcador.eixo}`}>
                    <span>{marcador.eixo}</span>
                </button>
            ))}
        </div>
    );
};