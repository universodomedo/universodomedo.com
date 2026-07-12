'use client';

import styles from './Editor3D.module.css';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import type { CampoTransformEditor3D } from './editor3D.tipos';
import type { TransformEditor3D } from './editor3D.projeto.serializacao';
import type { Vetor3Malha } from './editor3D.malha';

function grausParaRadianos(valor: number): number { return valor * (Math.PI / 180); };
function radianosParaGraus(valor: number): number { return Number((valor * (180 / Math.PI)).toFixed(2)); };

interface PainelTransformEditor3DProps {
    readonly transform: TransformEditor3D | null;
    // Caixa envolvente LOCAL da malha do objeto (sem escala): dimensão exibida = base × escala; editar a dimensão ajusta a escala. null = seleção sem malha (câmera/título).
    readonly dimensoesBase: Vetor3Malha | null;
    readonly aoAtualizar: (campo: CampoTransformEditor3D, indice: number, valor: number) => void;
};

// Um eixo com base ~zero (malha achatada) não tem como derivar escala a partir da dimensão — o campo trava.
const MINIMO_BASE_DIMENSAO_EDITOR3D = 0.000001;

export function PainelTransformEditor3D({ transform, dimensoesBase, aoAtualizar }: PainelTransformEditor3DProps) {
    if (transform === null) return <p className={styles.vazio_painel}>Selecione um objeto na Coleção da Cena para editar suas propriedades.</p>;

    // 1 unidade de cena = 1 m (mesma convenção do jogo: 1 unidade = 1000 mm).
    const dimensao = (eixo: number): number => dimensoesBase === null ? 0 : dimensoesBase[eixo] * transform.escala[eixo];
    const atualizaDimensao = (eixo: number, valor: number): void => { if (dimensoesBase !== null && dimensoesBase[eixo] > MINIMO_BASE_DIMENSAO_EDITOR3D) aoAtualizar('escala', eixo, valor / dimensoesBase[eixo]); };

    return (
        <div className={styles.grupo_propriedades}>
            <CampoNumeroEditor3D rotulo="Posição X" valor={transform.posicao[0]} passo={0.1} atualizaValor={valor => aoAtualizar('posicao', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Posição Y" valor={transform.posicao[1]} passo={0.1} atualizaValor={valor => aoAtualizar('posicao', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Posição Z" valor={transform.posicao[2]} passo={0.1} atualizaValor={valor => aoAtualizar('posicao', 2, valor)} />
            <CampoNumeroEditor3D rotulo="Rotação X" valor={radianosParaGraus(transform.rotacao[0])} passo={1} atualizaValor={valor => aoAtualizar('rotacao', 0, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Rotação Y" valor={radianosParaGraus(transform.rotacao[1])} passo={1} atualizaValor={valor => aoAtualizar('rotacao', 1, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Rotação Z" valor={radianosParaGraus(transform.rotacao[2])} passo={1} atualizaValor={valor => aoAtualizar('rotacao', 2, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Escala X" valor={transform.escala[0]} passo={0.05} minimo={0.05} atualizaValor={valor => aoAtualizar('escala', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Escala Y" valor={transform.escala[1]} passo={0.05} minimo={0.05} atualizaValor={valor => aoAtualizar('escala', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Escala Z" valor={transform.escala[2]} passo={0.05} minimo={0.05} atualizaValor={valor => aoAtualizar('escala', 2, valor)} />
            {dimensoesBase !== null && (
                <>
                    <CampoNumeroEditor3D rotulo="Dimensão X (m)" valor={dimensao(0)} passo={0.01} minimo={0.01} desabilitado={dimensoesBase[0] <= MINIMO_BASE_DIMENSAO_EDITOR3D} atualizaValor={valor => atualizaDimensao(0, valor)} />
                    <CampoNumeroEditor3D rotulo="Dimensão Y (m)" valor={dimensao(1)} passo={0.01} minimo={0.01} desabilitado={dimensoesBase[1] <= MINIMO_BASE_DIMENSAO_EDITOR3D} atualizaValor={valor => atualizaDimensao(1, valor)} />
                    <CampoNumeroEditor3D rotulo="Dimensão Z (m)" valor={dimensao(2)} passo={0.01} minimo={0.01} desabilitado={dimensoesBase[2] <= MINIMO_BASE_DIMENSAO_EDITOR3D} atualizaValor={valor => atualizaDimensao(2, valor)} />
                </>
            )}
        </div>
    );
};
