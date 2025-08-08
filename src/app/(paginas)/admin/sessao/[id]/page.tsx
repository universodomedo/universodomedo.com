import { obtemDadosSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { ContextoCadastroNovoLinkSessaoProvider } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { AreaVideoYoutube, AreaPodcastSpotify, AdministrarSessao_ConteudoGeral } from '../componentes';
import { DetalheSessaoCanonicaDto } from 'types-nora-api';

export default async function AdministrarSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const detalheSessao = await obtemDadosSessao(Number(id));

    if (!detalheSessao) return <div>Sessão não encontrada</div>

    return <AdministrarSessao_ConteudoGeral detalheSessao={detalheSessao} />
};