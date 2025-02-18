// #region Imports
import { FiltroProps, FiltroPropsItems, Habilidade } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';

import { useContextoControleHabilidades } from 'Contextos/ContextoControleHabilidades/contexto.tsx';
import { useClasseContextualPersonagemHabilidades } from 'Classes/ClassesContextuais/PersonagemHabilidades.tsx';
import { useClasseContextualPersonagemInerencias } from 'Classes/ClassesContextuais/PersonagemInerencias.tsx';

import Item from './item.tsx';
// #endregion

const pagina = () => {
    const { habilidades } = useClasseContextualPersonagemHabilidades();
    const { habilidadesInerentes } = useClasseContextualPersonagemInerencias();

    const { mostrarFiltros } = useContextoControleHabilidades();

    const renderHabilidadeItem = (habilidade: Habilidade, index: number) => (
        <Item key={index} habilidade={habilidade} />
    );

    const itemsFiltro: FiltroPropsItems<Habilidade>[] = [
        new FiltroPropsItems<Habilidade>(
            (habilidade) => habilidade.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase(),
            'Nome da Habilidade',
            'Procure pela Habilidade',
            'text',
            true,
        ),
    ];

    return (
        <ConsultaProvider<Habilidade> registros={[[...habilidadesInerentes, ...habilidades]]} mostrarFiltro={mostrarFiltros} filtroProps={new FiltroProps<Habilidade>(itemsFiltro)} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderHabilidadeItem} />
        </ConsultaProvider>
    );
}

export default pagina;