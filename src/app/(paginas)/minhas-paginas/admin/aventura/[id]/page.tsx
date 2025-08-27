import { AdministrarAventura_Slot } from '../componentes';
import { buscaGrupoAventuraEspecifico } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default async function AdministrarAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const grupoAventura = await buscaGrupoAventuraEspecifico(Number(id));

    if (!grupoAventura) return <div>Aventura não encontrada</div>

    return (
        <AdministrarAventura_Slot grupoAventura={grupoAventura} />
    );
};