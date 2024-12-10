// #region Imports
import { Habilidade } from 'Types/classes/index.ts';

import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaHabilidades } from './contexto.tsx';

import Item from './item.tsx';
// #endregion

const page = ({ abaId, habilidadesPersonagem, abrirAbaAcao }: { abaId: string; habilidadesPersonagem: Habilidade[], abrirAbaAcao: () => void; }) => {
    const { stopLoading } = useLoading();

    const { mostrarFiltros } = useContextoAbaHabilidades();

    const renderHabilidadeItem = (habilidade: Habilidade, index: number) => (
        <Item key={index} habilidade={habilidade} />
    );

    return (
        <ConsultaProvider<Habilidade> abaId={abaId} registros={[habilidadesPersonagem]} mostrarFiltro={mostrarFiltros} filtroProps={Habilidade.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderHabilidadeItem} />
        </ConsultaProvider>
    );
}

export default page;