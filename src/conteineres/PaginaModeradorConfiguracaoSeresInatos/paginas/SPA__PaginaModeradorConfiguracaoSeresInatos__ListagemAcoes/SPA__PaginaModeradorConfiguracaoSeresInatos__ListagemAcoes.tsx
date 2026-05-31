import styles from '../../styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes/contexto';
import type { RegistroAcaoInata } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

export default function SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes() {
    const { listagemAcoes, iniciaNovaAcao, editaAcao, alternaAtivoAcao } = useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes();

    return (
        <ListagemComposta
            listagem={listagemAcoes}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaNovaAcao, textoBotao: 'Nova Ação' }}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={3}
            obterIdRegistro={acao => acao.id}
            renderizarItem={acao => <CardAcao acao={acao} editaAcao={editaAcao} alternaAtivoAcao={alternaAtivoAcao} />}
        />
    );
};

function CardAcao({ acao, editaAcao, alternaAtivoAcao }: { acao: RegistroAcaoInata; editaAcao: (acao: RegistroAcaoInata) => void; alternaAtivoAcao: (acao: RegistroAcaoInata) => Promise<void>; }) {
    return (
        <article className={acao.ativo ? styles.card : styles.card_inativo}>
            <button type="button" className={styles.card_principal} onClick={() => editaAcao(acao)}>
                <strong>{acao.nome}</strong>
                <span>{acao.descricao}</span>
                <small>{acao.categoria} · {acao.parametros.itens.length} parâmetros</small>
            </button>
            <button type="button" className={styles.botao_secundario} onClick={() => alternaAtivoAcao(acao)}>{acao.ativo ? 'Desativar' : 'Reativar'}</button>
        </article>
    );
};