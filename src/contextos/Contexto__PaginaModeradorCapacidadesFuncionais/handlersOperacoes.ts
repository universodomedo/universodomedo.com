import { useCallback, useMemo } from 'react';
import type { OperacaoFuncionalCapacidade, TipoParametroFuncionalCapacidade } from 'types-nora-api';

import { criaItemEstruturalCapacidadeFuncional, criaOperacaoFuncionalCapacidade } from './formulario';
import { aplicaCampoOperacao, atualizaIndice, obtemItensOperacao, removeIndice, substituiItensOperacao } from './helpers';
import { useAtualizadorParametroAninhado } from './handlersParametrosAninhados';
import type { SetFormularioCapacidadeFuncional } from './persistencia';
import type { GrupoItemEstruturalOperacao } from './tipos';

export function useHandlersOperacoesCapacidadeFuncional(setFormulario: SetFormularioCapacidadeFuncional, primeiroTipoParametro: () => TipoParametroFuncionalCapacidade | null, normalizaTipoParametro: (tipo: string) => TipoParametroFuncionalCapacidade | null) {
    const parametros = useAtualizadorParametroAninhado(primeiroTipoParametro, normalizaTipoParametro);

    const atualizaOperacoes = useCallback((atualiza: (operacoes: readonly OperacaoFuncionalCapacidade[]) => readonly OperacaoFuncionalCapacidade[]): void => {
        setFormulario(formularioAtual => ({ ...formularioAtual, estrutura: { ...formularioAtual.estrutura, operacoesFuncionais: atualiza(formularioAtual.estrutura.operacoesFuncionais) } }));
    }, [setFormulario]);

    const atualizaOperacaoPorIndice = useCallback((indiceOperacao: number, atualiza: (operacao: OperacaoFuncionalCapacidade) => OperacaoFuncionalCapacidade): void => {
        atualizaOperacoes(operacoes => atualizaIndice(operacoes, indiceOperacao, atualiza));
    }, [atualizaOperacoes]);

    const adicionaOperacao = useCallback((): void => {
        atualizaOperacoes(operacoes => [...operacoes, criaOperacaoFuncionalCapacidade()]);
    }, [atualizaOperacoes]);

    const atualizaOperacao = useCallback((indice: number, campo: 'key' | 'nome' | 'ordem', valor: string): void => {
        atualizaOperacaoPorIndice(indice, operacao => aplicaCampoOperacao(operacao, campo, valor));
    }, [atualizaOperacaoPorIndice]);

    const removeOperacao = useCallback((indice: number): void => {
        atualizaOperacoes(operacoes => removeIndice(operacoes, indice));
    }, [atualizaOperacoes]);

    const adicionaParametroOperacao = useCallback((indiceOperacao: number): void => {
        atualizaOperacaoPorIndice(indiceOperacao, operacao => {
            const parametro = parametros.criaParametro();
            return parametro ? { ...operacao, parametrosFuncionais: [...operacao.parametrosFuncionais, parametro] } : operacao;
        });
    }, [atualizaOperacaoPorIndice, parametros]);

    const atualizaParametroOperacao = useCallback((indiceOperacao: number, indiceParametro: number, atualiza: (parametrosAtuais: OperacaoFuncionalCapacidade['parametrosFuncionais']) => OperacaoFuncionalCapacidade['parametrosFuncionais']): void => {
        atualizaOperacaoPorIndice(indiceOperacao, operacao => ({ ...operacao, parametrosFuncionais: atualiza(operacao.parametrosFuncionais) }));
    }, [atualizaOperacaoPorIndice]);

    const atualizaItensOperacao = useCallback((indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, atualiza: (itens: ReturnType<typeof obtemItensOperacao>) => ReturnType<typeof obtemItensOperacao>): void => {
        atualizaOperacaoPorIndice(indiceOperacao, operacao => substituiItensOperacao(operacao, grupo, atualiza(obtemItensOperacao(operacao, grupo))));
    }, [atualizaOperacaoPorIndice]);

    return useMemo(() => ({ adicionaOperacao, atualizaOperacao, removeOperacao, adicionaParametroOperacao, atualizaParametroOperacaoTipo: (indiceOperacao: number, indiceParametro: number, tipo: string) => atualizaParametroOperacao(indiceOperacao, indiceParametro, params => parametros.atualizaParametroTipo(params, indiceParametro, tipo)), atualizaParametroOperacaoNome: (indiceOperacao: number, indiceParametro: number, nome: string) => atualizaParametroOperacao(indiceOperacao, indiceParametro, params => parametros.atualizaParametroNome(params, indiceParametro, nome)), atualizaParametroOperacaoValor: (indiceOperacao: number, indiceParametro: number, valor: string) => atualizaParametroOperacao(indiceOperacao, indiceParametro, params => parametros.atualizaParametroValor(params, indiceParametro, valor)), removeParametroOperacao: (indiceOperacao: number, indiceParametro: number) => atualizaParametroOperacao(indiceOperacao, indiceParametro, params => removeIndice(params, indiceParametro)), adicionaItemOperacao: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao) => atualizaItensOperacao(indiceOperacao, grupo, itens => [...itens, criaItemEstruturalCapacidadeFuncional()]), atualizaItemOperacao: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, indiceItem: number, campo: 'key' | 'nome' | 'descricao', valor: string) => atualizaItensOperacao(indiceOperacao, grupo, itens => atualizaIndice(itens, indiceItem, item => ({ ...item, [campo]: valor }))), removeItemOperacao: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, indiceItem: number) => atualizaItensOperacao(indiceOperacao, grupo, itens => removeIndice(itens, indiceItem)), adicionaParametroItemOperacao: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, indiceItem: number) => atualizaItensOperacao(indiceOperacao, grupo, itens => atualizaIndice(itens, indiceItem, parametros.adicionaParametro)), atualizaParametroItemOperacaoTipo: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, indiceItem: number, indiceParametro: number, tipo: string) => atualizaItensOperacao(indiceOperacao, grupo, itens => atualizaIndice(itens, indiceItem, item => ({ ...item, parametrosFuncionais: parametros.atualizaParametroTipo(item.parametrosFuncionais, indiceParametro, tipo) }))), atualizaParametroItemOperacaoNome: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, indiceItem: number, indiceParametro: number, nome: string) => atualizaItensOperacao(indiceOperacao, grupo, itens => atualizaIndice(itens, indiceItem, item => ({ ...item, parametrosFuncionais: parametros.atualizaParametroNome(item.parametrosFuncionais, indiceParametro, nome) }))), atualizaParametroItemOperacaoValor: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, indiceItem: number, indiceParametro: number, valor: string) => atualizaItensOperacao(indiceOperacao, grupo, itens => atualizaIndice(itens, indiceItem, item => ({ ...item, parametrosFuncionais: parametros.atualizaParametroValor(item.parametrosFuncionais, indiceParametro, valor) }))), removeParametroItemOperacao: (indiceOperacao: number, grupo: GrupoItemEstruturalOperacao, indiceItem: number, indiceParametro: number) => atualizaItensOperacao(indiceOperacao, grupo, itens => atualizaIndice(itens, indiceItem, item => parametros.removeParametro(item, indiceParametro))) }), [adicionaOperacao, adicionaParametroOperacao, atualizaItensOperacao, atualizaOperacao, atualizaParametroOperacao, parametros, removeOperacao]);
};
