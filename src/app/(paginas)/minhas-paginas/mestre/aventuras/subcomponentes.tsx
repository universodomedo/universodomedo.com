'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export function AventurasMestre_ConteudoGeral() {
    const { gruposAventurasListadas } = useContextoMestreAventuras();

    return (
        <div className={styles.recipiente_aventuras_mestre}>
            {gruposAventurasListadas!.map(grupoAventura => (
                <LinkInterno key={grupoAventura.id} className={styles.recipiente_item_imagem_aventura_mestre} destino={{ pagina: PAGINAS.minhasPaginas.mestre.aventura, params: { id: String(grupoAventura.id) } }}>
                    <div className={styles.recipiente_imagem_aventura_mestre}>
                        <RenderArquivoArteCapa caminhoArquivoArte={grupoAventura.dadosArteCapa.caminhoArquivoArteCapa} />
                    </div>
                    <h4>{grupoAventura.nomeUnicoGrupoAventura}</h4>
                </LinkInterno>
            ))}
        </div>
    );
};