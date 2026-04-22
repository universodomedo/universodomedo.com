import styles from './styles.module.css';

import { CaminhoArquivoArte } from 'types-nora-api';

import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function RecipienteAventuraOuSessao__ItemListagem({ destino, caminhoArquivoArte, detalhePrincipal, detalheSecundario }: { destino: DestinoInput; caminhoArquivoArte: CaminhoArquivoArte; detalhePrincipal?: string; detalheSecundario?: string; }) {
    return (
        <CustomLink className={styles.recipiente_item_imagem_aventura_mestre} inlineBlock={false} destino={destino}>
            <div className={styles.recipiente_imagem_aventura_mestre}>
                <RenderArquivoArteCapa caminhoArquivoArte={caminhoArquivoArte} />
            </div>
            {detalhePrincipal && <h4>{detalhePrincipal}</h4>}
            {detalheSecundario && <h5>{detalheSecundario}</h5>}
        </CustomLink>
    );
};