// #region Imports
import { ControladorModificadores, ValoresLinhaEfeito } from 'Types/classes/index.ts';

import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaEfeitos } from './contexto.tsx';

import Item from './item.tsx';
// #endregion

const page: React.FC<{ abaId: string; controladorModificadores: ControladorModificadores }> = ({ abaId, controladorModificadores }) => {
  const { stopLoading } = useLoading();

  const { mostrarFiltros } = useContextoAbaEfeitos();

  const efeito = controladorModificadores.valoresEfeitosEDetalhesPorLinhaEfeito.filter(valores => !valores.valoresEstaVazio);

  const renderEfeitoItem = (valoresLinhaEfeito: ValoresLinhaEfeito, index: number) => (
    <Item key={index} valoresLinhaEfeito={valoresLinhaEfeito} />
  );

  return (
    <ConsultaProvider<ValoresLinhaEfeito> abaId={abaId} registros={[efeito]} mostrarFiltro={mostrarFiltros} filtroProps={ValoresLinhaEfeito.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: ['Efeitos'] }}>
      <Consulta renderItem={renderEfeitoItem} />
    </ConsultaProvider>
  );
}

export default page;