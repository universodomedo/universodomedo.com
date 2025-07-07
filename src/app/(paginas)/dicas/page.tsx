import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS, EstruturaPaginaDefinicao } from 'types-nora-api';
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
                            etiqueta: 'Seu primeiro Personagem',
                            subPaginaDefinicao: '/dicas/comecando',
                            itemDeDuasColunas: true,
                        },
                        {
                            tipo: 'ItemLista',
                            etiqueta: 'Criando e Evoluindo seu Personagem',
                            subPaginaDefinicao: '/dicas/evoluindo',
                            itemDeDuasColunas: true,
                        }
                    ]
                },
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
                },
            ]
        }
    }

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.DICAS, comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaConteudoDinamico conteudo={conteudo} hrefInicio={'/dicas'} listaSlug={listaSlug} />
        </ControladorSlot>
    );
};