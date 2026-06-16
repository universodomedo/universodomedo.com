import styles from './styles.module.css';

import { useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao } from 'Contextos/Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao/contexto';

type ContextoConfiguracao = ReturnType<typeof useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao>;
type RegistroModificador = ContextoConfiguracao['modificadoresLogica'][number];

export default function SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao() {
    const { habilidade, atributos, modificadoresLogica, idAtributoSelecionado, selecionaAtributo, tipoModificadorSelecionado, selecionaTipoModificador, formularioNovoModificador, valorEhValido, podeSalvar, salvar, excluirModificador, acoesLogica, logicaCarregando, logicaErro, salvandoLogica, podeSalvarLogica, adicionaAcaoLogica, alteraAcaoLogica, removeAcaoLogica, salvarLogica } = useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao();
    const modificadorDeAtributoSelecionado = tipoModificadorSelecionado === 'atributo';
    const modificadorParametrizadoPorPericiaSelecionado = tipoModificadorSelecionado === 'teste_pericia_valor_maximo_parametrizado';

    return (
        <section className={styles.recipiente_configuracao}>
            <article className={styles.painel_configuracao}>
                <header className={styles.cabecalho_configuracao}>
                    <span>Habilidade em configuração</span>
                    <h2>{habilidade.nome}</h2>
                </header>

                <div className={styles.conteudo_configuracao}>
                    <section className={styles.area_logica}>
                        <header className={styles.cabecalho_area}>
                            <h3>Ações da lógica</h3>
                            <button type="button" className={styles.botao_secundario} onClick={adicionaAcaoLogica} disabled={logicaCarregando || salvandoLogica}>Adicionar ação</button>
                        </header>
                        {logicaCarregando && <p className={styles.estado_listagem}>Buscando lógica da habilidade</p>}
                        {logicaErro && <p className={styles.estado_erro}>{logicaErro}</p>}
                        {!logicaCarregando && !logicaErro && acoesLogica.length === 0 && <p className={styles.estado_listagem}>Nenhuma ação interna configurada.</p>}
                        <div className={styles.lista_acoes_logica}>
                            {acoesLogica.map((acao, indice) => (
                                <article key={indice} className={styles.acao_logica}>
                                    <label className={styles.campo}>
                                        <span>Ordem</span>
                                        <input type="number" step="1" value={acao.ordem} onChange={evento => alteraAcaoLogica(indice, 'ordem', evento.target.value)} disabled={salvandoLogica} />
                                    </label>
                                    <label className={styles.campo}>
                                        <span>Nome</span>
                                        <input type="text" value={acao.nome} onChange={evento => alteraAcaoLogica(indice, 'nome', evento.target.value)} disabled={salvandoLogica} />
                                    </label>
                                    <label className={styles.campo}>
                                        <span>Chave do domínio</span>
                                        <input type="text" value={acao.chaveDominio} onChange={evento => alteraAcaoLogica(indice, 'chaveDominio', evento.target.value)} disabled={salvandoLogica} placeholder="percepcao_auditiva" />
                                    </label>
                                    <button type="button" className={styles.botao_excluir} onClick={() => removeAcaoLogica(indice)} disabled={salvandoLogica}>Remover</button>
                                </article>
                            ))}
                        </div>
                        <button type="button" className={styles.botao_salvar} onClick={salvarLogica} disabled={!podeSalvarLogica}>{salvandoLogica ? 'Salvando...' : 'Salvar Lógica'}</button>
                    </section>

                    <section className={styles.area_modificadores}>
                        <h3>Modificadores passivos</h3>
                        {logicaCarregando && <p className={styles.estado_listagem}>Buscando lógica da habilidade</p>}
                        {logicaErro && <p className={styles.estado_erro}>{logicaErro}</p>}
                        {!logicaCarregando && !logicaErro && modificadoresLogica.length === 0 && <p className={styles.estado_listagem}>Nenhum modificador passivo cadastrado.</p>}
                        <div className={styles.lista_modificadores}>
                            {modificadoresLogica.map((modificador, indice) => <RenderizaModificador key={`${modificador.ordem}-${modificador.nome}-${indice}`} indice={indice} modificador={modificador} atributos={atributos} excluirModificador={excluirModificador} />)}
                        </div>
                    </section>

                    <section className={styles.area_cadastro}>
                        <h3>Cadastrar modificador</h3>
                        <label className={styles.campo}>
                            <span>Nome</span>
                            <input type="text" {...formularioNovoModificador.input('nome')} />
                            {formularioNovoModificador.erro('nome') && <small className={styles.erro_campo}>{formularioNovoModificador.erro('nome')}</small>}
                        </label>
                        <label className={styles.campo}>
                            <span>Tipo de modificador</span>
                            <select value={tipoModificadorSelecionado} onChange={evento => selecionaTipoModificador(evento.target.value)} disabled={formularioNovoModificador.salvando}>
                                <option value="atributo">Atributo</option>
                                <option value="teste_pericia_valor_maximo_parametrizado">Valor Máximo de teste de Perícia parametrizado</option>
                            </select>
                        </label>
                        {modificadorDeAtributoSelecionado && (
                            <label className={styles.campo}>
                                <span>Atributo</span>
                                <select value={idAtributoSelecionado?.toString() ?? ''} onChange={evento => selecionaAtributo(evento.target.value ? Number(evento.target.value) : null)} disabled={formularioNovoModificador.salvando}>
                                    <option value="">Selecione um Atributo</option>
                                    {atributos.map(atributo => <option key={atributo.id} value={atributo.id}>{atributo.nome} ({atributo.nomeAbreviado})</option>)}
                                </select>
                            </label>
                        )}
                        {modificadorParametrizadoPorPericiaSelecionado && (
                            <div className={styles.argumento_bloqueado}>
                                <span>Argumento</span>
                                <strong>Perícia</strong>
                                <p>O modificador será aplicado na Perícia que carrega esta Habilidade.</p>
                            </div>
                        )}
                        <label className={styles.campo}>
                            <span>Valor</span>
                            <input type="number" step="1" {...formularioNovoModificador.input('valor')} />
                            {formularioNovoModificador.valores.valor.trim().length > 0 && !valorEhValido && <small className={styles.erro_campo}>Informe um número inteiro diferente de zero.</small>}
                        </label>
                        <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{formularioNovoModificador.salvando ? 'Salvando...' : 'Cadastrar Modificador'}</button>
                    </section>
                </div>
            </article>
        </section>
    );
};

