import type { AcaoSalaJogoAuditoriaVisualizada, MensagemSalaJogo } from 'types-nora-api';

import styles from './styles.module.css';
import { useContexto__PaginaAdminAuditoriaSalaDeJogo__Listagem } from 'Contextos/Contexto__PaginaAdminAuditoriaSalaDeJogo__Listagem/contexto';

export default function SPA__PaginaAdminAuditoriaSalaDeJogo__Listagem() {
    const { acoes, carregando, erro } = useContexto__PaginaAdminAuditoriaSalaDeJogo__Listagem();

    if (carregando) return <section className={styles.estado}><p>Carregando acoes...</p></section>;
    if (erro) return <section className={styles.estado_erro}><p>{erro}</p></section>;
    if (acoes.length === 0) return <section className={styles.estado}><p>Nenhuma acao registrada no runtime.</p></section>;

    return (
        <section className={styles.feed}>
            {acoes.map(acao => <RegistroAuditoria key={`${acao.referenciaAcao.codigoSala}:${acao.referenciaAcao.idAcao}`} acao={acao} />)}
        </section>
    );
};

function RegistroAuditoria({ acao }: { acao: AcaoSalaJogoAuditoriaVisualizada; }) {
    return (
        <article className={styles.registro}>
            <div className={styles.mensagem}>
                <RenderMensagem mensagem={acao.mensagem} nivel={0} />
            </div>

            <div className={styles.metadados}>
                <span>Sala {acao.acao.codigoSala}</span>
                <span>Acao #{acao.acao.id}</span>
                <span>{acao.acao.segundoDaPartida}s</span>
                <span>{obtemOrigem(acao)}</span>
                <span>{acao.acao.payload.modoExecucaoTeste}</span>
            </div>
        </article>
    );
};

function RenderMensagem({ mensagem, nivel }: { mensagem: MensagemSalaJogo; nivel: number; }) {
    if (mensagem.subNivel.mensagens.length === 0) return <p className={styles.linha_detalhe} style={{ marginLeft: `${nivel * 1.15}em` }}>{mensagem.mensagem}</p>;

    return (
        <details className={nivel === 0 ? styles.detalhe_raiz : styles.detalhe} style={{ marginLeft: `${nivel * 1.15}em` }}>
            <summary>{mensagem.mensagem}</summary>
            <div className={styles.subnivel}>
                {mensagem.subNivel.mensagens.map((subMensagem, index) => <RenderMensagem key={index} mensagem={subMensagem} nivel={nivel + 1} />)}
            </div>
        </details>
    );
};

function obtemOrigem(acao: AcaoSalaJogoAuditoriaVisualizada): string {
    if (acao.acao.origem.tipo === 'jogador') return 'Jogador';
    if (acao.acao.origem.tipo === 'participante_narrador') return 'Narrador';
    return 'Sistema';
};