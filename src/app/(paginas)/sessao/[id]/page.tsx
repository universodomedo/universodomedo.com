import { PaginaSessao_Client } from '../componentes';

export default async function PaginaSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return <PaginaSessao_Client idSessao={Number(id)} />;
};