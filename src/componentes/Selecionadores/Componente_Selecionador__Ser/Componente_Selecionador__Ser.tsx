'use client';

import styles from './styles.module.css';

import { PathAvatarPadrao } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

// Seletor de Ser jogável — instância do Componente_Selecionador com fonte GraphQL SerJogavel. Devolve o idSer via aoConfirmar.
// Nome do jogável é domínio futuro (cada domínio terá o nome no seu lugar); até lá o rótulo é por id. Sem avatar vinculado → PathAvatarPadrao.
export function Componente_Selecionador__Ser({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (idSer: number) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const listagem = useNoraGraphQLListagem('SerJogavel', {
        select: ['fkSeresId'],
        camposFiltroConsulta: ['fkSeresId'],
        camposFiltroVisualizacao: ['fkSeresId'],
        itensPorPagina: 12,
        carregando: 'Buscando Seres',
        mensagemErro: 'Houve um erro recuperando os Seres',
        mensagemListaVazia: 'Nenhum Ser jogável cadastrado (crie em Cadastro de Novo Ser).',
        mensagemListaVaziaComFiltro: 'Nenhum Ser encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkSeresId: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={ser => ser.fkSeresId}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={ser => (
                <div className={styles.item_ser}>
                    <span className={styles.avatar}><RenderUsuario caminhoArquivoAvatar={PathAvatarPadrao} /></span>
                    <div className={styles.info}>
                        <strong className={styles.nome}>{`Ser #${ser.fkSeresId}`}</strong>
                        <span className={styles.tipo}>Jogável</span>
                    </div>
                </div>
            )}
            aoConfirmar={ser => aoConfirmar(ser.fkSeresId)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar este Ser"
        />
    );
};
