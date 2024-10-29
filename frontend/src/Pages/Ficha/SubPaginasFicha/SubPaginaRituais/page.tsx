// #region Imports
import { Ritual } from 'Types/classes/index.ts';
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";

import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
import { faL } from "@fortawesome/free-solid-svg-icons";
// #endregion

const page: React.FC<{ abaId: string; rituaisPersonagem: Ritual[], abrirAbaAcao: () => void; }> = ({ abaId, rituaisPersonagem, abrirAbaAcao }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();

  const clickIcone = (ritual: Ritual) => {
    abrirAbaAcao();

    dispatch(setCacheFiltros({ abaId: 'aba7', filtro: [ { idFiltro: 1, idOpcao: [ritual.nome] } ], updateExterno: true }));
  }

  const renderRitualItem = (ritual: Ritual, index: number) => (
    <ReferenciaTooltip key={index} objeto={ritual.tooltipProps}>
      <IconeCustomizado onClick={() => clickIcone(ritual)} props={ritual.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <ConsultaProvider<Ritual> abaId={abaId} registros={[rituaisPersonagem]} filtroProps={Ritual.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={ { usaSubtitulos: false, divisoes: [''] } }>
      <Consulta renderItem={renderRitualItem} />
    </ConsultaProvider>
  );
};

export default page;