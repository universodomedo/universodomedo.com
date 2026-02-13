import styles from './styles.module.css';

import { GrupoAventuraDto } from 'types-nora-api';

import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function AventuraEmLayoutContextualizado({ grupoAventura, destino, escondeEstado = false }: { grupoAventura: GrupoAventuraDto; destino: DestinoInput; escondeEstado?: boolean }) {
    return (
        <CustomLink className={styles.recipiente_item_imagem_aventura_mestre} inlineBlock={false} destino={destino}>
            <div className={styles.recipiente_imagem_aventura_mestre}>
                <RecipienteImagem src={grupoAventura.aventura.imagemCapa?.fullPath} />
            </div>
            <h4>{grupoAventura.nomeUnicoGrupoAventura}</h4>
            {!escondeEstado && <h5>{grupoAventura.estadoAtual}</h5>}
        </CustomLink>
    );
};