import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS, EstruturaPaginaDefinicao } from 'types-nora-api';
import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';

export default async function PaginaDefinicao({ params }: { params: Promise<{ slug: string[] }>; }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    const conteudo: EstruturaPaginaDefinicao = {
        titulo: 'Seu primeiro Personagem',
        listaConteudo: {
            itens: [
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Bem Vindo ao Universo do Medo!'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Para criar seu primeiro Personagem, você vai precisar de um Convite, seja para uma Sessão Única ou uma Aventura'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Quando você for convidado, o convite e o procedimento de criação ficaram disponíveis na página Meus Personagens'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Lembre-se que as páginas de Definições e Dicas tem diversas informações valiosas que vão esclarecer dúvidas e servir de referência durante o desenvolvimento de seus personagens'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Algumas informações mais avançadas precisam ser desbloqueadas para ter acesso, então se alguma mecânica de jogo mencionada não estiver esclarecida ou alguma dúvida surgir após visitar as páginas mencionadas, entre em contato com a Direção'
                        },
                    ]
                },
            ]
        }
    }

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.DICAS, comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaConteudoDinamico conteudo={conteudo} hrefInicio={'/dicas'} listaSlug={['comecando']} />
        </ControladorSlot>
    );
};