'use client';

import styles from './Editor3D.module.css';

import { type RefObject } from 'react';

import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { PainelObjetoEditor3D } from './PainelObjetoEditor3D';
import { PainelCorpoPersonagemEditor3D, type CampoParametroRegiaoEditor3D } from './PainelCorpoPersonagemEditor3D';
import { PainelTransformEditor3D } from './PainelTransformEditor3D';
import { PainelCameraCapaArteEditor3D, type CampoVetorCameraCapaArteEditor3D } from './PainelCameraCapaArteEditor3D';
import { PainelTituloCapaArteEditor3D } from './PainelTituloCapaArteEditor3D';
import { ArvoreCenaEditor3D, type ColecaoArvoreEditor3D, type ObjetoResumoEditor3D } from './ArvoreCenaEditor3D';
import { SELECAO_CAMERA_EDITOR3D, SELECAO_CORPO_PERSONAGEM_EDITOR3D, SELECAO_TITULO_CAPA_ARTE_EDITOR3D, type CampoTransformEditor3D, type ModoTransformEditor3D, type TravasTransformEditor3D } from './editor3D.tipos';
import type { CameraEditor3D, CapaArteEditor3D, TransformEditor3D } from './editor3D.projeto.serializacao';
import type { Vetor3Malha } from './editor3D.malha';
import type { CorpoPersonagemCenaCanonicaEditor3D, MembroPersonagemEditor3D } from 'types-nora-api';

export type { ColecaoArvoreEditor3D, ObjetoResumoEditor3D };

interface PainelLateralEditor3DProps {
    readonly objetosRaiz: readonly ObjetoResumoEditor3D[];
    readonly colecoes: readonly ColecaoArvoreEditor3D[];
    readonly totalObjetos: number;
    readonly idSelecionado: number | null;
    readonly objetoSelecionado: { readonly nome: string; readonly cor: string; readonly materiaisExtras: readonly { readonly nome: string; readonly cor: string }[]; readonly tipoRotulo: string; readonly subdivisao: number; readonly espessura: number; readonly peca: { readonly idPeca: string; readonly nome: string } | null } | null;
    readonly temFacesSelecionadas: boolean;
    readonly transformSelecionado: TransformEditor3D | null;
    readonly dimensoesBaseSelecionado: Vetor3Malha | null;
    readonly modoTransform: ModoTransformEditor3D;
    readonly travasTransform: TravasTransformEditor3D;
    readonly aoAlternarTravaTransform: (campo: CampoTransformEditor3D, indice: number) => void;
    readonly camera: CameraEditor3D | null;
    readonly capaArte: CapaArteEditor3D;
    readonly corpoPersonagem: CorpoPersonagemCenaCanonicaEditor3D | null;
    readonly regioesCorpo: readonly { readonly membro: MembroPersonagemEditor3D; readonly rotulo: string }[];
    readonly regiaoCorpoSelecionada: MembroPersonagemEditor3D | null;
    readonly rotuloRegiaoSelecionada: string;
    readonly pecasDaRegiao: readonly { readonly idPeca: string; readonly nome: string }[];
    readonly refPreviewCamera: RefObject<HTMLCanvasElement | null>;
    readonly povCameraAtiva: boolean;
    readonly alvoTravado: boolean;
    readonly capturando: boolean;
    readonly capaSalva: boolean;
    readonly aoSelecionar: (id: number) => void;
    readonly aoSelecionarCorpo: (regiao: MembroPersonagemEditor3D | null) => void;
    readonly aoAlternarVisibilidade: (id: number) => void;
    readonly aoRenomearObjeto: (id: number, nome: string) => void;
    readonly aoMudarCorObjeto: (cor: string) => void;
    readonly aoMudarSubdivisaoObjeto: (subdivisao: number) => void;
    readonly aoMudarEspessuraObjeto: (espessura: number) => void;
    readonly aoAdicionarMaterialObjeto: () => void;
    readonly aoMudarCorMaterialObjeto: (slot: number, cor: string) => void;
    readonly aoRenomearMaterialObjeto: (slot: number, nome: string) => void;
    readonly aoAtribuirMaterialObjeto: (slot: number) => void;
    readonly aoEspelharObjetoX: () => void;
    readonly aoAplicarTransformacoesObjeto: () => void;
    readonly aoDuplicarObjeto: (id: number) => void;
    readonly aoExcluirObjeto: (id: number) => void;
    readonly aoAtualizarParametroCorpo: (regiao: MembroPersonagemEditor3D | null, campo: CampoParametroRegiaoEditor3D, valor: number) => void;
    readonly aoMudarCorCorpo: (cor: string) => void;
    readonly aoAnexarPeca: () => void;
    readonly aoRemoverPeca: (idPeca: string) => void;
    readonly aoAtualizarTransform: (campo: CampoTransformEditor3D, indice: number, valor: number) => void;
    readonly aoAssentarObjetoNoChao: () => void;
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
                <ArvoreCenaEditor3D objetosRaiz={props.objetosRaiz} colecoes={props.colecoes} idSelecionado={props.idSelecionado} temCamera={props.camera !== null} povCameraAtiva={props.povCameraAtiva} regioesCorpo={props.regioesCorpo} regiaoCorpoSelecionada={props.regiaoCorpoSelecionada} aoSelecionarCorpo={props.aoSelecionarCorpo} aoSelecionar={props.aoSelecionar} aoAlternarVisibilidadeObjeto={props.aoAlternarVisibilidade} aoDuplicarObjeto={props.aoDuplicarObjeto} aoExcluirObjeto={props.aoExcluirObjeto} aoAlternarVisibilidadeColecao={props.aoAlternarVisibilidadeColecao} aoRenomearColecao={props.aoRenomearColecao} aoRenomearObjeto={props.aoRenomearObjeto} aoRemoverColecao={props.aoRemoverColecao} aoMoverObjeto={props.aoMoverObjeto} aoAlternarPovCamera={props.aoAlternarPovCamera} />
            </PainelColapsavelEditor3D>