function RenderizaModificador({ indice, modificador, atributos, excluirModificador }: { indice: number; modificador: RegistroModificador; atributos: ContextoConfiguracao['atributos']; excluirModificador: ContextoConfiguracao['excluirModificador']; }) {
    const descricaoAlvo = descreveAlvoModificador(modificador, atributos);
    const valor = modificador.propriedades.valor > 0 ? `+${modificador.propriedades.valor}` : modificador.propriedades.valor.toString();

    return (
        <article className={styles.modificador}>
            <div>
                <strong>{modificador.nome}</strong>
                <span>{descricaoAlvo}</span>
            </div>
            <b>{valor}</b>
            <button type="button" className={styles.botao_excluir} onClick={() => excluirModificador(indice, modificador.nome)}>Excluir</button>
        </article>
    );
};

function descreveAlvoModificador(modificador: RegistroModificador, atributos: ContextoConfiguracao['atributos']): string {
    if (modificador.propriedades.tipo === 'teste_pericia_valor_maximo_parametrizado') return 'Valor Máximo de teste de Perícia (argumento: Perícia)';

    const idAtributo = modificador.propriedades.idAtributo;
    const atributo = atributos.find(atributoAtual => atributoAtual.id === idAtributo);
    if (atributo) return `${atributo.nome} (${atributo.nomeAbreviado})`;

    return `Atributo inválido (#${idAtributo ?? 'sem id'})`;
};