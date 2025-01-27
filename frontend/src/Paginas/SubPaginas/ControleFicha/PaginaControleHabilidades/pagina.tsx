// #region Imports
import { Habilidade } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import { useContextoControleHabilidades } from 'Contextos/ContextoControleHabilidades/contexto.tsx';

import Item from './item.tsx';
// #endregion

const page = ({ habilidadesPersonagem }: { habilidadesPersonagem: Habilidade[] }) => {
    const { mostrarFiltros } = useContextoControleHabilidades();

    const renderHabilidadeItem = (habilidade: Habilidade, index: number) => (
        <Item key={index} habilidade={habilidade} />
    );

    return (
        <ConsultaProvider<Habilidade> registros={[habilidadesPersonagem]} mostrarFiltro={mostrarFiltros} filtroProps={Habilidade.filtroProps} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderHabilidadeItem} />
        </ConsultaProvider>
    );
}

export default page;