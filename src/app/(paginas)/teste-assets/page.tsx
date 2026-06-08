'use client';

import styles from './styles.module.css';

import { useMemo, useState } from 'react';

type TipoCasoVisual = 'INSIGNIA' | 'ARTE_CAPA' | 'SER' | 'AVATAR_SER' | 'EMBLEMA' | 'ASSET_SITE';
type TipoPreviewCasoVisual = 'quadrado' | 'wide' | 'vertical' | 'livre';

interface CasoVisualTeste {
    readonly tipo: TipoCasoVisual;
    readonly nome: string;
    readonly dimensao: string;
    readonly formato: string;
    readonly origem: string;
    readonly descricao: string;
    readonly objetivoTeste: string;
    readonly criterios: readonly string[];
    readonly preview: TipoPreviewCasoVisual;
};

const casosVisuaisTeste: readonly CasoVisualTeste[] = [
    {
        tipo: 'INSIGNIA',
        nome: 'Insígnia',
        dimensao: '1024 x 1024',
        formato: 'Objeto 3D com visualização 2D quadrada',
        origem: 'Conquista ou recompensa de ação do usuário',
        descricao: 'Representa uma conquista visual do usuário e também pode ser exibida como trophy ou galeria 3D.',
        objetivoTeste: 'Validar se o fluxo suporta um objeto 3D que também gera uma saída 2D padronizada.',
        criterios: ['Preview quadrado obrigatório', 'Identidade visual forte', 'Pode existir como item 3D', 'Não depende de backend nesta página'],
        preview: 'quadrado',
    },
    {
        tipo: 'ARTE_CAPA',
        nome: 'Arte de Capa',
        dimensao: '1280 x 720',
        formato: 'Imagem 2D wide',
        origem: 'Canvas 2D ou screenshot de ambiente 3D',
        descricao: 'Imagem promocional de momento, personagem, aventura ou significado jogado, com título e assinatura opcionais.',
        objetivoTeste: 'Validar composição wide, área de título, assinatura e troca entre base padrão e item selecionado.',
        criterios: ['Preview 16:9 obrigatório', 'Título togglable', 'Assinatura togglable', 'Pode nascer de Canvas 2D ou screenshot 3D'],
        preview: 'wide',
    },
    {
        tipo: 'SER',
        nome: 'Ser',
        dimensao: '3D',
        formato: 'Objeto 3D editável',
        origem: 'Mestre ou jogador',
        descricao: 'Representa o estado visual e interpretativo de um Ser em dado momento, podendo ser humanoide, animal ou criatura.',
        objetivoTeste: 'Validar área reservada para comparação de estado visual 3D, altura mecânica e variações futuras.',
        criterios: ['Representação 3D', 'Altura mecânica visível', 'Suporta estados futuros', 'Pode gerar Avatar de Ser'],
        preview: 'vertical',
    },
    {
        tipo: 'AVATAR_SER',
        nome: 'Avatar de Ser',
        dimensao: '2D padronizado',
        formato: 'Imagem social derivada de um Ser',
        origem: 'Gerado a partir de um Ser',
        descricao: 'Representa um personagem de maneira social na plataforma, sempre com proporção e direção visual padronizadas.',
        objetivoTeste: 'Validar comparação entre avatar padrão e avatar selecionado, mantendo enquadramento fixo.',
        criterios: ['Enquadramento consistente', 'Direção visual padronizada', 'Pode representar momentos diferentes', 'Pode ser usado como Avatar do Usuário'],
        preview: 'quadrado',
    },
    {
        tipo: 'EMBLEMA',
        nome: 'Emblema',
        dimensao: 'Composição 2D',
        formato: 'Moldura, ícone, cores e efeitos',
        origem: 'Customização do Avatar do Usuário',
        descricao: 'Conjunto de elementos selecionáveis para adornar o Avatar do Usuário e gerar engajamento visual.',
        objetivoTeste: 'Validar composição modular entre moldura, ícone e variação visual selecionada.',
        criterios: ['Composição por partes', 'Moldura separável', 'Ícone separável', 'Pode ter efeito animado futuramente'],
        preview: 'quadrado',
    },
    {
        tipo: 'ASSET_SITE',
        nome: 'Asset do Site',
        dimensao: 'Variável',
        formato: '2D, WebP ou SVG',
        origem: 'Uso interno da interface',
        descricao: 'Imagem usada internamente no site, como bordas, divisores, sombreamentos, máscaras, ícones e ornamentos.',
        objetivoTeste: 'Validar catálogo visual interno sem tratar o asset como item de jogo ou criação social.',
        criterios: ['Uso interno claro', 'Pode ser SVG ou WebP', 'Não precisa ter dono artístico', 'Pode variar proporção conforme aplicação'],
        preview: 'livre',
    },
];

const passosTeste: readonly string[] = ['Selecionar tipo visual', 'Ver padrão esperado', 'Simular item selecionado', 'Comparar padrão e selecionado', 'Validar dimensão/formato', 'Validar critérios mínimos'];

function obtemCasoVisualInicial(): CasoVisualTeste { return casosVisuaisTeste[0]; };

function obtemClassePreview(preview: TipoPreviewCasoVisual): string {
    if (preview === 'quadrado') return styles.previewQuadrado;
    if (preview === 'wide') return styles.previewWide;
    if (preview === 'vertical') return styles.previewVertical;

    return styles.previewLivre;
};

function criaTextoResumoCaso(casoVisual: CasoVisualTeste): string { return `${casoVisual.nome} — ${casoVisual.dimensao} — ${casoVisual.formato}`; };

