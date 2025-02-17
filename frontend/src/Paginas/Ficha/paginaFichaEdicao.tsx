// #region Imports
import style from "./style.module.css";
import { useEffect, useRef, useState } from 'react';

import { GanhoIndividualNexAtributo, GanhoIndividualNexEscolhaClasse, GanhoIndividualNexEstatisticaFixa, GanhoIndividualNexHabilidade, GanhoIndividualNexPericia, GanhoIndividualNexRitual } from "Classes/ClassesTipos/index.ts";

import { ContextoFichaProvider, useContextoFicha } from 'Contextos/ContextoPersonagem/contexto.tsx';
import { ContextoNexUpProvider, useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem";

import EscolheClasse from 'Paginas/SubPaginas/EdicaoFicha/EscolheClasse/pagina.tsx';
import EditaHabilidades from 'Paginas/SubPaginas/EdicaoFicha/EditaHabilidades/pagina.tsx';
import EditaAtributos from 'Paginas/SubPaginas/EdicaoFicha/EditaAtributos/pagina.tsx';
import EditaEstatisticas from 'Paginas/SubPaginas/EdicaoFicha/EditaEstatisticas/pagina.tsx';
import EditaPericias from 'Paginas/SubPaginas/EdicaoFicha/EditaPericias/pagina.tsx';
import EditaRituais from 'Paginas/SubPaginas/EdicaoFicha/EditaRituais/pagina.tsx';

import ControladorSwiperDireita from 'Componentes/ControladorSwiperDireita/pagina.tsx';
import JanelaNotificacao from "Componentes/JanelaNotificacao/pagina";
// #endregion

const pagina = () => {
    const { dadosPersonagem } = useClasseContextualPersonagem();
    const personagem = getPersonagemFromContext();

    return (
        <ContextoNexUpProvider personagem={personagem}>
            <PaginaEditaFichaComContexto />
        </ContextoNexUpProvider>
    );
};

const PaginaEditaFichaComContexto = () => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [_, setState] = useState({});

    const { atualizaHabilidades } = useContextoFicha();
    const { ganhosNex, registerSetState, triggerSetState } = useContextoNexUp();

    useEffect(() => {
        registerSetState(setState);
    }, [registerSetState]);

    const janelaNotificacaoRef = useRef<{ openConsole: () => void } | null>(null);
    const handleAbrirJanelaBotaoDesabilitado = () => {
        if (janelaNotificacaoRef.current) {
            janelaNotificacaoRef.current.openConsole();
        }
    };

    const handleMouseEnter = () => {
        const id = setTimeout(() => {
            handleAbrirJanelaBotaoDesabilitado();
        }, 400);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
    };

    const proximo = () => {
        ganhosNex.avancaEtapa();
        atualizaHabilidades();
        triggerSetState();
    };

    return (
        <div className={style.secao_unica}>
            <JanelaNotificacao ref={janelaNotificacaoRef} />
            <ControladorSwiperDireita />

            <div className={style.secao_edicao_centro}>
                <h1 className={style.titulo_edicao_ficha}>{ganhosNex.tituloNexUp}</h1>

                <div className={style.recipiente_edicao}>
                    {ganhosNex.etapa instanceof GanhoIndividualNexEscolhaClasse && (
                        <EscolheClasse />
                    )}
                    {ganhosNex.etapa instanceof GanhoIndividualNexHabilidade && (
                        <EditaHabilidades />
                    )}
                    {ganhosNex.etapa instanceof GanhoIndividualNexAtributo && (
                        <EditaAtributos />
                    )}
                    {ganhosNex.etapa instanceof GanhoIndividualNexEstatisticaFixa && (
                        <EditaEstatisticas />
                    )}
                    {ganhosNex.etapa instanceof GanhoIndividualNexPericia && (
                        <EditaPericias />
                    )}
                    {ganhosNex.etapa instanceof GanhoIndividualNexRitual && (
                        <EditaRituais />
                    )}
                </div>
                
                <div className={style.botoes}>
                    {!ganhosNex.podeAvancarEtapa ? (
                        <div className={`${style.recipiente_botao_desabilitado}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <button onClick={proximo} disabled={!ganhosNex.podeAvancarEtapa}>{ganhosNex.textoBotaoProximo}</button>
                        </div>
                    ) : (
                        <button onClick={proximo} disabled={!ganhosNex.podeAvancarEtapa} className={style.prosseguir}>{ganhosNex.textoBotaoProximo}</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default pagina;