// #region Imports
import { Ritual } from 'Types/classes/index.ts';
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";

import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
// #endregion

const page: React.FC<{ abaId: string; rituaisPersonagem: Ritual[], abrirAbaAcao: () => void; }> = ({ abaId, rituaisPersonagem, abrirAbaAcao }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();

  const clickIcone = (ritual: Ritual) => {
    abrirAbaAcao();

    dispatch(setCacheFiltros({ abaId: 'aba7', filtro: [ { idFiltro: 1, idOpcao: [ritual.nomeExibicao] } ], updateExterno: true }));
  }

  const renderRitualItem = (ritual: Ritual, index: number) => (
    <IconeCustomizado key={index} tooltipProps={ritual.tooltipProps} textoBotaoConfirmar={'Ver Ações'} exec={{executaEmModal: false, func:() => {clickIcone(ritual)} }}/>
  );

  return (
    <ConsultaProvider<Ritual> abaId={abaId} registros={[rituaisPersonagem]} filtroProps={Ritual.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={ { usaSubtitulos: false, divisoes: [''] } }>
      <Consulta renderItem={renderRitualItem} />
    </ConsultaProvider>
  );
};

export default page;