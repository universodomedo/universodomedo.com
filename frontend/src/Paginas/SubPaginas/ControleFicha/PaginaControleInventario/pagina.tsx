// #region Imports
import style from './style.module.css';

import { Inventario, EstatisticasBuffaveisPersonagem, Item } from 'Classes/ClassesTipos/index.ts'
import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import BarraEstatisticaDanificavel from 'Componentes/BarraEstatisticaDanificavel/pagina.tsx';

import { useContextoControleInventario } from 'Contextos/ContextoControleInventario/contexto.tsx';
import { useClasseContextualPersonagemEstatisticasBuffaveis } from 'Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx';

import RenderItem from './item.tsx';
import { useClasseContextualPersonagemInventario } from 'Classes/ClassesContextuais/PersonagemInventario.tsx';
// #endregion

const pagina = () => {
  const { mostrarFiltros, mostrarBarras } = useContextoControleInventario();
  const { inventario } = useClasseContextualPersonagemInventario();
  const { espacoInventario, gerenciadorEspacoCategoria } = useClasseContextualPersonagemEstatisticasBuffaveis();

  const itensGuardados = inventario.agrupamento.filter(item => item.itemEstaGuardado);
  const itensEmpunhados = inventario.agrupamento.filter(item => item.itemEstaEmpunhado);
  const itensVestidos = inventario.agrupamento.filter(item => item.itemEstaVestido);

  const renderItem = (item: Item, index: number) => (
    <RenderItem key={index} item={item} />
  );

  return (
    <div className={style.conteudo_inventario}>
      {mostrarBarras && (
        <div className={style.inventario_maximos}>
          <BarraEstatisticaDanificavel titulo={'Espaços'} valorAtual={inventario.espacosUsados} valorMaximo={espacoInventario.espacoTotal} corBarra={'#666666'} corBarraSecundaria={'#AAAAAA'}></BarraEstatisticaDanificavel>
          <div className={style.inventario_categoria}>
            {gerenciadorEspacoCategoria.espacosCategoria.map((espacoCategoria, index) => (
              <div key={index} className={style.barra_categoria}>
                <BarraEstatisticaDanificavel titulo={espacoCategoria.nomeCategoria} valorAtual={inventario.numeroItensCategoria(espacoCategoria.valorCategoria)} valorMaximo={espacoCategoria.maximoEspacosCategoria} corBarra={'#666666'} corBarraSecundaria={'#AAAAAA'}></BarraEstatisticaDanificavel>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {estatisticasBuffaveis.extremidades.length > 0 && (
        <div className={style.container_extremidades}>
          {estatisticasBuffaveis.extremidades.map((extremidade, index) => (
            <div key={index} className={style.extremidade}>
              <h1>Extremidade {extremidade.id}: {extremidade.estaOcupada ? `Preenchida ${extremidade.refItem?.nomeExibicao}` : 'Livre'}</h1>
              {extremidade.refItem ? (
                <IconeItem key={index} mostrarEtiquetas={mostrarEtiquetas} quantidadeAgrupada={extremidade.refItem.tooltipPropsSingular.numeroUnidades!} props={extremidade.refItem.tooltipPropsSingular!} onClick={() => clickItem(extremidade.refItem!)} />
              ) :
                <div className={style.icones_extremidade_vazia}></div>
              }
            </div>
          ))}
        </div>
      )} */}

      <ConsultaProvider<Item> registros={[itensVestidos, itensEmpunhados, itensGuardados]} mostrarFiltro={mostrarFiltros} filtroProps={Item.filtroProps} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Itens Vestidos', 'Itens Empunhados', 'Itens Guardados'] }} calculoTotal={(item) => (item.quantidadeUnidadesDesseItem || 1)}>
        <Consulta renderItem={renderItem} />
      </ConsultaProvider>
    </div>
  );
};

export default pagina;