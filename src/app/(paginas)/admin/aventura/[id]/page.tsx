import { AdministrarAventura_ConteudoGeral } from '../componentes';
import { buscaGrupoAventuraEspecifico } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { LayoutVisualizacaoPadrao_ConteudoGeral, LayoutVisualizacaoPadrao_ConteudoMenu } from 'Contextos/ContextoLayoutVisualizacaoPadrao/hooks';
import { ListaAcoesAdmin } from '../../componentes';

export default async function AdministrarAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const aventura = await buscaGrupoAventuraEspecifico(Number(id));

    if (!aventura) return <div>Aventura não encontrada</div>

    return (
        <>
            <LayoutVisualizacaoPadrao_ConteudoGeral proporcaoFlex={0.9} hrefPaginaVoltar={'/admin/aventuras'}>
                <AdministrarAventura_ConteudoGeral aventura={aventura} />
            </LayoutVisualizacaoPadrao_ConteudoGeral>

            <LayoutVisualizacaoPadrao_ConteudoMenu>
                <ListaAcoesAdmin />
            </LayoutVisualizacaoPadrao_ConteudoMenu>
        </>
    );
};