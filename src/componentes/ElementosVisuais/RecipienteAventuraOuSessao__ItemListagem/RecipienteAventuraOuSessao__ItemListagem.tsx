import styles from './styles.module.css';

import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function RecipienteAventuraOuSessao__ItemListagem({ destino, caminhoCapa, detalhePrincipal, detalheSecundario }: { destino: DestinoInput; caminhoCapa: string; detalhePrincipal?: string; detalheSecundario?: string; }) {
    return (
        <CustomLink className={styles.recipiente_item_imagem_aventura_mestre} inlineBlock={false} destino={destino}>
            <div className={styles.recipiente_imagem_aventura_mestre}>
                <RecipienteImagem src={caminhoCapa} />
            </div>
            {detalhePrincipal && <h4>{detalhePrincipal}</h4>}
            {detalheSecundario && <h5>{detalheSecundario}</h5>}
        </CustomLink>
    );
};