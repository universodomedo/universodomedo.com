'use client';

import styles from './styles.module.css';

import classNames from 'classnames';
import { useMemo } from 'react';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaDocumentacaoProduto__Ctas } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Ctas/contexto';

const OPCOES_TIPO_CTA: readonly OpcaoSelecionador[] = [
    { value: 'FIXA', label: 'Fixa — sempre presente' },
    { value: 'DINAMICA', label: 'Dinâmica — sazonal (vai e vem)' },
];
const OPCOES_DESTINO_TIPO: readonly OpcaoSelecionador[] = [
    { value: 'pagina', label: 'Página' },
    { value: 'jornada', label: 'Jornada' },
];

// Catálogo global de CTAs (com destino e públicos) + catálogo de tipos de seção. Ambos reutilizáveis entre páginas.
export default function SPA__PaginaDocumentacaoProduto__Ctas() {
    const { listagemCtas, listagemTiposSecao, listagemPersonas, listagemPaginas, listagemJornadas, formCta, formTipoSecao, salvandoCta, salvandoTipo, erroCta, erroTipo, podeSalvarCta, podeSalvarTipo, setCampoCta, setCampoTipo, editarCta, editarTipoSecao, limparFormCta, limparFormTipo, salvarCta, salvarTipoSecao, publicosDaCta, nomePersonaPorId, rotuloDestino, vincularPublico, desvincularPublico, idVinculoPublico } = useContexto__PaginaDocumentacaoProduto__Ctas();

    const opcoesDestino = useMemo<OpcaoSelecionador[]>(() => {
        if (formCta.destinoTipo === 'jornada') return listagemJornadas.registros.map(jornada => ({ value: String(jornada.id), label: jornada.titulo }));
        return listagemPaginas.registros.map(pagina => ({ value: String(pagina.id), label: pagina.label }));
    }, [formCta.destinoTipo, listagemJornadas.registros, listagemPaginas.registros]);

    // Públicos ainda NÃO vinculados à CTA em edição (dropdown de adicionar).
    const personasDisponiveis = useMemo<OpcaoSelecionador[]>(() => {
        if (formCta.idEmEdicao === null) return [];
        const jaPublico = new Set(publicosDaCta(formCta.idEmEdicao));
        return listagemPersonas.registros.filter(persona => persona.ativo && !jaPublico.has(persona.id)).map(persona => ({ value: String(persona.id), label: persona.nome }));
    }, [formCta.idEmEdicao, publicosDaCta, listagemPersonas.registros]);

    return (
        <div className={styles.colunas}>
            <section className={styles.coluna}>
                <h4 className={styles.titulo_secao}>CTAs (pontos de conversão)</h4>
                {listagemCtas.registros.length === 0 && <p className={styles.vazio}>Nenhuma CTA cadastrada ainda.</p>}
                <ul className={styles.lista}>
                    {listagemCtas.registros.map(cta => (
                        <li key={cta.id}>
                            <DivClicavel className={classNames(styles.item, { [styles.em_edicao]: formCta.idEmEdicao === cta.id })} onClick={() => editarCta(cta)}>
                                <div className={styles.item_topo}>
                                    <strong className={styles.nome_item}>{cta.label}</strong>
                                    <span className={styles.tipo_tag}>{cta.tipo === 'DINAMICA' ? 'Dinâmica' : 'Fixa'}</span>
                                </div>
                                <span className={styles.destino}>{rotuloDestino(cta)}</span>
                                {publicosDaCta(cta.id).length > 0 && <span className={styles.publicos}>{publicosDaCta(cta.id).map(id => nomePersonaPorId(id)).join(' · ')}</span>}
                            </DivClicavel>
                        </li>
                    ))}
                </ul>
                <div className={styles.form}>
                    <InputComRotulo rotulo={formCta.idEmEdicao === null ? 'Nova CTA *' : 'Editando CTA *'}>
                        <input type="text" value={formCta.label} onChange={e => setCampoCta('label', e.target.value)} placeholder="ex.: Jogar Tutorial" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Tipo">
                        <SelecionadorOpcoes opcoes={OPCOES_TIPO_CTA} valor={formCta.tipo} onChange={valor => setCampoCta('tipo', (valor ?? 'FIXA') as FormTipoValor)} />
                    </InputComRotulo>
                    <div className={styles.linha_destino}>
                        <InputComRotulo rotulo="Destino">
                            <SelecionadorOpcoes opcoes={OPCOES_DESTINO_TIPO} valor={formCta.destinoTipo} onChange={valor => { setCampoCta('destinoTipo', (valor ?? 'pagina') as 'pagina' | 'jornada'); setCampoCta('destinoId', null); }} />
                        </InputComRotulo>
                        <InputComRotulo rotulo={formCta.destinoTipo === 'jornada' ? 'Jornada *' : 'Página *'}>
                            <SelecionadorOpcoes opcoes={opcoesDestino} valor={formCta.destinoId !== null ? String(formCta.destinoId) : null} onChange={valor => setCampoCta('destinoId', valor !== null ? Number(valor) : null)} placeholder={formCta.destinoTipo === 'jornada' ? 'Escolha a jornada...' : 'Escolha a página...'} />
                        </InputComRotulo>
                    </div>
                    <InputComRotulo rotulo="Importância / justificativa">
                        <textarea rows={2} value={formCta.importancia} onChange={e => setCampoCta('importancia', e.target.value)} placeholder="Por que esta CTA existe? Que problema resolve?" />
                    </InputComRotulo>
                    {erroCta && <p className={styles.erro}>{erroCta}</p>}
                    <div className={styles.acoes_form}>
                        {formCta.idEmEdicao !== null && <button type="button" className={styles.botao_leve} onClick={limparFormCta} disabled={salvandoCta}>Cancelar edição</button>}
                        <button type="button" className={styles.botao_leve} onClick={salvarCta} disabled={!podeSalvarCta}>{salvandoCta ? 'Salvando...' : formCta.idEmEdicao === null ? 'Criar CTA' : 'Salvar CTA'}</button>
                    </div>
                    {formCta.idEmEdicao !== null && (
                        <div className={styles.publicos_edicao}>
                            <h5 className={styles.titulo_sub}>Públicos desta CTA</h5>
                            <ul className={styles.lista_publicos}>
                                {publicosDaCta(formCta.idEmEdicao).map(idPersona => {
                                    const idVinculo = idVinculoPublico(formCta.idEmEdicao as number, idPersona);
                                    return (
                                        <li key={idPersona} className={styles.publico_item}>
                                            <span>{nomePersonaPorId(idPersona)}</span>
                                            {idVinculo !== null && <button type="button" className={styles.botao_leve} onClick={() => desvincularPublico(idVinculo)}>Remover</button>}
                                        </li>
                                    );
                                })}
                            </ul>
                            <SelecionadorOpcoes opcoes={personasDisponiveis} valor={null} onChange={valor => { if (valor !== null && formCta.idEmEdicao !== null) vincularPublico(formCta.idEmEdicao, Number(valor)); }} placeholder={personasDisponiveis.length > 0 ? 'Adicionar público...' : 'Todos os públicos já vinculados'} />
                        </div>
                    )}
                </div>
            </section>
            <section className={styles.coluna}>
                <h4 className={styles.titulo_secao}>Tipos de seção</h4>
                {listagemTiposSecao.registros.length === 0 && <p className={styles.vazio}>Nenhum tipo cadastrado ainda.</p>}
                <ul className={styles.lista}>
                    {listagemTiposSecao.registros.map(tipo => (
                        <li key={tipo.id}>
                            <DivClicavel className={classNames(styles.item, { [styles.inativo]: !tipo.ativo, [styles.em_edicao]: formTipoSecao.idEmEdicao === tipo.id })} onClick={() => editarTipoSecao(tipo)}>
                                <strong className={styles.nome_item}>{tipo.rotulo}</strong>
                                {!tipo.ativo && <span className={styles.tipo_tag}>inativo</span>}
                            </DivClicavel>
                        </li>
                    ))}
                </ul>
                <div className={styles.form}>
                    <InputComRotulo rotulo={formTipoSecao.idEmEdicao === null ? 'Novo tipo de seção *' : 'Editando tipo *'}>
                        <input type="text" value={formTipoSecao.rotulo} onChange={e => setCampoTipo('rotulo', e.target.value)} placeholder="ex.: Hero, Carrossel, Grid, Highlight" />
                    </InputComRotulo>
                    {formTipoSecao.idEmEdicao !== null && (
                        <div className={styles.linha_toggle}>
                            <span className={styles.rotulo_toggle}>Ativo</span>
                            <AlternaOpcao opcao={formTipoSecao.ativo} onChange={valor => setCampoTipo('ativo', valor)} />
                        </div>
                    )}
                    {erroTipo && <p className={styles.erro}>{erroTipo}</p>}
                    <div className={styles.acoes_form}>
                        {formTipoSecao.idEmEdicao !== null && <button type="button" className={styles.botao_leve} onClick={limparFormTipo} disabled={salvandoTipo}>Cancelar edição</button>}
                        <button type="button" className={styles.botao_leve} onClick={salvarTipoSecao} disabled={!podeSalvarTipo}>{salvandoTipo ? 'Salvando...' : formTipoSecao.idEmEdicao === null ? 'Criar tipo' : 'Salvar tipo'}</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

type FormTipoValor = 'FIXA' | 'DINAMICA';