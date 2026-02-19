'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { PAGINAS, LinkDto } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaAdminSessaoProvider, useContextoPaginaAdminSessao } from 'Contextos/ContextoPaginaAdminSessao/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import { ContextoCadastroNovoLinkSessaoProvider } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { useContextoCadastroNovoLinkSessao } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';

export function AdministrarSessao_Client({ idSessao }: { idSessao: number; }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.sessao}>
            <ContextoPaginaAdminSessaoProvider idSessao={idSessao}>
                <AdministrarSessao_Conteudo />
            </ContextoPaginaAdminSessaoProvider>
        </ControladorSlot>
    );
};

function AdministrarSessao_Conteudo() {
    const { sessao } = useContextoPaginaAdminSessao();
    useConfigurarLayoutContextualizado({ fecharProps: { tipo: 'href', paginaRetorno: { pagina: PAGINAS.minhasPaginas.admin.aventura, params: { id: String(sessao.detalheSessaoAventura.grupoAventura.id) } }, tituloTooltip: 'Voltar' } });

    return (
        <SecaoDeConteudo id={styles.recipiente_detalhes_sessao}>
            {sessao.tipo == 'AVENTURA'
                ? <SessaoDeAventura />
                : sessao.tipo == 'SESSAO_UNICA_CANONICA' || sessao.tipo == 'SESSAO_UNICA_NAO_CANONICA' ? <SessaoUnica />
                    : <></>
            }
        </SecaoDeConteudo>
    );
};

function SessaoDeAventura() {
    const { sessao } = useContextoPaginaAdminSessao();

    return (
        <ContextoCadastroNovoLinkSessaoProvider sessao={sessao}>
            <div id={styles.recipiente_acoes_aventura}>
                <div>
                    <h1>{sessao.detalheSessaoAventura.episodioPorExtenso}</h1>
                    <h3>{sessao.detalheSessaoAventura.grupoAventura.aventura.titulo} - {sessao.detalheSessaoAventura.grupoAventura.nome}</h3>
                </div>

                <AreaVideoYoutube linkVideo={sessao.detalheSessaoCanonica.linkSessaoYoutube} />

                <AreaPodcastSpotify linkPodcast={sessao.detalheSessaoCanonica.linkSessaoSpotify} />
            </div>
        </ContextoCadastroNovoLinkSessaoProvider>
    );
};

function SessaoUnica() {
    return (
        <></>
    );
};

function AreaVideoYoutube({ linkVideo }: { linkVideo: LinkDto }) {
    const { iniciaProcessoVinculoLinkSessao } = useContextoCadastroNovoLinkSessao();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkVideo && linkVideo.urlCompleta ? (
                    <Link href={linkVideo.urlCompleta} target='_blank'><p>Tem Vídeo</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLinkSessao(2)}>Configurar Vídeo</button>
                )}
            </div>
        </>
    );
};

function AreaPodcastSpotify({ linkPodcast }: { linkPodcast: LinkDto }) {
    const { iniciaProcessoVinculoLinkSessao } = useContextoCadastroNovoLinkSessao();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkPodcast && linkPodcast.urlCompleta ? (
                    <Link href={linkPodcast.urlCompleta} target='_blank'><p>Tem Podcast</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLinkSessao(4)}>Configurar Podcast</button>
                )}
            </div>
        </>
    );
};