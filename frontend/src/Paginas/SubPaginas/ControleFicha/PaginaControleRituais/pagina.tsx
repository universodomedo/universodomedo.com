// #region Imports
import { FiltroProps, FiltroPropsItems, IRitualServico, OpcoesFiltro } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';

import { useContextoControleRituais } from 'Contextos/ContextoControleRituais/contexto.tsx';
import { useClasseContextualPersonagemRituais } from 'Classes/ClassesContextuais/PersonagemRituais.tsx';

import Item from './item.tsx';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';
// #endregion

const pagina = () => {
    const { rituais } = useClasseContextualPersonagemRituais();
    const { mostrarFiltros } = useContextoControleRituais();

    const renderRitualItem = (ritual: IRitualServico, index: number) => (
        <Item key={index} ritual={ritual} />
    );

    const itemsFiltro: FiltroPropsItems<IRitualServico>[] = [
        new FiltroPropsItems<IRitualServico>(
            (ritual) => ritual.nomeExibicao,
            'Nome do Ritual',
            'Procure pelo Ritual',
            'text',
            true
        ),
        new FiltroPropsItems<IRitualServico>(
            (ritual) => ritual.comportamentos.comportamentoRitual.refElemento.id,
            'Elemento',
            'Selecione o Elemento do Ritual',
            'select',
            true,
            new OpcoesFiltro(SingletonHelper.getInstance().elementos.map(elemento => ({ id: elemento.id, nome: elemento.nome }))),
        ),
        new FiltroPropsItems<IRitualServico>(
            (ritual) => ritual.comportamentos.comportamentoRitual.refCirculoNivelRitual.id,
            'Círculo',
            'Selecione o Círculo do Ritual',
            'select',
            true,
            new OpcoesFiltro(SingletonHelper.getInstance().circulos_niveis_ritual.map(circulo_nivel => ({ id: circulo_nivel.id, nome: circulo_nivel.nome }))),
        ),
    ];

    return (
        <ConsultaProvider<IRitualServico> registros={[rituais]} mostrarFiltro={mostrarFiltros} filtroProps={new FiltroProps<IRitualServico>(itemsFiltro)} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: [''] }}>
            <Consulta renderItem={renderRitualItem} />
        </ConsultaProvider>
    );
};

export default pagina;