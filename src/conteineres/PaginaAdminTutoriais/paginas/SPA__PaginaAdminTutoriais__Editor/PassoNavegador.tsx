import styles from './PassoNavegador.module.css';

import { useContexto__PaginaAdminTutoriais__Editor } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/contexto';

export default function PassoNavegador() {
    const editor = useContexto__PaginaAdminTutoriais__Editor();
    const passos = editor.acoes.passos;
    const ativoId = editor.selecao.passoAtivoId;

    return (
        <div className={styles.navegador}>
            {passos.map((passo, indice) => (
                <button key={passo.idLocal} type="button" className={passo.idLocal === ativoId ? styles.aba_ativa : styles.aba} onClick={() => editor.selecao.selecionaPasso(passo.idLocal)}>Passo {indice + 1}</button>
            ))}
            <button type="button" className={styles.acao} onClick={editor.acoes.adicionaPasso}>+ Passo</button>
            {ativoId !== null && <button type="button" className={styles.acao} onClick={() => editor.acoes.reordenaPasso(ativoId, 'cima')}>↑</button>}
            {ativoId !== null && <button type="button" className={styles.acao} onClick={() => editor.acoes.reordenaPasso(ativoId, 'baixo')}>↓</button>}
            {ativoId !== null && <button type="button" className={styles.acao} disabled={passos.length <= 1} onClick={() => editor.acoes.removePasso(ativoId)}>Remover Passo</button>}
        </div>
    );
};
