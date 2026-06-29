'use client';

import styles from './Editor3D.module.css';

import { type RefObject } from 'react';

import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { PainelTransformEditor3D } from './PainelTransformEditor3D';
import { PainelCameraCapaArteEditor3D, type CampoVetorCameraCapaArteEditor3D } from './PainelCameraCapaArteEditor3D';
import { PainelTituloCapaArteEditor3D } from './PainelTituloCapaArteEditor3D';
import { ArvoreCenaEditor3D, type ColecaoArvoreEditor3D, type ObjetoResumoEditor3D } from './ArvoreCenaEditor3D';
import { SELECAO_CAMERA_EDITOR3D, SELECAO_TITULO_CAPA_ARTE_EDITOR3D, type CampoTransformEditor3D } from './editor3D.tipos';
import type { CameraEditor3D, CapaArteEditor3D, TransformEditor3D } from './editor3D.projeto.serializacao';

export type { ColecaoArvoreEditor3D, ObjetoResumoEditor3D };

interface PainelLateralEditor3DProps {
    readonly objetosRaiz: readonly ObjetoResumoEditor3D[];
    readonly colecoes: readonly ColecaoArvoreEditor3D[];
    readonly totalObjetos: number;
    readonly idSelecionado: number | null;
    readonly transformSelecionado: TransformEditor3D | null;
    readonly camera: CameraEditor3D | null;
    readonly capaArte: CapaArteEditor3D;
    readonly refPreviewCamera: RefObject<HTMLCanvasElement | null>;
    readonly povCameraAtiva: boolean;
    readonly alvoTravado: boolean;
    readonly capturando: boolean;
    readonly capaSalva: boolean;
    readonly aoSelecionar: (id: number) => void;
    readonly aoAlternarVisibilidade: (id: number) => void;
    readonly aoAtualizarTransform: (campo: CampoTransformEditor3D, indice: number, valor: number) => void;
    readonly aoAtualizarCameraVetor: (campo: CampoVetorCameraCapaArteEditor3D, indice: number, valor: number) => void;
    readonly aoAtualizarCameraFov: (valor: number) => void;
    readonly aoAtualizarTituloTexto: (texto: string) => void;
    readonly aoAtualizarTituloTransform: (campo: CampoTransformEditor3D, indice: number, valor: number) => void;
    readonly aoAtualizarTituloCor: (cor: string) => void;
    readonly aoAlternarPovCamera: () => void;
    readonly aoAlternarAlvoTravado: () => void;
    readonly aoCapturar: () => void;
    readonly aoCriarColecao: () => void;
    readonly aoAlternarVisibilidadeColecao: (id: number) => void;
    readonly aoRenomearColecao: (id: number, nome: string) => void;
    readonly aoRemoverColecao: (id: number) => void;
    readonly aoMoverObjeto: (idObjeto: number, idColecaoDestino: number | null) => void;
};

export function PainelLateralEditor3D(props: PainelLateralEditor3DProps) {
    return (
        <aside className={styles.painel_lateral}>
            <div className={styles.bloco_acao_painel}>
                <button type="button" className={styles.botao_acao_painel} onClick={props.aoCapturar} disabled={props.capturando}>
                    <span>{props.capturando ? 'Capturando…' : 'Capturar Arte de Capa'}</span>
                    <strong>{props.capaSalva ? '✓' : 'PNG'}</strong>
                </button>
            </div>

            <PainelColapsavelEditor3D titulo="Coleção da Cena" valor={String(props.totalObjetos)} acoes={<button type="button" className={styles.botao_add_colecao} onClick={() => props.aoCriarColecao()} title="Nova coleção" aria-label="Nova coleção">+</button>}>
                <ArvoreCenaEditor3D objetosRaiz={props.objetosRaiz} colecoes={props.colecoes} idSelecionado={props.idSelecionado} temCamera={props.camera !== null} povCameraAtiva={props.povCameraAtiva} aoSelecionar={props.aoSelecionar} aoAlternarVisibilidadeObjeto={props.aoAlternarVisibilidade} aoAlternarVisibilidadeColecao={props.aoAlternarVisibilidadeColecao} aoRenomearColecao={props.aoRenomearColecao} aoRemoverColecao={props.aoRemoverColecao} aoMoverObjeto={props.aoMoverObjeto} aoAlternarPovCamera={props.aoAlternarPovCamera} />
            </PainelColapsavelEditor3D>

            {props.idSelecionado === SELECAO_CAMERA_EDITOR3D && props.camera !== null ? (
                <PainelColapsavelEditor3D titulo="Câmera" valor="Output">
                    <PainelCameraCapaArteEditor3D camera={props.camera} refPreview={props.refPreviewCamera} alvoTravado={props.alvoTravado} aoAtualizarVetor={props.aoAtualizarCameraVetor} aoAtualizarFov={props.aoAtualizarCameraFov} aoAlternarAlvoTravado={props.aoAlternarAlvoTravado} />
                </PainelColapsavelEditor3D>
            ) : props.idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D && props.camera !== null ? (
                <PainelColapsavelEditor3D titulo="Título" valor="Texto 3D">
                    <PainelTituloCapaArteEditor3D titulo={props.capaArte.titulo} aoAtualizarTexto={props.aoAtualizarTituloTexto} aoAtualizarTransform={props.aoAtualizarTituloTransform} aoAtualizarCor={props.aoAtualizarTituloCor} />
                </PainelColapsavelEditor3D>
            ) : (
                <PainelColapsavelEditor3D titulo="Transform" valor={props.transformSelecionado !== null ? '1' : '0'}>
                    <PainelTransformEditor3D transform={props.transformSelecionado} aoAtualizar={props.aoAtualizarTransform} />
                </PainelColapsavelEditor3D>
            )}
        </aside>
    );
};
