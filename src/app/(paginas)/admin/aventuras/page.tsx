import Link from "next/link";
import { obtemTodasAventuras } from "Uteis/ApiConsumer/ConsumerMiddleware";

export default async function AdministrarAventuras() {
    const aventuras = await obtemTodasAventuras();

    return (
        <>
            {aventuras.flatMap(aventura =>
                aventura.gruposAventura?.sort((a, b) => b.id - a.id).map(grupo => (
                    <Link key={grupo.id} href={`/admin/aventura/${grupo.id}`}>
                        <h1>{aventura.titulo}{!aventura.temApenasUmGrupo && ` ${grupo.nome}`}</h1>
                    </Link>
                )) || []
            )}
        </>
    );
};