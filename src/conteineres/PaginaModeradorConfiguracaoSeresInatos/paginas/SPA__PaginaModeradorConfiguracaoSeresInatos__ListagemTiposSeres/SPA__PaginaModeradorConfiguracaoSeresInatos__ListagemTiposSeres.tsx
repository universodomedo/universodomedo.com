import styles from '../../styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { VisualizacaoConsolidada } from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/componentes/ComponentesConfiguracaoSeresInatos';
import { useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres/contexto';
import type { RegistroTipoSer } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

export default function SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres() {
    const { listagemTiposSeres, tipoSerConsolidado, iniciaNovoTipoSer, editaTipoSer, visualizaTipoSer, alternaAtivoTipoSer } = useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres();

    return (
        <>
            <ListagemComposta
                listagem={listagemTiposSeres}
                novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaNovoTipoSer, textoBotao: 'Novo Tipo' }}
                modoExibicao={ListagemCompostaModoExibicao.GRADE}
                itensPorLinha={3}
                obterIdRegistro={tipoSer => tipoSer.id}
                renderizarItem={tipoSer => <CardTipoSer tipoSer={tipoSer} editaTipoSer={editaTipoSer} visualizaTipoSer={visualizaTipoSer} alternaAtivoTipoSer={alternaAtivoTipoSer} />}
            />
            {tipoSerConsolidado && <VisualizacaoConsolidada tipoSer={tipoSerConsolidado} />}
        </>
    );
};

function CardTipoSer({ tipoSer, editaTipoSer, visualizaTipoSer, alternaAtivoTipoSer }: { tipoSer: RegistroTipoSer; editaTipoSer: (tipoSer: RegistroTipoSer) => void; visualizaTipoSer: (tipoSer: RegistroTipoSer) => Promise<void>; alternaAtivoTipoSer: (tipoSer: RegistroTipoSer) => Promise<void>; }) {
    return (
        <article className={tipoSer.ativo ? styles.card : styles.card_inativo}>
            <button type="button" className={styles.card_principal} onClick={() => visualizaTipoSer(tipoSer)}>
                <strong>{tipoSer.nome}</strong>
                <span>{tipoSer.descricao}</span>
                <small>{tipoSer.tamanho} · {tipoSer.pesoKg}kg · {tipoSer.capacidades.itens.length} capacidades</small>
            </button>
            <div className={styles.acoes_card}>
                <button type="button" className={styles.botao_secundario} onClick={() => editaTipoSer(tipoSer)}>Editar</button>
                <button type="button" className={styles.botao_secundario} onClick={() => alternaAtivoTipoSer(tipoSer)}>{tipoSer.ativo ? 'Desativar' : 'Reativar'}</button>
            </div>
        </article>
    );
};