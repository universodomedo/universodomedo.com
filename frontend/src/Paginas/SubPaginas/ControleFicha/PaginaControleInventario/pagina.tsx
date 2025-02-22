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
        <div className={style.inventario_barras}>
          <div className={style.recipiente_barra_espaco}>
            <BarraEstatisticaDanificavel titulo={'Espaços'} valorAtual={inventario.espacosUsados} valorMaximo={capacidadeDeCarga.capacidadeTotal} corBarra={'#AAAAAA'} corBarraSecundaria={'#666666'}></BarraEstatisticaDanificavel>
          </div>
          <div className={style.recipiente_linha_categorias}>
            {espacosCategoria.filter(espaco_categoria => [2, 3].includes(espaco_categoria.refTipoCategoria.id)).map((espaco_categoria, index) => (
              <div key={index} className={style.recipiente_barra_categoria}>
                <BarraEstatisticaDanificavel titulo={espaco_categoria.refTipoCategoria.nomeCategoria} valorAtual={inventario.numeroItensCategoria(espaco_categoria.refTipoCategoria.valorCategoria)} valorMaximo={espaco_categoria.maximoDeItensDessaCategoria} corBarra={'#AAAAAA'} corBarraSecundaria={'#666666'}></BarraEstatisticaDanificavel>
              </div>
            ))}
          </div>
          <div className={style.recipiente_linha_categorias}>
            {espacosCategoria.filter(espaco_categoria => [4, 5].includes(espaco_categoria.refTipoCategoria.id)).map((espaco_categoria, index) => (
              <div key={index} className={style.recipiente_barra_categoria}>
                <BarraEstatisticaDanificavel titulo={espaco_categoria.refTipoCategoria.nomeCategoria} valorAtual={inventario.numeroItensCategoria(espaco_categoria.refTipoCategoria.valorCategoria)} valorMaximo={espaco_categoria.maximoDeItensDessaCategoria} corBarra={'#AAAAAA'} corBarraSecundaria={'#666666'}></BarraEstatisticaDanificavel>
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