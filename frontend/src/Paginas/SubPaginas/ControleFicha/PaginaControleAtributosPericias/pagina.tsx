// #region Imports
import style from "./style.module.css";

import { adicionaSinalEmNumeroParaExibicao, AtributoPersonagem, PericiaPatentePersonagem } from 'Classes/ClassesTipos/index.ts'
import { textoFormatadoParaVisualizacao } from 'Uteis/uteis.tsx';
import { useContextoControleAtributosPericias } from 'Contextos/ContextoControleAtributosPericias/contexto.tsx'

import Tooltip from 'Componentes/Tooltip/pagina.tsx';
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
    const { abreviar } = useContextoControleAtributosPericias();
    const atributoPorExtenso = textoFormatadoParaVisualizacao(abreviar ? atributo.refAtributo.nomeAbrev : atributo.refAtributo.nome);

    return (
        <div className={`${style.atributo_personagem} ${style[atributo.refAtributo.nomeAbrev]}`}>
            <Tooltip>
                <Tooltip.Trigger>
                    <h3 className={style.nome_atributo}>{`${atributoPorExtenso} [${atributo.valorTotal}]`}</h3>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <TooltipAtributo atributo={atributo} />
                </Tooltip.Content>
            </Tooltip>

            <div className={style.pericias_personagem}>
                {pericias.map((pericia, index) => (
                    <AreaPericia key={index} pericia={pericia} />
                ))}
            </div>
        </div>
    );
}

const AreaPericia = ({ pericia }: { pericia: PericiaPatentePersonagem }) => {
    const { abreviar } = useContextoControleAtributosPericias();
    const periciaPorExtenso = textoFormatadoParaVisualizacao(abreviar ? pericia.refPericia.nomeAbrev : pericia.refPericia.nome);

    return (
        <div className={style.pericia_personagem}>
            <Tooltip>
                <Tooltip.Trigger>
                    <button className={style.botao_pericia} onClick={() => { pericia.realizarTeste(); }}>{periciaPorExtenso}</button>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <TooltipPericia pericia={pericia} />
                </Tooltip.Content>
            </Tooltip>

            <h3 className={style.pericia_valor}>
                <span style={{ color: pericia.refPatente.corTexto }}>{pericia.refPatente.nome.slice(0, 1)}</span>
                {pericia.valorEfeito !== 0 && (
                    <span style={{ color: pericia.valorEfeito > 0 ? '#83EF83' : '#E98282' }}>
                        {` ${adicionaSinalEmNumeroParaExibicao(pericia.valorEfeito)}`}
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

            {/* verificando se existe algum bonus além do valor natural */}
            {atributo.detalhesValor.length > 0 && (
                <>
                    <h2>Detalhes do Total: {atributo.valorTotal}</h2>
                    {atributo.detalhesValor.map((detalheValor, index) => (
                        <p key={index}>{detalheValor}</p>
                    ))}
                </>
            )}
        </>
    );
}

const TooltipPericia = ({ pericia }: { pericia: PericiaPatentePersonagem }) => {
    return (
        <>
            <h1>{pericia.refPericia.nome}</h1>
            <p>{pericia.refPericia.descricao}</p>

            {/* verificando se existe algum bonus além da patente */}
            {pericia.detalhesValor.length > 0 && (
                <>
                    <h2>Detalhes do Total: {pericia.valorTotal}</h2>
                    {pericia.detalhesValor.map((detalheValor, index) => (
                        <p key={index}>{detalheValor}</p>
                    ))}
                </>
            )}
        </>
    );
}

export default page;