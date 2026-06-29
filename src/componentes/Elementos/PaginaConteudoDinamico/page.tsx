import styles from './styles.module.css';

// Pra alterar esse Link, vai ter que alterar toda a estrutura de EstruturaPaginaDefinicao no backend para usar PAGINAS
import Link from 'next/link';
import { EstruturaPaginaDefinicao, montarHref, toParamsRecord, type PaginaDef, type PaginaParams, type RequiredKeys } from 'types-nora-api';

import TextoGlitado from 'Componentes/ElementosVisuais/TextoGlitado/TextoGlitado';
import TituloDefinicao from './TituloDefinicao';

export type InicioProps<P extends PaginaDef<string>> =
    keyof PaginaParams<P> extends never
    ? { pagina: P; params?: never }
    : RequiredKeys<PaginaParams<P>> extends never
    ? { pagina: P; params?: PaginaParams<P> }
    : { pagina: P; params: PaginaParams<P> };

export default function PaginaConteudoDinamico<P extends PaginaDef<string>>({ conteudo, inicio, listaSlug }: { conteudo: EstruturaPaginaDefinicao; inicio: InicioProps<P>; listaSlug: string[] }) {
    const paramsObj = ('params' in inicio && inicio.params) ? toParamsRecord(inicio.params) : {};
    const hrefInicio = montarHref(inicio.pagina.hrefTemplate, paramsObj);
    const hrefAnterior = listaSlug.length > 1 ? `${hrefInicio}/${listaSlug.slice(0, -1).join('/')}` : hrefInicio;

    return (
        <div className={styles.recipiente_definicao}>
            {listaSlug.length > 0 && (
                <Link className={styles.seta_voltar} href={hrefAnterior} aria-label="Voltar para a Definição anterior">←</Link>
            )}

            <div className={styles.recipiente_titulo}>
                <TituloDefinicao titulo={conteudo.titulo} />
                {conteudo.subtitulo && (<h3 className={styles.definicao_subtitulo}>{conteudo.subtitulo}</h3>)}
                <span className={styles.divisoria_ornamental} />
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
};