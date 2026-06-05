import { useCallback, useMemo } from 'react';
import type { TipoParametroFuncionalCapacidade } from 'types-nora-api';

import { criaItemEstruturalCapacidadeFuncional } from './formulario';
import { atualizaIndice, obtemItensEstruturais, removeIndice, substituiItensEstruturais } from './helpers';
import { useAtualizadorParametroAninhado } from './handlersParametrosAninhados';
import type { SetFormularioCapacidadeFuncional } from './persistencia';
import type { GrupoItemEstruturalCapacidade } from './tipos';

export function useHandlersItensCapacidadeFuncional(setFormulario: SetFormularioCapacidadeFuncional, primeiroTipoParametro: () => TipoParametroFuncionalCapacidade | null, normalizaTipoParametro: (tipo: string) => TipoParametroFuncionalCapacidade | null) {
    const parametros = useAtualizadorParametroAninhado(primeiroTipoParametro, normalizaTipoParametro);

    const atualizaItens = useCallback((grupo: GrupoItemEstruturalCapacidade, atualiza: (itens: ReturnType<typeof obtemItensEstruturais>) => ReturnType<typeof obtemItensEstruturais>): void => {
        setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: substituiItensEstruturais(formularioAtual.estrutura, grupo, atualiza(obtemItensEstruturais(formularioAtual.estrutura, grupo))) }));
    }, [setFormulario]);

    const adicionaItemEstrutural = useCallback((grupo: GrupoItemEstruturalCapacidade): void => {
        atualizaItens(grupo, itens => [...itens, criaItemEstruturalCapacidadeFuncional()]);
    }, [atualizaItens]);

    const atualizaItemEstrutural = useCallback((grupo: GrupoItemEstruturalCapacidade, indice: number, campo: 'key' | 'nome' | 'descricao', valor: string): void => {
        atualizaItens(grupo, itens => atualizaIndice(itens, indice, item => ({ ...item, [campo]: valor })));
    }, [atualizaItens]);

    const removeItemEstrutural = useCallback((grupo: GrupoItemEstruturalCapacidade, indice: number): void => {
        atualizaItens(grupo, itens => removeIndice(itens, indice));
    }, [atualizaItens]);

    const atualizaParametroItem = useCallback((grupo: GrupoItemEstruturalCapacidade, indiceItem: number, atualiza: (parametrosAtuais: ReturnType<typeof obtemItensEstruturais>[number]['parametrosFuncionais']) => ReturnType<typeof obtemItensEstruturais>[number]['parametrosFuncionais']): void => {
        atualizaItens(grupo, itens => atualizaIndice(itens, indiceItem, item => ({ ...item, parametrosFuncionais: atualiza(item.parametrosFuncionais) })));
    }, [atualizaItens]);

    return useMemo(() => ({ adicionaItemEstrutural, atualizaItemEstrutural, removeItemEstrutural, adicionaParametroItemEstrutural: (grupo: GrupoItemEstruturalCapacidade, indiceItem: number) => atualizaItens(grupo, itens => atualizaIndice(itens, indiceItem, parametros.adicionaParametro)), atualizaParametroItemEstruturalTipo: (grupo: GrupoItemEstruturalCapacidade, indiceItem: number, indiceParametro: number, tipo: string) => atualizaParametroItem(grupo, indiceItem, params => parametros.atualizaParametroTipo(params, indiceParametro, tipo)), atualizaParametroItemEstruturalNome: (grupo: GrupoItemEstruturalCapacidade, indiceItem: number, indiceParametro: number, nome: string) => atualizaParametroItem(grupo, indiceItem, params => parametros.atualizaParametroNome(params, indiceParametro, nome)), atualizaParametroItemEstruturalValor: (grupo: GrupoItemEstruturalCapacidade, indiceItem: number, indiceParametro: number, valor: string) => atualizaParametroItem(grupo, indiceItem, params => parametros.atualizaParametroValor(params, indiceParametro, valor)), removeParametroItemEstrutural: (grupo: GrupoItemEstruturalCapacidade, indiceItem: number, indiceParametro: number) => atualizaItens(grupo, itens => atualizaIndice(itens, indiceItem, item => parametros.removeParametro(item, indiceParametro))) }), [adicionaItemEstrutural, atualizaItemEstrutural, atualizaItens, atualizaParametroItem, parametros, removeItemEstrutural]);
};
