'use client';

import styles from './styles.module.css';

import { IconeVisualComandoAreaInterativa3D } from '../comandos/IconeVisualComandoAreaInterativa3D';
import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { obtemComandoAreaInterativa3D } from '../comandos/editor3D.comandos';
import { obtemMotivoBloqueioInsetFacesEditor3D } from '../estado/editor3D.estado.edicao.selectors';
import { obtemNomeTipoSelecaoEdicaoEditor3D } from '../modoOperacao/editor3D.modoOperacao.tipos';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function PainelEdicaoMeshEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const comandoInset = obtemComandoAreaInterativa3D('i-inset-faces');
    const idObjetoAtivo = estado.escopoEdicao?.idObjetoAtivo ?? null;
    const objetoAtivo = idObjetoAtivo === null ? null : estado.objetos.find(objeto => objeto.id === idObjetoAtivo) ?? null;
    const faceSelecionada = estado.faceSelecionadaEdicao;
    const motivoBloqueioInset = obtemMotivoBloqueioInsetFacesEditor3D(estado);
    const podeAplicarInset = motivoBloqueioInset === null;

    function aplicaInsetFaces(): void {
        if (motivoBloqueioInset !== null) {
            acoes.exibeNotificacaoAreaInterativa(motivoBloqueioInset);

            return;
        }

        acoes.iniciaInsetFaceSelecionada();
    };

    return (
        <PainelColapsavelEditor3D titulo="Mesh" valor={objetoAtivo?.nome ?? 'Edit Mode'}>
            <div className={styles.status}>
                <span>Objeto ativo</span>
                <strong>{objetoAtivo?.nome ?? 'None'}</strong>
            </div>

            <div className={styles.status}>
                <span>Selecao</span>
                <strong>{obtemNomeTipoSelecaoEdicaoEditor3D(estado.tipoSelecaoEdicao)}</strong>
            </div>

            <div className={styles.status}>
                <span>Face</span>
                <strong>{faceSelecionada?.idFace ?? 'None'}</strong>
            </div>

            <div className={styles.linhaBotoes}>
                <button className={`${styles.botaoControle} ${styles.botaoControleComIcone} ${podeAplicarInset ? '' : styles.botaoControleBloqueado}`} type="button" aria-disabled={!podeAplicarInset} onClick={aplicaInsetFaces} title={motivoBloqueioInset ?? `${comandoInset.nome}${comandoInset.atalho === null ? '' : ` (${comandoInset.atalho})`}`}>
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
