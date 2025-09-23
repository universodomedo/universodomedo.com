'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { EstiloSessao, LinkDto, SessaoDto } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { ListaAcoesAdmin } from '../componentes';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import { useContextoCadastroNovoLinkSessao } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { ContextoCadastroNovoLinkSessaoProvider } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';

export function AdministrarSessao_Slot({ sessao }: { sessao: SessaoDto; }) {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo hrefPaginaRetorno={`/minhas-paginas/admin/aventura/${sessao.detalheSessaoAventura.grupoAventura.id}`}>
                <AdministrarSessao_Conteudo sessao={sessao} />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesAdmin />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function AdministrarSessao_Conteudo({ sessao }: { sessao: SessaoDto }) {
    return (
        <SecaoDeConteudo id={styles.recipiente_detalhes_sessao}>
            { sessao.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA
                ? <SessaoDeAventura sessao={sessao} />
                : sessao.estiloSessao == EstiloSessao.SESSAO_UNICA_CANONICA || sessao.estiloSessao == EstiloSessao.SESSAO_UNICA_NAO_CANONICA ? <SessaoUnica sessao={sessao} />
                : <></>
            }
        </SecaoDeConteudo>
    );
};

function SessaoDeAventura({ sessao }: { sessao: SessaoDto }) {
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

function SessaoUnica({ sessao }: { sessao: SessaoDto }) {
    return (
        <></>
    );
};

function AreaVideoYoutube({ linkVideo }: { linkVideo: LinkDto }) {
    const { iniciaProcessoVinculoLinkSessao } = useContextoCadastroNovoLinkSessao();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkVideo ? (
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
                {linkPodcast ? (
                    <Link href={linkPodcast.urlCompleta} target='_blank'><p>Tem Podcast</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLinkSessao(4)}>Configurar Podcast</button>
                )}
            </div>
        </>
    );
};