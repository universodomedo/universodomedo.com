// #region Imports
import { Buff, Modificadores } from 'Types/classes/index.ts';

import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaEfeitos } from './contexto.tsx';

import Item from './item.tsx';
// #endregion

const page: React.FC<{ abaId: string; modificadores: Modificadores }> = ({ abaId, modificadores }) => {
  const { stopLoading } = useLoading();

  const { mostrarFiltros } = useContextoAbaEfeitos();

  const buffs = modificadores.buffs;

  const buffsAplicados = buffs.aplicados;
  const buffsSobreescritos = buffs.sobreescritos;

  const renderBuffItem = (efeito: Buff, index: number) => (
    <Item key={index} efeito={efeito} />
  );

  return (
    <ConsultaProvider<Buff> abaId={abaId} registros={[buffsAplicados, buffsSobreescritos]} mostrarFiltro={mostrarFiltros} filtroProps={Buff.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Efeitos Aplicados', 'Efeitos Sobrescritos'] }}>
      <Consulta renderItem={renderBuffItem} />
    </ConsultaProvider>
  );
}

export default page;