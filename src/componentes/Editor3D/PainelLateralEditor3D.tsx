'use client';

import styles from './Editor3D.module.css';

import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { PainelTransformEditor3D } from './PainelTransformEditor3D';
import { ArvoreCenaEditor3D, type ColecaoArvoreEditor3D, type ObjetoResumoEditor3D } from './ArvoreCenaEditor3D';
import type { CampoTransformEditor3D } from './editor3D.tipos';
import type { TransformEditor3D } from './editor3D.projeto.serializacao';

export type { ColecaoArvoreEditor3D, ObjetoResumoEditor3D };

interface PainelLateralEditor3DProps {
    readonly objetosRaiz: readonly ObjetoResumoEditor3D[];
    readonly colecoes: readonly ColecaoArvoreEditor3D[];
    readonly totalObjetos: number;
    readonly idSelecionado: number | null;
    readonly transformSelecionado: TransformEditor3D | null;
    readonly capturando: boolean;
    readonly capaSalva: boolean;
    readonly aoSelecionar: (id: number) => void;
    readonly aoAlternarVisibilidade: (id: number) => void;
    readonly aoAtualizarTransform: (campo: CampoTransformEditor3D, indice: number, valor: number) => void;
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
                <ArvoreCenaEditor3D objetosRaiz={props.objetosRaiz} colecoes={props.colecoes} idSelecionado={props.idSelecionado} aoSelecionar={props.aoSelecionar} aoAlternarVisibilidadeObjeto={props.aoAlternarVisibilidade} aoAlternarVisibilidadeColecao={props.aoAlternarVisibilidadeColecao} aoRenomearColecao={props.aoRenomearColecao} aoRemoverColecao={props.aoRemoverColecao} aoMoverObjeto={props.aoMoverObjeto} />
            </PainelColapsavelEditor3D>

            <PainelColapsavelEditor3D titulo="Transform" valor={props.transformSelecionado !== null ? '1' : '0'}>
                <PainelTransformEditor3D transform={props.transformSelecionado} aoAtualizar={props.aoAtualizarTransform} />
            </PainelColapsavelEditor3D>
        </aside>
    );
};
