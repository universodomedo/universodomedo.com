import { ControladorSlot } from 'Layouts/ControladorSlot';

import { EstruturaPaginaDefinicao } from 'types-nora-api';
import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';

export default async function PaginaDefinicao({ params }: { params: Promise<{ slug: string[] }>; }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    const conteudo: EstruturaPaginaDefinicao = {
        titulo: 'Dicas',
        listaConteudo: {
            itens: [
                {
                    tipo: 'Lista',
                    itensLista: [
                        {
                            tipo: 'ItemLista',
                            etiqueta: 'Disponibilidades',
                            subPaginaDefinicao: '/dicas/disponibilidades'
                        },
                        {
                            tipo: 'ItemLista',
                            etiqueta: 'Termos de Aceite',
                            subPaginaDefinicao: '/dicas/termos-de-aceite'
                        },
                    ]
                }
            ]
        }
    }

    return (
        <ControladorSlot pageConfig={{ comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaConteudoDinamico conteudo={conteudo} listaSlug={listaSlug} />
        </ControladorSlot>
    );
};