import styles from './styles.module.css';
import Link from 'next/link';

import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import { obtemDadosPorPaginaDefinicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default async function PaginaDefinicao({ params }: { params: { chave?: string[] } }) {
    const { chave } = await params;
    const listaChaves = chave || [];

    const identificadorPagina = listaChaves.length > 0 ? `/${listaChaves.join("/")}` : "";
    const resultado = await obtemDadosPorPaginaDefinicao(identificadorPagina);
    
    if (!resultado.sucesso || resultado.dados === undefined) {
        return (
            <Redirecionador urlRedirecionar='/definicoes' />
        );
    }

    const conteudo = resultado.dados;

    return (
        <div className={styles.recipiente_definicao}>
            {listaChaves.length > 0 && <Breadcrumb listaChaves={listaChaves.map((chave) => decodeURIComponent(chave))} />}

            <div className={styles.recipiente_titulo}>
                <h1 className={styles.definicao_titulo}>{conteudo.titulo}</h1>
                {conteudo.subtitulo && (<h3>{conteudo.subtitulo}</h3>)}
            </div>

            <div className={styles.definicao_corpo}>
                {conteudo.listaConteudo.itens.map((conteudo, index) => {
                    if (conteudo.tipo === 'Definicao') {
                        return (
                            <div key={index} className={styles.definicao_conteudo}>
                                {conteudo.paragrafos.map((item, indexParagrafo) => (
                                    <p key={indexParagrafo}>{item}</p>
                                ))}
                            </div>
                        );
                    }
                    if (conteudo.tipo === 'Lista') {
                        return (
                            <div key={index} className={styles.definicao_lista_opcoes}>
                                {conteudo.itensLista.map((item, indexItemLista) => (
                                    <div key={indexItemLista} className={styles.recipiente_opcao_lista}>
                                        <p><Link href={`${item.subPaginaDefinicao}`}>{item.etiqueta}</Link></p>
                                    </div>
                                ))}
                            </div>
                        );
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
};

function Breadcrumb({ listaChaves }: { listaChaves: string[] }) {
    const caminho = [
        { label: "Início", href: "/definicoes" },
        ...listaChaves.map((chave, index) => ({
            label: chave,
            href: `/definicoes/${listaChaves.slice(0, index + 1).join("/")}`
        }))
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
                    {index < caminho.length - 1 && " → "}
                </span>
            ))}
        </div>
    );
};