// #region Imports
import { Habilidade } from 'Types/classes/index.ts';

import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaHabilidades } from './contexto.tsx';

import Item from './item.tsx';
// #endregion

const page = ({ abaId, habilidadesPersonagem, abrirAbaAcao }: { abaId: string; habilidadesPersonagem: Habilidade[], abrirAbaAcao: () => void; }) => {
    const { mostrarFiltros } = useContextoAbaHabilidades();

    const renderHabilidadeItem = (habilidade: Habilidade, index: number) => (
        <Item key={index} habilidade={habilidade} />
    );

    return (
        <ConsultaProvider<Habilidade> abaId={abaId} registros={[habilidadesPersonagem]} mostrarFiltro={mostrarFiltros} filtroProps={Habilidade.filtroProps} onLoadComplete={() => {}} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderHabilidadeItem} />
        </ConsultaProvider>
    );
}

export default page;