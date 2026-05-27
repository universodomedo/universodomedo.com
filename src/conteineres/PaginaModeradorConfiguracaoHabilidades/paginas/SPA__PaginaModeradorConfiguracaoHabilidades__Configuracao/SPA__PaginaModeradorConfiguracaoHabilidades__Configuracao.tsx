import styles from './styles.module.css';

import { useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao } from 'Contextos/Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao/contexto';

type ContextoConfiguracao = ReturnType<typeof useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao>;
type RegistroModificador = ContextoConfiguracao['listagemModificadores']['registros'][number];

export default function SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao() {
    const { habilidade, atributos, listagemModificadores, idAtributoSelecionado, selecionaAtributo, formularioNovoModificador, valorEhValido, podeSalvar, salvar, excluirModificador } = useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao();
    const carregarMais = listagemModificadores.carregarMais;

    return (
        <section className={styles.recipiente_configuracao}>
            <article className={styles.painel_configuracao}>
                <header className={styles.cabecalho_configuracao}>
                    <span>Habilidade em configuração</span>
                    <h2>{habilidade.nome}</h2>
                </header>

                <div className={styles.conteudo_configuracao}>
                    <section className={styles.area_modificadores}>
                        <h3>Modificadores passivos</h3>
                        {listagemModificadores.carregando && <p className={styles.estado_listagem}>{listagemModificadores.carregando}</p>}
                        {listagemModificadores.erro && <p className={styles.estado_erro}>{listagemModificadores.erro}</p>}
                        {!listagemModificadores.carregando && !listagemModificadores.erro && listagemModificadores.registros.length === 0 && <p className={styles.estado_listagem}>{listagemModificadores.mensagemListaVazia}</p>}
                        <div className={styles.lista_modificadores}>
                            {listagemModificadores.registros.map(modificador => <RenderizaModificador key={modificador.id} modificador={modificador} atributos={atributos} excluirModificador={excluirModificador} />)}
                        </div>
                        {carregarMais?.podeCarregarMais && <button type="button" className={styles.botao_secundario} onClick={carregarMais.aoCarregarMais} disabled={!!carregarMais.carregando}>{carregarMais.carregando ?? 'Carregar mais'}</button>}
                    </section>

                    <section className={styles.area_cadastro}>
                        <h3>Cadastrar modificador</h3>
                        <label className={styles.campo}>
                            <span>Nome</span>
                            <input type="text" {...formularioNovoModificador.input('nome')} />
                            {formularioNovoModificador.erro('nome') && <small className={styles.erro_campo}>{formularioNovoModificador.erro('nome')}</small>}
                        </label>
                        <label className={styles.campo}>
                            <span>Atributo</span>
                            <select value={idAtributoSelecionado?.toString() ?? ''} onChange={evento => selecionaAtributo(evento.target.value ? Number(evento.target.value) : null)} disabled={formularioNovoModificador.salvando}>
                                <option value="">Selecione um Atributo</option>
                                {atributos.map(atributo => <option key={atributo.id} value={atributo.id}>{atributo.nome} ({atributo.nomeAbreviado})</option>)}
                            </select>
                        </label>
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

function RenderizaModificador({ modificador, atributos, excluirModificador }: { modificador: RegistroModificador; atributos: ContextoConfiguracao['atributos']; excluirModificador: ContextoConfiguracao['excluirModificador']; }) {
    const atributo = atributos.find(atributoAtual => atributoAtual.id === modificador.propriedades.idAtributo);
    const nomeAtributo = atributo ? `${atributo.nome} (${atributo.nomeAbreviado})` : `Atributo inválido (#${modificador.propriedades.idAtributo})`;
    const valor = modificador.propriedades.valor > 0 ? `+${modificador.propriedades.valor}` : modificador.propriedades.valor.toString();

    return (
        <article className={styles.modificador}>
            <div>
                <strong>{modificador.nome}</strong>
                <span>{nomeAtributo}</span>
            </div>
            <b>{valor}</b>
            <button type="button" className={styles.botao_excluir} onClick={() => excluirModificador(modificador.id, modificador.nome)}>Excluir</button>
        </article>
    );
};
