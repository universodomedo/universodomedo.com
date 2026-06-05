import { useCallback, useMemo } from 'react';
import type { NaturezaFuncionalCapacidade, ParametroAceitoCapacidadeFuncional, ParametroFuncionalCapacidade, TipoParametroFuncionalCapacidade } from 'types-nora-api';

import { alternaNaturezaFuncional, criaParametroAceitoCapacidadeFuncional, criaParametroFuncionalCapacidade } from './formulario';
import { atualizaIndice, removeIndice } from './helpers';
import type { SetFormularioCapacidadeFuncional } from './persistencia';

export function useHandlersCamposCapacidadeFuncional(setFormulario: SetFormularioCapacidadeFuncional, primeiroTipoParametro: () => TipoParametroFuncionalCapacidade | null, normalizaTipoParametro: (tipo: string) => TipoParametroFuncionalCapacidade | null) {
    const setCampoTexto = useCallback((campo: 'key' | 'nome', valor: string): void => {
        setFormulario(formularioAtual => ({ ...formularioAtual, [campo]: valor }));
    }, [setFormulario]);

    const alternaNatureza = useCallback((natureza: NaturezaFuncionalCapacidade): void => {
        setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, naturezasFuncionais: alternaNaturezaFuncional(formularioAtual.estrutura.naturezasFuncionais, natureza) } }));
    }, [setFormulario]);

    const adicionaParametroAceito = useCallback((): void => {
        const tipo = primeiroTipoParametro();
        if (!tipo) return;
        setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, parametrosAceitos: [...formularioAtual.estrutura.parametrosAceitos, criaParametroAceitoCapacidadeFuncional(tipo)] } }));
    }, [primeiroTipoParametro, setFormulario]);

    const atualizaParametroAceito = useCallback((indice: number, atualiza: (parametro: ParametroAceitoCapacidadeFuncional) => ParametroAceitoCapacidadeFuncional): void => {
        setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, parametrosAceitos: atualizaIndice(formularioAtual.estrutura.parametrosAceitos, indice, atualiza) } }));
    }, [setFormulario]);

    const atualizaParametroAceitoTipo = useCallback((indice: number, tipo: string): void => {
        const tipoNormalizado = normalizaTipoParametro(tipo);
        if (!tipoNormalizado) return;
        atualizaParametroAceito(indice, parametro => ({ ...parametro, tipo: tipoNormalizado }));
    }, [atualizaParametroAceito, normalizaTipoParametro]);

    const adicionaParametroFuncional = useCallback((): void => {
        const tipo = primeiroTipoParametro();
        if (!tipo) return;
        setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, parametrosFuncionais: [...formularioAtual.estrutura.parametrosFuncionais, criaParametroFuncionalCapacidade(tipo)] } }));
    }, [primeiroTipoParametro, setFormulario]);

    const atualizaParametroFuncional = useCallback((indice: number, atualiza: (parametro: ParametroFuncionalCapacidade) => ParametroFuncionalCapacidade): void => {
        setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, parametrosFuncionais: atualizaIndice(formularioAtual.estrutura.parametrosFuncionais, indice, atualiza) } }));
    }, [setFormulario]);

    const atualizaParametroFuncionalTipo = useCallback((indice: number, tipo: string): void => {
        const tipoNormalizado = normalizaTipoParametro(tipo);
        if (!tipoNormalizado) return;
        atualizaParametroFuncional(indice, parametro => ({ ...parametro, tipo: tipoNormalizado }));
    }, [atualizaParametroFuncional, normalizaTipoParametro]);

    return useMemo(() => ({ setCampoTexto, alternaNatureza, adicionaParametroAceito, atualizaParametroAceitoTipo, atualizaParametroAceitoNome: (indice: number, nome: string) => atualizaParametroAceito(indice, parametro => ({ ...parametro, nome })), alternaParametroAceitoObrigatorio: (indice: number) => atualizaParametroAceito(indice, parametro => ({ ...parametro, obrigatorio: parametro.obrigatorio !== true })), removeParametroAceito: (indice: number) => setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, parametrosAceitos: removeIndice(formularioAtual.estrutura.parametrosAceitos, indice) } })), adicionaParametroFuncional, atualizaParametroFuncionalTipo, atualizaParametroFuncionalNome: (indice: number, nome: string) => atualizaParametroFuncional(indice, parametro => ({ ...parametro, nome })), atualizaParametroFuncionalValor: (indice: number, valor: string) => atualizaParametroFuncional(indice, parametro => ({ ...parametro, valor })), removeParametroFuncional: (indice: number) => setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, parametrosFuncionais: removeIndice(formularioAtual.estrutura.parametrosFuncionais, indice) } })) }), [adicionaParametroAceito, adicionaParametroFuncional, alternaNatureza, atualizaParametroAceito, atualizaParametroAceitoTipo, atualizaParametroFuncional, atualizaParametroFuncionalTipo, setCampoTexto, setFormulario]);
};
