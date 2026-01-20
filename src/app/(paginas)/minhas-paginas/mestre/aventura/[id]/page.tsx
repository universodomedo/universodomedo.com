import { PaginaMestreAventura_Client } from '../componentes';

export default async function PaginaMestreAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return <PaginaMestreAventura_Client idGrupoAventura={Number(id)} />;
};