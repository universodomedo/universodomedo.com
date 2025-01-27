// #region Imports
import { Acao } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import { useContextoControleAcoes } from 'Contextos/ContextoControleAcoes/contexto.tsx'

import Item from './item.tsx';
// #endregion

const page: React.FC<{ acoesPersonagem: Acao[] }> = ({ acoesPersonagem }) => {
    const { mostrarFiltros } = useContextoControleAcoes();

    const acoesGerais = acoesPersonagem.filter(acao => acao.dadosAcaoCustomizada !== undefined);
    const acoesRealizaveis = acoesPersonagem.filter(acao => !acao.bloqueada && acao.dadosAcaoCustomizada === undefined);
    const acoesBloqueadas = acoesPersonagem.filter(acao => acao.bloqueada);

    const renderAcaoItem = (acao: Acao, index: number) => (
        <Item key={index} acao={acao} />
    );

    return (
        <>
            <ConsultaProvider<Acao> registros={[acoesGerais, acoesRealizaveis, acoesBloqueadas]} mostrarFiltro={mostrarFiltros} filtroProps={Acao.filtroProps} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Ações Gerais', 'Ações Realizáveis', 'Ações Bloqueadas'] }}>
                <Consulta renderItem={renderAcaoItem} />
            </ConsultaProvider>
        </>
    );
};

export default page;