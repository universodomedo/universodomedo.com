import { obtemSessaoGeral } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AdministrarSessao_Slot } from '../componentes';

export default async function AdministrarSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const sessao = await obtemSessaoGeral(Number(id));

    if (!sessao) return <div>Sessão não encontrada</div>

    return <AdministrarSessao_Slot sessao={sessao} />
};