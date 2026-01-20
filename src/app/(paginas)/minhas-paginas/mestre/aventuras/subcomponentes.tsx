'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function AventurasMestre_ConteudoGeral() {
    const { gruposAventurasListadas } = useContextoMestreAventuras();

    return (
        <div id={styles.recipiente_aventuras_mestre}>
            {gruposAventurasListadas!.map(grupo => (
                <LinkInterno key={grupo.id} className={styles.recipiente_item_imagem_aventura_mestre} destino={{ pagina: PAGINAS.minhasPaginas.mestre.aventura, params: { id: String(grupo.id) } }}>
                    <div className={styles.recipiente_imagem_aventura_mestre}>
                        <RecipienteImagem src={grupo.aventura.imagemCapa?.fullPath} />
                    </div>
                    <h4>{grupo.nomeUnicoGrupoAventura}</h4>
                </LinkInterno>
            ))}
        </div>
    );
};