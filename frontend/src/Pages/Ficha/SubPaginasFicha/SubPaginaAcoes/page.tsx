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

  const acoesRealizaveis = acoesPersonagem.filter(acao => !acao.bloqueada);
  const acoesBloqueadas = acoesPersonagem.filter(acao => acao.bloqueada);

  const renderAcaoItem = (acao: Acao, index: number) => (
    <Item key={index} acao={acao} />
  );

  return (
    <>
      <ConsultaProvider<Acao> abaId={abaId} registros={[acoesRealizaveis, acoesBloqueadas]} mostrarFiltro={mostrarFiltros} filtroProps={Acao.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Ações Realizáveis', 'Ações Bloqueadas'] }}>
        <Consulta renderItem={renderAcaoItem} />
      </ConsultaProvider>
    </>
  );
};

export default page;