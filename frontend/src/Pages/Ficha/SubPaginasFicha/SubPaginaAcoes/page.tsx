// #region Imports
import { Acao } from 'Types/classes/index.ts';

import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaAcoes } from './contexto.tsx';

import Item from './item.tsx';
// #endregion

const page: React.FC<{ abaId: string; acoesPersonagem: Acao[] }> = ({ abaId, acoesPersonagem }) => {
  const { stopLoading } = useLoading();

  const { mostrarFiltros } = useContextoAbaAcoes();

  const acoesGerais = acoesPersonagem.filter(acao => acao.dadosAcaoCustomizada !== undefined);
  const acoesRealizaveis = acoesPersonagem.filter(acao => !acao.bloqueada && acao.dadosAcaoCustomizada === undefined);
  const acoesBloqueadas = acoesPersonagem.filter(acao => acao.bloqueada);

  const renderAcaoItem = (acao: Acao, index: number) => (
    <Item key={index} acao={acao} />
  );

  return (
    <>
      <ConsultaProvider<Acao> abaId={abaId} registros={[acoesGerais, acoesRealizaveis, acoesBloqueadas]} mostrarFiltro={mostrarFiltros} filtroProps={Acao.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Ações Gerais', 'Ações Realizáveis', 'Ações Bloqueadas'] }}>
        <Consulta renderItem={renderAcaoItem} />
      </ConsultaProvider>
    </>
  );
};

export default page;