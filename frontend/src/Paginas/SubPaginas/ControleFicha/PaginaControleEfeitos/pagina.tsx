// #region Imports
import { ControladorModificadores, ValoresLinhaEfeito } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import { useContextoControleEfeitos } from 'Contextos/ContextoControleEfeitos/contexto.tsx';

import Item from './item.tsx';
// #endregion

const page: React.FC<{ controladorModificadores: ControladorModificadores }> = ({ controladorModificadores }) => {
    const { mostrarFiltros } = useContextoControleEfeitos();

    const efeito = controladorModificadores.valoresEfeitosEDetalhesPorLinhaEfeito.filter(valores => !valores.valoresEstaVazio);

    const renderEfeitoItem = (valoresLinhaEfeito: ValoresLinhaEfeito, index: number) => (
        <Item key={index} valoresLinhaEfeito={valoresLinhaEfeito} />
    );

    return (
        <ConsultaProvider<ValoresLinhaEfeito> registros={[efeito]} mostrarFiltro={mostrarFiltros} filtroProps={ValoresLinhaEfeito.filtroProps} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: ['Efeitos'] }}>
            <Consulta renderItem={renderEfeitoItem} />
        </ConsultaProvider>
    );
}

export default page;