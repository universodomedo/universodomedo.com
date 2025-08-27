'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { DetalheSessaoCanonicaDto, LinkDto } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { ListaAcoesAdmin } from '../componentes';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import { useContextoCadastroNovoLinkSessao } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { ContextoCadastroNovoLinkSessaoProvider } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';

export function AdministrarSessao_Slot({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto; }) {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo hrefPaginaRetorno={`/admin/aventura/${detalheSessao.grupoAventura!.id}`}>
                <AdministrarSessao_Conteudo detalheSessao={detalheSessao} />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesAdmin />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function AdministrarSessao_Conteudo({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto }) {
    return (
        <SecaoDeConteudo id={styles.recipiente_detalhes_sessao}>
            { detalheSessao.grupoAventura ? <SessaoDeAventura detalheSessao={detalheSessao} /> : <SessaoUnica detalheSessao={detalheSessao} /> }
        </SecaoDeConteudo>
    );
};

function SessaoDeAventura({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto }) {
    if (!detalheSessao.grupoAventura) return <></>; // ja verificado

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