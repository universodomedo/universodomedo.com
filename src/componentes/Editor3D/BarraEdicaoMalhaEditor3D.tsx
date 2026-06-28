'use client';

import styles from './Editor3D.module.css';

export type ModoSelecaoEdicaoEditor3D = 'VERTICE' | 'ARESTA' | 'FACE';

const MODOS_SELECAO_EDICAO: readonly { readonly modo: ModoSelecaoEdicaoEditor3D; readonly rotulo: string; readonly atalho: string; }[] = [
    { modo: 'VERTICE', rotulo: 'Vértice', atalho: '1' },
    { modo: 'ARESTA', rotulo: 'Aresta', atalho: '2' },
    { modo: 'FACE', rotulo: 'Face', atalho: '3' },
];

interface BarraEdicaoMalhaEditor3DProps {
    readonly modoSelecao: ModoSelecaoEdicaoEditor3D;
    readonly podeExtrudar: boolean;
    readonly podeChanfrar: boolean;
    readonly aoTrocarModoSelecao: (modo: ModoSelecaoEdicaoEditor3D) => void;
    readonly aoExtrudar: () => void;
    readonly aoChanfrar: () => void;
};

export function BarraEdicaoMalhaEditor3D({ modoSelecao, podeExtrudar, podeChanfrar, aoTrocarModoSelecao, aoExtrudar, aoChanfrar }: BarraEdicaoMalhaEditor3DProps) {
    return (
        <div className={styles.barra_edicao_malha}>
            <div className={styles.grupo_modo_selecao}>
                {MODOS_SELECAO_EDICAO.map(item => (
                    <button key={item.modo} type="button" className={`${styles.botao_modo_selecao} ${modoSelecao === item.modo ? styles.botao_modo_selecao_ativo : ''}`} onClick={() => aoTrocarModoSelecao(item.modo)}>{item.rotulo}<kbd>{item.atalho}</kbd></button>
                ))}
            </div>
            <button type="button" className={styles.botao_extrude} disabled={!podeExtrudar} onClick={aoExtrudar} title={podeExtrudar ? 'Extrudar a face selecionada' : 'Selecione uma face (modo Face)'}>Extrude<kbd>E</kbd></button>
            <button type="button" className={styles.botao_bevel} disabled={!podeChanfrar} onClick={aoChanfrar} title={podeChanfrar ? 'Chanfrar a aresta selecionada' : 'Selecione uma aresta (modo Aresta)'}>Bevel<kbd>B</kbd></button>
        </div>
    );
};
