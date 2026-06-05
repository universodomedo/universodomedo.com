import type { OperacaoFuncionalCapacidade } from 'types-nora-api';

import type { FormularioCapacidadeFuncional, ItemEstruturalCapacidadeFuncional } from './formulario';
import type { GrupoItemEstruturalCapacidade, GrupoItemEstruturalOperacao } from './tipos';

export function aplicaCampoOperacao(operacao: OperacaoFuncionalCapacidade, campo: 'key' | 'nome' | 'ordem', valor: string): OperacaoFuncionalCapacidade {
    if (campo === 'ordem') return { ...operacao, ordem: valor.trim().length > 0 ? Number(valor) : 0 };

    return { ...operacao, [campo]: valor };
};

export function removeIndice<TItem>(itens: readonly TItem[], indice: number): readonly TItem[] {
    return itens.filter((_, indiceAtual) => indiceAtual !== indice);
};

export function atualizaIndice<TItem>(itens: readonly TItem[], indice: number, atualiza: (item: TItem) => TItem): readonly TItem[] {
    return itens.map((item, indiceAtual) => indiceAtual === indice ? atualiza(item) : item);
};

export function obtemItensEstruturais(estrutura: FormularioCapacidadeFuncional['estrutura'], grupo: GrupoItemEstruturalCapacidade): readonly ItemEstruturalCapacidadeFuncional[] {
    if (grupo === 'requisitosEstruturais') return estrutura.requisitosEstruturais;
    if (grupo === 'condicoesFuncionais') return estrutura.condicoesFuncionais;
    if (grupo === 'efeitosPassivos') return estrutura.efeitosPassivos;

    return estrutura.estadosBloqueiosPublicos;
};

export function substituiItensEstruturais(estrutura: FormularioCapacidadeFuncional['estrutura'], grupo: GrupoItemEstruturalCapacidade, itens: readonly ItemEstruturalCapacidadeFuncional[]): FormularioCapacidadeFuncional['estrutura'] {
    if (grupo === 'requisitosEstruturais') return { ...estrutura, requisitosEstruturais: itens };
    if (grupo === 'condicoesFuncionais') return { ...estrutura, condicoesFuncionais: itens };
    if (grupo === 'efeitosPassivos') return { ...estrutura, efeitosPassivos: itens };

    return { ...estrutura, estadosBloqueiosPublicos: itens };
};

export function obtemItensOperacao(operacao: OperacaoFuncionalCapacidade, grupo: GrupoItemEstruturalOperacao): readonly ItemEstruturalCapacidadeFuncional[] {
    if (grupo === 'requisitosEstruturais') return operacao.requisitosEstruturais;
    if (grupo === 'condicoesFuncionais') return operacao.condicoesFuncionais;

    return operacao.estadosBloqueiosPublicos;
};

export function substituiItensOperacao(operacao: OperacaoFuncionalCapacidade, grupo: GrupoItemEstruturalOperacao, itens: readonly ItemEstruturalCapacidadeFuncional[]): OperacaoFuncionalCapacidade {
    if (grupo === 'requisitosEstruturais') return { ...operacao, requisitosEstruturais: itens };
    if (grupo === 'condicoesFuncionais') return { ...operacao, condicoesFuncionais: itens };

    return { ...operacao, estadosBloqueiosPublicos: itens };
};
