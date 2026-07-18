'use client';

import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import { useContextoPaginaSessoes__SemSessaoSelecionada } from 'Contextos/ContextoPaginaSessoes__SemSessaoSelecionada/contexto';
import { SessaoListagemContextoRegistro } from 'Contextos/ContextoPaginasListagemSessoes/contexto';

export default function SPA__PaginaSessoes__SemSessaoSelecionada() {
    const { listagemSessoes, selecionaSessao } = useContextoPaginaSessoes__SemSessaoSelecionada();

    return (
        <ListagemComposta
            listagem={listagemSessoes}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={5}
            obterIdRegistro={sessao => sessao.id}
            renderizarItem={sessao => <ItemSessao sessao={sessao} aoSelecionar={selecionaSessao} />}
        />
    );
};

function ItemSessao({ sessao, aoSelecionar }: { sessao: SessaoListagemContextoRegistro; aoSelecionar: (idSessao: number) => void; }) {
    return (
        <DivClicavel className={styles.item_sessao} onClick={() => { aoSelecionar(sessao.id); }} title={sessao.tituloInteligente.tituloCompleto}>
            <RenderArquivoArteCapa caminhoArquivoArte={sessao.dadosArteCapa.caminhoArquivoArteCapa} />
            <div className={styles.avatar_narrador}>
                <AvatarUsuarioEmVisualizacao_CACHED idUsuario={sessao.usuarioMestre.id} />
            </div>
            <div className={styles.detalhe_data}>{sessao.detalheData}</div>
        </DivClicavel>
    );
};
