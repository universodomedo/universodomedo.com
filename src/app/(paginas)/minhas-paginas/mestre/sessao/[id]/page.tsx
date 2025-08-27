import { ContextoPaginaMestreSessaoProvider } from 'Contextos/ContextoMestreSessao/contexto';
import { PaginaMestreSessao_Contexto } from '../componentes';

export default async function PaginaMestreSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <ContextoPaginaMestreSessaoProvider idSessao={Number(id)}>
            <PaginaMestreSessao_Contexto />
        </ContextoPaginaMestreSessaoProvider>
    );
};