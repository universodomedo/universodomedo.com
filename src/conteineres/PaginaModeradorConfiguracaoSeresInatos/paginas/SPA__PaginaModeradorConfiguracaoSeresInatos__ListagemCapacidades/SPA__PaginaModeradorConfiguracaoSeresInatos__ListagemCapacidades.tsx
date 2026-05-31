import styles from '../../styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades/contexto';
import type { RegistroCapacidadeInata } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

export default function SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades() {
    const { listagemCapacidades, iniciaNovaCapacidade, editaCapacidade, alternaAtivoCapacidade } = useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades();

    return (
        <ListagemComposta
            listagem={listagemCapacidades}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaNovaCapacidade, textoBotao: 'Nova Capacidade' }}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={3}
            obterIdRegistro={capacidade => capacidade.id}
            renderizarItem={capacidade => <CardCapacidade capacidade={capacidade} editaCapacidade={editaCapacidade} alternaAtivoCapacidade={alternaAtivoCapacidade} />}
        />
    );
};

function CardCapacidade({ capacidade, editaCapacidade, alternaAtivoCapacidade }: { capacidade: RegistroCapacidadeInata; editaCapacidade: (capacidade: RegistroCapacidadeInata) => void; alternaAtivoCapacidade: (capacidade: RegistroCapacidadeInata) => Promise<void>; }) {
    return (
        <article className={capacidade.ativo ? styles.card : styles.card_inativo}>
            <button type="button" className={styles.card_principal} onClick={() => editaCapacidade(capacidade)}>
                <strong>{capacidade.nome}</strong>
                <span>{capacidade.origemCorporal}{capacidade.quantidade ? ` (${capacidade.quantidade})` : ''}</span>
                <small>{capacidade.acoes.itens.length} ações</small>
            </button>
            <button type="button" className={styles.botao_secundario} onClick={() => alternaAtivoCapacidade(capacidade)}>{capacidade.ativo ? 'Desativar' : 'Reativar'}</button>
        </article>
    );
};