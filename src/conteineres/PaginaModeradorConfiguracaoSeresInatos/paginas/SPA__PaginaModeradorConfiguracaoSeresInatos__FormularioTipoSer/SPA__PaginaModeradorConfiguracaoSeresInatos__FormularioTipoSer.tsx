import styles from '../../styles.module.css';

import { CabecalhoFormulario, InputParametro, SelectOpcao } from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/componentes/ComponentesConfiguracaoSeresInatos';
import { useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer/contexto';
import type { FormularioTipoSerCapacidade } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/contexto';

export default function SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer() {
    const { formularioTipoSer, setFormularioTipoSer, listagemCapacidades, opcoesTipoSer, idCapacidadeSelecionada, setIdCapacidadeSelecionada, aoVoltar, adicionaCapacidadeSelecionada, removeCapacidadeTipoSer, atualizaParametroTipoSer, salvaTipoSer } = useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer();

    return (
        <form className={styles.formulario} onSubmit={evento => { evento.preventDefault(); salvaTipoSer().catch(() => undefined); }}>
            <CabecalhoFormulario titulo={formularioTipoSer.id === null ? 'Novo tipo de ser' : 'Editar tipo de ser'} aoVoltar={aoVoltar} />
            <label className={styles.campo}>
                <span>Nome</span>
                <input value={formularioTipoSer.nome} onChange={evento => setFormularioTipoSer({ ...formularioTipoSer, nome: evento.target.value })} />
            </label>
            <label className={styles.campo}>
                <span>Descrição</span>
                <textarea value={formularioTipoSer.descricao} onChange={evento => setFormularioTipoSer({ ...formularioTipoSer, descricao: evento.target.value })} />
            </label>
            <div className={styles.grade_atributos}>
                <SelectOpcao label="Tamanho" value={formularioTipoSer.tamanho} opcoes={opcoesTipoSer?.tamanhos ?? []} onChange={valor => setFormularioTipoSer({ ...formularioTipoSer, tamanho: valor })} />
                <SelectOpcao label="Raciocínio" value={formularioTipoSer.raciocinio} opcoes={opcoesTipoSer?.raciocinios ?? []} onChange={valor => setFormularioTipoSer({ ...formularioTipoSer, raciocinio: valor })} />
                <SelectOpcao label="Comunicação" value={formularioTipoSer.comunicacao} opcoes={opcoesTipoSer?.comunicacoes ?? []} onChange={valor => setFormularioTipoSer({ ...formularioTipoSer, comunicacao: valor })} />
                <label className={styles.campo}>
                    <span>Peso kg</span>
                    <input type="number" value={formularioTipoSer.pesoKg} onChange={evento => setFormularioTipoSer({ ...formularioTipoSer, pesoKg: evento.target.value })} />
                </label>
                <label className={styles.campo}>
                    <span>Carga kg</span>
                    <input type="number" value={formularioTipoSer.limiteCargaKg} onChange={evento => setFormularioTipoSer({ ...formularioTipoSer, limiteCargaKg: evento.target.value })} />
                </label>
            </div>
            <div className={styles.bloco_composto}>
                <header>
                    <strong>Capacidades</strong>
                    <div className={styles.adicao_inline}>
                        <select value={idCapacidadeSelecionada} onChange={evento => setIdCapacidadeSelecionada(evento.target.value)}>
                            <option value="">Capacidade</option>
                            {listagemCapacidades.registros.filter(capacidade => capacidade.ativo).map(capacidade => <option key={capacidade.id} value={capacidade.id}>{capacidade.nome}</option>)}
                        </select>
                        <button type="button" onClick={adicionaCapacidadeSelecionada}>Adicionar</button>
                    </div>
                </header>
                {formularioTipoSer.capacidades.map(capacidade => <EditorCapacidadeTipoSer key={capacidade.idCapacidadeInata} capacidade={capacidade} removeCapacidadeTipoSer={removeCapacidadeTipoSer} atualizaParametroTipoSer={atualizaParametroTipoSer} />)}
            </div>
            <button type="submit" className={styles.botao_primario}>{formularioTipoSer.id === null ? 'Cadastrar Tipo' : 'Salvar Tipo'}</button>
        </form>
    );
};

function EditorCapacidadeTipoSer({ capacidade, removeCapacidadeTipoSer, atualizaParametroTipoSer }: { capacidade: FormularioTipoSerCapacidade; removeCapacidadeTipoSer: (idCapacidadeInata: number) => void; atualizaParametroTipoSer: (idCapacidadeInata: number, idAcaoInata: number, chave: string, valor: string) => void; }) {
    return (
        <article className={styles.editor_vinculo}>
            <header>
                <strong>{capacidade.nomeCapacidade}</strong>
                <button type="button" onClick={() => removeCapacidadeTipoSer(capacidade.idCapacidadeInata)}>Remover</button>
            </header>
            {capacidade.parametrosAcoes.map(acao => (
                <div key={acao.idAcaoInata} className={styles.subeditor}>
                    <span>{acao.nomeAcao}</span>
                    <div className={styles.grade_parametros}>
                        {acao.parametros.map(parametro => <InputParametro key={parametro.chave} parametro={parametro} onChange={valor => atualizaParametroTipoSer(capacidade.idCapacidadeInata, acao.idAcaoInata, parametro.chave, valor)} />)}
                    </div>
                </div>
            ))}
        </article>
    );
};