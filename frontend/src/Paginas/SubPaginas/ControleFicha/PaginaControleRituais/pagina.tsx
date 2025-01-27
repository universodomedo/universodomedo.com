// #region Imports
import { Ritual } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import { useContextoControleRituais } from 'Contextos/ContextoControleRituais/contexto.tsx';

import Item from './item.tsx';
// #endregion

const page = ({ rituaisPersonagem }: { rituaisPersonagem: Ritual[] }) => {
    const { mostrarFiltros } = useContextoControleRituais();

    const renderRitualItem = (ritual: Ritual, index: number) => (
        <Item key={index} ritual={ritual} />
    );

    return (
        <ConsultaProvider<Ritual> registros={[rituaisPersonagem]} mostrarFiltro={mostrarFiltros} filtroProps={Ritual.filtroProps} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderRitualItem} />
        </ConsultaProvider>
    );
};

export default page;