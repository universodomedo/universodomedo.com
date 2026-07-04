'use client';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

// Seletor de Passe — instância do Componente_Selecionador com fonte GraphQL 'Passe'. Devolve { id, nome } via aoConfirmar.
export function Componente_Selecionador__Passe({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (id: number, nome: string) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const listagem = useNoraGraphQLListagem('Passe', {
        select: ['id', 'codigoInterno', 'nome', 'ativo'],
        camposFiltroConsulta: ['codigoInterno', 'nome'],
        camposFiltroVisualizacao: ['codigoInterno', 'nome'],
        itensPorPagina: 50,
        carregando: 'Buscando passes',
        mensagemErro: 'Houve um erro recuperando os passes',
        mensagemListaVazia: 'Nenhum passe cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum passe encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={passe => passe.id}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={passe => <span><strong>{passe.nome}</strong> — {passe.codigoInterno}</span>}
            aoConfirmar={passe => aoConfirmar(passe.id, passe.nome)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar este passe"
        />
    );
};
