import { LIMITES_ANALISE_TESTE_PERICIA } from 'types-nora-api';

import styles from './resultadosAlvo.module.css';

interface PropsResultadosAlvoTestePericiaUdm {
    readonly resultadosAlvo: readonly number[];
    readonly novoResultadoAlvo: number;
    readonly setNovoResultadoAlvo: (resultadoAlvo: number) => void;
    readonly adicionarResultadoAlvo: () => void;
    readonly removerResultadoAlvo: (resultadoAlvo: number) => void;
};

export default function ResultadosAlvoTestePericiaUdm({ resultadosAlvo, novoResultadoAlvo, setNovoResultadoAlvo, adicionarResultadoAlvo, removerResultadoAlvo }: PropsResultadosAlvoTestePericiaUdm) {
    const podeAdicionar = Number.isSafeInteger(novoResultadoAlvo) && Math.abs(novoResultadoAlvo) <= LIMITES_ANALISE_TESTE_PERICIA.resultadoAlvoAbsolutoMaximo && !resultadosAlvo.includes(novoResultadoAlvo) && resultadosAlvo.length < LIMITES_ANALISE_TESTE_PERICIA.quantidadeResultadosAlvoMaxima;

    return (
        <div className={styles.resultadosAlvo}>
            <div className={styles.apresentacaoResultadosAlvo}>
                <strong>Resultados-alvo</strong>
                <span>Compare a chance de cada cenário atingir valores relevantes para a mecânica atual.</span>
            </div>
            <div className={styles.adicionarResultadoAlvo}>
                <label htmlFor="novo-resultado-alvo-udm">Atingir pelo menos</label>
                <input id="novo-resultado-alvo-udm" type="number" min={-LIMITES_ANALISE_TESTE_PERICIA.resultadoAlvoAbsolutoMaximo} max={LIMITES_ANALISE_TESTE_PERICIA.resultadoAlvoAbsolutoMaximo} step={1} value={novoResultadoAlvo} onChange={event => setNovoResultadoAlvo(Number.isSafeInteger(event.target.valueAsNumber) ? event.target.valueAsNumber : 0)} onKeyDown={event => { if (event.key === 'Enter') adicionarResultadoAlvo(); }} />
                <button type="button" onClick={adicionarResultadoAlvo} disabled={!podeAdicionar}>Adicionar</button>
            </div>
            <div className={styles.listaResultadosAlvo}>
                {resultadosAlvo.length === 0 && <span>Nenhum resultado-alvo configurado.</span>}
                {resultadosAlvo.map(resultadoAlvo => <button type="button" key={resultadoAlvo} onClick={() => removerResultadoAlvo(resultadoAlvo)} title={`Remover resultado-alvo ${resultadoAlvo}+`}>{resultadoAlvo}+ <strong>×</strong></button>)}
            </div>
        </div>
    );
};