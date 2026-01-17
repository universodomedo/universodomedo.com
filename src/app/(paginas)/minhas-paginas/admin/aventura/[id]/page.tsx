import { AdministrarAventura_Client } from "../componentes";

export default async function AdministrarAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return <AdministrarAventura_Client idGrupoAventura={Number(id)} />;
};