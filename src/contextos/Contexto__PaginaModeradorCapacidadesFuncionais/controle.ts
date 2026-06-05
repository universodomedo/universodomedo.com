import { useMemo } from 'react';

import { useHandlersCamposCapacidadeFuncional } from './handlersCampos';
import { useHandlersItensCapacidadeFuncional } from './handlersItens';
import { useHandlersOperacoesCapacidadeFuncional } from './handlersOperacoes';
import { usePersistenciaCapacidadeFuncional } from './persistencia';
import type { Contexto__PaginaModeradorCapacidadesFuncionais__Props } from './tipos';

export function useControlePaginaModeradorCapacidadesFuncionais(): Contexto__PaginaModeradorCapacidadesFuncionais__Props {
    const persistencia = usePersistenciaCapacidadeFuncional();
    const campos = useHandlersCamposCapacidadeFuncional(persistencia.setFormulario, persistencia.primeiroTipoParametro, persistencia.normalizaTipoParametro);
    const itens = useHandlersItensCapacidadeFuncional(persistencia.setFormulario, persistencia.primeiroTipoParametro, persistencia.normalizaTipoParametro);
    const operacoes = useHandlersOperacoesCapacidadeFuncional(persistencia.setFormulario, persistencia.primeiroTipoParametro, persistencia.normalizaTipoParametro);

    return useMemo(() => ({
        listagemCapacidadesFuncionais: persistencia.listagemCapacidadesFuncionais,
        formulario: persistencia.formulario,
        modoFormulario: persistencia.modoFormulario,
        opcoes: persistencia.opcoes,
        carregandoOpcoes: persistencia.carregandoOpcoes,
        erroOpcoes: persistencia.erroOpcoes,
        carregandoDetalhe: persistencia.carregandoDetalhe,
        erroDetalhe: persistencia.erroDetalhe,
        salvando: persistencia.salvando,
        podeSalvar: persistencia.podeSalvar,
        novaCapacidade: persistencia.novaCapacidade,
        selecionaCapacidade: persistencia.selecionaCapacidade,
        salvaCapacidade: persistencia.salvaCapacidade,
        desativaSelecionada: persistencia.desativaSelecionada,
        reativaSelecionada: persistencia.reativaSelecionada,
        ...campos,
        ...operacoes,
        ...itens,
    }), [campos, itens, operacoes, persistencia]);
};