            {props.idSelecionado === SELECAO_CAMERA_EDITOR3D && props.camera !== null ? (
                <PainelColapsavelEditor3D titulo="Câmera" valor="Output">
                    <PainelCameraCapaArteEditor3D camera={props.camera} refPreview={props.refPreviewCamera} alvoTravado={props.alvoTravado} aoAtualizarVetor={props.aoAtualizarCameraVetor} aoAtualizarFov={props.aoAtualizarCameraFov} aoAlternarAlvoTravado={props.aoAlternarAlvoTravado} />
                </PainelColapsavelEditor3D>
            ) : props.idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D && props.camera !== null ? (
                <PainelColapsavelEditor3D titulo="Título" valor="Texto 3D">
                    <PainelTituloCapaArteEditor3D titulo={props.capaArte.titulo} aoAtualizarTexto={props.aoAtualizarTituloTexto} aoAtualizarTransform={props.aoAtualizarTituloTransform} aoAtualizarCor={props.aoAtualizarTituloCor} />
                </PainelColapsavelEditor3D>
            ) : props.idSelecionado === SELECAO_CORPO_PERSONAGEM_EDITOR3D && props.corpoPersonagem !== null ? (
                <PainelColapsavelEditor3D titulo="Corpo" valor={props.regiaoCorpoSelecionada !== null ? props.rotuloRegiaoSelecionada : 'Global'}>
                    <PainelCorpoPersonagemEditor3D corpo={props.corpoPersonagem} regiaoSelecionada={props.regiaoCorpoSelecionada} rotuloRegiao={props.rotuloRegiaoSelecionada} pecasDaRegiao={props.pecasDaRegiao} aoAtualizarParametro={props.aoAtualizarParametroCorpo} aoMudarCor={props.aoMudarCorCorpo} aoAnexarPeca={props.aoAnexarPeca} aoRemoverPeca={props.aoRemoverPeca} />
                </PainelColapsavelEditor3D>
            ) : (
                <>
                    {props.objetoSelecionado !== null && (
                        <PainelColapsavelEditor3D titulo="Objeto" valor={props.objetoSelecionado.tipoRotulo}>
                            <PainelObjetoEditor3D cor={props.objetoSelecionado.cor} materiaisExtras={props.objetoSelecionado.materiaisExtras} subdivisao={props.objetoSelecionado.subdivisao} espessura={props.objetoSelecionado.espessura} temFacesSelecionadas={props.temFacesSelecionadas} peca={props.objetoSelecionado.peca} aoMudarCor={props.aoMudarCorObjeto} aoMudarSubdivisao={props.aoMudarSubdivisaoObjeto} aoMudarEspessura={props.aoMudarEspessuraObjeto} aoAdicionarMaterial={props.aoAdicionarMaterialObjeto} aoMudarCorMaterial={props.aoMudarCorMaterialObjeto} aoRenomearMaterial={props.aoRenomearMaterialObjeto} aoAtribuirMaterial={props.aoAtribuirMaterialObjeto} aoEspelharX={props.aoEspelharObjetoX} aoAplicarTransformacoes={props.aoAplicarTransformacoesObjeto} aoRemoverPeca={props.aoRemoverPeca} />
                        </PainelColapsavelEditor3D>
                    )}
                    <PainelColapsavelEditor3D titulo="Transform" valor={props.transformSelecionado !== null ? '1' : '0'}>
                        <PainelTransformEditor3D transform={props.transformSelecionado} dimensoesBase={props.dimensoesBaseSelecionado} modo={props.modoTransform} travas={props.travasTransform} aoAlternarTrava={props.aoAlternarTravaTransform} aoAtualizar={props.aoAtualizarTransform} aoAssentarNoChao={props.aoAssentarObjetoNoChao} />
                    </PainelColapsavelEditor3D>
                </>
            )}
        </aside>
    );
};
