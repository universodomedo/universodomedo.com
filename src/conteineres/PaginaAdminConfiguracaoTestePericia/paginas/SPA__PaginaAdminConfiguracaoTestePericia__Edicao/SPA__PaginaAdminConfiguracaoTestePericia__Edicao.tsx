import type { LinhaPreviewConfiguracaoTestePericia } from 'types-nora-api';

import styles from './styles.module.css';
import { useContexto__PaginaAdminConfiguracaoTestePericia__Edicao } from 'Contextos/Contexto__PaginaAdminConfiguracaoTestePericia__Edicao/contexto';

export default function SPA__PaginaAdminConfiguracaoTestePericia__Edicao() {
    const { linhasConfiguradas, linhasPreview, salvando, erro, podeRemoverUltimoIntervalo, alterarValorConfigurado, adicionarProximoIntervalo, removerUltimoIntervaloOpcional, salvarConfiguracao } = useContexto__PaginaAdminConfiguracaoTestePericia__Edicao();

    return (
        <section className={styles.recipiente}>
            <div className={styles.painel_regras}>
                <header className={styles.cabecalho}>
                    <h2>Teste de Pericia</h2>
                </header>

                <div className={styles.tabela_regras}>
                    <div className={styles.linha_cabecalho}>
                        <span>Atributo</span>
                        <span>Valor configurado</span>
                        <span>Valor minimo</span>
                        <span>Estado</span>
                    </div>

                    {linhasConfiguradas.map(linha => <LinhaConfiguracao key={linha.valorAtributo} linha={linha} alterarValorConfigurado={alterarValorConfigurado} />)}
                </div>

                <div className={styles.acoes}>
                    <button type="button" className={styles.botao_secundario} onClick={adicionarProximoIntervalo} disabled={salvando}>Adicionar intervalo</button>
                    <button type="button" className={styles.botao_secundario} onClick={removerUltimoIntervaloOpcional} disabled={salvando || !podeRemoverUltimoIntervalo}>Remover ultimo</button>
                    <button type="button" className={styles.botao_principal} onClick={salvarConfiguracao} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                </div>

                {erro && <div className={styles.erro}>{erro}</div>}
            </div>

            <div className={styles.painel_preview}>
                <header className={styles.cabecalho}>
                    <h2>Preview</h2>
                </header>

                <div className={styles.lista_preview}>
                    {linhasPreview.map(linha => <LinhaPreview key={linha.valorAtributo} linha={linha} />)}
                </div>
            </div>
        </section>
    );
};

function LinhaConfiguracao({ linha, alterarValorConfigurado }: { linha: LinhaPreviewConfiguracaoTestePericia; alterarValorConfigurado: (valorAtributo: number, valorConfigurado: number) => void; }) {
    return (
        <label className={styles.linha_regra}>
            <span>{linha.valorAtributo}</span>
            <input type="number" min={linha.valorAtributo === 1 ? 0 : 1} step={1} value={linha.valorConfigurado} onChange={event => alterarValorConfigurado(linha.valorAtributo, Number(event.target.value))} />
            <strong>{linha.valorMinimo}</strong>
            <em>{linha.obrigatorio ? 'Obrigatorio' : 'Configurado'}</em>
        </label>
    );
};

function LinhaPreview({ linha }: { linha: LinhaPreviewConfiguracaoTestePericia; }) {
    return (
        <div className={styles.linha_preview}>
            <span>{linha.valorAtributo}</span>
            <span>{linha.valorConfigurado}</span>
            <strong>{linha.valorMinimo}</strong>
        </div>
    );
};
