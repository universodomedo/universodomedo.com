import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { Renderiza__ImagemUDM__ArteCapaEnquadrada } from 'Uteis/RenderImagemUDM/Renderiza__ImagemUDM__ArteCapaEnquadrada';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Listagem/contexto';

type PartidaListagemRegistro = {
    readonly id: number;
    readonly nome: string;
    readonly tipo: string;
    readonly tipoDesafio: string | null;
    readonly partidaConfigurada: boolean;
    readonly arteCapa: { readonly idProjeto: number } | null;
};

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Listagem() {
    const { iniciaCadastro } = useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem();
    const listagemPartidas = useNoraGraphQLListagem('Partida', {
        select: ['id', 'nome', 'tipo', 'partidaConfigurada', 'tipoDesafio', { arteCapa: ['idProjeto'] }],
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
            itensPorLinha={5}
            obterIdRegistro={partida => partida.id}
            renderizarItem={partida => <CardPartida partida={partida} />}
            novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: iniciaCadastro, textoBotao: 'Nova Partida' }}
        />
    );
};

function CardPartida({ partida }: { partida: PartidaListagemRegistro; }) {
    const { selecionaPartida } = useContexto__PaginaGameDesignerConfiguracaoPartida__Listagem();
    const imagem = useImagemCapaArte(partida.arteCapa?.idProjeto ?? null);

    return (
        <DivClicavel className={styles.card} onClick={() => selecionaPartida(partida.id)} title={partida.nome}>
            <div className={styles.capa}>
                {imagem && <Renderiza__ImagemUDM__ArteCapaEnquadrada imagemBase64={imagem} />}
            </div>
            <div className={styles.tags}>
                {partida.tipoDesafio && <span className={styles.tag}>{partida.tipoDesafio}</span>}
                <span className={partida.partidaConfigurada ? styles.tag_configurado : styles.tag_pendente}>{partida.partidaConfigurada ? 'Configurado' : 'Não Configurado'}</span>
            </div>
        </DivClicavel>
    );
};
