// #region Imports
import { Acao } from "Types/classes.tsx";
import ConsultaGenerica from "Components/ConsultaFicha/ConsultaGenerica";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip";
import { useLoading } from "Components/LayoutAbas/hooks.ts";
// #endregion

const page: React.FC<{ abaId: string; acoesPersonagem: Acao[] }> = ({ abaId, acoesPersonagem }) => {
  const { stopLoading } = useLoading();

  const renderAcaoItem = (acao: Acao, index: number) => (
    <ReferenciaTooltip key={index} objeto={acao.tooltipProps}>
      <IconeCustomizado onClick={() => {acao.executa()}} props={acao.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <>
      <ConsultaGenerica<Acao>
        abaId={abaId}
        data={acoesPersonagem}
        filtroProps={Acao.filtroProps}
        renderItem={renderAcaoItem}
        onLoadComplete={stopLoading}
      />
    </>
  );
};

export default page;