import { useState } from 'react';

import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { ItemPartidaOrbital } from 'Componentes/ElementosDeJogo/ItemPartidaOrbital/ItemPartidaOrbital';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem/contexto';
import type { EncaixeArteCapaPartida } from 'types-nora-api';

type PartidaListagemRegistro = {
    readonly id: number;
    readonly nome: string;
    readonly tipo: string;
    readonly tipoDesafio: string | null;
    readonly partidaConfigurada: boolean;
    readonly arteCapa: { readonly idProjeto: number; readonly encaixe: EncaixeArteCapaPartida } | null;
};

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Listagem() {
    const { iniciaCadastro } = useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem();
    const listagemPartidas = useNoraGraphQLListagem('Partida', {
        select: ['id', 'nome', 'tipo', 'partidaConfigurada', 'tipoDesafio', { arteCapa: ['idProjeto', { encaixe: ['escala', 'deslocamentoX', 'deslocamentoY'] }] }],
        camposFiltroConsulta: ['nome', 'tipo', 'partidaConfigurada'],
        camposFiltroVisualizacao: ['nome', 'tipo', 'partidaConfigurada'],
        itensPorPagina: 60,
        carregando: 'Carregando Partidas',
        mensagemErro: 'Não foi possível carregar as Partidas.',
        mensagemListaVazia: 'Nenhuma Partida cadastrada ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma Partida encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return (
        <ListagemComposta
            listagem={listagemPartidas}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={partida => partida.id}
            renderizarItem={partida => <CardPartida partida={partida} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Nova Partida' }}
        />
    );
};

// Reusa o MESMO item do Orbital (capa enquadrada + nome + estado) na PROPORÇÃO real do Orbital (3.6:1); no hover foca como o item central (zoom + tratamento selecionado do componente) — WYSIWYG com o jogo.
function CardPartida({ partida }: { partida: PartidaListagemRegistro; }) {
    const { selecionaPartida } = useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem();
    const imagem = useImagemCapaArte(partida.arteCapa?.idProjeto ?? null);
    const [focado, setFocado] = useState(false);

    return (
        <div className={`${styles.card} ${focado ? styles.card_focado : ''}`} onMouseEnter={() => setFocado(true)} onMouseLeave={() => setFocado(false)}>
            <ItemPartidaOrbital className={styles.card_orbital} nome={partida.nome} imagemBase64={imagem} encaixe={partida.arteCapa?.encaixe} selecionado={focado} onClick={() => selecionaPartida(partida.id)} />
            <div className={styles.badges}>
                {partida.tipoDesafio && <span className={styles.tag}>{partida.tipoDesafio}</span>}
                <span className={partida.partidaConfigurada ? styles.tag_configurado : styles.tag_pendente}>{partida.partidaConfigurada ? 'Configurado' : 'Não Configurado'}</span>
            </div>
        </div>
    );
};
