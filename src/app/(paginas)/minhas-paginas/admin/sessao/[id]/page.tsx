import { AdministrarSessao_Client } from '../componentes';

export default async function AdministrarSessao({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return <AdministrarSessao_Client idSessao={Number(id)} />;
};