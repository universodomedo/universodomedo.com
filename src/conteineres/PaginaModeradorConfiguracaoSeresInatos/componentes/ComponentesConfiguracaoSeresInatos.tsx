import styles from '../styles.module.css';

import type { AbaConfiguracaoSeresInatos, ValorParametroFormulario } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/contexto';
import type { VIEW_TipoSerInatoConsolidadoDto } from 'types-nora-api';

const ABAS: readonly { chave: AbaConfiguracaoSeresInatos; nome: string; }[] = [
    { chave: 'acoes', nome: 'Ações' },
    { chave: 'capacidades', nome: 'Capacidades' },
    { chave: 'tipos', nome: 'Tipos de Ser' },
];

export function AbasConfiguracaoSeresInatos({ abaAtual, selecionaListagemAcoes, selecionaListagemCapacidades, selecionaListagemTiposSeres }: { abaAtual: AbaConfiguracaoSeresInatos; selecionaListagemAcoes: () => void; selecionaListagemCapacidades: () => void; selecionaListagemTiposSeres: () => void; }) {
    return (
        <nav className={styles.abas}>
            {ABAS.map(aba => <button key={aba.chave} type="button" className={abaAtual === aba.chave ? styles.aba_ativa : styles.aba} onClick={() => selecionaAba(aba.chave, selecionaListagemAcoes, selecionaListagemCapacidades, selecionaListagemTiposSeres)}>{aba.nome}</button>)}
        </nav>
    );
};

function selecionaAba(aba: AbaConfiguracaoSeresInatos, selecionaListagemAcoes: () => void, selecionaListagemCapacidades: () => void, selecionaListagemTiposSeres: () => void): void {
    if (aba === 'acoes') selecionaListagemAcoes();
    else if (aba === 'capacidades') selecionaListagemCapacidades();
    else selecionaListagemTiposSeres();
};

export function CabecalhoFormulario({ titulo, aoVoltar }: { titulo: string; aoVoltar: () => void; }) {
    return (
        <header className={styles.cabecalho_formulario}>
            <h2>{titulo}</h2>
            <button type="button" onClick={aoVoltar}>Voltar</button>
        </header>
    );
};

export function SelectOpcao({ label, value, opcoes, onChange }: { label: string; value: string; opcoes: readonly { readonly chave: string; readonly nome: string; }[]; onChange: (value: string) => void; }) {
    return (
        <label className={styles.campo}>
            <span>{label}</span>
            <select value={value} onChange={evento => onChange(evento.target.value)}>
                <option value="">Selecione</option>
                {opcoes.map(opcao => <option key={opcao.chave} value={opcao.chave}>{opcao.nome}</option>)}
            </select>
        </label>
    );
};

export function InputParametro({ parametro, onChange }: { parametro: ValorParametroFormulario; onChange: (valor: string) => void; }) {
    return (
        <label className={styles.campo_parametro}>
            <span>{parametro.nome}{parametro.unidade ? ` (${parametro.unidade})` : ''}</span>
            <input type="number" value={parametro.valor} onChange={evento => onChange(evento.target.value)} />
        </label>
    );
};

export function VisualizacaoConsolidada({ tipoSer }: { tipoSer: VIEW_TipoSerInatoConsolidadoDto; }) {
    return (
        <section className={styles.consolidado}>
            <header>
                <span>Visualização consolidada</span>
                <h3>{tipoSer.nome}</h3>
            </header>
            <div className={styles.resumo_consolidado}>
                <span>{tipoSer.tamanho}</span>
                <span>{tipoSer.pesoKg}kg</span>
                <span>{tipoSer.limiteCargaKg}kg carga</span>
                <span>{tipoSer.raciocinio}</span>
                <span>{tipoSer.comunicacao}</span>
            </div>
            {tipoSer.capacidades.map(capacidade => (
                <article key={capacidade.id} className={styles.capacidade_consolidada}>
                    <strong>{capacidade.nome}</strong>
                    <span>{capacidade.origemCorporal}{capacidade.quantidade ? ` (${capacidade.quantidade})` : ''}</span>
                    <div>
                        {capacidade.acoes.map(acao => (
                            <p key={acao.id}>
                                <b>{acao.nome}</b>
                                <small>{acao.parametrosFinais.map(parametro => `${parametro.chave}: ${parametro.valor}`).join(' · ') || 'sem parâmetros'}</small>
                            </p>
                        ))}
                    </div>
                </article>
            ))}
        </section>
    );
};