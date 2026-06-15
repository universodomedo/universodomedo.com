import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerSeres__CriarFicha } from 'Contextos/Contexto__PaginaGameDesignerSeres__CriarFicha/contexto';
import { ID_PATENTE_PADRAO, VALOR_PADRAO_ATRIBUTO, VALOR_PADRAO_ESTATISTICA } from 'Contextos/Contexto__PaginaGameDesignerSeres__CriarFicha/fichaSerEditor';

export default function SPA__PaginaGameDesignerSeres__CriarFicha() {
    const contexto = useContexto__PaginaGameDesignerSeres__CriarFicha();

    if (!contexto.pronto) return <section className={styles.editor}><p>Carregando referências...</p></section>;

    return (
        <section className={styles.editor}>
            <header className={styles.cabecalho}>
                <button type="button" className={styles.botao_voltar} onClick={contexto.voltar} disabled={contexto.salvando}>← Voltar</button>
                <h2>Criar Ficha do Ser</h2>
            </header>

            {!contexto.classeSerDisponivel && <p className={styles.erro}>Classe dedicada a Seres não encontrada no cache. Cadastre a Classe-Ser para habilitar o salvamento.</p>}

            <div className={styles.bloco}>
                <h3>Atributos</h3>
                <div className={styles.grade}>
                    {contexto.atributos.map(atributo => (
                        <label key={atributo.id} className={styles.campo}>
                            <span>{atributo.nome}</span>
                            <input type="number" value={contexto.valoresAtributos[atributo.id] ?? VALOR_PADRAO_ATRIBUTO} onChange={evento => contexto.setValorAtributo(atributo.id, Number(evento.target.value))} disabled={contexto.salvando} />
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.bloco}>
                <h3>Perícias</h3>
                {contexto.periciasPorAtributo.map(grupo => (
                    <div key={grupo.atributo.id} className={styles.grupo_pericias}>
                        <h4>{grupo.atributo.nome}</h4>
                        <div className={styles.grade}>
                            {grupo.pericias.map(pericia => (
                                <label key={pericia.id} className={styles.campo}>
                                    <span>{pericia.nome}</span>
                                    <select value={contexto.patentesPericias[pericia.id] ?? ID_PATENTE_PADRAO} onChange={evento => contexto.setPatentePericia(pericia.id, Number(evento.target.value))} disabled={contexto.salvando}>
                                        {contexto.patentes.map(patente => <option key={patente.id} value={patente.id}>{patente.nome}</option>)}
                                    </select>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.bloco}>
                <h3>Estatísticas</h3>
                <div className={styles.grade}>
                    {contexto.estatisticas.map(estatistica => (
                        <label key={estatistica.id} className={styles.campo}>
                            <span>{estatistica.nome}</span>
                            <input type="number" value={contexto.valoresEstatisticas[estatistica.id] ?? VALOR_PADRAO_ESTATISTICA} onChange={evento => contexto.setValorEstatistica(estatistica.id, Number(evento.target.value))} disabled={contexto.salvando} />
                        </label>
                    ))}
                </div>
            </div>

            <footer className={styles.rodape}>
                <button type="button" className={styles.botao_salvar} onClick={contexto.salvar} disabled={!contexto.podeSalvar}>{contexto.salvando ? 'Salvando...' : 'Salvar Ficha'}</button>
            </footer>
        </section>
    );
};
