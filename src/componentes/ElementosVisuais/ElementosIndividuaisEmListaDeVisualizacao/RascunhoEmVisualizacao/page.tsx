import styles from './styles.module.css';

import { RascunhoDto } from 'types-nora-api';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export default function RascunhoEmVisualizacao({ rascunho }: { rascunho: RascunhoDto }) {
    return (
        <DivClicavel className={styles.recipiente_item_rascunho} desabilitado={!rascunho.detalheRascunho.disponivel} classeParaDesabilitado={styles.rascunho_indisponivel} onClick={() => console.log(`teste`)}>
        {/* <DivClicavel className={styles.recipiente_item_rascunho}> */}
            <div className={styles.recipiente_titulo_item_rascunho}>
                <h4>{rascunho.titulo}</h4>
            </div>

            <div className={styles.recipiente_detalhe_item_rascunho}>
                <h5>{rascunho.detalheRascunho.detalhe}</h5>
            </div>
        </DivClicavel>
    );
};