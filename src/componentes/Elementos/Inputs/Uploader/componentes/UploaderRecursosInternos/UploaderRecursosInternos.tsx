'use client';

import styles from './styles.module.css';

import { useContextoUploadImagem } from 'Contextos/ContextoUploadImagem/contexto';
import Uploader from '../../Uploader';

export default function UploaderRecursosInternos() {
    const { recursosInternos, isCarregando } = useContextoUploadImagem();
    if (!recursosInternos) throw new Error('UploaderRecursosInternos precisa de contexto recursosInternos');

    return (
        <>
            <Uploader />

            <div className={styles.recipiente_input_texto_recurso_interno}>
                <label className={styles.label_input_recurso_interno}>Nome do recurso *</label>
                <input className={styles.input_recurso_interno} type="text" value={recursosInternos.nome} onChange={(e) => recursosInternos.setNome(e.target.value)} disabled={isCarregando} placeholder="Ex: IMAGEM__PAGINA_TESTE__BOTAO_PRINCIPAL" />
                {recursosInternos.erro ? <div className={styles.erro_recurso_interno} aria-live="polite">{recursosInternos.erro}</div> : null}
            </div>
        </>
    );
};