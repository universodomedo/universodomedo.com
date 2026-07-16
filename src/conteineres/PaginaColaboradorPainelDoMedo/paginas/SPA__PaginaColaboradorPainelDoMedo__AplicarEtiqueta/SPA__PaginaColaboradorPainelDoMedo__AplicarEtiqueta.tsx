'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__AplicarEtiqueta() {
    const { disponiveis, salvando, aplicar, irParaCriar, cancelar } = useContexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.lista}>
                    {disponiveis.length === 0 && <p className={styles.estado}>Nenhuma etiqueta disponível no catálogo. Crie a primeira.</p>}
                    {disponiveis.map(etiqueta => (
                        <button key={etiqueta.id} className={styles.item} onClick={() => aplicar(etiqueta.id)} disabled={salvando}>
                            <span className={styles.chip} style={{ background: etiqueta.cor, border: `0.12em solid ${etiqueta.corBorda}` }}>{etiqueta.nome}</span>
                        </button>
                    ))}
                </div>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={irParaCriar} disabled={salvando}>Criar nova etiqueta</button>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
