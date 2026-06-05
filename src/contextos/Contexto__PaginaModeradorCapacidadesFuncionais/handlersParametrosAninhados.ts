import { useCallback } from 'react';
import type { ParametroFuncionalCapacidade, TipoParametroFuncionalCapacidade } from 'types-nora-api';

import { criaParametroFuncionalCapacidade, type ItemEstruturalCapacidadeFuncional } from './formulario';
import { atualizaIndice, removeIndice } from './helpers';

export function useAtualizadorParametroAninhado(primeiroTipoParametro: () => TipoParametroFuncionalCapacidade | null, normalizaTipoParametro: (tipo: string) => TipoParametroFuncionalCapacidade | null) {
    const criaParametro = useCallback((): ParametroFuncionalCapacidade | null => {
        const tipo = primeiroTipoParametro();
        return tipo ? criaParametroFuncionalCapacidade(tipo) : null;
    }, [primeiroTipoParametro]);

    const atualizaParametroTipo = useCallback((parametros: readonly ParametroFuncionalCapacidade[], indice: number, tipo: string): readonly ParametroFuncionalCapacidade[] => {
        const tipoNormalizado = normalizaTipoParametro(tipo);
        if (!tipoNormalizado) return parametros;
        return atualizaIndice(parametros, indice, parametro => ({ ...parametro, tipo: tipoNormalizado }));
    }, [normalizaTipoParametro]);

    const atualizaParametroNome = useCallback((parametros: readonly ParametroFuncionalCapacidade[], indice: number, nome: string): readonly ParametroFuncionalCapacidade[] => {
        return atualizaIndice(parametros, indice, parametro => ({ ...parametro, nome }));
    }, []);

    const atualizaParametroValor = useCallback((parametros: readonly ParametroFuncionalCapacidade[], indice: number, valor: string): readonly ParametroFuncionalCapacidade[] => {
        return atualizaIndice(parametros, indice, parametro => ({ ...parametro, valor }));
    }, []);

    const adicionaParametro = useCallback((item: ItemEstruturalCapacidadeFuncional): ItemEstruturalCapacidadeFuncional => {
        const parametro = criaParametro();
        if (!parametro) return item;
        return { ...item, parametrosFuncionais: [...item.parametrosFuncionais, parametro] };
    }, [criaParametro]);

    const removeParametro = useCallback((item: ItemEstruturalCapacidadeFuncional, indiceParametro: number): ItemEstruturalCapacidadeFuncional => {
        return { ...item, parametrosFuncionais: removeIndice(item.parametrosFuncionais, indiceParametro) };
    }, []);

    return { criaParametro, atualizaParametroTipo, atualizaParametroNome, atualizaParametroValor, adicionaParametro, removeParametro };
};
