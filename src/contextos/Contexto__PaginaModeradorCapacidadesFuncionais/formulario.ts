import type { CapacidadeFuncionalDetalheDto, CondicaoFuncionalCapacidade, DTO__CREATE__CapacidadeFuncional, DTO__UPDATE__CapacidadeFuncional, EfeitoPassivoCapacidadeFuncional, EstadoBloqueioPublicoCapacidadeFuncional, EstruturaCapacidadeFuncional, NaturezaFuncionalCapacidade, OperacaoFuncionalCapacidade, ParametroAceitoCapacidadeFuncional, ParametroFuncionalCapacidade, RequisitoEstruturalCapacidadeFuncional, TipoParametroFuncionalCapacidade } from 'types-nora-api';

export type FormularioCapacidadeFuncional = {
    readonly id: number | null;
    readonly key: string;
    readonly nome: string;
    readonly ativa: boolean;
    readonly estrutura: EstruturaCapacidadeFuncional;
};

export type ItemEstruturalCapacidadeFuncional = RequisitoEstruturalCapacidadeFuncional | CondicaoFuncionalCapacidade | EstadoBloqueioPublicoCapacidadeFuncional | EfeitoPassivoCapacidadeFuncional;

export function criaEstruturaCapacidadeFuncionalVazia(): EstruturaCapacidadeFuncional {
    return { naturezasFuncionais: [], parametrosAceitos: [], parametrosFuncionais: [], requisitosEstruturais: [], condicoesFuncionais: [], operacoesFuncionais: [], efeitosPassivos: [], estadosBloqueiosPublicos: [] };
};

export function criaFormularioCapacidadeFuncionalVazio(): FormularioCapacidadeFuncional {
    return { id: null, key: '', nome: '', ativa: true, estrutura: criaEstruturaCapacidadeFuncionalVazia() };
};

export function criaFormularioCapacidadeFuncionalPorDetalhe(detalhe: CapacidadeFuncionalDetalheDto): FormularioCapacidadeFuncional {
    return { id: detalhe.id, key: detalhe.key, nome: detalhe.nome, ativa: detalhe.ativa, estrutura: clonaEstruturaCapacidadeFuncional(detalhe.estrutura) };
};

export function montaPayloadCreateCapacidadeFuncional(formulario: FormularioCapacidadeFuncional): DTO__CREATE__CapacidadeFuncional {
    return { key: formulario.key, nome: formulario.nome, estrutura: clonaEstruturaCapacidadeFuncional(formulario.estrutura) };
};

export function montaPayloadUpdateCapacidadeFuncional(formulario: FormularioCapacidadeFuncional): DTO__UPDATE__CapacidadeFuncional {
    if (formulario.id === null) throw new Error('Capacidade funcional selecionada é obrigatória para edição.');

    return { id: formulario.id, key: formulario.key, nome: formulario.nome, estrutura: clonaEstruturaCapacidadeFuncional(formulario.estrutura) };
};

export function clonaEstruturaCapacidadeFuncional(estrutura: EstruturaCapacidadeFuncional): EstruturaCapacidadeFuncional {
    return {
        naturezasFuncionais: [...estrutura.naturezasFuncionais],
        parametrosAceitos: estrutura.parametrosAceitos.map(parametro => ({ ...parametro })),
        parametrosFuncionais: estrutura.parametrosFuncionais.map(parametro => ({ ...parametro })),
        requisitosEstruturais: estrutura.requisitosEstruturais.map(clonaItemEstrutural),
        condicoesFuncionais: estrutura.condicoesFuncionais.map(clonaItemEstrutural),
        operacoesFuncionais: estrutura.operacoesFuncionais.map(operacao => ({ ...operacao, parametrosFuncionais: operacao.parametrosFuncionais.map(parametro => ({ ...parametro })), requisitosEstruturais: operacao.requisitosEstruturais.map(clonaItemEstrutural), condicoesFuncionais: operacao.condicoesFuncionais.map(clonaItemEstrutural), estadosBloqueiosPublicos: operacao.estadosBloqueiosPublicos.map(clonaItemEstrutural) })),
        efeitosPassivos: estrutura.efeitosPassivos.map(clonaItemEstrutural),
        estadosBloqueiosPublicos: estrutura.estadosBloqueiosPublicos.map(clonaItemEstrutural),
    };
};

export function criaParametroAceitoCapacidadeFuncional(tipo: TipoParametroFuncionalCapacidade): ParametroAceitoCapacidadeFuncional {
    return { tipo, nome: '', obrigatorio: false };
};

export function criaParametroFuncionalCapacidade(tipo: TipoParametroFuncionalCapacidade): ParametroFuncionalCapacidade {
    return { tipo, nome: '', valor: '' };
};

export function criaOperacaoFuncionalCapacidade(): OperacaoFuncionalCapacidade {
    return { key: '', nome: '', ordem: 0, parametrosFuncionais: [], requisitosEstruturais: [], condicoesFuncionais: [], estadosBloqueiosPublicos: [] };
};

export function criaItemEstruturalCapacidadeFuncional(): ItemEstruturalCapacidadeFuncional {
    return { key: '', nome: '', descricao: '', parametrosFuncionais: [] };
};

export function alternaNaturezaFuncional(atuais: readonly NaturezaFuncionalCapacidade[], natureza: NaturezaFuncionalCapacidade): readonly NaturezaFuncionalCapacidade[] {
    if (atuais.includes(natureza)) return atuais.filter(naturezaAtual => naturezaAtual !== natureza);

    return [...atuais, natureza];
};

function clonaItemEstrutural<TItem extends ItemEstruturalCapacidadeFuncional>(item: TItem): TItem {
    return { ...item, parametrosFuncionais: item.parametrosFuncionais.map(parametro => ({ ...parametro })) };
};
