// #region Imports
import { Ritual } from 'Types/classes/index.ts';

import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaRituais } from './contexto.tsx';

import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";

import Item from './item.tsx';
// #endregion


const page = ({ abaId, rituaisPersonagem, abrirAbaAcao }: { abaId: string; rituaisPersonagem: Ritual[], abrirAbaAcao: () => void; }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();

  const { mostrarFiltros } = useContextoAbaRituais();

  const clickIcone = (ritual: Ritual) => {
    abrirAbaAcao();

    dispatch(setCacheFiltros({ abaId: 'aba7', filtro: [ { idFiltro: 1, idOpcao: [ritual.nomeExibicao] } ], updateExterno: true }));
  }

  const renderRitualItem = (ritual: Ritual, index: number) => (
    <Item key={index} ritual={ritual} />
  );

  return (
    <ConsultaProvider<Ritual> abaId={abaId} registros={[rituaisPersonagem]} mostrarFiltro={mostrarFiltros} filtroProps={Ritual.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={ { usaSubtitulos: false, divisoes: [''] } }>
      <Consulta renderItem={renderRitualItem} />
    </ConsultaProvider>
  );
};

export default page;