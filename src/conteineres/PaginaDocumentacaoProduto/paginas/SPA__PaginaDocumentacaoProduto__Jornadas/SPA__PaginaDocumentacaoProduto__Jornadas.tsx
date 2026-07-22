'use client';

import styles from './styles.module.css';

import classNames from 'classnames';
import { useMemo, useState } from 'react';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaDocumentacaoProduto__Jornadas } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Jornadas/contexto';

// Jornadas por persona: o caminho ordenado pelas páginas reais até um objetivo, com completude derivada dos verbetes.
export default function SPA__PaginaDocumentacaoProduto__Jornadas() {
    const { listagemJornadas, listagemPersonas, jornadaSelecionada, passosDaSelecionada, completudePorJornada, estaDocumentada, nomePersonaPorId, paginaPorId, paginasParaPasso, abrirVerbeteDaPagina, selecionarJornada, formJornada, salvandoJornada, erroJornada, podeSalvarJornada, setCampoJornada, editarJornada, limparFormJornada, salvarJornada, adicionarPasso, removerPasso, moverPasso } = useContexto__PaginaDocumentacaoProduto__Jornadas();

    const [idPaginaPasso, setIdPaginaPasso] = useState<number | null>(null);
    const [notaPasso, setNotaPasso] = useState<string>('');
    const [adicionando, setAdicionando] = useState<boolean>(false);

    const opcoesPersonas = useMemo<OpcaoSelecionador[]>(() => listagemPersonas.registros.filter(persona => persona.ativo).map(persona => ({ value: String(persona.id), label: persona.nome })), [listagemPersonas.registros]);
    // Página do passo = dropdown; a mesma página pode aparecer em mais de um passo, então não filtramos as já usadas.
    const opcoesPaginas = useMemo<OpcaoSelecionador[]>(() => paginasParaPasso.map(pagina => ({ value: String(pagina.id), label: pagina.label })), [paginasParaPasso]);

    async function confirmarPasso(): Promise<void> {
        if (idPaginaPasso === null) return;
        setAdicionando(true);
        try {
            await adicionarPasso(idPaginaPasso, notaPasso.trim().length > 0 ? notaPasso.trim() : null);
            setIdPaginaPasso(null);
            setNotaPasso('');
        } finally {
            setAdicionando(false);
        }
    };

    return (
        <div className={styles.colunas}>
            <section className={styles.coluna_jornadas}>
                <h4 className={styles.titulo_secao}>Jornadas</h4>
                {listagemJornadas.registros.length === 0 && <p className={styles.vazio}>Nenhuma jornada cadastrada ainda.</p>}
                <ul className={styles.lista}>
                    {listagemJornadas.registros.map(jornada => {
                        const completude = completudePorJornada(jornada.id);
                        const completa = completude.total > 0 && completude.documentadas === completude.total;
                        return (
                            <li key={jornada.id}>
                                <DivClicavel className={classNames(styles.item, { [styles.selecionada]: jornadaSelecionada?.id === jornada.id })} onClick={() => selecionarJornada(jornada)}>
                                    <strong className={styles.nome_item}>{jornada.titulo}</strong>
                                    <span className={styles.persona_tag}>{nomePersonaPorId(jornada.fkPersonasId)}</span>
                                    <span className={classNames(styles.estado, { [styles.completa]: completa })}>{completude.total === 0 ? 'Sem passos' : completa ? 'Completa' : `Em construção · ${completude.documentadas}/${completude.total} documentadas`}</span>
                                </DivClicavel>
                            </li>
                        );
                    })}
                </ul>
                <div className={styles.form}>
                    <InputComRotulo rotulo="Persona (de quem é a jornada) *">
                        {formJornada.idEmEdicao === null
                            ? <SelecionadorOpcoes opcoes={opcoesPersonas} valor={formJornada.fkPersonasId !== null ? String(formJornada.fkPersonasId) : null} onChange={valor => setCampoJornada('fkPersonasId', valor !== null ? Number(valor) : null)} placeholder="Selecione a persona..." />
                            : <span className={styles.persona_fixa}>{formJornada.fkPersonasId !== null ? nomePersonaPorId(formJornada.fkPersonasId) : ''}</span>}
                    </InputComRotulo>
                    <InputComRotulo rotulo={formJornada.idEmEdicao === null ? 'Nova jornada *' : 'Editando jornada *'}>
                        <input type="text" value={formJornada.titulo} onChange={e => setCampoJornada('titulo', e.target.value)} placeholder="ex.: Do zero até a primeira partida" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Descrição">
                        <textarea rows={3} value={formJornada.descricao} onChange={e => setCampoJornada('descricao', e.target.value)} placeholder="Qual objetivo essa jornada atinge?" />
                    </InputComRotulo>
                    {erroJornada && <p className={styles.erro}>{erroJornada}</p>}
                    <div className={styles.acoes_form}>
                        {formJornada.idEmEdicao !== null && <button type="button" className={styles.botao_leve} onClick={limparFormJornada} disabled={salvandoJornada}>Cancelar edição</button>}
                        <button type="button" className={styles.botao_leve} onClick={salvarJornada} disabled={!podeSalvarJornada}>{salvandoJornada ? 'Salvando...' : formJornada.idEmEdicao === null ? 'Criar jornada' : 'Salvar jornada'}</button>
                    </div>
                </div>
            </section>
            <section className={styles.coluna_detalhe}>
                {jornadaSelecionada === null && <p className={styles.vazio}>Selecione uma jornada para ver e montar os passos.</p>}
                {jornadaSelecionada !== null && (
                    <>
                        <div className={styles.cabecalho_detalhe}>
                            <h4 className={styles.titulo_secao}>{jornadaSelecionada.titulo}</h4>
                            <button type="button" className={styles.botao_leve} onClick={() => editarJornada(jornadaSelecionada)}>Editar</button>
                        </div>
                        {jornadaSelecionada.descricao !== null && <p className={styles.descricao_detalhe}>{jornadaSelecionada.descricao}</p>}
                        {passosDaSelecionada.length === 0 && <p className={styles.vazio}>Nenhum passo ainda — adicione a primeira página do caminho.</p>}
                        <ol className={styles.lista_passos}>
                            {passosDaSelecionada.map((passo, indice) => {
                                const pagina = paginaPorId(passo.fkPaginasNavegacaoId);
                                const documentada = estaDocumentada(passo.fkPaginasNavegacaoId);
                                return (
                                    <li key={passo.id} className={styles.passo}>
                                        <span className={styles.numero_passo}>{indice + 1}</span>
                                        <div className={styles.corpo_passo}>
                                            <DivClicavel className={styles.pagina_passo} onClick={() => abrirVerbeteDaPagina(passo.fkPaginasNavegacaoId)}>
                                                <strong className={styles.nome_item}>{pagina?.label ?? `Página #${passo.fkPaginasNavegacaoId}`}</strong>
                                                <span className={classNames(styles.estado, { [styles.completa]: documentada })}>{documentada ? 'Documentada' : 'Sem documentação'}</span>
                                            </DivClicavel>
                                            {passo.nota !== null && <p className={styles.nota_passo}>{passo.nota}</p>}
                                        </div>
                                        <div className={styles.acoes_passo}>
                                            <button type="button" className={styles.botao_leve} onClick={() => moverPasso(passo.id, 'subir')} disabled={indice === 0}>↑</button>
                                            <button type="button" className={styles.botao_leve} onClick={() => moverPasso(passo.id, 'descer')} disabled={indice === passosDaSelecionada.length - 1}>↓</button>
                                            <button type="button" className={styles.botao_leve} onClick={() => removerPasso(passo.id)}>Remover</button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                        <div className={styles.form_passo}>
                            <InputComRotulo rotulo="Adicionar passo — página">
                                <SelecionadorOpcoes opcoes={opcoesPaginas} valor={idPaginaPasso !== null ? String(idPaginaPasso) : null} onChange={valor => setIdPaginaPasso(valor !== null ? Number(valor) : null)} placeholder="Escolha uma página..." isClearable />
                            </InputComRotulo>
                            {idPaginaPasso !== null && (
                                <>
                                    <InputComRotulo rotulo={`O que acontece em "${paginaPorId(idPaginaPasso)?.label ?? 'esta página'}"?`}>
                                        <textarea rows={2} value={notaPasso} onChange={e => setNotaPasso(e.target.value)} placeholder="Nota opcional do passo." />
                                    </InputComRotulo>
                                    <div className={styles.acoes_form}>
                                        <button type="button" className={styles.botao_leve} onClick={() => { setIdPaginaPasso(null); setNotaPasso(''); }} disabled={adicionando}>Cancelar</button>
                                        <button type="button" className={styles.botao_leve} onClick={confirmarPasso} disabled={adicionando}>{adicionando ? 'Adicionando...' : 'Adicionar passo'}</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};