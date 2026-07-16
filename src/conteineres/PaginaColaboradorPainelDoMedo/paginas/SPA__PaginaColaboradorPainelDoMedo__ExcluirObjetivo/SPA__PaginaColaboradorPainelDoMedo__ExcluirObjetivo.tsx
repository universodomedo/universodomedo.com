'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__ExcluirObjetivo() {
    const { objetivo, contagemCards, salvando, excluir, cancelar } = useContexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo();

    const bloqueado = contagemCards > 0;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <p className={styles.aviso}>Excluir o objetivo <strong>{objetivo.nome}</strong> é definitivo.</p>
                {bloqueado
                    ? <p className={styles.bloqueio}>Este objetivo ainda tem <strong>{contagemCards} card{contagemCards > 1 ? 's' : ''}</strong>. Exclua os cards antes de remover o objetivo.</p>
                    : <p className={styles.detalhe}>O objetivo está sem cards e pode ser excluído.</p>}
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="perigo" onClick={excluir} disabled={salvando || bloqueado}>{salvando ? 'Excluindo...' : 'Confirmar exclusão'}</button>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
