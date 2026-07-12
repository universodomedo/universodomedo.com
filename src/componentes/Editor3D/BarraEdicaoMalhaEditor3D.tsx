'use client';

import styles from './Editor3D.module.css';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';

export type ModoSelecaoEdicaoEditor3D = 'VERTICE' | 'ARESTA' | 'FACE';

const MODOS_SELECAO_EDICAO: readonly { readonly modo: ModoSelecaoEdicaoEditor3D; readonly rotulo: string; readonly atalho: string; }[] = [
    { modo: 'VERTICE', rotulo: 'Vértice', atalho: '1' },
    { modo: 'ARESTA', rotulo: 'Aresta', atalho: '2' },
    { modo: 'FACE', rotulo: 'Face', atalho: '3' },
];

interface BarraEdicaoMalhaEditor3DProps {
    readonly modoSelecao: ModoSelecaoEdicaoEditor3D;
    readonly xRayAtivo: boolean;
    readonly podeExtrudar: boolean;
    readonly podeChanfrar: boolean;
    readonly podeCortarAnel: boolean;
    readonly podeInsetar: boolean;
    readonly podeExcluir: boolean;
    readonly podeFundir: boolean;
    readonly quantidadeBevel: number;
    readonly distanciaInset: number;
    readonly aoTrocarModoSelecao: (modo: ModoSelecaoEdicaoEditor3D) => void;
    readonly aoAlternarXRay: () => void;
    readonly aoExtrudar: () => void;
    readonly aoChanfrar: () => void;
    readonly aoCortarAnel: () => void;
    readonly aoInsetar: () => void;
    readonly aoExcluir: () => void;
    readonly aoFundir: () => void;
    readonly aoMudarQuantidadeBevel: (valor: number) => void;
    readonly aoMudarDistanciaInset: (valor: number) => void;
};

export function BarraEdicaoMalhaEditor3D({ modoSelecao, xRayAtivo, podeExtrudar, podeChanfrar, podeCortarAnel, podeInsetar, podeExcluir, podeFundir, quantidadeBevel, distanciaInset, aoTrocarModoSelecao, aoAlternarXRay, aoExtrudar, aoChanfrar, aoCortarAnel, aoInsetar, aoExcluir, aoFundir, aoMudarQuantidadeBevel, aoMudarDistanciaInset }: BarraEdicaoMalhaEditor3DProps) {
    return (
        <div className={styles.barra_edicao_malha}>
            <div className={styles.grupo_modo_selecao}>
                {MODOS_SELECAO_EDICAO.map(item => (
                    <button key={item.modo} type="button" className={`${styles.botao_modo_selecao} ${modoSelecao === item.modo ? styles.botao_modo_selecao_ativo : ''}`} onClick={() => aoTrocarModoSelecao(item.modo)}>{item.rotulo}<kbd>{item.atalho}</kbd></button>
                ))}
            </div>
            <button type="button" className={`${styles.botao_modo_selecao} ${xRayAtivo ? styles.botao_modo_selecao_ativo : ''}`} onClick={aoAlternarXRay} title={xRayAtivo ? 'Desligar X-Ray (a malha volta a bloquear a seleção)' : 'Ligar X-Ray: a malha fica translúcida e a seleção atravessa (alcança handles atrás da geometria)'}>X-Ray</button>
            <button type="button" className={styles.botao_extrude} disabled={!podeExtrudar} onClick={aoExtrudar} title={podeExtrudar ? 'Extrudar a face selecionada' : 'Selecione exatamente uma face (modo Face)'}>Extrude<kbd>E</kbd></button>
            <button type="button" className={styles.botao_bevel} disabled={!podeChanfrar} onClick={aoChanfrar} title={podeChanfrar ? 'Chanfrar a aresta selecionada' : 'Selecione uma aresta (modo Aresta)'}>Bevel<kbd>B</kbd></button>
            <div className={styles.campo_valor_operador} title="Recuo do Bevel (fração da aresta vizinha)">
                <CampoNumeroEditor3D rotulo="↧" valor={quantidadeBevel} passo={0.05} minimo={0.05} maximo={0.45} atualizaValor={aoMudarQuantidadeBevel} />
            </div>
            <button type="button" className={styles.botao_operador_malha} disabled={!podeCortarAnel} onClick={aoCortarAnel} title={podeCortarAnel ? 'Cortar um anel de arestas perpendicular à aresta selecionada' : 'Selecione uma aresta (modo Aresta)'}>Cortar Anel</button>
            <button type="button" className={styles.botao_operador_malha} disabled={!podeInsetar} onClick={aoInsetar} title={podeInsetar ? 'Encolher as faces selecionadas criando molduras (cada face individualmente)' : 'Selecione faces (modo Face)'}>Inset</button>
            <div className={styles.campo_valor_operador} title="Largura da moldura do Inset em metros (distância absoluta)">
                <CampoNumeroEditor3D rotulo="⤢" valor={distanciaInset} passo={0.05} minimo={0.01} maximo={5} atualizaValor={aoMudarDistanciaInset} />
            </div>
            <button type="button" className={styles.botao_operador_malha} disabled={!podeFundir} onClick={aoFundir} title={podeFundir ? 'Fundir os vértices selecionados no centróide' : 'Selecione 2+ vértices (modo Vértice)'}>Fundir</button>
            <button type="button" className={`${styles.botao_operador_malha} ${styles.botao_operador_malha_perigo}`} disabled={!podeExcluir} onClick={aoExcluir} title={podeExcluir ? (modoSelecao === 'FACE' ? 'Excluir as faces selecionadas' : 'Excluir os vértices selecionados (e as faces que os tocam)') : 'Selecione faces ou vértices'}>Excluir</button>
        </div>
    );
};
