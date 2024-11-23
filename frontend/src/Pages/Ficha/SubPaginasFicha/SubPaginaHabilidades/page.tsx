// #region Imports
import { Habilidade } from 'Types/classes/index.ts';
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import { useContextoAbaHabilidades } from './contexto.tsx';

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
// #endregion

const page = ({ abaId, habilidadesPersonagem, abrirAbaAcao }: { abaId: string; habilidadesPersonagem: Habilidade[], abrirAbaAcao: () => void; }) => {
    const { stopLoading } = useLoading();

    const { mostrarFiltros, mostrarEtiquetas } = useContextoAbaHabilidades();

    const renderHabilidadeItem = (habilidade: Habilidade, index: number) => (
        <IconeCustomizado key={index} mostrarEtiquetas={mostrarEtiquetas} tooltipProps={habilidade.tooltipProps} desabilitado={true} textoBotaoConfirmar={''} exec={{ executaEmModal: false, func: () => {} }} />
    );

    return (
        <ConsultaProvider<Habilidade> abaId={abaId} registros={[habilidadesPersonagem]} mostrarFiltro={mostrarFiltros} filtroProps={Habilidade.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderHabilidadeItem} />
        </ConsultaProvider>
    );
}

export default page;