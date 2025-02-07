// #region Imports
import { ValoresLinhaEfeito } from 'Classes/ClassesTipos/index.ts'

import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';

import { useClasseContextualPersonagemModificadores } from 'Classes/ClassesContextuais/PersonagemModificadores.tsx';
import { useContextoControleEfeitos } from 'Contextos/ContextoControleEfeitos/contexto.tsx';

import Item from './item.tsx';
// #endregion

const pagina = () => {
    const { valoresEfeitosEDetalhesPorLinhaEfeito } = useClasseContextualPersonagemModificadores();
    const { mostrarFiltros } = useContextoControleEfeitos();

    const efeito = valoresEfeitosEDetalhesPorLinhaEfeito().filter(valores => !valores.valoresEstaVazio);

    const renderEfeitoItem = (valoresLinhaEfeito: ValoresLinhaEfeito, index: number) => (
        <Item key={index} valoresLinhaEfeito={valoresLinhaEfeito} />
    );

    return (
        <ConsultaProvider<ValoresLinhaEfeito> registros={[efeito]} mostrarFiltro={mostrarFiltros} filtroProps={ValoresLinhaEfeito.filtroProps} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: false, divisoes: ['Efeitos'] }}>
            <Consulta renderItem={renderEfeitoItem} />
        </ConsultaProvider>
    );
}

export default pagina;