// #region Imports
import { Ritual } from "Types/classes.tsx";
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";

import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
// #endregion

const page: React.FC<{ abaId: string; rituaisPersonagem: Ritual[], abrirAbaAcao: () => void }> = ({ abaId, rituaisPersonagem, abrirAbaAcao }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();

  const clickIcone = () => {
    // abrirAbaAcao();

    //   dispatch(setCacheFiltros({ abaId: 'aba7', filtros: { ['(acao:Acao) => acao.refPai.nome']: ['Aprimorar Acrobacia2'] } }));
  }

  const renderRitualItem = (ritual: Ritual, index: number) => (
    <ReferenciaTooltip key={index} objeto={ritual.tooltipProps}>
      <IconeCustomizado onClick={clickIcone} props={ritual.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <ConsultaProvider<Ritual> abaId={abaId} registros={rituaisPersonagem} filtroProps={Ritual.filtroProps} onLoadComplete={stopLoading}>
      <Consulta renderItem={renderRitualItem} />
    </ConsultaProvider>
  );
};

export default page;