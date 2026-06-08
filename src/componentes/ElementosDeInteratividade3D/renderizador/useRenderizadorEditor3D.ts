'use client';

import { useEffect, useMemo, useState, type RefObject } from 'react';

import { criaRecursosRenderizadorEditor3D, limpaRecursosRenderizadorEditor3D } from './editor3D.renderizador.recursos';
import { iniciaLoopRenderizacaoEditor3D } from './editor3D.renderizador.frame';
import { renderizacaoEditor3DExibeAmbienteEdicao, type ModoRenderizacaoEditor3D } from './editor3D.renderizador.modo';
import { registraEventosRenderizadorEditor3D } from './eventos/editor3D.eventos.instalacao';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { useRefsRenderizadorEditor3D } from './editor3D.renderizador.refs';
import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { ObjetoCenaEditor3D } from '../editor/editor3D.tipos';

function obtemObjetosRenderizaveisEditor3D(estado: Editor3DState): ObjetoCenaEditor3D[] { return estado.malhaEmCriacao === null ? estado.objetos : [...estado.objetos, estado.malhaEmCriacao]; };

export function useRenderizadorEditor3D(canvasRef: RefObject<HTMLCanvasElement | null>, cursorFantasmaRef: RefObject<HTMLDivElement | null>, modoRenderizacao: ModoRenderizacaoEditor3D): boolean {
    const { estado, acoes } = useEditor3DContexto();
    const refs = useRefsRenderizadorEditor3D(estado, acoes);
    const objetosRenderizaveis = useMemo(() => obtemObjetosRenderizaveisEditor3D(estado), [estado.objetos, estado.malhaEmCriacao]);
    const assinaturaObjetos = useMemo(() => objetosRenderizaveis.map(objeto => `${objeto.id}:${objeto.tipo}:${objeto.quantidadeVertices}:${objeto.versaoGeometria}`).join('|'), [objetosRenderizaveis]);
    const [webglDisponivel, setWebglDisponivel] = useState(true);

    useEffect(() => {
        if (!renderizacaoEditor3DExibeAmbienteEdicao(modoRenderizacao)) return;

        const canvas = canvasRef.current;

        if (canvas === null) return;

        return registraEventosRenderizadorEditor3D({ canvas, cursorFantasma: cursorFantasmaRef, refs });
    }, [canvasRef, cursorFantasmaRef, modoRenderizacao, refs]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas === null) return;

        const gl = canvas.getContext('webgl', { alpha: true, antialias: true });

        if (gl === null) {
            setWebglDisponivel(false);

            return;
        }

        const recursos = criaRecursosRenderizadorEditor3D(gl, objetosRenderizaveis);

        if (recursos === null) {
            setWebglDisponivel(false);

            return;
        }

        setWebglDisponivel(true);

        const encerraLoop = iniciaLoopRenderizacaoEditor3D(gl, canvas, recursos, refs, modoRenderizacao);

        return () => {
            encerraLoop();
            limpaRecursosRenderizadorEditor3D(gl, recursos);
        };
    }, [assinaturaObjetos, canvasRef, cursorFantasmaRef, modoRenderizacao, refs]);

    return webglDisponivel;
};
