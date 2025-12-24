import styles from './styles.module.css';
import { EstruturaPaginaDefinicao, montarHref, type PaginaDef, type PaginaParams } from 'types-nora-api';

import Link from 'next/link';
import TextoGlitado from 'Componentes/ElementosVisuais/TextoGlitado/TextoGlitado';

type RequiredKeys<T extends Record<string, unknown>> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

type InicioProps<P extends PaginaDef<string>> =
    keyof PaginaParams<P> extends never
    ? { pagina: P; params?: never }
    : RequiredKeys<PaginaParams<P>> extends never
    ? { pagina: P; params?: PaginaParams<P> }
    : { pagina: P; params: PaginaParams<P> };

export default function PaginaConteudoDinamico<P extends PaginaDef<string>>({ conteudo, inicio, listaSlug }: { conteudo: EstruturaPaginaDefinicao; inicio: InicioProps<P>; listaSlug: string[] }) {
    const hrefInicio = montarHref(inicio.pagina.hrefTemplate, (('params' in inicio ? inicio.params : undefined) ?? {}) as Record<string, unknown>);

    return (
        <div className={styles.recipiente_definicao}>
            {listaSlug.length > 0 && <Breadcrumb hrefInicio={hrefInicio} listaSlug={listaSlug.map((chave) => decodeURIComponent(chave))} />}

            <div className={styles.recipiente_titulo}>
                <h1 className={styles.definicao_titulo}>{conteudo.titulo}</h1>
                {conteudo.subtitulo && (<h3>{conteudo.subtitulo}</h3>)}
            </div>

            <div className={styles.definicao_corpo}>
                {conteudo.listaConteudo.itens.map((conteudoItem, index) => {
                    if (conteudoItem.tipo === 'Definicao') {
                        return (
                            <div key={index} className={styles.definicao_conteudo}>
                                {conteudoItem.elementos.map((item, indexParagrafo) => {
                                    if (item.tipo === 'Paragrafo') return (<p key={indexParagrafo}>{item.conteudo}</p>);
                                    if (item.tipo === 'ParagrafoSecreto') return (<TextoGlitado chaveRequisito='123' key={indexParagrafo} tamanho='grande' />);
                                    return null;
                                })}
                            </div>
                        );
                    }

                    if (conteudoItem.tipo === 'Lista') {
                        return (
                            <div key={index} className={styles.recipiente_lista}>
                                <div className={styles.definicao_lista_opcoes}>
                                    {conteudoItem.itensLista.map((item, indexItemLista) => {
                                        if (item.tipo === 'ItemLista') {
                                            return (
                                                <div key={indexItemLista} className={`${styles.recipiente_opcao_lista}`}>
                                                    <p><Link href={`${item.subPaginaDefinicao}`}>{item.etiqueta}</Link></p>
                                                </div>
                                            );
                                        }

                                        if (item.tipo === 'ItemListaSecreto') {
                                            return (
                                                <div key={indexItemLista} className={styles.recipiente_opcao_lista}>
                                                    <TextoGlitado chaveRequisito='234' tamanho='pequeno' />
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>

            {conteudo.listaItensDefinicoesConectadas && (
                <div className={styles.definicao_conteudo_conectado}>
                    <h2>Definições Conectadas</h2>

                    <div className={styles.opcoes_conteudo_conectado}>
                        {conteudo.listaItensDefinicoesConectadas.map((item, index) => (
                            <span key={index}><Link href={`${item.subPaginaDefinicao}`}>{item.etiqueta}</Link></span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Breadcrumb({ hrefInicio, listaSlug }: { hrefInicio: string; listaSlug: string[] }) {
    const caminho = [
        { label: 'Início', href: hrefInicio },
        ...listaSlug.map((chave, index) => ({
            label: chave,
            href: `${hrefInicio}/${listaSlug.slice(0, index + 1).join('/')}`,
        })),
    ];

    return (
        <div className={styles.recipiente_breadcrumb}>
            {caminho.map((item, index) => (
                <span key={item.href}>
                    {index < caminho.length - 1 ? (
                        <Link href={`${item.href}`}>{item.label}</Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                    {index < caminho.length - 1 && ' → '}
                </span>
            ))}
        </div>
    );
};