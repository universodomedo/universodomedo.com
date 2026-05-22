'use client';

import styles from './styles.module.css';

import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';

import { AreaInterativa3D } from '../AreaInterativa3D';
import { CamadaAplicacaoTransformEditor3D } from '../aplicacao/CamadaAplicacaoTransformEditor3D';
import { CamadaCriacaoMeshEditor3D } from '../criacao/CamadaCriacaoMeshEditor3D';
import { ToolbarMouseEditor3D } from '../toolbar/ToolbarMouseEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { useMenuAplicacaoTransformEditor3D } from '../aplicacao/useMenuAplicacaoTransformEditor3D';
import { useMenuCriacaoMeshEditor3D } from '../criacao/useMenuCriacaoMeshEditor3D';
import type { TipoMalhaEditor3D } from '../editor/editor3D.tipos';

function alvoEstaDentroDe(event: ReactMouseEvent<HTMLElement>, seletor: string): boolean { return event.target instanceof Element && event.target.closest(seletor) !== null; };

function eventoTecladoVeioDeElementoEditavel(event: KeyboardEvent): boolean {
    const alvo = event.target;

    if (!(alvo instanceof Element)) return false;

    return alvo.closest('input, textarea, select, button, [contenteditable="true"]') !== null;
};

export function EspacoTrabalhoEditor3D() {
    const workspaceRef = useRef<HTMLElement | null>(null);
    const { estado, acoes } = useEditor3DContexto();
    const menuCriacao = useMenuCriacaoMeshEditor3D();
    const menuAplicacao = useMenuAplicacaoTransformEditor3D();

    function podeAbrirMenuCriacao(): boolean { return estado.modoAtual.tipo === 'NENHUM' && estado.malhaEmCriacao === null; };
    function podeAbrirMenuAplicacao(): boolean { return estado.modoAtual.tipo === 'NENHUM' && estado.malhaEmCriacao === null && estado.idsObjetosSelecionados.length > 0; };

    useEffect(() => {
        function processaAtalhoWorkspace(event: KeyboardEvent): void {
            if (eventoTecladoVeioDeElementoEditavel(event)) return;

            const tecla = event.key.toLowerCase();

            if (event.shiftKey && tecla === 'a' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                menuAplicacao.fechaMenu();
                menuCriacao.abreMenuNoCentro(workspaceRef.current, podeAbrirMenuCriacao());

                return;
            }

            if ((event.ctrlKey || event.metaKey) && tecla === 'a' && !event.shiftKey && !event.altKey) {
                event.preventDefault();
                menuCriacao.fechaMenu();
                menuAplicacao.abreMenuNoCentro(workspaceRef.current, podeAbrirMenuAplicacao());
            }
        };

        window.addEventListener('keydown', processaAtalhoWorkspace);

        return () => window.removeEventListener('keydown', processaAtalhoWorkspace);
    }, [estado.modoAtual.tipo, estado.malhaEmCriacao, estado.idsObjetosSelecionados.length, menuCriacao, menuAplicacao]);

    function abreMenuCriacao(event: ReactMouseEvent<HTMLElement>): void {
        event.preventDefault();
        menuAplicacao.fechaMenu();
        menuCriacao.abreMenu(event, workspaceRef.current, podeAbrirMenuCriacao());
    };

    function bloqueiaMenuContextoNativo(event: ReactMouseEvent<HTMLElement>): void { event.preventDefault(); };

    function processaMouseDownWorkspace(event: ReactMouseEvent<HTMLElement>): void {
        if (alvoEstaDentroDe(event, '[data-editor3d-toolbar-mouse="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-menu-criacao="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-menu-aplicacao="true"]')) return;
        if (event.button === 2) {
            abreMenuCriacao(event);

            return;
        }

        menuCriacao.fechaMenu();
        menuAplicacao.fechaMenu();
        if (alvoEstaDentroDe(event, 'canvas')) return;
        if (estado.ferramentaMouse !== 'SELECIONAR') acoes.resetaFerramentaMouse();
    };

    function selecionaTipoMalha(tipoMalha: TipoMalhaEditor3D): void {
        acoes.iniciaMalhaEmCriacao(tipoMalha);
        menuCriacao.fechaMenu();
    };

    function aplicaRotationScale(): void {
        acoes.aplicaRotationScaleObjetosSelecionados();
        menuAplicacao.fechaMenu();
    };

    return (
        <section ref={workspaceRef} className={styles.espacoTrabalhoEditor3D} onMouseDown={processaMouseDownWorkspace} onContextMenu={bloqueiaMenuContextoNativo}>
            <AreaInterativa3D />

            <ToolbarMouseEditor3D />

            <CamadaCriacaoMeshEditor3D posicaoMenu={menuCriacao.posicaoMenu} selecionaTipoMalha={selecionaTipoMalha} />

            <CamadaAplicacaoTransformEditor3D posicaoMenu={menuAplicacao.posicaoMenu} aplicaRotationScale={aplicaRotationScale} />
        </section>
    );
};