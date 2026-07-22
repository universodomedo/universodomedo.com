'use client';

import styles from './styles.module.css';

import { useMemo } from 'react';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaDocumentacaoProduto__Edicao, type RegistroMensagemEdicao, type RegistroPaginaCtaEdicao, type RegistroPassoEdicao, type RegistroPublicoEdicao, type RegistroSecaoEdicao, type RegistroVinculoEdicao } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Edicao/contexto';
import type { RegistroNecessidade } from 'Contextos/Contexto__PaginaDocumentacaoProduto/contexto';

const ROTULO_COMPOSICAO: Record<string, string> = { FLUXO_FIXO: 'Fluxo fixo (tela comum)', SUPERFICIE_CONFIGURAVEL: 'Superfície configurável (montável)' };
const ROTULO_GRAU: Record<string, string> = { PRINCIPAL: 'Principal', SECUNDARIA: 'Secundária' };

// Edição (PDF): renderiza TODOS os metadados da Documentação de Produto como um documento padrão (design de documento, print-first). O Exportar usa o diálogo de impressão do navegador.
export default function SPA__PaginaDocumentacaoProduto__Edicao() {
    const { listagemPaginas, listagemDocumentacoes, listagemPersonas, listagemNecessidades, listagemLigacoes, listagemJornadas, listagemCtas, listagemCtasPersonas, listagemTiposSecao, listagemVinculos, listagemPassos, listagemPaginasCtas, listagemSecoes, listagemPublicos, listagemMensagens, estaDocumentada, exportarPdf } = useContexto__PaginaDocumentacaoProduto__Edicao();

    const paginaPorId = useMemo(() => new Map(listagemPaginas.registros.map(pagina => [pagina.id, pagina])), [listagemPaginas.registros]);
    const personaPorId = useMemo(() => new Map(listagemPersonas.registros.map(persona => [persona.id, persona])), [listagemPersonas.registros]);
    const ctaPorId = useMemo(() => new Map(listagemCtas.registros.map(cta => [cta.id, cta])), [listagemCtas.registros]);
    const tipoSecaoPorId = useMemo(() => new Map(listagemTiposSecao.registros.map(tipo => [tipo.id, tipo])), [listagemTiposSecao.registros]);
    const nomePersona = (id: number): string => personaPorId.get(id)?.nome ?? `Persona #${id}`;

    const publicosDaCta = useMemo(() => {
        const mapa = new Map<number, number[]>();
        listagemCtasPersonas.registros.forEach(vinculo => mapa.set(vinculo.fkCtasId, [...(mapa.get(vinculo.fkCtasId) ?? []), vinculo.fkPersonasId]));
        return mapa;
    }, [listagemCtasPersonas.registros]);
    const ctasPorPagina = useMemo(() => {
        const mapa = new Map<number, RegistroPaginaCtaEdicao[]>();
        listagemPaginasCtas.registros.forEach(vinculo => mapa.set(vinculo.fkPaginasNavegacaoId, [...(mapa.get(vinculo.fkPaginasNavegacaoId) ?? []), vinculo]));
        return mapa;
    }, [listagemPaginasCtas.registros]);
    const secoesPorPagina = useMemo(() => {
        const mapa = new Map<number, RegistroSecaoEdicao[]>();
        listagemSecoes.registros.forEach(secao => mapa.set(secao.fkPaginasNavegacaoId, [...(mapa.get(secao.fkPaginasNavegacaoId) ?? []), secao]));
        mapa.forEach(secoes => secoes.sort((a, b) => a.ordem - b.ordem));
        return mapa;
    }, [listagemSecoes.registros]);
    const publicosPorPagina = useMemo(() => {
        const mapa = new Map<number, RegistroPublicoEdicao[]>();
        listagemPublicos.registros.forEach(publico => mapa.set(publico.fkPaginasNavegacaoId, [...(mapa.get(publico.fkPaginasNavegacaoId) ?? []), publico]));
        return mapa;
    }, [listagemPublicos.registros]);
    const mensagensPorPublico = useMemo(() => {
        const mapa = new Map<number, RegistroMensagemEdicao[]>();
        listagemMensagens.registros.forEach(mensagem => mapa.set(mensagem.fkDocumentacoesPaginasPersonasId, [...(mapa.get(mensagem.fkDocumentacoesPaginasPersonasId) ?? []), mensagem]));
        mapa.forEach(mensagens => mensagens.sort((a, b) => a.ordem - b.ordem));
        return mapa;
    }, [listagemMensagens.registros]);

    const necessidadesPorPersona = useMemo(() => {
        const mapa = new Map<number, RegistroNecessidade[]>();
        listagemNecessidades.registros.forEach(necessidade => mapa.set(necessidade.fkPersonasId, [...(mapa.get(necessidade.fkPersonasId) ?? []), necessidade]));
        return mapa;
    }, [listagemNecessidades.registros]);

    const vinculosPorDocumentacao = useMemo(() => {
        const mapa = new Map<number, RegistroVinculoEdicao[]>();
        listagemVinculos.registros.forEach(vinculo => mapa.set(vinculo.fkDocumentacoesPaginasId, [...(mapa.get(vinculo.fkDocumentacoesPaginasId) ?? []), vinculo]));
        return mapa;
    }, [listagemVinculos.registros]);

    const verbetes = useMemo(() => [...listagemDocumentacoes.registros].sort((a, b) => (paginaPorId.get(a.fkPaginasNavegacaoId)?.label ?? '').localeCompare(paginaPorId.get(b.fkPaginasNavegacaoId)?.label ?? '')), [listagemDocumentacoes.registros, paginaPorId]);

    const passosPorJornada = useMemo(() => {
        const mapa = new Map<number, RegistroPassoEdicao[]>();
        listagemPassos.registros.forEach(passo => mapa.set(passo.fkJornadasId, [...(mapa.get(passo.fkJornadasId) ?? []), passo]));
        mapa.forEach(passos => passos.sort((a, b) => a.ordem - b.ordem));
        return mapa;
    }, [listagemPassos.registros]);

    const dataEdicao = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const totalPaginas = listagemPaginas.registros.length;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.moldura}>
                    <article className={styles.documento}>
                        <header className={styles.capa}>
                            <p className={styles.selo}>Universo do Medo</p>
                            <h1 className={styles.titulo_doc}>Documentação de Produto</h1>
                            <p className={styles.edicao_data}>Edição de {dataEdicao}</p>
                            <p className={styles.resumo_capa}>{verbetes.length} de {totalPaginas} páginas documentadas · {listagemPersonas.registros.length} personas · {listagemNecessidades.registros.length} necessidades · {listagemJornadas.registros.length} jornadas · {listagemCtas.registros.length} CTAs</p>
                        </header>

                        <section className={styles.secao}>
                            <h2 className={styles.titulo_secao}>Personas & Necessidades</h2>
                            {listagemPersonas.registros.map(persona => (
                                <div key={persona.id} className={styles.bloco}>
                                    <h3 className={styles.titulo_bloco}>{persona.nome}{!persona.ativo && <span className={styles.tag_inativa}> (inativa)</span>}</h3>
                                    {persona.descricao !== null && <p className={styles.texto}>{persona.descricao}</p>}
                                    <ul className={styles.lista_doc}>
                                        {(necessidadesPorPersona.get(persona.id) ?? []).map(necessidade => (
                                            <li key={necessidade.id}><strong>{necessidade.titulo}</strong>{necessidade.descricao !== null && <> — {necessidade.descricao}</>}</li>
                                        ))}
                                    </ul>
                                    {(necessidadesPorPersona.get(persona.id) ?? []).length === 0 && <p className={styles.texto_vazio}>Sem necessidades registradas.</p>}
                                </div>
                            ))}
                        </section>

                        <section className={styles.secao}>
                            <h2 className={styles.titulo_secao}>Páginas Documentadas</h2>
                            {verbetes.length === 0 && <p className={styles.texto_vazio}>Nenhuma página documentada ainda.</p>}
                            {verbetes.map(verbete => {
                                const pagina = paginaPorId.get(verbete.fkPaginasNavegacaoId);
                                const vinculos = vinculosPorDocumentacao.get(verbete.id) ?? [];
                                const publicos = publicosPorPagina.get(verbete.fkPaginasNavegacaoId) ?? [];
                                const ctas = ctasPorPagina.get(verbete.fkPaginasNavegacaoId) ?? [];
                                const secoes = secoesPorPagina.get(verbete.fkPaginasNavegacaoId) ?? [];
                                return (
                                    <div key={verbete.id} className={styles.bloco}>
                                        <h3 className={styles.titulo_bloco}>{pagina?.label ?? `Página #${verbete.fkPaginasNavegacaoId}`}</h3>
                                        <p className={styles.rota_doc}>{pagina?.template}</p>
                                        {verbete.composicao !== null && <p className={styles.texto}><strong>Composição:</strong> {ROTULO_COMPOSICAO[verbete.composicao] ?? verbete.composicao}{verbete.composicaoDescricao !== null && <> — {verbete.composicaoDescricao}</>}</p>}
                                        {verbete.objetivo !== null && <p className={styles.texto}><strong>Objetivo:</strong> {verbete.objetivo}</p>}
                                        {verbete.informacoesConsumidas !== null && <p className={styles.texto}><strong>Consome:</strong> {verbete.informacoesConsumidas}</p>}
                                        {verbete.informacoesGeradas !== null && <p className={styles.texto}><strong>Gera:</strong> {verbete.informacoesGeradas}</p>}
                                        {verbete.statusImplementacao !== null && <p className={styles.texto}><strong>Status:</strong> {verbete.statusImplementacao}</p>}
                                        {vinculos.length > 0 && (
                                            <ul className={styles.lista_doc}>
                                                {vinculos.map(vinculo => (
                                                    <li key={vinculo.id}><strong>{vinculo.necessidade.titulo}</strong> ({personaPorId.get(vinculo.necessidade.fkPersonasId)?.nome ?? '?'}) — {vinculo.motivo} <em>[{vinculo.atendida ? 'Atendida' : 'Pendente'}]</em></li>
                                                ))}
                                            </ul>
                                        )}
                                        {publicos.length > 0 && (
                                            <>
                                                <p className={styles.texto}><strong>Públicos:</strong></p>
                                                <ul className={styles.lista_doc}>
                                                    {publicos.map(publico => {
                                                        const mensagens = mensagensPorPublico.get(publico.id) ?? [];
                                                        return <li key={publico.id}>{nomePersona(publico.fkPersonasId)} <em>[{ROTULO_GRAU[publico.grau] ?? publico.grau}]</em>{mensagens.length > 0 && <> — {mensagens.map(mensagem => mensagem.texto).join('; ')}</>}</li>;
                                                    })}
                                                </ul>
                                            </>
                                        )}
                                        {ctas.length > 0 && (
                                            <>
                                                <p className={styles.texto}><strong>CTAs:</strong></p>
                                                <ul className={styles.lista_doc}>
                                                    {ctas.map(cta => <li key={cta.id}>{ctaPorId.get(cta.fkCtasId)?.label ?? `CTA #${cta.fkCtasId}`}{cta.nota !== null && <> — {cta.nota}</>}</li>)}
                                                </ul>
                                            </>
                                        )}
                                        {secoes.length > 0 && (
                                            <>
                                                <p className={styles.texto}><strong>Seções:</strong></p>
                                                <ol className={styles.lista_passos_doc}>
                                                    {secoes.map(secao => <li key={secao.id}>{secao.nome} <em>({tipoSecaoPorId.get(secao.fkTiposSecaoId)?.rotulo ?? 'tipo?'})</em>{secao.objetivo !== null && <> — {secao.objetivo}</>}</li>)}
                                                </ol>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </section>

                        <section className={styles.secao}>
                            <h2 className={styles.titulo_secao}>Fluxos de Navegação</h2>
                            {listagemLigacoes.registros.length === 0 && <p className={styles.texto_vazio}>Nenhuma ligação registrada ainda.</p>}
                            <ul className={styles.lista_doc}>
                                {listagemLigacoes.registros.map(ligacao => (
                                    <li key={ligacao.id}>{paginaPorId.get(ligacao.fkPaginasNavegacaoOrigemId)?.label ?? '?'} → {paginaPorId.get(ligacao.fkPaginasNavegacaoDestinoId)?.label ?? '?'}{ligacao.descricao !== null && <> — {ligacao.descricao}</>}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.secao}>
                            <h2 className={styles.titulo_secao}>Jornadas</h2>
                            {listagemJornadas.registros.length === 0 && <p className={styles.texto_vazio}>Nenhuma jornada registrada ainda.</p>}
                            {listagemJornadas.registros.map(jornada => {
                                const passos = passosPorJornada.get(jornada.id) ?? [];
                                const documentadas = passos.filter(passo => estaDocumentada(passo.fkPaginasNavegacaoId)).length;
                                const completa = passos.length > 0 && documentadas === passos.length;
                                return (
                                    <div key={jornada.id} className={styles.bloco}>
                                        <h3 className={styles.titulo_bloco}>{jornada.titulo} <span className={styles.tag_persona}>({personaPorId.get(jornada.fkPersonasId)?.nome ?? '?'})</span> <em className={styles.tag_estado}>{passos.length === 0 ? 'Sem passos' : completa ? 'Completa' : `Em construção · ${documentadas}/${passos.length} documentadas`}</em></h3>
                                        {jornada.descricao !== null && <p className={styles.texto}>{jornada.descricao}</p>}
                                        <ol className={styles.lista_passos_doc}>
                                            {passos.map(passo => (
                                                <li key={passo.id}>{paginaPorId.get(passo.fkPaginasNavegacaoId)?.label ?? `Página #${passo.fkPaginasNavegacaoId}`}{!estaDocumentada(passo.fkPaginasNavegacaoId) && <em> (sem documentação)</em>}{passo.nota !== null && <> — {passo.nota}</>}</li>
                                            ))}
                                        </ol>
                                    </div>
                                );
                            })}
                        </section>

                        <section className={styles.secao}>
                            <h2 className={styles.titulo_secao}>Catálogo de CTAs</h2>
                            {listagemCtas.registros.length === 0 && <p className={styles.texto_vazio}>Nenhuma CTA registrada ainda.</p>}
                            {listagemCtas.registros.map(cta => {
                                const publicos = publicosDaCta.get(cta.id) ?? [];
                                const destino = cta.fkJornadasId !== null
                                    ? `Jornada: ${listagemJornadas.registros.find(jornada => jornada.id === cta.fkJornadasId)?.titulo ?? `#${cta.fkJornadasId}`}`
                                    : cta.fkPaginasNavegacaoId !== null ? `Página: ${paginaPorId.get(cta.fkPaginasNavegacaoId)?.label ?? `#${cta.fkPaginasNavegacaoId}`}` : 'Sem destino';
                                return (
                                    <div key={cta.id} className={styles.bloco}>
                                        <h3 className={styles.titulo_bloco}>{cta.label} <em className={styles.tag_estado}>{cta.tipo === 'DINAMICA' ? 'Dinâmica' : 'Fixa'}</em></h3>
                                        <p className={styles.texto}><strong>Destino:</strong> {destino}</p>
                                        {publicos.length > 0 && <p className={styles.texto}><strong>Públicos:</strong> {publicos.map(id => nomePersona(id)).join(', ')}</p>}
                                        {cta.importancia !== null && <p className={styles.texto}>{cta.importancia}</p>}
                                    </div>
                                );
                            })}
                        </section>

                        <footer className={styles.rodape_doc}>
                            <p>Documento vivo — gerado da Documentação de Produto do Universo do Medo. As informações refletem o estado da plataforma na data da edição.</p>
                        </footer>
                    </article>
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={exportarPdf}>Exportar para PDF</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};