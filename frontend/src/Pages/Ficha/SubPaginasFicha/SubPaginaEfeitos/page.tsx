// #region Imports
import { ControladorModificadores, Efeito, Modificador } from 'Types/classes/index.ts';

import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaEfeitos } from './contexto.tsx';

import Item from './item.tsx';
// #endregion

const page: React.FC<{ abaId: string; controladorModificadores: ControladorModificadores }> = ({ abaId, controladorModificadores }) => {
  const { stopLoading } = useLoading();

  const { mostrarFiltros } = useContextoAbaEfeitos();

  const buffsAplicados = controladorModificadores.efeitos.aplicados;
  const buffsSobreescritos: Efeito[] = [];
  // const buffsSobreescritos = buffs.sobreescritos;

  const renderBuffItem = (modificador: Modificador, index: number) => (
    <Item key={index} modificador={modificador} />
  );

  return (
    // <ConsultaProvider<Modificador> abaId={abaId} registros={[buffsAplicados, buffsSobreescritos]} mostrarFiltro={mostrarFiltros} filtroProps={Modificador.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Efeitos Aplicados', 'Efeitos Sobrescritos'] }}>
    <ConsultaProvider<Modificador> abaId={abaId} registros={[buffsAplicados, buffsSobreescritos]} mostrarFiltro={mostrarFiltros} filtroProps={Modificador.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Efeitos Aplicados', 'Efeitos Sobrescritos'] }}>
      <Consulta renderItem={renderBuffItem} />
    </ConsultaProvider>
  );
}

export default page;