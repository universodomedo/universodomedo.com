'use client';

import styles from './styles.module.css';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

type StatusChecklist = 'pronto' | 'em_desenvolvimento' | 'em_breve' | 'futuro_proximo';

type ItemChecklist = { titulo: string; descricao: string; status: StatusChecklist; };

const ITENS_PASSE: ItemChecklist[] = [
    { titulo: 'Fichas Temporárias ilimitadas', descricao: 'Remoção do limite de Fichas Temporárias para a conta com Passe de Jogador ativo', status: 'pronto' },
    { titulo: 'Criação de Ficha Temporária', descricao: 'Crie a ficha que será levada ao jogo sem depender de longos livros de regras, com autonomia e velocidade', status: 'pronto' },
    { titulo: 'Criação de Personagem e História', descricao: 'Dê início a uma nova história. Uma nova face destinada a atravessar os mistérios do Universo do Medo', status: 'em_breve' },
    { titulo: 'Sala de Jogo', descricao: 'Mantenha acesso imediato à sua ficha e a uma base extensa de recursos durante a experiência de jogo', status: 'em_desenvolvimento' },
    { titulo: 'Sala de Jogo - Inventário e Habilidades', descricao: 'Desenvolva sua presença no Paranormal e coloque à prova os limites do seu poder', status: 'em_breve' },
    { titulo: 'Biblioteca de Desbloqueáveis', descricao: 'Registre e preserve sua experiência no Universo do Medo. Sua conta se torna mais forte e suas respostas, mais próximas', status: 'futuro_proximo' },
    { titulo: 'Criação 3D de Personagem', descricao: 'Controle a aparência do seu Personagem com profundidade, em tempo real e sem depender de ferramentas externas', status: 'em_breve' },
    { titulo: 'Impressão de Personagem', descricao: 'Eternize sua trajetória com a impressão do seu Personagem, integrada ao ecossistema e sem custos adicionais', status: 'futuro_proximo' },
    { titulo: 'Customização Visual de Ficha e Tela de Jogador', descricao: 'Escolha temas visuais inspirados em diferentes cenários e atmosferas da história do Universo do Medo', status: 'em_breve' },
];

function textoStatus(status: StatusChecklist): string {
    if (status === 'pronto') return 'Pronto';
    if (status === 'em_desenvolvimento') return 'Em desenvolvimento';
    if (status === 'em_breve') return 'Em breve';
    return 'Futuro próximo';
}

function ordemStatus(status: StatusChecklist): number {
    if (status === 'pronto') return 0;
    if (status === 'em_desenvolvimento') return 1;
    if (status === 'em_breve') return 2;
    return 3;
}

function textoStatusPasse(diasPasse: number): string {
    if (diasPasse > 0) return 'Passe ativo';
    return 'Passe inativo';
}

export default function Passejogadorluiz() {
    return <EsqueletoFake />;
};

function EsqueletoFake() {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div className={styles.recipente_pagina}>
            <div className={styles.recipiente_row}>
                <div className={styles.recipiente_conteudo} {...scrollableProps}>
                    <div className={styles.recipiente_conteudo__header}>
                        <h1>Meu Passe de Jogador</h1>
                    </div>
                    <div className={styles.recipiente_conteudo__body}>
                        <PaginaPasseDeJogador />
                    </div>
                </div>
                <div className={styles.recipiente_menu} />
            </div>
        </div>
    );
};

// Alterações apenas daqui para baixo

