// #region Imports
import { Acao } from "Types/classes.tsx";
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip";

import ExecutadorAcoes from "Components/SubComponents/ExecutadorAcoes/page.tsx";

import { useDispatch } from 'react-redux';
import { iniciaExecucaoAcao } from "Redux/slices/executadorAcaoHelperSlice.ts";
// #endregion

const page: React.FC<{ abaId: string; acoesPersonagem: Acao[] }> = ({ abaId, acoesPersonagem }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();

  const renderAcaoItem = (acao: Acao, index: number) => (
    <ReferenciaTooltip key={index} objeto={acao.tooltipProps}>
      <IconeCustomizado onClick={() => {
        if (acao.verificaCustosPodemSerPagos && acao.verificaRequisitosCumpridos) {
          if (acao.requisitos && acao.requisitos.length > 0) {
            dispatch(iniciaExecucaoAcao({ acao }));
          } else {
            acao.executa();
          }
        }
      }} props={acao.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <>
      <ExecutadorAcoes />
      <ConsultaProvider<Acao> abaId={abaId} registros={[acoesPersonagem]} filtroProps={Acao.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={ { usaSubtitulos: false, divisoes: [''] } }>
        <Consulta renderItem={renderAcaoItem} />
      </ConsultaProvider>
    </>
  );
};

export default page;