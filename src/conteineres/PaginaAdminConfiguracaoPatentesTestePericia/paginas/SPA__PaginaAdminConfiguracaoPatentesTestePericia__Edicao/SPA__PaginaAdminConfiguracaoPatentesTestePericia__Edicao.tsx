import { CheckIcon } from '@radix-ui/react-icons';

import { type LinhaEdicaoPatenteTestePericia, useContexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao } from 'Contextos/Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao/contexto';
import styles from './styles.module.css';

export default function SPA__PaginaAdminConfiguracaoPatentesTestePericia__Edicao() {
    const { linhas, configuracaoDisponivel, salvando, erro, alterarIncremento, salvarConfiguracao } = useContexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao();

    return (
        <section className={styles.superficie}>
            <header className={styles.cabecalho}>
                <h2>Patentes de Pericia</h2>
                <button type="button" className={styles.botaoSalvar} onClick={salvarConfiguracao} disabled={!configuracaoDisponivel || salvando}>
                    <CheckIcon />
                    <span>{salvando ? 'Salvando...' : 'Salvar'}</span>
                </button>
            </header>

            {configuracaoDisponivel ? (
                <div className={styles.tabela}>
                    <div className={styles.linhaCabecalho}>
                        <span>Patente</span>
                        <span>Inc. minimo</span>
                        <span>Inc. maximo</span>
                        <span>Min. acumulado</span>
                        <span>Max. acumulado</span>
                    </div>
                    {linhas.map(linha => <LinhaConfiguracaoPatente key={linha.idPatentePericia} linha={linha} salvando={salvando} alterarIncremento={alterarIncremento} />)}
                </div>
            ) : <div className={styles.erro}>Configuracao indisponivel.</div>}

            {erro && <div className={styles.erro}>{erro}</div>}
        </section>
    );
};

function LinhaConfiguracaoPatente({ linha, salvando, alterarIncremento }: { linha: LinhaEdicaoPatenteTestePericia; salvando: boolean; alterarIncremento: (idPatentePericia: number, campo: 'incrementoValorMinimo' | 'incrementoValorMaximo', valor: number) => void; }) {
    return (
        <label className={styles.linhaRegra}>
            <strong>{linha.nomePatente}</strong>
            <input type="number" step={1} value={linha.incrementoValorMinimo} onChange={event => alterarIncremento(linha.idPatentePericia, 'incrementoValorMinimo', Number(event.target.value))} disabled={salvando} />
            <input type="number" step={1} value={linha.incrementoValorMaximo} onChange={event => alterarIncremento(linha.idPatentePericia, 'incrementoValorMaximo', Number(event.target.value))} disabled={salvando} />
            <span>{linha.incrementoValorMinimoAcumulado}</span>
            <span>{linha.incrementoValorMaximoAcumulado}</span>
        </label>
    );
};