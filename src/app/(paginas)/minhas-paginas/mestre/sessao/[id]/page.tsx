import { PaginaMestreSessao_Client } from '../componentes';

export default async function PaginaMestreSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return <PaginaMestreSessao_Client idSessao={Number(id)} />;
};