// #region Imports
import { FiltroProps, FiltroPropsItems, IAcaoService } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import { useContextoControleAcoes } from 'Contextos/ContextoControleAcoes/contexto.tsx'
import { useClasseContextualPersonagemAcoes } from 'Classes/ClassesContextuais/PersonagemAcoes.tsx';

import Item from './item.tsx';
// #endregion

const pagina = () => {
    const { acoes } = useClasseContextualPersonagemAcoes();
    const { mostrarFiltros } = useContextoControleAcoes();

    const acoesGerais = acoes.filter(acao => acao.dadosAcaoCustomizada !== undefined);
    const acoesRealizaveis = acoes.filter(acao => !acao.bloqueada && acao.dadosAcaoCustomizada === undefined);
    const acoesBloqueadas = acoes.filter(acao => acao.bloqueada);

    const renderAcaoItem = (acao: IAcaoService, index: number) => (
        <Item key={index} acao={acao} />
    );

    const itemsFiltro: FiltroPropsItems<IAcaoService>[] = [];

    return (
        <>
            <ConsultaProvider<IAcaoService> registros={[acoesGerais, acoesRealizaveis, acoesBloqueadas]} mostrarFiltro={mostrarFiltros} filtroProps={new FiltroProps<IAcaoService>(itemsFiltro)} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Ações Gerais', 'Ações Realizáveis', 'Ações Bloqueadas'] }}>
                <Consulta renderItem={renderAcaoItem} />
            </ConsultaProvider>
        </>
    );
};

export default pagina;