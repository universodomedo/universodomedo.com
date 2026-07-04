'use client';

import styles from './styles.module.css';

import { PathAvatarPadrao } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

// Seletor de Ser — instância do Componente_Selecionador com fonte GraphQL SerDetalhe. Devolve { idSer, nome } via aoConfirmar.
// Ser ainda não tem avatar vinculado → usa PathAvatarPadrao.
export function Componente_Selecionador__Ser({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (idSer: number, nome: string) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const listagem = useNoraGraphQLListagem('SerDetalhe', {
        select: ['fkSerId', 'nome', 'tipoSerNome'],
        // Só Seres PRONTOS pra partida: com ficha e em dia. evolucaoPendente=false inner-joina o vínculo de ficha (exclui Ser SEM ficha — que quebra o início da Partida com "Ficha do Ser não encontrada") e também exclui ficha pendente. Ser pendente não deve ser selecionável.
        whereFixo: { evolucaoPendente: false },
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Seres',
        mensagemErro: 'Houve um erro recuperando os Seres',
        mensagemListaVazia: 'Nenhum Ser cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Ser encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={ser => ser.fkSerId}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={ser => (
                <div className={styles.item_ser}>
                    <span className={styles.avatar}><RenderUsuario caminhoArquivoAvatar={PathAvatarPadrao} /></span>
                    <div className={styles.info}>
                        <strong className={styles.nome}>{ser.nome}</strong>
                        <span className={styles.tipo}>{ser.tipoSerNome}</span>
                    </div>
                </div>
            )}
            aoConfirmar={ser => aoConfirmar(ser.fkSerId, ser.nome)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar este Ser"
        />
    );
};
