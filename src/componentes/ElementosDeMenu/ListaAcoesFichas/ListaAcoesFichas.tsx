'use client';

import styles from '../styles.module.css';

import { useContextoPaginaFichasTemporarias } from 'Contextos/ContextoPaginaFichasTemporarias/contexto';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export default function ListaAcoesFichas() {
    const { fichasTemporarias, setIdFichaTemporariaSelecionada, fichaTemporariaSelecionada } = useContextoPaginaFichasTemporarias();

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
                            <DivClicavel key={fichaTemporaria.id} className={styles.recipiente_item_ficha_temporaria} classeParaDesabilitado={styles.ativo} desabilitado={fichaTemporaria.id === fichaTemporariaSelecionada?.id} onClick={() => setIdFichaTemporariaSelecionada(fichaTemporaria.id)}>
                                <h2>{fichaTemporaria.nome}</h2>
                            </DivClicavel>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};