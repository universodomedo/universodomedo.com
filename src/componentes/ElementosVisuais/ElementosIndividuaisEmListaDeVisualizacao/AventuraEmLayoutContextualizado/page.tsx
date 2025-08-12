import styles from './styles.module.css';

import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

import { GrupoAventuraDto } from 'types-nora-api';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function AventuraEmLayoutContextualizado({ grupoAventura, href }: { grupoAventura: GrupoAventuraDto; href: string }) {
    return (
        <CustomLink className={styles.recipiente_item_imagem_aventura_mestre} href={href} inlineBlock={false}>
            <div className={styles.recipiente_imagem_aventura_mestre}>
                <RecipienteImagem src={grupoAventura.aventura.imagemCapa?.fullPath} />
            </div>
            <h4>{grupoAventura.nomeUnicoGrupoAventura}</h4>
        </CustomLink>
    );
};