import { obtemDadosSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AdministrarSessao_Slot } from '../componentes';

export default async function AdministrarSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const detalheSessao = await obtemDadosSessao(Number(id));

    if (!detalheSessao) return <div>Sessão não encontrada</div>

    return <AdministrarSessao_Slot detalheSessao={detalheSessao} />
};