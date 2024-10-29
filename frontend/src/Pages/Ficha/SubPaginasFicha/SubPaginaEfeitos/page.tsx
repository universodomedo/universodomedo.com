// #region Imports
import { Buff, BuffsAplicados } from 'Types/classes/index.ts';

import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";

// #endregion

const page: React.FC<{ abaId: string; buffsPersonagem:BuffsAplicados}> = ({ abaId, buffsPersonagem }) => {
  const { stopLoading } = useLoading();

  const buffsAplicados = buffsPersonagem.listaObjetosBuff.reduce((acc, cur) => {
    const buffsDoTipo = cur.tipoBuff.reduce((acc2, cur2) => {
      acc2.push(cur2.aplicado);

      return acc2;
    }, [] as Buff[]);
  
    return acc.concat(buffsDoTipo);
  }, [] as Buff[]);

  const buffsSobreescritos = buffsPersonagem.listaObjetosBuff.reduce((acc, cur) => {
    const buffsDoTipo = cur.tipoBuff.reduce((acc2, cur2) => {
      acc2.push(...cur2.sobreescritos);

      return acc2;
    }, [] as Buff[]);

    return acc.concat(buffsDoTipo);
  }, [] as Buff[]);

  const renderBuffItem = (efeito: Buff, index: number) => (
    <ReferenciaTooltip key={index} objeto={efeito.tooltipProps}>
      <IconeCustomizado props={efeito.tooltipProps.iconeCustomizado} />
    </ReferenciaTooltip>
  );

  return (
    <ConsultaProvider<Buff> abaId={abaId} registros={[buffsAplicados, buffsSobreescritos]} filtroProps={Buff.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={ { usaSubtitulos: true, divisoes: ['Efeitos Aplicados', 'Efeitos Sobrescritos'] } }>
      <Consulta renderItem={renderBuffItem} />
    </ConsultaProvider>
  );
}

export default page;