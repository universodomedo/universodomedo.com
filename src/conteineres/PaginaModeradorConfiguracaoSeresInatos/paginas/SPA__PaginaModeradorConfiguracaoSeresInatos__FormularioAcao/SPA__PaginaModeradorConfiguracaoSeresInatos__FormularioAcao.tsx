import styles from '../../styles.module.css';

import { CabecalhoFormulario } from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/componentes/ComponentesConfiguracaoSeresInatos';
import { useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao/contexto';

export default function SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao() {
    const { formularioAcao, setFormularioAcao, opcoesAcoes, aoVoltar, adicionaParametroAcao, atualizaParametroAcao, removeParametroAcao, salvaAcao } = useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao();

    return (
        <form className={styles.formulario} onSubmit={evento => { evento.preventDefault(); salvaAcao().catch(() => undefined); }}>
            <CabecalhoFormulario titulo={formularioAcao.id === null ? 'Nova ação inata' : 'Editar ação inata'} aoVoltar={aoVoltar} />
            <label className={styles.campo}>
                <span>Nome</span>
                <input value={formularioAcao.nome} onChange={evento => setFormularioAcao({ ...formularioAcao, nome: evento.target.value })} />
            </label>
            <label className={styles.campo}>
                <span>Descrição</span>
                <textarea value={formularioAcao.descricao} onChange={evento => setFormularioAcao({ ...formularioAcao, descricao: evento.target.value })} />
            </label>
            <label className={styles.campo}>
                <span>Categoria</span>
                <select value={formularioAcao.categoria} onChange={evento => setFormularioAcao({ ...formularioAcao, categoria: evento.target.value as typeof formularioAcao.categoria })}>
                    {(opcoesAcoes?.categorias ?? []).map(categoria => <option key={categoria.chave} value={categoria.chave}>{categoria.nome}</option>)}
                </select>
            </label>
            <div className={styles.bloco_composto}>
                <header>
                    <strong>Parâmetros</strong>
                    <button type="button" onClick={adicionaParametroAcao}>Adicionar</button>
                </header>
                {formularioAcao.parametros.map(parametro => (
                    <div key={parametro.idFormulario} className={styles.parametro_linha}>
                        <input value={parametro.chave} placeholder="Chave" onChange={evento => atualizaParametroAcao(parametro.idFormulario, { ...parametro, chave: evento.target.value })} />
                        <input value={parametro.nome} placeholder="Nome" onChange={evento => atualizaParametroAcao(parametro.idFormulario, { ...parametro, nome: evento.target.value })} />
                        <input value={parametro.unidade} placeholder="Unidade" onChange={evento => atualizaParametroAcao(parametro.idFormulario, { ...parametro, unidade: evento.target.value })} />
                        <label className={styles.check_linha}>
                            <input type="checkbox" checked={parametro.obrigatorio} onChange={evento => atualizaParametroAcao(parametro.idFormulario, { ...parametro, obrigatorio: evento.target.checked })} />
                            <span>Obrigatório</span>
                        </label>
                        <button type="button" onClick={() => removeParametroAcao(parametro.idFormulario)}>Remover</button>
                    </div>
                ))}
            </div>
            <button type="submit" className={styles.botao_primario}>{formularioAcao.id === null ? 'Cadastrar Ação' : 'Salvar Ação'}</button>
        </form>
    );
};