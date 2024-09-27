// #region Imports
import { Acao } from "Types/classes.tsx";
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip";
// #endregion

const page: React.FC<{ abaId: string; acoesPersonagem: Acao[] }> = ({ abaId, acoesPersonagem }) => {
  const { stopLoading } = useLoading();

  const renderAcaoItem = (acao: Acao, index: number) => (
    <ReferenciaTooltip key={index} objeto={acao.tooltipProps}>
      <IconeCustomizado onClick={() => {acao.executa()}} props={acao.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <ConsultaProvider<Acao> abaId={abaId} registros={acoesPersonagem} filtroProps={Acao.filtroProps} onLoadComplete={stopLoading}>
      <Consulta renderItem={renderAcaoItem} />
    </ConsultaProvider>
  );
};

export default page;