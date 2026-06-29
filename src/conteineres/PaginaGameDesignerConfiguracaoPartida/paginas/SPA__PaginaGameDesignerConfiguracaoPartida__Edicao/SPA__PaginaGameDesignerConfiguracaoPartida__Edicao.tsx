import styles from './styles.module.css';

import type { TipoPartida } from 'types-nora-api';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

const ROTULOS_TIPO_PARTIDA: Record<TipoPartida, string> = { MISSAO: 'Missão', DESAFIO: 'Desafio' };

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Edicao() {
    const { partida, salvando, nome, setNome, podeSalvarNome, salvarNome, configurarRuntime, configurarDetalhes, deletar } = useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao();

    return (
        <section className={styles.edicao}>
            <div className={styles.cabecalho}>
                <span className={styles.selo}>{ROTULOS_TIPO_PARTIDA[partida.tipo]}{partida.tipoDesafio ? ` · ${partida.tipoDesafio}` : ''}</span>
                <span className={partida.partidaConfigurada ? styles.selo_ok : styles.selo_pendente}>{partida.partidaConfigurada ? 'Configurada' : 'Sem configuração'}</span>
            </div>

            <label className={styles.campo}>
                <span>Nome</span>
                <div className={styles.linha}>
                    <input type="text" value={nome} onChange={evento => setNome(evento.target.value)} maxLength={255} disabled={salvando} />
                    <button type="button" className={styles.botao_secundario} onClick={() => void salvarNome()} disabled={!podeSalvarNome || salvando}>Salvar nome</button>
                </div>
            </label>

            <p className={styles.dica}>A exibição e a ordem desta Partida em cada catálogo são geridas em <strong>Catálogos de Partida</strong> (Adicionar Partida ao catálogo). A Partida em si está sempre acessível.</p>

            <div className={styles.acoes}>
                <button type="button" className={styles.botao_principal} onClick={configurarRuntime}>Configurar Runtime</button>
                <button type="button" className={styles.botao_principal} onClick={() => void configurarDetalhes()} disabled={salvando}>Configurar Detalhes</button>
                <button type="button" className={styles.botao_perigo} onClick={() => void deletar()} disabled={salvando}>Deletar Partida</button>
            </div>
        </section>
    );
};
