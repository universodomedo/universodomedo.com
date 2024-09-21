// #region Imports
import ConsultaGenerica from "Components/ConsultaFicha/ConsultaGenerica";
import { Ritual } from "Types/classes.tsx";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";
// #endregion

const page: React.FC<{ rituaisPersonagem: Ritual[] }> = ({ rituaisPersonagem }) => {
  const renderRitualItem = (ritual: Ritual, index:number) => (
    <ReferenciaTooltip key={index} objeto={ritual.tooltipProps}>
      <IconeCustomizado props={ritual.tooltipProps.iconeCustomizado}/>
    </ReferenciaTooltip>
  );

  return (
    <>
      <ConsultaGenerica
        data={rituaisPersonagem}
        filterSortConfig={Ritual.filtroProps}
        renderItem={renderRitualItem}
      />
    </>
  );
};

export default page;