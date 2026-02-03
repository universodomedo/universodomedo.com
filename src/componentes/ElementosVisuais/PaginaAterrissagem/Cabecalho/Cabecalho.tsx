import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';
import ComponenteBotaoAcessar from 'Componentes/ElementosVisuais/BotaoAcessar/botao-acessar';

export default function SecaoCabecalho() {
    return (
        <div className={styles.cabecalho}>
            <div id={styles.cabecalho_esquerda}>
                <div id={styles.recipiente_logo}>
                    <LinkInterno destino={PAGINAS.home}>
                        <RecipienteArquivoInterno arquivo={'LOGO'} className={styles.arquivo_logo} />
                    </LinkInterno>
                </div>
            </div>

            <div id={styles.cabecalho_direita}>
                <div id={styles.cabecalho_direita_linha}>
                    <div className={styles.linha} />
                </div>
                <div id={styles.cabecalho_direita_acesso}>
                    <ComponenteBotaoAcessar />
                </div>
            </div>
        </div>
    );
};