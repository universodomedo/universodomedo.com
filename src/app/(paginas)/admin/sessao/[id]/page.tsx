import styles from '../styles.module.css';

import { obtemDadosSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { ContextoCadastroNovoLinkSessaoProvider } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { AreaVideoYoutube, AreaPodcastSpotify } from '../componentes';
import { DetalheSessaoCanonicaDto } from 'types-nora-api';

export default async function AdministrarSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const detalheSessao = await obtemDadosSessao(Number(id));

    if (!detalheSessao) return <div>Sessão não encontrada</div>

    return detalheSessao.grupoAventura ? <SessaoDeAventura detalheSessao={detalheSessao} /> : <SessaoUnica detalheSessao={detalheSessao} />;
};

function SessaoDeAventura({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto }) {
    // ja verificado
    if (!detalheSessao.grupoAventura) return <></>;

    return (
        <ContextoCadastroNovoLinkSessaoProvider detalheSessao={detalheSessao} idGrupoAventura={detalheSessao.grupoAventura.id}>
            <div id={styles.recipiente_acoes_aventura}>
                <div>
                    <h1>{detalheSessao.episodioPorExtenso}</h1>
                    <h3>{detalheSessao.grupoAventura.aventura.titulo} - {detalheSessao.grupoAventura.nome}</h3>
                </div>

                <AreaVideoYoutube linkVideo={detalheSessao.linkSessaoYoutube} />

                <AreaPodcastSpotify linkPodcast={detalheSessao.linkSessaoSpotify} />
            </div>
        </ContextoCadastroNovoLinkSessaoProvider>
    );
};

function SessaoUnica({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto }) {
    return (
        <></>
    );
};