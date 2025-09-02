import styles from './styles.module.css';

import { RascunhoDto } from 'types-nora-api';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContextoMestreRascunhosSessoesUnicas } from 'Contextos/ContextoMestreRascunhosSessoesUnicas/contexto';

export default function RascunhoEmVisualizacao({ rascunho }: { rascunho: RascunhoDto }) {
    const { selecionaRascunho } = useContextoMestreRascunhosSessoesUnicas();
    
    return (
        <DivClicavel className={styles.recipiente_item_rascunho} desabilitado={!rascunho.detalheUtilizacaoRascunho.disponivel} classeParaDesabilitado={styles.rascunho_indisponivel} onClick={() => selecionaRascunho(rascunho.id)}>
        {/* <DivClicavel className={styles.recipiente_item_rascunho}> */}
            <div className={styles.recipiente_titulo_item_rascunho}>
                <h4>{rascunho.titulo}</h4>
            </div>

            <div className={styles.recipiente_detalhe_item_rascunho}>
                <h5>{rascunho.detalheUtilizacaoRascunho.detalhe}</h5>
            </div>
        </DivClicavel>
    );
};