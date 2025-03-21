import { EstruturaPaginaDefinicao } from 'types-nora-api';

import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';

export default async function PaginaDefinicao({ params }: { params: { chave?: string[] } }) {
    const { chave } = await params;
    const listaChaves = chave || [];

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
                        }
                    ]
                }
            ]
        }
    }

    return <PaginaConteudoDinamico conteudo={conteudo} listaChaves={listaChaves} />
};