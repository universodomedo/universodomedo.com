import { PAGINAS, EstruturaPaginaDefinicao } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import PaginaConteudoDinamico, { InicioProps } from 'Componentes/Elementos/PaginaConteudoDinamico/page';

export function PaginaDefinicao_Client({ listaSlug }: { listaSlug: string[]; }) {
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
                            // itemDeDuasColunas: true,
                        },
                        {
                            tipo: 'ItemLista',
                            etiqueta: 'Criando e Evoluindo seu Personagem',
                            subPaginaDefinicao: '/dicas/evoluindo',
                            // itemDeDuasColunas: true,
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

    return <ControladorSlot_TEMPORARIO_Dicas conteudo={conteudo} inicio={{ pagina: PAGINAS.dicas }} listaSlug={listaSlug} />;
};

export function ControladorSlot_TEMPORARIO_Dicas({ conteudo, inicio, listaSlug }: { conteudo: EstruturaPaginaDefinicao; inicio: InicioProps<typeof PAGINAS.dicas>; listaSlug: string[]; }) {
    return (
        <ControladorSlot pagina={PAGINAS.dicas}>
            <PaginaConteudoDinamico conteudo={conteudo} inicio={inicio} listaSlug={listaSlug} />
        </ControladorSlot>
    );
};