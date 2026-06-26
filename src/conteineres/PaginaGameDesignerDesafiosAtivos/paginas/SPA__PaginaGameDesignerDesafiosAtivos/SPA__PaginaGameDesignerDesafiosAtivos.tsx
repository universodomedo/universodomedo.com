import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerDesafiosAtivos } from 'Contextos/Contexto__PaginaGameDesignerDesafiosAtivos/contexto';
import type { DesafioAtivoResumo, SelecaoDesafioPeriodoResumo, TipoPainelAtivos } from 'types-nora-api';

// Inspetor de Desafios — visão SOMENTE LEITURA (por tipo: desafio ativo / publicados / histórico recente).
// As FERRAMENTAS DE TESTE foram removidas (os domínios rotativos e participação/leaderboard só serão
// exercitados quando o jogo/runtime existir). Removidas daqui, preservadas no histórico git:
//   - barra "Instante simulado" (datetime-local) para simular a virada de período;
//   - botão "Garantir / Avançar" (materializa a instância do período);
//   - bloco "Participação" (editor de política + "Registrar tentativa");
//   - registrar resultado + leaderboard da instância.
// Ver também a nota de reativação no Contexto__PaginaGameDesignerDesafiosAtivos.

export default function SPA__PaginaGameDesignerDesafiosAtivos() {
    const contexto = useContexto__PaginaGameDesignerDesafiosAtivos();

    return (
        <section className={styles.pagina}>
            {contexto.erro && <div className={styles.alerta}>{contexto.erro}</div>}

            {contexto.carregando && !contexto.painel
                ? <section className={styles.estado}>Carregando...</section>
                : (
                    <div className={styles.lista_categorias}>
                        {(contexto.painel?.tipos ?? []).map(tipo => <TipoCard key={tipo.tipo} tipoPainel={tipo} />)}
                        {(contexto.painel?.tipos.length ?? 0) === 0 && <section className={styles.estado}>Nenhum tipo de Desafio disponível.</section>}
                    </div>
                )}
        </section>
    );
};

function TipoCard({ tipoPainel }: { tipoPainel: TipoPainelAtivos; }) {
    return (
        <article className={styles.categoria}>
            <header className={styles.cabecalho_categoria}>
                <div className={styles.dados_categoria}>
                    <strong>{tipoPainel.rotulo} <span className={styles.selo}>{tipoPainel.rotativo ? 'Rotativo' : 'Fixo'}</span></strong>
                </div>
            </header>

            {tipoPainel.rotativo && (
                <div className={styles.bloco_ativo}>
                    <span className={styles.rotulo_bloco}>Período {tipoPainel.periodoChave ?? '—'}</span>
                    {tipoPainel.desafioAtivo
                        ? <strong className={styles.ativo_nome}>Desafio ativo: {tipoPainel.desafioAtivo.nome}</strong>
                        : <em className={styles.ativo_vazio}>Ainda não materializado</em>}
                </div>
            )}

            <ListaPublicados publicados={tipoPainel.desafiosPublicados} />

            {tipoPainel.rotativo && <HistoricoRecente selecoes={tipoPainel.historicoRecente} />}
        </article>
    );
};

function ListaPublicados({ publicados }: { publicados: readonly DesafioAtivoResumo[]; }) {
    return (
        <section className={styles.bloco_lista}>
            <span className={styles.rotulo_bloco}>Publicados ({publicados.length})</span>
            {publicados.length === 0
                ? <em className={styles.lista_vazia}>Nenhum desafio publicado.</em>
                : <div className={styles.lista_itens}>{publicados.map(desafio => <span key={desafio.id} className={styles.item_lista}>{desafio.nome}</span>)}</div>}
        </section>
    );
};

function HistoricoRecente({ selecoes }: { selecoes: readonly SelecaoDesafioPeriodoResumo[]; }) {
    return (
        <section className={styles.bloco_lista}>
            <span className={styles.rotulo_bloco}>Histórico recente ({selecoes.length})</span>
            {selecoes.length === 0
                ? <em className={styles.lista_vazia}>Sem histórico.</em>
                : <div className={styles.lista_itens}>{selecoes.map(selecao => <span key={selecao.periodoChave} className={styles.item_historico}><strong>{selecao.periodoChave}</strong> · {selecao.desafio.nome}</span>)}</div>}
        </section>
    );
};
