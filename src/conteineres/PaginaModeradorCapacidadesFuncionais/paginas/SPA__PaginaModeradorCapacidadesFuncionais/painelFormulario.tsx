import botoes from './botoes.module.css';
import formStyles from './formulario.module.css';
import styles from './styles.module.css';

import type { ContextoCapacidades } from './SPA__PaginaModeradorCapacidadesFuncionais';
import ItensEstruturaisCapacidadeFuncional from './secaoItensEstruturais';
import NaturezasCapacidadeFuncional from './secaoNaturezas';
import OperacoesCapacidadeFuncional from './secaoOperacoes';
import { ParametrosAceitosCapacidadeFuncional, ParametrosFuncionaisCapacidadeFuncional } from './secaoParametros';

export default function PainelFormularioCapacidadesFuncionais({ contexto }: { contexto: ContextoCapacidades; }) {
    const { formulario, modoFormulario, carregandoOpcoes, erroOpcoes, carregandoDetalhe, erroDetalhe, salvando, podeSalvar, salvaCapacidade, desativaSelecionada, reativaSelecionada, setCampoTexto } = contexto;

    return (
        <article className={styles.painel_formulario}>
            <header className={styles.cabecalho_formulario}>
                <div>
                    <span>{modoFormulario === 'novo' ? 'Nova capacidade' : 'Editando capacidade'}</span>
                    <h2>{formulario.nome.trim().length > 0 ? formulario.nome : 'Capacidade Funcional'}</h2>
                    {formulario.id !== null && <small>{formulario.ativa ? 'Ativa' : 'Inativa'}</small>}
                </div>
                <div className={styles.acoes_formulario}>
                    {formulario.id !== null && formulario.ativa && <button type="button" className={botoes.botao_secundario} onClick={desativaSelecionada}>Desativar</button>}
                    {formulario.id !== null && !formulario.ativa && <button type="button" className={botoes.botao_secundario} onClick={reativaSelecionada}>Reativar</button>}
                    <button type="button" className={botoes.botao_principal} onClick={salvaCapacidade} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                </div>
            </header>
            {carregandoOpcoes && <p className={styles.estado}>{carregandoOpcoes}</p>}
            {erroOpcoes && <p className={styles.estado_erro}>{erroOpcoes}</p>}
            {carregandoDetalhe && <p className={styles.estado}>{carregandoDetalhe}</p>}
            {erroDetalhe && <p className={styles.estado_erro}>{erroDetalhe}</p>}
            <div className={formStyles.grid_campos}>
                <label className={formStyles.campo}>
                    <span>Key</span>
                    <input type="text" value={formulario.key} onChange={evento => setCampoTexto('key', evento.target.value)} />
                </label>
                <label className={formStyles.campo}>
                    <span>Nome</span>
                    <input type="text" value={formulario.nome} onChange={evento => setCampoTexto('nome', evento.target.value)} />
                </label>
            </div>
            <NaturezasCapacidadeFuncional contexto={contexto} />
            <ParametrosAceitosCapacidadeFuncional contexto={contexto} />
            <ParametrosFuncionaisCapacidadeFuncional contexto={contexto} />
            <OperacoesCapacidadeFuncional contexto={contexto} />
            <ItensEstruturaisCapacidadeFuncional contexto={contexto} grupo="requisitosEstruturais" titulo="Requisitos estruturais" />
            <ItensEstruturaisCapacidadeFuncional contexto={contexto} grupo="condicoesFuncionais" titulo="Condições funcionais" />
            <ItensEstruturaisCapacidadeFuncional contexto={contexto} grupo="efeitosPassivos" titulo="Efeitos passivos" />
            <ItensEstruturaisCapacidadeFuncional contexto={contexto} grupo="estadosBloqueiosPublicos" titulo="Estados e bloqueios públicos" />
        </article>
    );
};
