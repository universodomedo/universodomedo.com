import styles from './styles.module.css';

import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

import { GrupoAventuraDto } from 'types-nora-api';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function AventuraEmLayoutContextualizado({ grupoAventura, href, escondeEstado = false }: { grupoAventura: GrupoAventuraDto; href: string; escondeEstado?: boolean }) {
    return (
        <CustomLink className={styles.recipiente_item_imagem_aventura_mestre} href={href} inlineBlock={false}>
            <div className={styles.recipiente_imagem_aventura_mestre}>
                <RecipienteImagem src={grupoAventura.aventura.imagemCapa?.fullPath} />
            </div>
            <h4>{grupoAventura.nomeUnicoGrupoAventura}</h4>
            {!escondeEstado && <h5>{grupoAventura.estadoAtual}</h5>}
        </CustomLink>
    );
};