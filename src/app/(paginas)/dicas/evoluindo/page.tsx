import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS, EstruturaPaginaDefinicao } from 'types-nora-api';
import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';

export default async function PaginaDefinicao({ params }: { params: Promise<{ slug: string[] }>; }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    const conteudo: EstruturaPaginaDefinicao = {
        titulo: 'Edição de Ficha',
        subtitulo: 'Criando e Evoluindo seu Personagem',
        listaConteudo: {
            itens: [
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Com seu Personagem criado ou quando ele estiver evoluindo, você será notificado de Pendências de Evolução, que irão aparecer na página Meus Personagens'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Na página Evoluindo Personagens, você pode ver todos os seus Personagens que estão em processo de Evolução. Lembre-se que um Personagem que tenha Pendência de Evolução não pode participar de Sessões ou qualquer procedimento de jogo, como modificar Inventário, Habilidades ou se comunicar com outros personagens, estando em transe até o processo ser concluído'
                        }
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Quando evoluindo seu Personagem, você será recebido pelo Resumo Inicial, que exibe todas as etapas que você tem nessa Evolução'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Toda etapa que você começar terá Pontos Automáticos, Pontos Obrigatórios e Pontos Opcionais, que são exibidos na Janela de Notificação'
                        },
                        // {
                        //     tipo: 'Paragrafo',
                        //     conteudo: '(implementar visual da janela de notificação)'
                        // },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'E por fim, o processo de Evolução exibe um Resumo Final, mostrando todas as alterações que serão realizadas. A Edição da Ficha apenas acontece depois de finalizar o procedimento e ser redirecionado para fora da página de Evolução'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Toda Etapa e cada Elemento da sua Ficha devem ter um breve resumo e um atalho para visitar a respectiva Definição'
                        },
                    ]
                },
            ]
        }
    }

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.DICAS, comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaConteudoDinamico conteudo={conteudo} hrefInicio={'/dicas'} listaSlug={['evoluindo']} />
        </ControladorSlot>
    );
};