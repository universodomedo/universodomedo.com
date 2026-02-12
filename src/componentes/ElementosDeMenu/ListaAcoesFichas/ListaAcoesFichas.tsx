'use client';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import styles from '../styles.module.css';

import { useContextoPaginaFichas } from 'Contextos/ContextoPaginaFichas/contexto';

export default function ListaAcoesFichas() {
    const { fichasTemporarias, setIdFichaSelecionada, fichaSelecionada } = useContextoPaginaFichas();

    return (
        <div id={styles.recipiente_lista_acoes}>
            <div className={styles.recipiente_item_lista_acoes}>
                <h2 className={styles.titulo_permissao}>Buscar Ficha</h2>
            </div>

            <hr className={styles.divisor} />

            <div className={styles.recipiente_item_lista_acoes}>
                <div className={styles.recipiente_item_lista_acoes}>
                    <h2 className={styles.titulo_permissao}>Fichas Temporárias</h2>
                    <div className={styles.recipiente_lista_fichas_temporarias}>
                        {fichasTemporarias.map(fichaTemporaria => (
                            <DivClicavel key={fichaTemporaria.id} className={styles.recipiente_item_ficha_temporaria} classeParaDesabilitado={styles.ativo} desabilitado={fichaTemporaria.ficha.id === fichaSelecionada?.id} onClick={() => setIdFichaSelecionada(fichaTemporaria.ficha.id)}>
                                <h2>{fichaTemporaria.nome}</h2>
                            </DivClicavel>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};