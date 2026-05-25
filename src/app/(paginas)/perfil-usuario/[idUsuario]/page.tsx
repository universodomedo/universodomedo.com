import { notFound } from 'next/navigation';

import PaginaVisualizacaoPerfilUsuario_Client from './componentes';

export default function PaginaVisualizacaoPerfilUsuarioSlug({ params: { idUsuario } }: { params: { idUsuario: string; }; }) {
    const idUsuarioNumerico = Number(idUsuario);

    if (!Number.isInteger(idUsuarioNumerico) || idUsuarioNumerico <= 0) notFound();

    return <PaginaVisualizacaoPerfilUsuario_Client idUsuario={idUsuarioNumerico} />;
};