export default function Page() {
    const [tipoSelecionado, setTipoSelecionado] = useState<TipoCasoVisual>(obtemCasoVisualInicial().tipo);
    const [exibeTitulo, setExibeTitulo] = useState(true);
    const [exibeAssinatura, setExibeAssinatura] = useState(true);
    const [usaSelecionado, setUsaSelecionado] = useState(true);
    const casoSelecionado = useMemo(() => casosVisuaisTeste.find(casoVisual => casoVisual.tipo === tipoSelecionado) ?? obtemCasoVisualInicial(), [tipoSelecionado]);
    const classePreview = obtemClassePreview(casoSelecionado.preview);
    const arteCapaSelecionada = casoSelecionado.tipo === 'ARTE_CAPA';

    return (
        <main className={styles.pagina}>
            <section className={styles.cabecalho}>
                <div className={styles.blocoTitulo}>
                    <span className={styles.selo}>Teste local</span>
                    <h1>Casos visuais do Universo do Medo</h1>
                    <p>Página vazia para testar o roadmap de criação visual/editorial sem backend, sem GraphQL, sem persistência e sem consumo externo.</p>
                </div>

                <div className={styles.resumoAtual} aria-label="Resumo do caso selecionado">
                    <span>Selecionado</span>
                    <strong>{criaTextoResumoCaso(casoSelecionado)}</strong>
                </div>
            </section>

            <section className={styles.gradePrincipal}>
                <aside className={styles.menuCasos} aria-label="Tipos de caso visual">
                    <h2>Tipos</h2>

                    <div className={styles.listaCasos}>
                        {casosVisuaisTeste.map(casoVisual => (
                            <button className={`${styles.botaoCaso} ${casoVisual.tipo === tipoSelecionado ? styles.botaoCasoAtivo : ''}`} type="button" key={casoVisual.tipo} onClick={() => setTipoSelecionado(casoVisual.tipo)}>
                                <strong>{casoVisual.nome}</strong>
                                <span>{casoVisual.dimensao}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                <section className={styles.areaTeste} aria-label="Área de teste do caso visual">
                    <div className={styles.barraTeste}>
                        <div>
                            <h2>{casoSelecionado.nome}</h2>
                            <p>{casoSelecionado.objetivoTeste}</p>
                        </div>

                        <div className={styles.acoesTeste}>
                            <button className={`${styles.botaoAlternancia} ${usaSelecionado ? styles.botaoAlternanciaAtivo : ''}`} type="button" onClick={() => setUsaSelecionado(!usaSelecionado)}>
                                {usaSelecionado ? 'Selecionado ativo' : 'Padrão ativo'}
                            </button>

                            {arteCapaSelecionada && (
                                <>
                                    <button className={`${styles.botaoAlternancia} ${exibeTitulo ? styles.botaoAlternanciaAtivo : ''}`} type="button" onClick={() => setExibeTitulo(!exibeTitulo)}>Título</button>
                                    <button className={`${styles.botaoAlternancia} ${exibeAssinatura ? styles.botaoAlternanciaAtivo : ''}`} type="button" onClick={() => setExibeAssinatura(!exibeAssinatura)}>Assinatura</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.comparacao}>
                        <article className={styles.cartaoPreview}>
                            <header>
                                <span>Padrão esperado</span>
                                <strong>{casoSelecionado.dimensao}</strong>
                            </header>

                            <div className={`${styles.preview} ${classePreview}`}>
                                <div className={styles.conteudoPreview}>
                                    <span>{casoSelecionado.nome}</span>
                                    <strong>Padrão</strong>
                                    {arteCapaSelecionada && exibeTitulo && <em>Título da capa</em>}
                                    {arteCapaSelecionada && exibeAssinatura && <small>Assinatura do autor</small>}
                                </div>
                            </div>
                        </article>

                        <article className={styles.cartaoPreview}>
                            <header>
                                <span>Item selecionado</span>
                                <strong>{usaSelecionado ? 'Simulado' : 'Não selecionado'}</strong>
                            </header>

                            <div className={`${styles.preview} ${classePreview} ${usaSelecionado ? styles.previewSelecionado : styles.previewDesativado}`}>
                                <div className={styles.conteudoPreview}>
                                    <span>{casoSelecionado.nome}</span>
                                    <strong>{usaSelecionado ? 'Selecionado' : 'Vazio'}</strong>
                                    {arteCapaSelecionada && exibeTitulo && <em>Título customizado</em>}
                                    {arteCapaSelecionada && exibeAssinatura && <small>Autor simulado</small>}
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className={styles.detalhesCaso}>
                        <article className={styles.cartaoDetalhe}>
                            <h3>Descrição</h3>
                            <p>{casoSelecionado.descricao}</p>

                            <dl>
                                <div>
                                    <dt>Formato</dt>
                                    <dd>{casoSelecionado.formato}</dd>
                                </div>

                                <div>
                                    <dt>Origem</dt>
                                    <dd>{casoSelecionado.origem}</dd>
                                </div>
                            </dl>
                        </article>

                        <article className={styles.cartaoDetalhe}>
                            <h3>Critérios mínimos</h3>

                            <ul>
                                {casoSelecionado.criterios.map(criterio => <li key={criterio}>{criterio}</li>)}
                            </ul>
                        </article>
                    </div>
                </section>

                <aside className={styles.passosRoadmap} aria-label="Passos de validação">
                    <h2>Passos</h2>

                    <ol>
                        {passosTeste.map((passo, indice) => (
                            <li key={passo}>
                                <span>{indice + 1}</span>
                                <strong>{passo}</strong>
                            </li>
                        ))}
                    </ol>
                </aside>
            </section>
        </main>
    );
};