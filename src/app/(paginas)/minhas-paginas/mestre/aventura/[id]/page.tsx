import { ContextoPaginaMestreAventuraProvider } from 'Contextos/ContextoMestreAventura/contexto';
import { PaginaMestreAventura_Contexto } from '../componentes';

export default async function PaginaMestreAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <ContextoPaginaMestreAventuraProvider idGrupoAventura={Number(id)}>
            <PaginaMestreAventura_Contexto />
        </ContextoPaginaMestreAventuraProvider>
    );
};