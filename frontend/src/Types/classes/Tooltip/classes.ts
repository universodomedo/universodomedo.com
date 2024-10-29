// #region Imports
import { PaletaCores } from 'Types/classes/index.ts';
// #endregion

export interface TooltipProps {
    caixaInformacao: CaixaInformacaoProps,
    iconeCustomizado?: IconeCustomizadoProps,
    corTooltip: PaletaCores,
    numeroUnidades?: number,
}

export interface IconeCustomizadoProps {
    corDeFundo: string,
    svg: string
}

export interface CaixaInformacaoProps {
    cabecalho?: TipoInformacaoCabecalhoCaixa[],
    corpo?: TipoInformacaoCorpoCaixa[],
}

export interface TipoInformacaoCabecalhoCaixa {
    tipo: 'titulo' | 'subtitulo',
    conteudo?: string,
}

export interface TipoInformacaoCorpoCaixa {
    tipo: 'texto' | 'separacao' | 'icone',
    conteudo?: string,
    cor?: string,
}