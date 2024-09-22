// #region Imports
import { Ritual } from "Types/classes.tsx";
import ConsultaGenerica from "Components/ConsultaFicha/ConsultaGenerica";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";
// #endregion

const page: React.FC<{ abaId: string; rituaisPersonagem: Ritual[] }> = ({ abaId, rituaisPersonagem }) => {
  const renderRitualItem = (ritual: Ritual, index: number) => (
    <ReferenciaTooltip key={index} objeto={ritual.tooltipProps}>
      <IconeCustomizado props={ritual.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <>
      <ConsultaGenerica<Ritual>
        abaId={abaId}
        data={rituaisPersonagem}
        filtroProps={Ritual.filtroProps}
        renderItem={renderRitualItem}
      />
    </>
  );
};

export default page;