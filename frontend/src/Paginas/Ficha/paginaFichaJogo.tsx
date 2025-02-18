// #region Imports
import style from "./style.module.css";

import { useClasseContextualPersonagemDetalhes } from "Classes/ClassesContextuais/PersonagemDetalhes.tsx";
import { useClasseContextualPersonagemEstatisticasDanificaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasDanificaveis.tsx";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx";
import { useContextoFicha } from "Contextos/ContextoPersonagem/contexto.tsx";

import PaginaEmJogo from 'Paginas/Ficha/paginaFichaEmJogo.tsx';
import PaginaShopping  from 'Paginas/Ficha/paginaFichaShopping.tsx';
import PaginaLocais from 'Componentes/BarraLocaisDeJogo/PaginaLocais.tsx';

import ControladorSwiperDireita from 'Componentes/ControladorSwiperDireita/pagina.tsx';
import BarraEstatisticaDanificavel from 'Componentes/BarraEstatisticaDanificavel/pagina.tsx';
// #endregion

const pagina = () => {
    return (
        <>
            <div className={style.secao_cima}><PaginaFichaCima /></div>
            <ControladorSwiperDireita />
            <div className={style.secao_baixo}><PaginaFichaBaixo /></div>
        </>
    );
}

const PaginaFichaCima = () => {
    const { paginaDeJogoAberta } = useContextoFicha();

    return paginaDeJogoAberta === 1
        ? <PaginaEmJogo />
        : <PaginaShopping />;
}

const PaginaFichaBaixo = () => {
    const { nome, classe, nivel } = useClasseContextualPersonagemDetalhes();
    const { estatisticasDanificaveis } = useClasseContextualPersonagemEstatisticasDanificaveis();
    const { execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();

    return (
        <>
            <div className={style.fatia_parte_baixo_estatisticas}>
                <div className={style.fatia_parte_baixo_estatisticas_danificaveis}>
                    {estatisticasDanificaveis.map((estatistica, index) => (
                        <div key={index} className={style.recipiente_estatistica_danificavel}>
                            <BarraEstatisticaDanificavel titulo={estatistica.refEstatisticaDanificavel.nomeAbreviado} valorAtual={estatistica.valorAtual} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor} />
                        </div>
                    ))}
                </div>
                <div className={style.fatia_parte_baixo_execucoes}>
                    {execucoes.map((execucao, index) => (
                        <div key={index} className={style.recipiente_execucao}>
                            <p>{execucao.refExecucao.nomeExibicao}</p>
                            <p>{execucao.numeroAcoesAtuais}/{execucao.numeroAcoesMaximasTotal}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className={style.fatia_parte_baixo_atalhos}>
                <div className={style.barra_locais}>
                    <PaginaLocais />
                </div>

                <div className={style.barras}>
                    {/* <div className={style.barra_acoes}>
                        <IconeAcaoExecutavel acao={acoes[0]} />
                        <div className={style.item_barra_acoes} onClick={() => { empunhaItem(inventario.itens[0]); }}>
                            <div className={style.icone_acao}><FontAwesomeIcon icon={faPlus} style={{ width: '50%', height: '50%' }} /></div>
                        </div>
                        <div className={style.item_barra_acoes} onClick={() => { console.log(inventario); }}>
                            <div className={style.icone_acao}><FontAwesomeIcon icon={faPlus} style={{ width: '50%', height: '50%' }} /></div>
                        </div>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao}><FontAwesomeIcon icon={faPlus} style={{ width: '50%', height: '50%' }} /></div>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className={`${style.fatia_parte_baixo_detalhes}`}>
                <div className={style.recipiente_informacoes_personagem}>
                    <h2>{nome}</h2>
                    <h2>{classe.nome} - {nivel.nomeDisplay}</h2>
                </div>
                <div className={style.recipiente_imagem_personagem}>
                    <div id={style.imagem_personagem} />
                </div>
            </div>
        </>
    );
}

export default pagina;