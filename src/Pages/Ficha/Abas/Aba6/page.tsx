// #region Imports
import style from "./style.module.css";
import { Acao } from "Types/classes.tsx";
import ConsultaGenerica from "Components/ConsultaFicha/ConsultaGenerica";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip";
// #endregion

const page: React.FC<{ abaId: string; acoesPersonagem: Acao[] }> = ({ abaId, acoesPersonagem }) => {
  const renderAcaoItem = (acao: Acao, index: number) => (
    <ReferenciaTooltip key={index} objeto={acao.tooltipProps}>
      <IconeCustomizado props={acao.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <>
      <ConsultaGenerica<Acao>
        abaId={abaId}
        data={acoesPersonagem}
        filtroProps={Acao.filtroProps}
        renderItem={renderAcaoItem}
      />
    </>
  );
};

export default page;