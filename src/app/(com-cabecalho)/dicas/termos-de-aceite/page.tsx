import { EstruturaPaginaDefinicao } from 'types-nora-api';

import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';

export default async function PaginaDefinicao({ params }: { params: { chave?: string[] } }) {
    const { chave } = await params;
    const listaChaves = chave || [];

    const conteudo: EstruturaPaginaDefinicao = {
        titulo: 'Termos de Aceite',
        subtitulo: 'Os termos podem ser confirmados quando acessando a plataforma pela primeira vez',
        listaConteudo: {
            itens: [
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'O Universo do Medo é uma experiência narrativa que busca representar a realidade de forma dramática e imersiva. Por esse motivo, as aventuras podem conter temas e elementos restritos para maiores de 16 anos'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Cada aventura e cada temática podem abordar diferentes níveis de conteúdo sensível, incluindo, mas não se limitando à:'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Alerta de Conteúdo Sensível!'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Se a presença de algum desses temas for um fator determinante para sua experiência, o Universo do Medo pode não ser um ambiente confortável para você. Caso tenha dúvidas, entre em contato com a Direção antes de prosseguir'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: '— Descrições detalhadas de ferimentos, incluindo mutilações e outras lesões graves;'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: '— Temas ligados a traumas, como água, insetos, assombrações, espaços confinados e sangue;'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: '— Efeitos sonoros fragmentados, sussurrantes ou alarmantes;'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: '— Representação de transtornos psicológicos e emocionais, incluindo depressão, sociopatia, psicopatia e ansiedade;'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: '— Menções a suicídio, violência sexual, conflitos sociais e tortura física/psicológica;'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: '— Uso de substâncias e outros vícios;'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: '— Discussões filosóficas e existenciais;'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Em cada aventura, os temas abordados serão previamente sinalizados e esclarecidos novamente na Etapa de Confirmação de Aventura, garantindo que os jogadores tenham plena consciência do conteúdo antes de participar'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Nosso compromisso é contar histórias que se ancorem firmemente na realidade. Os temas abordados no Universo do Medo estão presentes em diversas mídias e na vida real. Esta plataforma não promove, incentiva ou romantiza qualquer um desses comportamentos em nenhum contexto'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: '-'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'O Universo do Medo não é apenas um jogo — é uma experiência social. Para que todos possam participar plenamente e utilizar nossas ferramentas de forma saudável, é essencial que o ambiente seja acolhedor e respeitoso'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Para preservar o bem-estar da comunidade, nomes impróprios ou de duplo sentido, bem como imagens que não representem adequadamente seu personagem ou sejam inapropriadas, não serão permitidos. Nossa equipe de Moderação atua ativamente para garantir o cumprimento dessas diretrizes, podendo revisar e revogar conteúdos que violem esse princípio'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'O espaço e as ferramentas disponibilizadas são exclusivamente para jogar e discutir o Universo do Medo. Esta é uma plataforma gratuita e utilizá-la para outras finalidades demonstra desrespeito com nossa Direção e com a comunidade'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'O que acontece fora do Universo do Medo está além do nosso controle, mas pedimos que evitem discussões polêmicas e o uso da plataforma para outros jogos ou sistemas'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Não será tolerado qualquer forma de preconceito, discurso de ódio ou atividades alheias ao Universo do Medo. Independentemente de diferenças pessoais, todos aqui buscam o mesmo nível de qualidade e comprometimento com o RPG, e garantiremos que esses padrões sejam mantidos'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: '-'
                        },
                    ]
                },
                {
                    tipo: 'Definicao',
                    elementos: [
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'As aventuras do Universo do Medo são construídas a partir da interação entre personagens. Cada jogador tem um papel fundamental no desenrolar da história, e a ausência de qualquer participante pode afetar o rumo da narrativa de maneiras imprevisíveis'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Por isso, ao se comprometer com uma Aventura, certifique-se de que sua disponibilidade não afetará sua rotina. Escolha dias de jogo nos quais seja possível manter o compromisso sem imprevistos frequentes, garantindo sua presença pelo tempo integral da aventura em questão. Além disso, recomendamos que esteja disponível alguns minutos antes e depois do horário combinado, para evitar atrasos e manter a imersão da experiência'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Para preservar a qualidade da comunidade, faltas e atrasos recorrentes poderão resultar em penalidades, definidas pela Direção do Universo do Medo. Dependendo da gravidade e da frequência do problema, as medidas podem variar desde abandono forçado da aventura até a perda definitiva do personagem'
                        },
                        {
                            tipo: 'Paragrafo',
                            conteudo: 'Cada participante deve estar ciente do impacto que sua ausência pode causar aos demais. Nossas diretrizes visam manter um espaço organizado e respeitoso, onde o compromisso de cada jogador seja valorizado. Se surgir qualquer imprevisto que possa comprometer sua participação, comunique imediatamente a Direção e os demais jogadores da sua aventura. Isso não é uma obrigação ou punição, mas uma forma de garantir o melhor ambiente possível para todos'
                        },
                    ]
                },
            ]
        }
    }

    return <PaginaConteudoDinamico conteudo={conteudo} listaChaves={listaChaves} />
};