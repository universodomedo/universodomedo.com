import { EditorDicas_Client } from '../componentes';

export default async function PaginaEditorDicas({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    return <EditorDicas_Client listaSlug={listaSlug} />;
};
