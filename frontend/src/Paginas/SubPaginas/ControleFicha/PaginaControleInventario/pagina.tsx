// #region Imports
import style from './style.module.css';

import { FiltroProps, FiltroPropsItems, Item } from 'Classes/ClassesTipos/index.ts'
import { Consulta, ConsultaProvider } from 'Componentes/ConsultaGenerica/pagina.tsx';
import BarraEstatisticaDanificavel from 'Componentes/BarraEstatisticaDanificavel/pagina.tsx';

import { useContextoControleInventario } from 'Contextos/ContextoControleInventario/contexto.tsx';
import { useClasseContextualPersonagemEstatisticasBuffaveis } from 'Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx';
import { useClasseContextualPersonagemInventario } from 'Classes/ClassesContextuais/PersonagemInventario.tsx';

import RenderItem from './item.tsx';
// #endregion

const pagina = () => {
  const { mostrarFiltros, mostrarBarras } = useContextoControleInventario();
  const { inventario } = useClasseContextualPersonagemInventario();
  const { capacidadeDeCarga, espacosCategoria } = useClasseContextualPersonagemEstatisticasBuffaveis();
  
  const itensGuardados = inventario.agrupamento.filter(item => item.itemEstaGuardado);
  const itensEmpunhados = inventario.agrupamento.filter(item => item.itemEstaEmpunhado);
  const itensEquipados = inventario.agrupamento.filter(item => item.itemEstaEquipado);

  const renderItem = (item: Item, index: number) => (
    <RenderItem key={index} item={item} />
  );

  const itemsFiltro: FiltroPropsItems<Item>[] = [
    new FiltroPropsItems<Item>(
      (item) => item.nome.nomeExibicao,
      'Nome do Item',
      'Procure pelo Item',
      'text',
      true
    ),
  ];

  return (
    <div className={style.conteudo_inventario}>
      {mostrarBarras && (
        <div className={style.inventario_maximos}>
          <BarraEstatisticaDanificavel titulo={'Espaços'} valorAtual={inventario.espacosUsados} valorMaximo={capacidadeDeCarga.capacidadeTotal} corBarra={'#666666'} corBarraSecundaria={'#AAAAAA'}></BarraEstatisticaDanificavel>
          <div className={style.inventario_categoria}>
            {espacosCategoria.map((espacoCategoria, index) => (
              <div key={index} className={style.barra_categoria}>
                <BarraEstatisticaDanificavel titulo={espacoCategoria.refTipoCategoria.nomeCategoria} valorAtual={inventario.numeroItensCategoria(espacoCategoria.refTipoCategoria.valorCategoria)} valorMaximo={espacoCategoria.maximoDeItensDessaCategoria} corBarra={'#666666'} corBarraSecundaria={'#AAAAAA'}></BarraEstatisticaDanificavel>
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

      <ConsultaProvider<Item> registros={[itensEmpunhados, itensEquipados, itensGuardados]} mostrarFiltro={mostrarFiltros} filtroProps={new FiltroProps<Item>(itemsFiltro)} onLoadComplete={() => { }} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Itens Empunhados', 'Itens Equipados', 'Itens Guardados'] }} calculoTotal={(item) => (item.quantidadeUnidadesDesseItem || 1)}>
        <Consulta renderItem={renderItem} />
      </ConsultaProvider>
    </div>
  );
};

export default pagina;