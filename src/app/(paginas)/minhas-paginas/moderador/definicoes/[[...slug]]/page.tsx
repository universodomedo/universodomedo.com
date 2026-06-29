import { EditorDefinicoes_Client } from '../componentes';

export default async function PaginaEditorDefinicoes({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    return <EditorDefinicoes_Client listaSlug={listaSlug} />;
};