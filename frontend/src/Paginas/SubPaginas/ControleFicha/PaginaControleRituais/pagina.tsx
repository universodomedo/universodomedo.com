// #region Imports
import { FiltroProps, FiltroPropsItems, Ritual, OpcoesFiltro } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';

import { useContextoControleRituais } from 'Contextos/ContextoControleRituais/contexto.tsx';
import { useClasseContextualPersonagemRituais } from 'Classes/ClassesContextuais/PersonagemRituais.tsx';

import Item from './item.tsx';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';
// #endregion

const pagina = () => {
    const { rituais } = useClasseContextualPersonagemRituais();
    const { mostrarFiltros } = useContextoControleRituais();

    const renderRitualItem = (ritual: Ritual, index: number) => (
        <Item key={index} ritual={ritual} />
    );

    const itemsFiltro: FiltroPropsItems<Ritual>[] = [
        new FiltroPropsItems<Ritual>(
            (ritual) => ritual.nome.nomeExibicao,
            'Nome do Ritual',
            'Procure pelo Ritual',
            'text',
            true
        ),
        new FiltroPropsItems<Ritual>(
            (ritual) => ritual.refElemento.id,
            'Elemento',
            'Selecione o Elemento do Ritual',
            'select',
            true,
            new OpcoesFiltro(SingletonHelper.getInstance().elementos.map(elemento => ({ id: elemento.id, nome: elemento.nome }))),
        ),
        new FiltroPropsItems<Ritual>(
            (ritual) => ritual.refCirculoNivelRitual.id,
            'Círculo',
            'Selecione o Círculo do Ritual',
            'select',
            true,
            new OpcoesFiltro(SingletonHelper.getInstance().circulos_niveis_ritual.map(circulo_nivel => ({ id: circulo_nivel.id, nome: circulo_nivel.nome }))),
        ),
    ];

    return (
        <ConsultaProvider<Ritual> registros={[rituais]} mostrarFiltro={mostrarFiltros} filtroProps={new FiltroProps<Ritual>(itemsFiltro)} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderRitualItem} />
        </ConsultaProvider>
    );
};

export default pagina;