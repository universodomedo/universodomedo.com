import { PaginaDefinicao_Client } from "./componentes";

export default async function PaginaDefinicao({ params }: { params: Promise<{ slug: string[] }>; }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    return <PaginaDefinicao_Client listaSlug={listaSlug} />;
}