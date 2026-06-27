import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro } from 'Contextos/Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro/contexto';

export default function SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro() {
    const { classesDisponiveis, estatisticasDisponiveis, atributos, idClasse, setIdClasse, idEstatistica, setIdEstatistica, valorCoeficiente, setValorCoeficiente, pesoDoAtributo, setPesoDoAtributo, somaPesos, somaValida, salvando, podeSalvar, salvar } = useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro();

    return (
        <section className={styles.recipiente}>
            <header className={styles.cabecalho}>
                <h2>Novo Coeficiente</h2>
            </header>

            <label className={styles.campo}>
                <span>Classe</span>
                <select value={idClasse} onChange={evento => setIdClasse(evento.target.value)} disabled={salvando}>
                    <option value="">Selecione uma classe</option>
                    {classesDisponiveis.map(classe => <option key={classe.id} value={String(classe.id)}>{classe.nome}</option>)}
                </select>
            </label>

            <label className={styles.campo}>
                <span>Estatística</span>
                <select value={idEstatistica} onChange={evento => setIdEstatistica(evento.target.value)} disabled={salvando || idClasse === ''}>
                    <option value="">{idClasse === '' ? 'Selecione uma classe primeiro' : 'Selecione uma estatística'}</option>
                    {estatisticasDisponiveis.map(estatistica => <option key={estatistica.id} value={String(estatistica.id)}>{estatistica.nome}</option>)}
                </select>
            </label>

            <label className={styles.campo}>
                <span>Coeficiente</span>
                <input type="number" step="0.1" min="0" value={valorCoeficiente} onChange={evento => setValorCoeficiente(evento.target.value)} disabled={salvando} />
            </label>

            <div className={styles.pesos}>
                <span className={styles.titulo_pesos}>Pesos por Atributo</span>
                {atributos.map(atributo => (
                    <label key={atributo.id} className={styles.campo_peso}>
                        <span>{atributo.nome}</span>
                        <input type="number" step="0.01" min="0" value={pesoDoAtributo(atributo.id)} onChange={evento => setPesoDoAtributo(atributo.id, evento.target.value)} disabled={salvando} />
                    </label>
                ))}
                <div className={somaValida ? styles.soma : styles.soma_invalida}>Soma dos pesos: {somaPesos.toFixed(2)}{somaValida ? '' : ' (deve ser ≈ 1.00)'}</div>
            </div>

            <footer className={styles.rodape}>
                <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Criar Coeficiente'}</button>
            </footer>
        </section>
    );
};
