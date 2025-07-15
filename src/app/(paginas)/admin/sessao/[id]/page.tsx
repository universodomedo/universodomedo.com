import styles from '../styles.module.css';

import { obtemDadosSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { ContextoCadastroNovoLinkProvider } from 'Contextos/ContextoCadastroNovoLink/contexto';
import { AreaVideoYoutube, AreaPodcastSpotify } from '../componentes';

export default async function AdministrarSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const sessao = await obtemDadosSessao(Number(id));

    if (!sessao) return <div>Sessão não encontrada</div>

    return (
        <ContextoCadastroNovoLinkProvider sessao={sessao} idGrupoAventura={sessao.grupoAventura.id}>
            <div id={styles.recipiente_acoes_aventura}>
                <div>
                    <h1>{sessao.episodioPorExtenso}</h1>
                    <h3>{sessao.grupoAventura.aventura.titulo} - {sessao.grupoAventura.nome}</h3>
                </div>

                <AreaVideoYoutube linkVideo={sessao.linkSessaoYoutube} />

                <AreaPodcastSpotify linkPodcast={sessao.linkSessaoSpotify} />
            </div>
        </ContextoCadastroNovoLinkProvider>
    );
};