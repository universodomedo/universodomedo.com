'use client';

import styles from './styles.module.css';

import { type ChangeEvent } from 'react';

import { CampoNumeroEditor3D } from '../controles/CampoNumeroEditor3D';
import { ControleVerticesMeshEditor3D } from './ControleVerticesMeshEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { obtemDefinicaoMalhaEditor3D } from '../editor/editor3D.objetos';
import { tiposMalhaEditor3D, type CampoVetorMalhaEditor3D, type IndiceVetor3Editor3D, type TipoMalhaEditor3D } from '../editor/editor3D.tipos';

function grausParaRadianos(valor: number): number { return valor * (Math.PI / 180); };
function radianosParaGraus(valor: number): number { return Number((valor * (180 / Math.PI)).toFixed(2)); };

export function PainelParametrizacaoMeshEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const malha = estado.malhaEmCriacao;
    const definicao = malha === null ? null : obtemDefinicaoMalhaEditor3D(malha.tipo);

    function atualizaVetor(campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number): void { acoes.atualizaVetorMalhaEmCriacao(campo, indice, valor); };
    function trocaTipoMalha(event: ChangeEvent<HTMLSelectElement>): void { acoes.trocaTipoMalhaEmCriacao(event.currentTarget.value as TipoMalhaEditor3D); };

    if (malha === null || definicao === null) return null;

    return (
        <div className={styles.painelParametrizacaoMesh} data-editor3d-painel-parametrizacao-mesh="true">
            <header className={styles.cabecalhoParametrizacaoMesh}>
                <span>Criar {definicao.nome}</span>
                <strong>{definicao.dimensao}</strong>
            </header>

            <label className={styles.controleTipoMesh}>
                <span>Mesh</span>
                <select value={malha.tipo} onChange={trocaTipoMalha}>
                    {tiposMalhaEditor3D.map(tipo => <option key={tipo.key} value={tipo.key}>{tipo.nome}</option>)}
                </select>
            </label>

            <ControleVerticesMeshEditor3D quantidadeVertices={malha.quantidadeVertices} quantidadeMinima={definicao.quantidadeMinima} quantidadeMaxima={definicao.quantidadeMaxima} quantidadeAjustavel={definicao.quantidadeAjustavel} defineQuantidadeVertices={acoes.defineQuantidadeVertices} />
            <CampoNumeroEditor3D rotulo="Location X" valor={malha.posicao[0]} passo={0.1} atualizaValor={valor => atualizaVetor('posicao', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Location Y" valor={malha.posicao[1]} passo={0.1} atualizaValor={valor => atualizaVetor('posicao', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Location Z" valor={malha.posicao[2]} passo={0.1} atualizaValor={valor => atualizaVetor('posicao', 2, valor)} />
            <CampoNumeroEditor3D rotulo="Rotation X" valor={radianosParaGraus(malha.rotacao[0])} passo={1} atualizaValor={valor => atualizaVetor('rotacao', 0, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Rotation Y" valor={radianosParaGraus(malha.rotacao[1])} passo={1} atualizaValor={valor => atualizaVetor('rotacao', 1, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Rotation Z" valor={radianosParaGraus(malha.rotacao[2])} passo={1} atualizaValor={valor => atualizaVetor('rotacao', 2, grausParaRadianos(valor))} />
            <CampoNumeroEditor3D rotulo="Scale X" valor={malha.escala[0]} passo={0.05} minimo={0.05} atualizaValor={valor => atualizaVetor('escala', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Scale Y" valor={malha.escala[1]} passo={0.05} minimo={0.05} atualizaValor={valor => atualizaVetor('escala', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Scale Z" valor={malha.escala[2]} passo={0.05} minimo={0.05} atualizaValor={valor => atualizaVetor('escala', 2, valor)} />

            <footer className={styles.rodapeParametrizacaoMesh}>
                <button type="button" onClick={acoes.cancelaMalhaEmCriacao}>Cancelar</button>
                <button className={styles.botaoConfirmarParametrizacaoMesh} type="button" onClick={acoes.confirmaMalhaEmCriacao}>Confirmar</button>
            </footer>
        </div>
    );
};