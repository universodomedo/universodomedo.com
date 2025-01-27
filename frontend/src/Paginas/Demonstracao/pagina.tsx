// #region Imports
import style from "./style.module.css";

import { useEffect, useState } from 'react';

import { ContextoFichaProvider, getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
import { ContextoNexUpProvider, useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';

import EditaAtributos from 'Paginas/SubPaginas/EdicaoFicha/EditaAtributos/pagina.tsx';
import EditaPericias from 'Paginas/SubPaginas/EdicaoFicha/EditaPericias/pagina.tsx';
import EditaEstatisticas from 'Paginas/SubPaginas/EdicaoFicha/EditaEstatisticas/pagina.tsx';
import EscolheClasse from 'Paginas/SubPaginas/EdicaoFicha/EscolheClasse/pagina.tsx';
import EditaRituais from 'Paginas/SubPaginas/EdicaoFicha/EditaRituais/pagina.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import img from 'Assets/testeCapa1.png'

import ControladorSwiperDireita from 'Componentes/ControladorSwiperDireita/pagina.tsx';
import BarraEstatisticaDanificavel from 'Componentes/BarraEstatisticaDanificavel/pagina.tsx';
// #endregion

const pagina = () => {
    const indexFicha = 0;

    return (
        <ContextoFichaProvider idFichaNoLocalStorage={indexFicha}>
            <InterseccaoParaPendencia />
        </ContextoFichaProvider>
    );
}

const InterseccaoParaPendencia = () => {
    const temPendencia = getPersonagemFromContext().temPendencia;

    return (
        <>
            {temPendencia ? (
                <PaginaEditaFicha />
            ) : (
                <PaginaFicha />
            )}
        </>
    );
}

const PaginaFicha = () => {
    return (
        <>
            <div className={style.secao_cima}><PaginaFichaCima /></div>
            <div className={style.secao_baixo}><PaginaFichaBaixo /></div>
        </>
    );
}

const PaginaFichaCima = () => {
    return (
        <>
            <div className={style.tela_principal} style={{ backgroundImage: `url(${img})` }} />
            <ControladorSwiperDireita />
        </>
    );
}

const PaginaFichaBaixo = () => {
    const personagem = getPersonagemFromContext();

    return (
        <>
            <div className={`${style.fatia_parte_baixo_detalhes}`}>
                <h2 className="noMargin">{personagem.detalhes.nome}</h2>
                <h2 className="noMargin">{personagem.detalhes.refClasse.nome}</h2>
                <h2 className="noMargin">{personagem.detalhes.refNivel.nomeDisplay}</h2>
            </div>
            <div className={style.fatia_parte_baixo_atalhos}>
                <div className={style.barras}>
                    <div className={style.barra_acoes}>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao} style={{ backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+)` }} />
                        </div>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao}><FontAwesomeIcon icon={faPlus} style={{ width: '50%', height: '50%' }} /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.fatia_parte_baixo_estatisticas_danificaveis}>
                {personagem.estatisticasDanificaveis.map((estatistica, index) => (
                    <div key={index} className={style.recipiente_estatistica_danificavel}>
                        <BarraEstatisticaDanificavel titulo={estatistica.refEstatisticaDanificavel.nomeAbrev} valorAtual={estatistica.valor} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor} />
                    </div>
                ))}
            </div>
        </>
    );
}

const PaginaEditaFicha = () => {
    const personagem = getPersonagemFromContext();

    return (
        <ContextoNexUpProvider personagem={personagem}>
            <PaginaEditaFichaComContexto />
        </ContextoNexUpProvider>
    );
}

const PaginaEditaFichaComContexto = () => {
    const [idEtapa, setIdEtapa] = useState(0);

    const [_, setState] = useState({});

    const { ganhosNex, registerSetState } = useContextoNexUp();

    useEffect(() => {
        registerSetState(setState);
    }, [registerSetState]);

    useEffect(() => {
        setIdEtapa(Math.min(...ganhosNex.identificadoresSecaoNexUp.map(secao => secao.id)));
    }, []);

    return (
        <div className={style.secao_unica}>
            <div className={style.titulos_secoes_nexup}>
                {ganhosNex.identificadoresSecaoNexUp.map((secao, index) => (
                    <h2 key={index} onClick={() => setIdEtapa(secao.id)} className={`${secao.id === idEtapa ? style.secao_aberta : ''}`}>{secao.titulo}</h2>
                ))}
                <button disabled={!ganhosNex.prontoParaFinalizar}>Finalizar</button>
            </div>
            <div className={style.secao_edicao_centro}>
                <div className={style.recipiente_edicao}>
                    {idEtapa === 1 && (
                        <EditaAtributos />
                    )}
                    {idEtapa === 2 && (
                        <EditaPericias />
                    )}
                    {idEtapa === 3 && (
                        <EditaEstatisticas />
                    )}
                    {idEtapa === 4 && (
                        <EscolheClasse />
                    )}
                    {idEtapa === 5 && (
                        <EditaRituais />
                    )}
                </div>
            </div>
        </div>
    );
}

export default pagina;