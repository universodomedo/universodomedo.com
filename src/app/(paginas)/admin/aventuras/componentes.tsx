import Link from "next/link";

import { AventuraDto } from "types-nora-api";

export function AdministrarAventuras_ConteudoGeral({ aventuras }: { aventuras: AventuraDto[] }) {
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