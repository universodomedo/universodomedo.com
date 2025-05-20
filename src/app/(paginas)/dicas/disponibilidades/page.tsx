import { ControladorSlot } from 'Layouts/ControladorSlot';

import { EstruturaPaginaDefinicao } from 'types-nora-api';
import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';

export default async function PaginaDefinicao({ params }: { params: Promise<{ slug: string[] }>; }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    const conteudo: EstruturaPaginaDefinicao = {
        titulo: 'Disponibilidades',
        listaConteudo: {
            itens: [
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'As Disponibilidades são muito importantes para mantermos o bem estar de uma aventura. Quando você estiver procurando por uma aventura, serão abertas algumas disponibilidades nas quais serão encaixadas a rotina de sessões'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'As Disponibilidades vigentes no momento são válidas de 30/03 até 03/08. Se você não conseguir se comprometer com a rotina semanal de uma disponibilidade, você não pode participar da aventura dessa disponibilidade, tendo em vista que faltas e atrasos recorrentes podem atribuir penalidades à você, desde exclusão da aventura, remoção do personagem, até banimento da plataforma'
                        }
                    ]
                }
            ]
        }
    }

    return (
        <ControladorSlot pageConfig={{ comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaConteudoDinamico conteudo={conteudo} hrefInicio={'/dicas'} listaSlug={['Disponibilidades']} />
        </ControladorSlot>
    );
};