'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { PAGINAS, LinkCompletaDto, SessaoCompletaDto } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaAdminSessaoProvider, useContextoPaginaAdminSessao } from 'Contextos/ContextoPaginaAdminSessao/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import { ContextoCadastroNovoLinkSessaoProvider, useContextoCadastroNovoLinkSessao } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';

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
    // to do
    // useConfigurarLayoutContextualizado({ fecharProps: { tipo: 'href', paginaRetorno: { pagina: PAGINAS.minhasPaginas.admin.aventura, params: { id: String(sessao.detalheSessaoAventura.grupoAventura.id) } }, tituloTooltip: 'Voltar' } });

    return (
        <SecaoDeConteudo id={styles.recipiente_detalhes_sessao}>
            <ContextoCadastroNovoLinkSessaoProvider sessao={sessao}>
                <SessaoLayout sessao={sessao} />
            </ContextoCadastroNovoLinkSessaoProvider>
        </SecaoDeConteudo>
    );
};

function SessaoLayout({ sessao }: { sessao: SessaoCompletaDto; }) {
    return (
        <div id={styles.recipiente_acoes_aventura}>
            <div>
                {/* to do, colocar propriedade em SessaoEntidade para obter a exibicao da sessao */}
                {/* {sessao.tipo === 'AVENTURA'
                    ? <>
                        <h1>{sessao.detalheSessaoAventura.episodioPorExtenso}</h1>
                        <h3>{sessao.detalheSessaoAventura.grupoAventura.aventura.titulo} - {sessao.detalheSessaoAventura.grupoAventura.nome}</h3>
                    </>
                    : <h1>{sessao.tituloInteligente.tituloCompleto}</h1>
                } */}
            </div>

            {(sessao.tipo === 'AVENTURA' || sessao.tipo === 'SESSAO_UNICA_CANONICA') && (
                <>
                    {/* <AreaVideoYoutube linkVideo={sessao.detalheSessaoCanonica.linkSessaoYoutube} />

                    <AreaPodcastSpotify linkPodcast={sessao.detalheSessaoCanonica.linkSessaoSpotify} /> */}
                </>
            )}
        </div>
    );
}

function AreaVideoYoutube({ linkVideo }: { linkVideo: LinkCompletaDto }) {
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

function AreaPodcastSpotify({ linkPodcast }: { linkPodcast: LinkCompletaDto }) {
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