import styles from './styles.module.css';

import { useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade/contexto';
import type { PropriedadesHabilidadeEspecial } from 'types-nora-api';

export default function SPA__PaginaModeradorHabilidadesEspeciais__NovaHabilidade() {
    const { formularioNovaHabilidade, custoEhValido, podeSalvar, salvar } = useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade();
    const parametrizacaoPorPericiaSelecionada = formularioNovaHabilidade.valores.tipoParametrizacao === 'parametrizada_por_pericia';

    function alteraTipoParametrizacao(tipoParametrizacao: string): void {
        formularioNovaHabilidade.setCampo('tipoParametrizacao', normalizaTipoParametrizacao(tipoParametrizacao));
    };

    return (
        <section className={styles.recipiente_nova_habilidade}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Nova Habilidade Especial</h2>
                    <p>Cadastre a habilidade e defina seu custo em pontos de progressão.</p>
                </header>

                <div className={styles.formulario}>
                    <label className={styles.campo}>
                        <span>Nome</span>
                        <input type="text" {...formularioNovaHabilidade.input('nome')} />
                        {formularioNovaHabilidade.erro('nome') && <small className={styles.erro_campo}>{formularioNovaHabilidade.erro('nome')}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Descrição</span>
                        <textarea {...formularioNovaHabilidade.textarea('descricao')} />
                        {formularioNovaHabilidade.erro('descricao') && <small className={styles.erro_campo}>{formularioNovaHabilidade.erro('descricao')}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Custo em Pontos de Habilidade Especial</span>
                        <input type="number" min="1" step="1" {...formularioNovaHabilidade.input('custoPontosHabilidadeEspecial')} />
                        {formularioNovaHabilidade.valores.custoPontosHabilidadeEspecial.trim().length > 0 && !custoEhValido && <small className={styles.erro_campo}>Informe um número inteiro maior que zero.</small>}
                    </label>

                    <fieldset className={styles.secao_parametrizacao}>
                        <legend>Parametrização</legend>

                        <label className={styles.campo}>
                            <span>Tipo de parametrização</span>
                            <select value={formularioNovaHabilidade.valores.tipoParametrizacao} onChange={evento => alteraTipoParametrizacao(evento.target.value)} disabled={formularioNovaHabilidade.salvando}>
                                <option value="sem_argumento">Sem argumento</option>
                                <option value="parametrizada_por_pericia">Parametrizada por Perícia</option>
                            </select>
                        </label>

                        {parametrizacaoPorPericiaSelecionada && (
                            <div className={styles.configuracao_parametrizada}>
                                <div className={styles.argumento_bloqueado}>
                                    <span>Argumento</span>
                                    <strong>Perícia</strong>
                                    <p>A perícia concreta será escolhida em cada instância adquirida pelo personagem. Modificadores e ações devem ser configurados na tela de Configuração de Habilidades.</p>
                                </div>
                            </div>
                        )}
                    </fieldset>
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{formularioNovaHabilidade.salvando ? 'Salvando...' : 'Salvar Habilidade'}</button>
                </footer>
            </div>
        </section>
    );
};

function normalizaTipoParametrizacao(tipoParametrizacao: string): PropriedadesHabilidadeEspecial['tipo'] {
    if (tipoParametrizacao === 'parametrizada_por_pericia') return 'parametrizada_por_pericia';

    return 'sem_argumento';
};
