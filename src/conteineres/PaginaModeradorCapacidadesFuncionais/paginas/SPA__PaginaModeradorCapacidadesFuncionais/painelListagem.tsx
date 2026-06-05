import botoes from './botoes.module.css';
import styles from './styles.module.css';

import type { RegistroCapacidadeFuncional } from 'Contextos/Contexto__PaginaModeradorCapacidadesFuncionais/tipos';
import type { ContextoCapacidades } from './SPA__PaginaModeradorCapacidadesFuncionais';

export default function PainelListagemCapacidadesFuncionais({ contexto }: { contexto: ContextoCapacidades; }) {
    const { listagemCapacidadesFuncionais, selecionaCapacidade, novaCapacidade } = contexto;
    const carregarMais = listagemCapacidadesFuncionais.carregarMais;

    return (
        <aside className={styles.painel_listagem}>
            <header className={styles.cabecalho_painel}>
                <span>Catálogo funcional</span>
                <button type="button" className={botoes.botao_secundario} onClick={novaCapacidade}>Nova</button>
            </header>
            {listagemCapacidadesFuncionais.carregando && <p className={styles.estado}>{listagemCapacidadesFuncionais.carregando}</p>}
            {listagemCapacidadesFuncionais.erro && <p className={styles.estado_erro}>{listagemCapacidadesFuncionais.erro}</p>}
            {!listagemCapacidadesFuncionais.carregando && !listagemCapacidadesFuncionais.erro && listagemCapacidadesFuncionais.registros.length === 0 && <p className={styles.estado}>{listagemCapacidadesFuncionais.mensagemListaVazia}</p>}
            <div className={styles.lista_capacidades}>
                {listagemCapacidadesFuncionais.registros.map(capacidade => <CardCapacidade key={capacidade.id} capacidade={capacidade} selecionaCapacidade={selecionaCapacidade} />)}
            </div>
            {carregarMais?.podeCarregarMais && <button type="button" className={botoes.botao_secundario} onClick={carregarMais.aoCarregarMais} disabled={!!carregarMais.carregando}>{carregarMais.carregando ?? 'Carregar mais'}</button>}
        </aside>
    );
};

function CardCapacidade({ capacidade, selecionaCapacidade }: { capacidade: RegistroCapacidadeFuncional; selecionaCapacidade: ContextoCapacidades['selecionaCapacidade']; }) {
    return (
        <button type="button" className={styles.card_capacidade} onClick={() => selecionaCapacidade(capacidade.id)}>
            <strong>{capacidade.nome}</strong>
            <span>{capacidade.key}</span>
            <small>{capacidade.ativa ? 'Ativa' : 'Inativa'} · {capacidade.estruturaResumo.naturezasFuncionaisTexto || 'Sem natureza'}</small>
            <small>{capacidade.estruturaResumo.quantidadeOperacoesFuncionais} operações · {capacidade.estruturaResumo.quantidadeParametrosAceitos} parâmetros aceitos</small>
        </button>
    );
};
