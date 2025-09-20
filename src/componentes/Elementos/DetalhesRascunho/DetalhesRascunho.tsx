import styles from './styles.module.css';

import { DetalhesRascunho_Conteudo_Botoes, DetalhesRascunho_Conteudo_Corpo } from './componentes';

export default function DetalhesRascunho_Conteudo() {
    return (
        <div id={styles.recipiente_detalhes_rascunho}>
            <DetalhesRascunho_Conteudo_Corpo />
            <div id={styles.recipiente_botoes_rascunho}>
                <DetalhesRascunho_Conteudo_Botoes />
            </div>
        </div>
    );
};