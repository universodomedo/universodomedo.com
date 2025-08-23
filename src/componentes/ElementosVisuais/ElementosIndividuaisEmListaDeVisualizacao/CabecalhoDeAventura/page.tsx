import styles from './styles.module.css';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function CabecalhoDeAventura({ pathCapa, titulo }: { pathCapa: string; titulo: string }) {
    return (
        <>
            <SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
                <RecipienteImagem src={pathCapa} />
            </SecaoDeConteudo>

            <SecaoDeConteudo id={styles.recipiente_nome_cabecalho_aventura}>
                <h1>{titulo}</h1>
            </SecaoDeConteudo>
        </>
    );
};