import styles from './styles.module.css';

import { useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade/contexto';
import type { PropriedadesHabilidadeEspecial } from 'types-nora-api';

export default function SPA__PaginaModeradorHabilidadesEspeciais__NovaHabilidade() {
    const { formularioNovaHabilidade, custoEhValido, bonusEhValido, podeSalvar, salvar } = useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade();
    const comportamentoParametrizadoSelecionado = formularioNovaHabilidade.valores.tipoComportamento === 'modificador_parametrizado_teste_pericia_valor_maximo';

    function alteraTipoComportamento(tipoComportamento: string): void {
        formularioNovaHabilidade.setCampo('tipoComportamento', normalizaTipoComportamento(tipoComportamento));
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

                    <fieldset className={styles.secao_comportamento}>
                        <legend>Comportamento</legend>

                        <label className={styles.campo}>
                            <span>Tipo de comportamento</span>
                            <select value={formularioNovaHabilidade.valores.tipoComportamento} onChange={evento => alteraTipoComportamento(evento.target.value)} disabled={formularioNovaHabilidade.salvando}>
                                <option value="sem_efeito_runtime">Sem comportamento runtime</option>
                                <option value="modificador_parametrizado_teste_pericia_valor_maximo">Bônus parametrizado no Valor Máximo de teste de Perícia</option>
                            </select>
                        </label>

                        {comportamentoParametrizadoSelecionado && (
                            <div className={styles.configuracao_parametrizada}>
                                <label className={styles.campo}>
                                    <span>Valor do bônus</span>
                                    <input type="number" min="1" step="1" {...formularioNovaHabilidade.input('valorBonus')} />
                                    {formularioNovaHabilidade.valores.valorBonus.trim().length > 0 && !bonusEhValido && <small className={styles.erro_campo}>Informe um número inteiro maior que zero.</small>}
                                </label>

                                <div className={styles.argumento_bloqueado}>
                                    <span>Argumento</span>
                                    <strong>Perícia</strong>
                                    <p>A perícia concreta será escolhida futuramente em cada instância adquirida pelo personagem.</p>
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

function normalizaTipoComportamento(tipoComportamento: string): PropriedadesHabilidadeEspecial['tipo'] {
    if (tipoComportamento === 'modificador_parametrizado_teste_pericia_valor_maximo') return 'modificador_parametrizado_teste_pericia_valor_maximo';

    return 'sem_efeito_runtime';
};
