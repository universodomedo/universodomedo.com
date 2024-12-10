// #region Imports
import style from './style.module.css';
import React, { useState } from 'react';

import { Inventario, EstatisticasBuffaveisPersonagem, Item } from 'Types/classes/index.ts';
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import BarraEstatisticaDanificavel from "Components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx";
import { useContextoAbaInventario } from './contexto.tsx';

import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";

import RenderItem from './item.tsx';
// #endregion

const page: React.FC<{ abaId: string; estatisticasBuffaveis: EstatisticasBuffaveisPersonagem, inventarioPersonagem: Inventario, abrirAbaAcao: () => void; }> = ({ abaId, estatisticasBuffaveis, inventarioPersonagem, abrirAbaAcao }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();

  const { mostrarFiltros, mostrarBarras } = useContextoAbaInventario();

  const itensEmpunhados = inventarioPersonagem.agrupamento.filter(item => item.comportamentoEmpunhavel.estaEmpunhado);
  const itensGuardados = inventarioPersonagem.agrupamento.filter(item => !item.comportamentoEmpunhavel.estaEmpunhado && !item.comportamentoVestivel.estaVestido);
  const itensVestidos = inventarioPersonagem.agrupamento.filter(item => item.comportamentoVestivel.estaVestido);

  const clickItem = (item: Item) => {
    if (item.acoes.length === 0) return;

    abrirAbaAcao();

    dispatch(setCacheFiltros({ abaId: 'aba7', filtro: [{ idFiltro: 1, idOpcao: [item.nomeExibicao] }], updateExterno: true }));
  }

  const renderItem = (item: Item, index: number) => (
    <RenderItem key={index} item={item} />
  );

  return (
    <div className={style.conteudo_inventario}>
      {mostrarBarras && (
        <div className={style.inventario_maximos}>
          <BarraEstatisticaDanificavel titulo={'Espaços'} valorAtual={inventarioPersonagem.espacosUsados} valorMaximo={estatisticasBuffaveis.espacoInventario.espacoTotal} corBarra={'#666666'} corBarraSecundaria={'#AAAAAA'}></BarraEstatisticaDanificavel>
          <div className={style.inventario_categoria}>
            {estatisticasBuffaveis.gerenciadorEspacoCategoria.espacosCategoria.map((espacoCategoria, index) => (
              <div key={index} className={style.barra_categoria}>
                <BarraEstatisticaDanificavel titulo={espacoCategoria.nomeCategoria} valorAtual={estatisticasBuffaveis.gerenciadorEspacoCategoria.numeroItensCategoria(espacoCategoria.valorCategoria)} valorMaximo={espacoCategoria.maximoEspacosCategoria} corBarra={'#666666'} corBarraSecundaria={'#AAAAAA'}></BarraEstatisticaDanificavel>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {estatisticasBuffaveis.extremidades.length > 0 && (
        <div className={style.container_extremidades}>
          {estatisticasBuffaveis.extremidades.map((extremidade, index) => (
            <div key={index} className={style.extremidade}>
              <h1>Extremidade {extremidade.id}</h1>
              {extremidade.refItem ? (
                <IconeItem key={index} mostrarEtiquetas={mostrarEtiquetas} quantidadeAgrupada={extremidade.refItem.tooltipPropsSingular.numeroUnidades!} props={extremidade.refItem.tooltipPropsSingular!} onClick={() => clickItem(extremidade.refItem!)} />
              ) :
                <div className={style.icones_extremidade_vazia}></div>
              }
            </div>
          ))}
        </div>
      )} */}

      <ConsultaProvider<Item> abaId={abaId} registros={[itensVestidos, itensEmpunhados, itensGuardados]} mostrarFiltro={mostrarFiltros} filtroProps={Item.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Itens Vestidos', 'Itens Empunhados', 'Itens Guardados'] }}>
        <Consulta renderItem={renderItem} />
      </ConsultaProvider>
    </div>
  );
};

export default page;