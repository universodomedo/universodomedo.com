import ResumoInicial from './paginas/resumoInicial';
import ResumoFinal from './paginas/resumoFinal';
import SelecaoClasse from './paginas/selecaoClasse';
import InformativoAumentoMaximoAtributo from './paginas/informativoAumentoMaximoAtributo';
import EdicaoEstatisticas from './paginas/edicaoEstatisticas.tsx';
import InformativoPontosHabilidadeEspecial from './paginas/informativoPontosHabilidadeEspecial.tsx';
import EdicaoAtributos from './paginas/edicaoAtributos.tsx';
import EdicaoPericias from './paginas/edicaoPericias.tsx';
import InformativoPontosHabilidadesParanormais from './paginas/informativoPontosHabilidadesParanormais.tsx';
import InformativoPontosHabilidadesElementais from './paginas/informativoPontosHabilidadesElementais.tsx';

export const PAGINAS_EDITA_FICHA = {
    RESUMO_INICIAL: ResumoInicial,
    RESUMO_FINAL: ResumoFinal,
    SELECAO_CLASSE: SelecaoClasse,
    AUMENTO_MAX_ATRIBUTO: InformativoAumentoMaximoAtributo,
    EDICAO_ESTATISTICAS: EdicaoEstatisticas,
    EDICAO_ATRIBUTOS: EdicaoAtributos,
    EDICAO_PERICIAS: EdicaoPericias,
    INFORME_PONTOS_HABILIDADE_ESPECIAL: InformativoPontosHabilidadeEspecial,
    EDICAO_HABILIDADES_PARANORMAIS: InformativoPontosHabilidadesParanormais,
    EDICAO_HABILIDADES_ELEMENTAIS: InformativoPontosHabilidadesElementais,
} as const;

export type PAGINAS_SPA__EDITA_FICHA = keyof typeof PAGINAS_EDITA_FICHA;