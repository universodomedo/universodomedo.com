// #region Imports
import { FiltroProps, FiltroPropsItems, Acao } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import { useContextoControleAcoes } from 'Contextos/ContextoControleAcoes/contexto.tsx'
import { useClasseContextualPersonagemAcoes } from 'Classes/ClassesContextuais/PersonagemAcoes.tsx';

import Item from './item.tsx';
// #endregion

const pagina = () => {
    const { acoes } = useClasseContextualPersonagemAcoes();
    const { mostrarFiltros } = useContextoControleAcoes();

    const acoesGerais = [] as Acao[];
    // const acoesGerais = acoes.filter(acao => acao.dadosAcaoCustomizada !== undefined);
    const acoesRealizaveis = acoes.filter(acao => !acao.bloqueada);
    // const acoesRealizaveis = acoes.filter(acao => !acao.bloqueada && acao.dadosAcaoCustomizada === undefined);
    const acoesBloqueadas = acoes.filter(acao => acao.bloqueada);

    const renderAcaoItem = (acao: Acao, index: number) => (
        <Item key={index} acao={acao} />
    );

    const itemsFiltro: FiltroPropsItems<Acao>[] = [];

    return (
        <>
            <ConsultaProvider<Acao> registros={[acoesGerais, acoesRealizaveis, acoesBloqueadas]} mostrarFiltro={mostrarFiltros} filtroProps={new FiltroProps<Acao>(itemsFiltro)} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Ações Gerais', 'Ações Realizáveis', 'Ações Bloqueadas'] }}>
                <Consulta renderItem={renderAcaoItem} />
            </ConsultaProvider>
        </>
    );
};

export default pagina;