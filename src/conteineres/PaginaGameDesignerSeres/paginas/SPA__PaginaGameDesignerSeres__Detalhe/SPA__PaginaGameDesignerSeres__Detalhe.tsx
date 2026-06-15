import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerSeres__Detalhe } from 'Contextos/Contexto__PaginaGameDesignerSeres__Detalhe/contexto';

export default function SPA__PaginaGameDesignerSeres__Detalhe() {
    const { idSerEmEdicao, carregando, erro, nome, tipoNome, ehJogavel, nivelNome, usuarioCriacaoNome, abrirEditorMembros } = useContexto__PaginaGameDesignerSeres__Detalhe();

    if (carregando) return <section className={styles.detalhe}><p>Carregando Ser...</p></section>;
    if (erro) return <section className={styles.detalhe}><p className={styles.erro}>{erro}</p></section>;

    return (
        <section className={styles.detalhe}>
            <header className={styles.cabecalho}>
                <h2>{nome ?? `Ser #${idSerEmEdicao}`}</h2>
            </header>

            <dl className={styles.dados}>
                <div><dt>Tipo</dt><dd>{tipoNome ?? '—'}</dd></div>
                <div><dt>Jogável</dt><dd>{ehJogavel ? 'Sim' : 'Não'}</dd></div>
                {ehJogavel && <div><dt>Nível</dt><dd>{nivelNome ?? '—'}</dd></div>}
                <div><dt>Criado por</dt><dd>{usuarioCriacaoNome ?? '—'}</dd></div>
            </dl>

            {/* Entradas para os fluxos reais (membros/ficha) das próximas etapas */}
            {ehJogavel && (
                <div className={styles.acoes}>
                    <button type="button" className={styles.botao_acao} onClick={abrirEditorMembros}>Editar Capacidades Inatas</button>
                    <button type="button" className={styles.botao_acao} onClick={() => undefined}>Criar Ficha</button>
                </div>
            )}
        </section>
    );
};
