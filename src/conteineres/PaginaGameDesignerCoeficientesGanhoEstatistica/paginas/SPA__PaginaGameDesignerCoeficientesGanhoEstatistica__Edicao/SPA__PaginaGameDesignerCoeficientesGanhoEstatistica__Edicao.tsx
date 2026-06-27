import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao } from 'Contextos/Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao/contexto';

export default function SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao() {
    const { classeNome, estatisticaNome, atributos, valorCoeficiente, setValorCoeficiente, pesoDoAtributo, setPesoDoAtributo, somaPesos, somaValida, salvando, podeSalvar, salvar } = useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao();

    return (
        <section className={styles.recipiente}>
            <header className={styles.cabecalho}>
                <h2>{classeNome} · {estatisticaNome}</h2>
            </header>

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
                <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Salvar Coeficiente'}</button>
            </footer>
        </section>
    );
};
