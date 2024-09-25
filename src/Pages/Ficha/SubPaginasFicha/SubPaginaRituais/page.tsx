// #region Imports
import { Ritual, Acao } from "Types/classes.tsx";
import ConsultaGenerica from "Components/ConsultaFicha/ConsultaGenerica";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
// #endregion

const page: React.FC<{ abaId: string; rituaisPersonagem: Ritual[], abrirAbaAcao: () => void }> = ({ abaId, rituaisPersonagem, abrirAbaAcao }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();

  const clickIcone = () => {
    abrirAbaAcao();
    
    dispatch(setCacheFiltros({ abaId: 'aba7', filtros: {['(acao:Acao) => acao.refPai.nome']: ['Aprimorar Acrobacia2']} }));
  }

  const renderRitualItem = (ritual: Ritual, index: number) => (
    <ReferenciaTooltip key={index} objeto={ritual.tooltipProps}>
      <IconeCustomizado onClick={clickIcone} props={ritual.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <>
      <ConsultaGenerica<Ritual>
        abaId={abaId}
        data={rituaisPersonagem}
        filtroProps={Ritual.filtroProps}
        renderItem={renderRitualItem}
        onLoadComplete={stopLoading}
      />
    </>
  );
};

export default page;