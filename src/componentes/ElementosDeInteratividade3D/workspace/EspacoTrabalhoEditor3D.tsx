'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';

import { AreaInterativa3D } from '../AreaInterativa3D';
import { BarraAbasProjetoEditor3D } from '../menus/BarraAbasProjetoEditor3D';
import { BarraMenusEditor3D } from '../menus/BarraMenusEditor3D';
import { BotaoComandosAreaInterativa3D } from '../comandos/BotaoComandosAreaInterativa3D';
import { CamadaAplicacaoTransformEditor3D } from '../aplicacao/CamadaAplicacaoTransformEditor3D';
import { CamadaCriacaoMeshEditor3D } from '../criacao/CamadaCriacaoMeshEditor3D';
import { SeletorModoOperacaoEditor3D } from '../modoOperacao/SeletorModoOperacaoEditor3D';
import { ToolbarMouseEditor3D } from '../toolbar/ToolbarMouseEditor3D';
import { comandoTecladoAreaInterativa3DEstaAtivo } from '../comandos/editor3D.comandos';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { useMenuAplicacaoTransformEditor3D } from '../aplicacao/useMenuAplicacaoTransformEditor3D';
import type { TipoMalhaEditor3D } from '../editor/editor3D.tipos';

function alvoEstaDentroDe(event: ReactMouseEvent<HTMLElement>, seletor: string): boolean { return event.target instanceof Element && event.target.closest(seletor) !== null; };

const tipoPadraoCriacaoMeshEditor3D: TipoMalhaEditor3D = 'CUBO_3D';

function eventoTecladoVeioDeElementoEditavel(event: KeyboardEvent): boolean {
    const alvo = event.target;

    if (!(alvo instanceof Element)) return false;

    return alvo.closest('input, textarea, select, [contenteditable="true"]') !== null;
};

export function EspacoTrabalhoEditor3D() {
    const workspaceRef = useRef<HTMLElement | null>(null);
    const { estado, acoes } = useEditor3DContexto();
    const menuAplicacao = useMenuAplicacaoTransformEditor3D();

    const podeCriarNovoMesh = useCallback((): boolean => estado.modoOperacao === 'OBJETO' && estado.modoAtual.tipo === 'NENHUM' && estado.malhaEmCriacao === null, [estado.modoOperacao, estado.modoAtual.tipo, estado.malhaEmCriacao]);
    const podeAbrirMenuAplicacao = useCallback((): boolean => estado.modoOperacao === 'OBJETO' && estado.modoAtual.tipo === 'NENHUM' && estado.malhaEmCriacao === null && estado.idsObjetosSelecionados.length > 0, [estado.modoOperacao, estado.modoAtual.tipo, estado.malhaEmCriacao, estado.idsObjetosSelecionados.length]);

    useEffect(() => {
        function processaAtalhoWorkspace(event: KeyboardEvent): void {
            if (eventoTecladoVeioDeElementoEditavel(event)) return;

            if (comandoTecladoAreaInterativa3DEstaAtivo('tab-modo-operacao', event)) {
                event.preventDefault();
                menuAplicacao.fechaMenu();
                acoes.alternaModoOperacao();

                return;
            }

            if (comandoTecladoAreaInterativa3DEstaAtivo('ctrl-a-apply', event)) {
                event.preventDefault();
                menuAplicacao.abreMenuNoCentro(workspaceRef.current, podeAbrirMenuAplicacao());
            }
        };

        window.addEventListener('keydown', processaAtalhoWorkspace);

        return () => window.removeEventListener('keydown', processaAtalhoWorkspace);
    }, [acoes, menuAplicacao, podeAbrirMenuAplicacao]);

    function abreCriarNovoMesh(): void {
        if (!podeCriarNovoMesh()) return;

        menuAplicacao.fechaMenu();
        acoes.iniciaMalhaEmCriacao(tipoPadraoCriacaoMeshEditor3D);
    };

    function bloqueiaMenuContextoNativo(event: ReactMouseEvent<HTMLElement>): void { event.preventDefault(); };

    function processaMouseDownWorkspace(event: ReactMouseEvent<HTMLElement>): void {
        if (alvoEstaDentroDe(event, '[data-editor3d-toolbar-mouse="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-comandos="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-modo-operacao="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-menu-criacao="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-painel-parametrizacao-mesh="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-menu-aplicacao="true"]')) return;
        if (alvoEstaDentroDe(event, '[data-editor3d-shell="true"]')) return;
        if (alvoEstaDentroDe(event, 'canvas')) return;

        menuAplicacao.fechaMenu();
        if (estado.ferramentaMouse !== 'SELECIONAR') acoes.resetaFerramentaMouse();
    };

    function aplicaRotationScale(): void {
        acoes.aplicaRotationScaleObjetosSelecionados();
        menuAplicacao.fechaMenu();
    };

    return (
        <section ref={workspaceRef} className={styles.espacoTrabalhoEditor3D} onMouseDown={processaMouseDownWorkspace} onContextMenu={bloqueiaMenuContextoNativo}>
            <BarraMenusEditor3D podeCriarNovoMesh={podeCriarNovoMesh()} abreCriarNovoMesh={abreCriarNovoMesh} />

            <BarraAbasProjetoEditor3D />

            <section className={styles.viewportEditor3D}>
                <AreaInterativa3D />

                <ToolbarMouseEditor3D />

                <BotaoComandosAreaInterativa3D />

                <SeletorModoOperacaoEditor3D />

                <CamadaCriacaoMeshEditor3D />

                <CamadaAplicacaoTransformEditor3D posicaoMenu={menuAplicacao.posicaoMenu} aplicaRotationScale={aplicaRotationScale} />
            </section>
        </section>
    );
};