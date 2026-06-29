import { PaginaDica_Client } from '../componentes';

export default async function PaginaDica({ params }: { params: Promise<{ slug: string[] }>; }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    return <PaginaDica_Client listaSlug={listaSlug} />;
}
