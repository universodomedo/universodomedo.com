import styles from './styles.module.css';
import { EstruturaPaginaDefinicao } from "types-nora-api";

import Link from 'next/link';
import TextoGlitado from 'Componentes/ElementosVisuais/TextoGlitado/TextoGlitado';

export default function PaginaConteudoDinamico({ conteudo, listaChaves }: { conteudo: EstruturaPaginaDefinicao, listaChaves: string[] }) {
    return (
        <div className={styles.recipiente_definicao}>
            {/* {listaChaves.length > 0 && <Breadcrumb listaChaves={listaChaves.map((chave) => decodeURIComponent(chave))} />} */}

            <div className={styles.recipiente_titulo}>
                <h1 className={styles.definicao_titulo}>{conteudo.titulo}</h1>
                {conteudo.subtitulo && (<h3>{conteudo.subtitulo}</h3>)}
            </div>

            <div className={styles.definicao_corpo}>
                {conteudo.listaConteudo.itens.map((conteudo, index) => {
                    if (conteudo.tipo === 'Definicao') {
                        return (
                            <div key={index} className={styles.definicao_conteudo}>
                                {conteudo.elementos.map((item, indexParagrafo) => {
                                    if (item.tipo === 'Paragrafo') {
                                        return (
                                            <p key={indexParagrafo}>{item.conteudo}</p>
                                        )
                                    }
                                    if (item.tipo === 'ParagrafoSecreto') {
                                        return (
                                            <TextoGlitado chaveRequisito='123' key={indexParagrafo} tamanho='grande' />
                                        )
                                    }
                                })}
                            </div>
                        );
                    }
                    if (conteudo.tipo === 'Lista') {
                        return (
                            <div key={index} className={styles.recipiente_lista}>
                                <div className={styles.definicao_lista_opcoes}>
                                    {conteudo.itensLista.map((item, indexItemLista) => {
                                        if (item.tipo === 'ItemLista') {
                                            return (
                                                <div key={indexItemLista} className={styles.recipiente_opcao_lista}>
                                                    <p><Link href={`${item.subPaginaDefinicao}`}>{item.etiqueta}</Link></p>
                                                </div>
                                            )
                                        }
                                        if (item.tipo === 'ItemListaSecreto') {
                                            return (
                                                <div key={indexItemLista} className={styles.recipiente_opcao_lista}>
                                                    <TextoGlitado chaveRequisito='234' tamanho='pequeno' />
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )
                    }
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

// function Breadcrumb({ listaChaves }: { listaChaves: string[] }) {
//     const caminho = [
//         { label: "Início", href: `/definicoes` },
//         ...listaChaves.map((chave, index) => ({
//             label: chave,
//             href: `${listaChaves.slice(0, index + 1).join("/")}`
//         }))
//     ];

//     return (
//         <div className={styles.recipiente_breadcrumb}>
//             {caminho.map((item, index) => (
//                 <span key={item.href}>
//                     {index < caminho.length - 1 ? (
//                         <Link href={`${item.href}`}>{item.label}</Link>
//                     ) : (
//                         <span>{item.label}</span>
//                     )}
//                     {index < caminho.length - 1 && " → "}
//                 </span>
//             ))}
//         </div>
//     );
// };