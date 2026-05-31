import styles from '../../styles.module.css';

import { CabecalhoFormulario, InputParametro } from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/componentes/ComponentesConfiguracaoSeresInatos';
import { useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade/contexto';
import type { FormularioCapacidadeAcao } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/contexto';

export default function SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade() {
    const { formularioCapacidade, setFormularioCapacidade, listagemAcoes, idAcaoSelecionada, setIdAcaoSelecionada, aoVoltar, adicionaAcaoSelecionada, removeAcaoCapacidade, atualizaParametroPadraoCapacidade, salvaCapacidade } = useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade();

    return (
        <form className={styles.formulario} onSubmit={evento => { evento.preventDefault(); salvaCapacidade().catch(() => undefined); }}>
            <CabecalhoFormulario titulo={formularioCapacidade.id === null ? 'Nova capacidade inata' : 'Editar capacidade inata'} aoVoltar={aoVoltar} />
            <label className={styles.campo}>
                <span>Nome</span>
                <input value={formularioCapacidade.nome} onChange={evento => setFormularioCapacidade({ ...formularioCapacidade, nome: evento.target.value })} />
            </label>
            <label className={styles.campo}>
                <span>Descrição</span>
                <textarea value={formularioCapacidade.descricao} onChange={evento => setFormularioCapacidade({ ...formularioCapacidade, descricao: evento.target.value })} />
            </label>
            <div className={styles.grid_campos}>
                <label className={styles.campo}>
                    <span>Origem corporal</span>
                    <input value={formularioCapacidade.origemCorporal} onChange={evento => setFormularioCapacidade({ ...formularioCapacidade, origemCorporal: evento.target.value })} />
                </label>
                <label className={styles.campo}>
                    <span>Quantidade</span>
                    <input type="number" value={formularioCapacidade.quantidade} onChange={evento => setFormularioCapacidade({ ...formularioCapacidade, quantidade: evento.target.value })} />
                </label>
            </div>
            <label className={styles.campo}>
                <span>Observações</span>
                <textarea value={formularioCapacidade.observacoes} onChange={evento => setFormularioCapacidade({ ...formularioCapacidade, observacoes: evento.target.value })} />
            </label>
            <div className={styles.bloco_composto}>
                <header>
                    <strong>Ações vinculadas</strong>
                    <div className={styles.adicao_inline}>
                        <select value={idAcaoSelecionada} onChange={evento => setIdAcaoSelecionada(evento.target.value)}>
                            <option value="">Ação</option>
                            {listagemAcoes.registros.filter(acao => acao.ativo).map(acao => <option key={acao.id} value={acao.id}>{acao.nome}</option>)}
                        </select>
                        <button type="button" onClick={adicionaAcaoSelecionada}>Adicionar</button>
                    </div>
                </header>
                {formularioCapacidade.acoes.map(acao => <EditorAcaoCapacidade key={acao.idAcaoInata} acao={acao} removeAcaoCapacidade={removeAcaoCapacidade} atualizaParametroPadraoCapacidade={atualizaParametroPadraoCapacidade} />)}
            </div>
            <button type="submit" className={styles.botao_primario}>{formularioCapacidade.id === null ? 'Cadastrar Capacidade' : 'Salvar Capacidade'}</button>
        </form>
    );
};

function EditorAcaoCapacidade({ acao, removeAcaoCapacidade, atualizaParametroPadraoCapacidade }: { acao: FormularioCapacidadeAcao; removeAcaoCapacidade: (idAcaoInata: number) => void; atualizaParametroPadraoCapacidade: (idAcaoInata: number, chave: string, valor: string) => void; }) {
    return (
        <article className={styles.editor_vinculo}>
            <header>
                <strong>{acao.nomeAcao}</strong>
                <button type="button" onClick={() => removeAcaoCapacidade(acao.idAcaoInata)}>Remover</button>
            </header>
            <div className={styles.grade_parametros}>
                {acao.parametrosPadrao.map(parametro => <InputParametro key={parametro.chave} parametro={parametro} onChange={valor => atualizaParametroPadraoCapacidade(acao.idAcaoInata, parametro.chave, valor)} />)}
            </div>
        </article>
    );
};