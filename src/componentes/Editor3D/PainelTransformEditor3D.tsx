'use client';

import styles from './Editor3D.module.css';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import type { CampoTransformEditor3D } from './editor3D.tipos';
import type { TransformEditor3D } from './editor3D.projeto.serializacao';

function grausParaRadianos(valor: number): number { return valor * (Math.PI / 180); };
function radianosParaGraus(valor: number): number { return Number((valor * (180 / Math.PI)).toFixed(2)); };

interface PainelTransformEditor3DProps {
    readonly transform: TransformEditor3D | null;
    readonly aoAtualizar: (campo: CampoTransformEditor3D, indice: number, valor: number) => void;
};

export function PainelTransformEditor3D({ transform, aoAtualizar }: PainelTransformEditor3DProps) {
    if (transform === null) return <p className={styles.vazio_painel}>Selecione um objeto na Coleção da Cena para editar suas propriedades.</p>;

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
        </div>
    );
};