function PaginaPasseDeJogador() {
    const diasPasse = 0;
    const itensOrdenados = [...ITENS_PASSE].sort((a, b) => ordemStatus(a.status) - ordemStatus(b.status));

    return (
        <div className={styles.recipiente_pagina_passe_de_jogador}>
            <div className={styles.hero}>
                <SecaoDeConteudo fit>
                    <div className={styles.hero_topo}>
                        <div className={styles.hero_badges}>
                            <span className={styles.badge}>{textoStatusPasse(diasPasse)}</span>
                            <span className={styles.badge_secundario}>Duração: 30 dias</span>
                        </div>

                        <div className={styles.bloco_titulo}>
                            <h1 className={styles.titulo}>Passe de Jogador</h1>
                            <div className={styles.linha_titulo} />
                        </div>

                        <p className={styles.subtitulo}>Um ciclo de apoio ao Universo do Medo com benefícios de conveniência, expansão contínua de recursos e participação direta na evolução da plataforma</p>
                    </div>
                </SecaoDeConteudo>
            </div>

            <div className={styles.conteudo}>
                <section className={styles.bloco}>
                    <h2 className={styles.titulo_secao}>O que está sendo sustentado</h2>
                    <p className={styles.texto}>O Passe de Jogador existe para manter o ecossistema do UdM em crescimento constante. Sua função não é limitar a base gratuita, mas sustentar estrutura, acelerar entregas e consolidar uma experiência persistente cada vez mais rica</p>
                    <div className={styles.linha_divisor} />
                </section>

                <section className={styles.bloco}>
                    <h2 className={styles.titulo_secao}>Estrutura do Jogador</h2>
                    <p className={styles.texto_menor}>Entregas concluídas, sistemas em expansão e próximos marcos da experiência do jogador dentro do Universo do Medo</p>

                    <ul className={styles.lista_checklist}>
                        {itensOrdenados.map((item) => (
                            <li key={item.titulo} className={styles.item_checklist}>
                                <div className={styles.item_topo}>
                                    <span className={`${styles.ponto_status} ${styles[`status_${item.status}`]}`} />
                                    <div className={styles.item_titulo}>{item.titulo}</div>
                                    <span className={`${styles.tag_status} ${styles[`tag_${item.status}`]}`}>{textoStatus(item.status)}</span>
                                </div>
                                <div className={styles.item_descricao}>{item.descricao}</div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.bloco}>
                    <h2 className={styles.titulo_secao}>A importância do Passe</h2>
                    <p className={styles.texto}>No Universo do Medo, a jornada não se resume a uma sessão isolada. Trata-se de uma estrutura persistente, com progresso, identidade e consequência. O Passe de Jogador fortalece essa continuidade ao sustentar tecnologia, arte, operação e a expansão gradual dos sistemas que moldam a experiência</p>
                </section>

                <section className={styles.bloco_cta}>
                    <div className={styles.cta_conteudo}>
                        <div className={styles.cta_textos}>
                            <div className={styles.cta_chamada}>Assine agora</div>
                            <div className={styles.cta_sub}>A assinatura será disponibilizada em breve, com ativação simples e direta</div>
                        </div>
                        <button className={styles.botao_cta} disabled>Assine agora</button>
                    </div>
                </section>

                <section className={styles.bloco_transparencia}>
                    <div className={styles.transparencia}>
                        <div className={styles.transparencia_topo}>
                            <div className={styles.transparencia_titulo}>Portal de Transparência</div>
                            <div className={styles.transparencia_hint}>Informações operacionais para quem deseja compreender a estrutura que sustenta o projeto</div>
                        </div>

                        <div className={styles.transparencia_conteudo}>
                            <div className={styles.transparencia_card}>
                                <div className={styles.transparencia_card_titulo}>Equipe Atual</div>
                                <ul className={styles.transparencia_lista}>
                                    <li>1 Responsável de Desenvolvimento</li>
                                    <li>1 Responsável de Servidores</li>
                                    <li>2 Artistas</li>
                                </ul>
                            </div>

                            <div className={styles.transparencia_card}>
                                <div className={styles.transparencia_card_titulo}>Ferramentas Ativas</div>
                                <ul className={styles.transparencia_lista}>
                                    <li>Hero Forge Premium</li>
                                    <li>Streamlabs Ultra</li>
                                </ul>
                            </div>

                            <div className={styles.transparencia_card}>
                                <div className={styles.transparencia_card_titulo}>Custo Atual</div>
                                <div className={styles.transparencia_valor}>R$ 7.000 / mês</div>
                                <div className={styles.transparencia_obs}>Esse valor mantém operação, equipe e ritmo de evolução. O Passe de Jogador existe para tornar esse crescimento contínuo, estável e previsível</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};