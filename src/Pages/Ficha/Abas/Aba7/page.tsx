// #region Imports
import ConsultaGenerica from "Components/ConsultaFicha/ConsultaGenerica";
import { Ritual } from "Types/classes.tsx";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
// #endregion

const page: React.FC<{ rituaisPersonagem: Ritual[] }> = ({ rituaisPersonagem }) => {
  const renderRitualItem = (ritual: Ritual, index:number) => (
    <IconeCustomizado key={index} props={ritual.tooltipProps} />
  );

  return (
    <>
      <ConsultaGenerica
        data={rituaisPersonagem}
        filterSortConfig={Ritual.obterFiltroOrdenacao()}
        renderItem={renderRitualItem}
      />
    </>
  );
};

export default page;