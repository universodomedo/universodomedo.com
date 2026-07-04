'use client';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

// Seletor de Produto — instância do Componente_Selecionador com fonte GraphQL 'Produto'. Devolve { id, nome } via aoConfirmar.
export function Componente_Selecionador__Produto({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (id: number, nome: string) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const listagem = useNoraGraphQLListagem('Produto', {
        select: ['id', 'codigoInterno', 'nome', 'ativo'],
        camposFiltroConsulta: ['codigoInterno', 'nome'],
        camposFiltroVisualizacao: ['codigoInterno', 'nome'],
        itensPorPagina: 50,
        carregando: 'Buscando produtos',
        mensagemErro: 'Houve um erro recuperando os produtos',
        mensagemListaVazia: 'Nenhum produto cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum produto encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={produto => produto.id}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={produto => <span><strong>{produto.nome}</strong> — {produto.codigoInterno}</span>}
            aoConfirmar={produto => aoConfirmar(produto.id, produto.nome)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar este produto"
        />
    );
};
