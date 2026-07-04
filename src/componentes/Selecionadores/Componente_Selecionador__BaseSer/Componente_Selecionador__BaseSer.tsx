'use client';

import styles from './styles.module.css';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

// Seletor de Base de Ser — instância do Componente_Selecionador com fonte GraphQL BaseSer (molde de membros).
// Devolve { idBaseSer, nome } via aoConfirmar; quem consome busca os membros do molde (REST bases_ser/obter) e preenche o editor.
export function Componente_Selecionador__BaseSer({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (idBaseSer: number, nome: string) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const listagem = useNoraGraphQLListagem('BaseSer', {
        select: ['id', 'nome'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Bases de Ser',
        mensagemErro: 'Houve um erro recuperando as Bases de Ser',
        mensagemListaVazia: 'Nenhuma Base de Ser cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma Base de Ser encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={baseSer => baseSer.id}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={baseSer => (
                <div className={styles.item_base}>
                    <strong className={styles.nome}>{baseSer.nome}</strong>
                </div>
            )}
            aoConfirmar={baseSer => aoConfirmar(baseSer.id, baseSer.nome)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar esta Base"
        />
    );
};
