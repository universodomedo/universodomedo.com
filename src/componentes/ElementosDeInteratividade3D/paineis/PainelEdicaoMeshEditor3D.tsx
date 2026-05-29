'use client';

import styles from './styles.module.css';

import { IconeVisualComandoAreaInterativa3D } from '../comandos/IconeVisualComandoAreaInterativa3D';
import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { obtemComandoAreaInterativa3D } from '../comandos/editor3D.comandos';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function PainelEdicaoMeshEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const comandoInset = obtemComandoAreaInterativa3D('i-inset-faces');
    const idObjetoAtivo = estado.escopoEdicao?.idObjetoAtivo ?? null;
    const objetoAtivo = idObjetoAtivo === null ? null : estado.objetos.find(objeto => objeto.id === idObjetoAtivo) ?? null;
    const faceSelecionada = estado.faceSelecionadaEdicao;
    const podeAplicarInset = estado.modoOperacao === 'EDICAO' && estado.modoAtual.tipo === 'NENHUM' && estado.malhaEmCriacao === null && estado.escopoEdicao !== null && faceSelecionada !== null && faceSelecionada.idObjeto === estado.escopoEdicao.idObjetoAtivo;

    function aplicaInsetFaces(): void {
        if (!podeAplicarInset) return;

        acoes.aplicaInsetFaceSelecionada();
    };

    return (
        <PainelColapsavelEditor3D titulo="Mesh" valor={objetoAtivo?.nome ?? 'Edit Mode'}>
            <div className={styles.status}>
                <span>Objeto ativo</span>
                <strong>{objetoAtivo?.nome ?? 'None'}</strong>
            </div>

            <div className={styles.status}>
                <span>Face</span>
                <strong>{faceSelecionada?.idFace ?? 'None'}</strong>
            </div>

            <div className={styles.linhaBotoes}>
                <button className={`${styles.botaoControle} ${styles.botaoControleComIcone}`} type="button" disabled={!podeAplicarInset} onClick={aplicaInsetFaces} title={`${comandoInset.nome}${comandoInset.atalho === null ? '' : ` (${comandoInset.atalho})`}`}>
                    <span className={styles.rotuloBotaoControleEditor3D}>
                        <IconeVisualComandoAreaInterativa3D icone={comandoInset.icone} className={styles.iconeBotaoControleEditor3D} />
                        <span>{comandoInset.nome}</span>
                    </span>
                    {comandoInset.atalho !== null && <strong>{comandoInset.atalho}</strong>}
                </button>
            </div>
        </PainelColapsavelEditor3D>
    );
};
