import styles from '../styles.module.css';

import { obtemGrupoAventuraParaAssistir } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AreaEpisodios, AreaLinkTrailer } from '../componentes';

export default async function AdministrarAventura ({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const aventura = await obtemGrupoAventuraParaAssistir(Number(id));

    if (!aventura) return <div>Aventura não encontrada</div>

    return (
        <div id={styles.recipiente_acoes_aventura}>
            <h1>{aventura.titulo} - {aventura.gruposAventura![0].nome}</h1>

            <AreaLinkTrailer linkTrailer={aventura.gruposAventura![0].linkTrailerYoutube} />

            <AreaEpisodios episodios={aventura.gruposAventura![0].sessoes} />
        </div>
    );
};