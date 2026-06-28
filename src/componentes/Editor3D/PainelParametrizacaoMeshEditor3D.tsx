'use client';

import styles from './Editor3D.module.css';

import { type ChangeEvent } from 'react';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import type { TipoPrimitivaEditor3D } from './editor3D.projeto.serializacao';

export type CampoVetorCriacaoEditor3D = 'posicao' | 'rotacao' | 'escala';
export type ParamCriacaoMalhaEditor3D = {
    readonly tipo: TipoPrimitivaEditor3D;
    readonly segmentos: number;
    readonly posicao: [number, number, number];
    readonly rotacao: [number, number, number];
    readonly escala: [number, number, number];
};

const TIPOS_MESH_EDITOR3D: readonly { readonly tipo: TipoPrimitivaEditor3D; readonly nome: string; }[] = [
    { tipo: 'CUBO', nome: 'Cubo' },
    { tipo: 'CILINDRO', nome: 'Cilindro' },
];

function grausParaRadianos(valor: number): number { return valor * (Math.PI / 180); };
function radianosParaGraus(valor: number): number { return Number((valor * (180 / Math.PI)).toFixed(2)); };

interface PainelParametrizacaoMeshEditor3DProps {
    readonly params: ParamCriacaoMalhaEditor3D;
    readonly aoMudarTipo: (tipo: TipoPrimitivaEditor3D) => void;
    readonly aoMudarSegmentos: (valor: number) => void;
    readonly aoMudarVetor: (campo: CampoVetorCriacaoEditor3D, indice: number, valor: number) => void;
    readonly aoConfirmar: () => void;
    readonly aoCancelar: () => void;
};

export function PainelParametrizacaoMeshEditor3D({ params, aoMudarTipo, aoMudarSegmentos, aoMudarVetor, aoConfirmar, aoCancelar }: PainelParametrizacaoMeshEditor3DProps) {
    const ehCubo = params.tipo === 'CUBO';

    function trocaTipo(evento: ChangeEvent<HTMLSelectElement>): void { aoMudarTipo(evento.currentTarget.value as TipoPrimitivaEditor3D); };

    return (
        <div className={styles.painel_parametrizacao}>
            <header className={styles.cabecalho_parametrizacao}>
                <span>Criar {ehCubo ? 'Cubo' : 'Cilindro'}</span>
                <strong>3D</strong>
            </header>

            <label className={styles.controle_tipo_mesh}>
                <span>Mesh</span>
                <select value={params.tipo} onChange={trocaTipo}>
                    {TIPOS_MESH_EDITOR3D.map(item => <option key={item.tipo} value={item.tipo}>{item.nome}</option>)}
                </select>
            </label>

            <CampoNumeroEditor3D rotulo="Número de Vértices" valor={ehCubo ? 8 : params.segmentos} passo={1} inteiro minimo={ehCubo ? 8 : 3} maximo={ehCubo ? 8 : 64} desabilitado={ehCubo} atualizaValor={aoMudarSegmentos} />
            <CampoNumeroEditor3D rotulo="Location X" valor={params.posicao[0]} passo={0.1} atualizaValor={valor => aoMudarVetor('posicao', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Location Y" valor={params.posicao[1]} passo={0.1} atualizaValor={valor => aoMudarVetor('posicao', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Location Z" valor={params.posicao[2]} passo={0.1} atualizaValor={valor => aoMudarVetor('posicao', 2, valor)} />
            <CampoNumeroEditor3D rotulo="Rotation X" valor={radianosParaGraus(params.rotacao[0])} passo={1} atualizaValor={valor => aoMudarVetor('rotacao', 0, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Rotation Y" valor={radianosParaGraus(params.rotacao[1])} passo={1} atualizaValor={valor => aoMudarVetor('rotacao', 1, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Rotation Z" valor={radianosParaGraus(params.rotacao[2])} passo={1} atualizaValor={valor => aoMudarVetor('rotacao', 2, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Scale X" valor={params.escala[0]} passo={0.05} minimo={0.05} atualizaValor={valor => aoMudarVetor('escala', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Scale Y" valor={params.escala[1]} passo={0.05} minimo={0.05} atualizaValor={valor => aoMudarVetor('escala', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Scale Z" valor={params.escala[2]} passo={0.05} minimo={0.05} atualizaValor={valor => aoMudarVetor('escala', 2, valor)} />

            <footer className={styles.rodape_parametrizacao}>
                <button type="button" onClick={aoCancelar}>Cancelar</button>
                <button type="button" className={styles.botao_confirmar_parametrizacao} onClick={aoConfirmar}>Confirmar</button>
            </footer>
        </div>
    );
};
