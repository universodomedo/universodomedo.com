import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem/contexto';
import type { PartidaResumo, TipoPartida } from 'types-nora-api';

const ROTULOS_TIPO_PARTIDA: Record<TipoPartida, string> = { MISSAO: 'Missão', DESAFIO: 'Desafio' };

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Listagem() {
    const { listagemPartidas, iniciaCadastro } = useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem();

    return (
        <ListagemComposta
            listagem={listagemPartidas}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={partida => partida.id}
            renderizarItem={partida => <RenderizaRegistroPartida partida={partida} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Nova Partida' }}
        />
    );
};

function RenderizaRegistroPartida({ partida }: { partida: PartidaResumo; }) {
    const { selecionaPartida } = useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem();

    return (
        <button type="button" className={styles.registro} onClick={() => selecionaPartida(partida.id)}>
            <strong className={styles.nome}>{partida.nome}</strong>
            <span className={styles.selo}>{ROTULOS_TIPO_PARTIDA[partida.tipo]}{partida.tipoDesafio ? ` · ${partida.tipoDesafio}` : ''}</span>
            <span className={partida.partidaConfigurada ? styles.selo_ok : styles.selo_pendente}>{partida.partidaConfigurada ? 'Configurada' : 'Sem configuração'}</span>
        </button>
    );
};
