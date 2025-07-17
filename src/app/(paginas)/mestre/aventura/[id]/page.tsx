import { ContextoPaginaMestreAventuraProvider } from 'Contextos/ContextoMestreAventura/contexto';
import { PaginaMestreAventura_Slot } from './componentes';

export default async function PaginaMestreAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <ContextoPaginaMestreAventuraProvider idGrupoAventura={Number(id)}>
            <PaginaMestreAventura_Slot />
        </ContextoPaginaMestreAventuraProvider>
    );
};