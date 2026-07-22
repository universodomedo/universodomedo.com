'use client';

import styles from './styles.module.css';

import { useMemo } from 'react';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaDocumentacaoProduto__Verbete, type RegistroMensagemVerbete, type RegistroSecaoPersonaVerbete } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Verbete/contexto';

const ROTULO_COMPOSICAO: Record<string, string> = { FLUXO_FIXO: 'Fluxo fixo', SUPERFICIE_CONFIGURAVEL: 'Superfície configurável' };
const ROTULO_TIPO_CTA: Record<string, string> = { FIXA: 'Fixa', DINAMICA: 'Dinâmica' };

// Verbete em modo LEITURA: zonas focais que respondem, de relance, as perguntas do documento — pra quem, o que ela pede, como se monta, o que serve.
// Ambiente escuro da marca (cards do Painel); hierarquia forte/suave carrega o olho pelos nomes, não por parágrafos.
export default function SPA__PaginaDocumentacaoProduto__Verbete() {
    const { pagina, documentacao, listagemVinculos, listagemPublicos, listagemMensagens, listagemPaginasCtas, listagemSecoes, listagemSecoesPersonas, listagemCtas, nomePersonaPorId, rotuloTipoSecao, rotuloDestinoCta, idPaginaDestinoCta, abrirVerbetePorId, abrirEdicao } = useContexto__PaginaDocumentacaoProduto__Verbete();

    const mensagensPorPublico = useMemo(() => {
        const mapa = new Map<number, RegistroMensagemVerbete[]>();
        listagemMensagens.registros.forEach(mensagem => mapa.set(mensagem.fkDocumentacoesPaginasPersonasId, [...(mapa.get(mensagem.fkDocumentacoesPaginasPersonasId) ?? []), mensagem]));
        mapa.forEach(mensagens => mensagens.sort((a, b) => a.ordem - b.ordem));
        return mapa;
    }, [listagemMensagens.registros]);

    const publicosPorSecao = useMemo(() => {
        const mapa = new Map<number, RegistroSecaoPersonaVerbete[]>();
        listagemSecoesPersonas.registros.forEach(vinculo => mapa.set(vinculo.fkSecoesId, [...(mapa.get(vinculo.fkSecoesId) ?? []), vinculo]));
        return mapa;
    }, [listagemSecoesPersonas.registros]);

    const ctaPorId = useMemo(() => new Map(listagemCtas.registros.map(cta => [cta.id, cta])), [listagemCtas.registros]);

    const atendidas = listagemVinculos.registros.filter(vinculo => vinculo.atendida).length;
    const dataAtualizacao = documentacao?.dataAtualizacao ? new Date(documentacao.dataAtualizacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null;

    // Zona só vira card se tem conteúdo; o que falta é apontado numa faixa única de lacunas (gap visível sem monumentalizar vazio).
    const temPublicos = listagemPublicos.registros.length > 0;
    const temCtas = listagemPaginasCtas.registros.length > 0;
    const temSecoes = listagemSecoes.registros.length > 0 || (documentacao?.composicao === 'SUPERFICIE_CONFIGURAVEL' && documentacao.composicaoDescricao !== null);
    const temNecessidades = listagemVinculos.registros.length > 0;
    const temEstado = documentacao !== null && (documentacao.statusImplementacao !== null || documentacao.informacoesConsumidas !== null || documentacao.informacoesGeradas !== null);
    const temSegundaFileira = temNecessidades || temEstado;
    const lacunas = [!temPublicos && 'Públicos', !temCtas && 'CTAs', !temSecoes && 'Seções', !temNecessidades && 'Necessidades', !temEstado && 'Estado'].filter((lacuna): lacuna is string => lacuna !== false);

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.moldura}>
                    {documentacao === null && (
                        <div className={styles.vazio_pagina}>
                            <h1 className={styles.titulo_vazio}>{pagina.label}</h1>
                            <p className={styles.aviso_vazio}>Esta página ainda não foi documentada.</p>
                        </div>
                    )}

                    {documentacao !== null && (
                        <div className={styles.verbete}>
                            <header className={styles.cabecalho}>
                                <span className={styles.rota}>{pagina.template}</span>
                                <div className={styles.selos}>
                                    {documentacao.composicao != null && <span className={styles.selo_composicao}>{ROTULO_COMPOSICAO[documentacao.composicao] ?? documentacao.composicao}</span>}
                                    {dataAtualizacao !== null && <span className={styles.data}>{dataAtualizacao}</span>}
                                </div>
                            </header>

                            <section className={styles.zona_objetivo}>
                                <h2 className={styles.pergunta}>Por que existe?</h2>
                                {documentacao.objetivo !== null ? <p className={styles.objetivo}>{documentacao.objetivo}</p> : <p className={styles.linha_vazia}>Sem objetivo documentado.</p>}
                            </section>

                            <div className={styles.grade}>
                                {temPublicos && <section className={styles.zona}>
                                    <h2 className={styles.pergunta}>Pra quem?</h2>
                                    {listagemPublicos.registros.map(publico => {
                                        const mensagens = mensagensPorPublico.get(publico.id) ?? [];
                                        return (
                                            <div key={publico.id} className={styles.publico}>
                                                <div className={styles.publico_cabecalho}>
                                                    <span className={styles.nome_forte}>{nomePersonaPorId(publico.fkPersonasId)}</span>
                                                    <span className={publico.grau === 'PRINCIPAL' ? styles.chip_principal : styles.chip_secundaria}>{publico.grau === 'PRINCIPAL' ? 'Principal' : 'Secundária'}</span>
                                                </div>
                                                {mensagens.length > 0 && (
                                                    <ul className={styles.mensagens}>
                                                        {mensagens.map(mensagem => <li key={mensagem.id} className={styles.mensagem}>{mensagem.texto}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </section>}

                                {temCtas && <section className={styles.zona}>
                                    <h2 className={styles.pergunta}>O que ela pede?</h2>
                                    <ol className={styles.lista_ctas}>
                                        {listagemPaginasCtas.registros.map((aparicao, indice) => {
                                            const cta = ctaPorId.get(aparicao.fkCtasId);
                                            const idDestino = idPaginaDestinoCta(aparicao.fkCtasId);
                                            return (
                                                <li key={aparicao.id} className={styles.cta}>
                                                    <span className={styles.posicao}>{indice + 1}</span>
                                                    <div className={styles.cta_corpo}>
                                                        <div className={styles.cta_linha}>
                                                            <span className={styles.nome_forte}>{cta?.label ?? `CTA #${aparicao.fkCtasId}`}</span>
                                                            {cta && <span className={styles.chip_secundaria}>{ROTULO_TIPO_CTA[cta.tipo] ?? cta.tipo}</span>}
                                                        </div>
                                                        {idDestino !== null
                                                            ? <button type="button" className={styles.destino_link} onClick={() => abrirVerbetePorId(idDestino)}>→ {rotuloDestinoCta(aparicao.fkCtasId)}</button>
                                                            : <span className={styles.destino}>→ {rotuloDestinoCta(aparicao.fkCtasId)}</span>}
                                                        {aparicao.nota !== null && <p className={styles.detalhe}>{aparicao.nota}</p>}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </section>}

                                {temSecoes && <section className={`${styles.zona} ${temSegundaFileira ? styles.zona_alta : ''}`}>
                                    <h2 className={styles.pergunta}>Como se monta?</h2>
                                    {documentacao.composicao === 'SUPERFICIE_CONFIGURAVEL' && documentacao.composicaoDescricao !== null && <p className={styles.detalhe_arquitetura}>{documentacao.composicaoDescricao}</p>}
                                    <ol className={styles.lista_secoes}>
                                        {listagemSecoes.registros.map((secao, indice) => {
                                            const publicos = publicosPorSecao.get(secao.id) ?? [];
                                            return (
                                                <li key={secao.id} className={styles.secao_item}>
                                                    <span className={styles.posicao}>{indice + 1}</span>
                                                    <div className={styles.cta_corpo}>
                                                        <div className={styles.cta_linha}>
                                                            <span className={styles.nome_forte}>{secao.nome}</span>
                                                            <span className={styles.chip_secundaria}>{rotuloTipoSecao(secao.fkTiposSecaoId)}</span>
                                                        </div>
                                                        {publicos.length > 0 && <span className={styles.destino}>{publicos.map(vinculo => nomePersonaPorId(vinculo.fkPersonasId)).join(' · ')}</span>}
                                                        {secao.objetivo !== null && <p className={styles.detalhe}>{secao.objetivo}</p>}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </section>}

                                {temNecessidades && <section className={styles.zona}>
                                    <h2 className={styles.pergunta}>Que necessidades serve? <span className={styles.contador}>{atendidas}/{listagemVinculos.registros.length} atendidas</span></h2>
                                    <ul className={styles.lista_necessidades}>
                                        {listagemVinculos.registros.map(vinculo => (
                                            <li key={vinculo.id} className={styles.necessidade}>
                                                <span className={vinculo.atendida ? styles.farol_atendida : styles.farol_pendente} />
                                                <div className={styles.cta_corpo}>
                                                    <div className={styles.cta_linha}>
                                                        <span className={styles.nome_forte}>{vinculo.necessidade.titulo}</span>
                                                        <span className={styles.tag_persona}>{nomePersonaPorId(vinculo.necessidade.fkPersonasId)}</span>
                                                        <span className={vinculo.atendida ? styles.estado_atendida : styles.estado_pendente}>{vinculo.atendida ? 'Atendida' : 'Pendente'}</span>
                                                    </div>
                                                    <p className={styles.detalhe}>{vinculo.motivo}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>}

                                {temEstado && <section className={`${styles.zona} ${styles.zona_apagada}`}>
                                    <h2 className={styles.pergunta}>Onde está hoje?</h2>
                                    {documentacao.statusImplementacao !== null && <p className={styles.texto_suave}>{documentacao.statusImplementacao}</p>}
                                    {documentacao.informacoesConsumidas !== null && <p className={styles.texto_suave}><span className={styles.rotulo_inline}>Consome</span> {documentacao.informacoesConsumidas}</p>}
                                    {documentacao.informacoesGeradas !== null && <p className={styles.texto_suave}><span className={styles.rotulo_inline}>Gera</span> {documentacao.informacoesGeradas}</p>}
                                </section>}
                            </div>

                            {lacunas.length > 0 && <p className={styles.lacunas}><span className={styles.rotulo_inline}>Sem registro ainda</span> {lacunas.join(' · ')}</p>}
                        </div>
                    )}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={abrirEdicao}>{documentacao === null ? 'Documentar' : 'Editar Documentação'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
