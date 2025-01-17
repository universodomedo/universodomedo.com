// #region Imports
import style from "./style.module.css";
import { useState } from 'react';

import { AtributoPersonagem, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { textoFormatadoParaVisualizacao } from 'Utils/utils.tsx';
import { useContextoAbaAtributo } from './contexto.tsx';

import TooltipPersistente from 'Recursos/Componentes/HoverCard/page.tsx';
// #endregion

const page = ({ atributos, pericias }: { atributos: AtributoPersonagem[], pericias: PericiaPatentePersonagem[] }) => {
  return (
    <div className={style.atributos_personagem}>
      {atributos.map((atributo, index) => (
        <AreaAtributo key={index}
          atributo={atributo}
          pericias={pericias.filter(pericia => pericia.refPericia.refAtributo.id === atributo.refAtributo.id)}
        />
      ))}
    </div>
  );
}

const AreaAtributo = ({ atributo, pericias }: { atributo: AtributoPersonagem, pericias: PericiaPatentePersonagem[] }) => {
  const [openTooltip, setOpenTooltip] = useState(false);
  const { abreviar } = useContextoAbaAtributo();
  const atributoPorExtenso = textoFormatadoParaVisualizacao(abreviar ? atributo.refAtributo.nomeAbrev : atributo.refAtributo.nome);

  return (
    <div className={`${style.atributo_personagem} ${style[atributo.refAtributo.nomeAbrev]}`}>
      <TooltipPersistente open={openTooltip} onOpenChange={setOpenTooltip}>
        <TooltipPersistente.Trigger>
          <h3 className={style.nome_atributo}>{`${atributoPorExtenso} [${atributo.valorTotal}]`}</h3>
        </TooltipPersistente.Trigger>

        <TooltipPersistente.Content>
          <TooltipAtributo atributo={atributo} />
        </TooltipPersistente.Content>
      </TooltipPersistente>
      <div className={style.pericias_personagem}>
        {pericias.map((pericia, index) => (
          <AreaPericia key={index} pericia={pericia} />
        ))}
      </div>
    </div>
  );
}

const AreaPericia = ({ pericia }: { pericia: PericiaPatentePersonagem }) => {
  const [openTooltip, setOpenTooltip] = useState(false);
  const { abreviar } = useContextoAbaAtributo();
  const periciaPorExtenso = textoFormatadoParaVisualizacao(abreviar ? pericia.refPericia.nomeAbrev : pericia.refPericia.nome);

  return (
    <div className={style.pericia_personagem}>
      <TooltipPersistente open={openTooltip} onOpenChange={setOpenTooltip}>
        <TooltipPersistente.Trigger>
          <button className={style.botao_pericia} onClick={() => { pericia.realizarTeste(); }}>{periciaPorExtenso}</button>
        </TooltipPersistente.Trigger>

        <TooltipPersistente.Content>
          <TooltipPericia pericia={pericia} />
        </TooltipPersistente.Content>
      </TooltipPersistente>

      <h3 className={style.pericia_valor}>
        <span style={{ color: pericia.refPatente.corTexto }}>{pericia.refPatente.nome.slice(0, 1)}</span>
        {pericia.valorEfeito !== 0 && (
          <span style={{color: pericia.valorEfeito > 0 ? '#83EF83' : '#E98282'}}>
            {` ${pericia.valorEfeito > 0 ? `+${pericia.valorEfeito}` : pericia.valorEfeito}`}
          </span>
        )}
      </h3>
    </div>
  );
}

const TooltipAtributo = ({ atributo }: { atributo: AtributoPersonagem }) => {
  return (
    <>
      <h2>{atributo.refAtributo.nome}</h2>
      <p>{atributo.refAtributo.descricao}</p>
    </>
  );
}

const TooltipPericia = ({ pericia }: { pericia: PericiaPatentePersonagem }) => {
  return (
    <>
      <h2>{pericia.refPericia.nome}</h2>
      <p>{pericia.refPericia.descricao}</p>

      {pericia.detalhesValor.length > 0 && (
        <>
          <h2>Detalhes do Bônus</h2>
          {pericia.detalhesValor.map(detalheValor => (
            <p>{detalheValor}</p>
          ))}
        </>
      )}
    </>
  );
}

export default page;