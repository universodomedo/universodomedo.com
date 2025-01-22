// #region Imports
import style from './style.module.css';
import { useEffect, useRef, useState } from 'react';

import { GanhoIndividualNexAtributo, GanhoIndividualNexEscolhaClasse, GanhoIndividualNexFactory, GanhoIndividualNexPericia, GanhoIndividualNexRitual, GanhosNex, obterGanhosGerais } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import EditaAtributos from 'Pages/EditaFicha/Componentes/EditaAtributos/page.tsx';
import EditaPericias from 'Pages/EditaFicha/Componentes/EditaPericias/page.tsx';
import EditaEstatisticas from 'Pages/EditaFicha/Componentes/EditaEstatisticas/page.tsx';
import EscolheClasse from 'Pages/EditaFicha/Componentes/EscolheClasse/page.tsx';
import EditaRituais from 'Pages/EditaFicha/Componentes/EditaRituais/page.tsx';

import { FichaProvider } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import JanelaNotificacao from 'Recursos/Componentes/JanelaNotificacao/page';

import { useNavigate, useLocation } from 'react-router-dom';

import { ContextoFichaProvider } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

const page = () => {
    const location = useLocation();
    const indexFicha = location.state?.indexFicha;

    return (
        <ContextoFichaProvider idFichaNoLocalStorage={indexFicha}>
            <PageComContexto />
        </ContextoFichaProvider>
    )
}

const PageComContexto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const indexFichaLocalStorage = location.state?.indexFicha;

    const [_, setState] = useState({});
    const atualizarFicha = () => setState({});

    const [ganhosNex, setGanhosNex] = useState<GanhosNex | null>(null);
    const [idNivelAtual, setIdNivelAtual] = useState(ganhosNex?.dadosFicha.detalhes?.idNivel);
    const idNivelFazendoAgora = (idNivelAtual || 0) + 1;

    const janelaNotificacaoRef = useRef<{ openConsole: () => void } | null>(null);
    const handleAbrirJanelaBotaoDesabilitado = () => {
        if (janelaNotificacaoRef.current) {
            janelaNotificacaoRef.current.openConsole();
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("dadosFicha")!)[indexFichaLocalStorage];

        GanhoIndividualNexFactory.setFicha(data);
        setGanhosNex(new GanhosNex(data));
    }, []);

    useEffect(() => {
        setIdNivelAtual(ganhosNex?.dadosFicha.detalhes?.idNivel);
    }, [ganhosNex]);

    useEffect(() => {
        atualizaGanhos();
    }, [idNivelAtual]);

    const atualizaGanhos = () => {
        ganhosNex?.adicionarNovoGanho(obterGanhosGerais(idNivelFazendoAgora, ganhosNex.dadosFicha.detalhes?.idClasse!));
        atualizarFicha();
    }

    const proximo = () => {
        ganhosNex?.avancaEtapa();
        atualizarFicha();

        if (ganhosNex?.finalizando && ganhosNex.etapa.id === 4) return escolheClasse();
        if (ganhosNex?.finalizando) atualizaGanhosParaFicha();
    };

    const volta = () => {
        if (ganhosNex?.estaNaPrimeiraEtapa) {
            navigate('/pagina-interna');
        } else {
            ganhosNex?.retrocedeEtapa();
            atualizarFicha();
        }
    };

    const escolheClasse = () => {
        ganhosNex!.dadosFicha.detalhes!.idClasse = (ganhosNex!.etapa as GanhoIndividualNexEscolhaClasse).idOpcaoEscolhida!;
        atualizaGanhos();
    }

    const atualizaGanhosParaFicha = () => {
        if (!ganhosNex) return;

        ganhosNex.dadosFicha.estatisticasDanificaveis = [
            { id: 1, valorMaximo: ganhosNex.pvAtualizado, valor: ganhosNex.pvAtualizado },
            { id: 2, valorMaximo: ganhosNex.psAtualizado, valor: ganhosNex.psAtualizado },
            { id: 3, valorMaximo: ganhosNex.peAtualizado, valor: ganhosNex.peAtualizado },
        ];

        if (ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 1)) {
            const atributosAtuais = ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 1) as GanhoIndividualNexAtributo;

            ganhosNex.dadosFicha.atributos = atributosAtuais.atributos.map(atributoAtual => ({ id: atributoAtual.refAtributo.id, valor: atributoAtual.valorAtual }));
        }

        if (ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 2)) {
            const periciasAtuais = ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 2) as GanhoIndividualNexPericia;

            ganhosNex.dadosFicha.periciasPatentes = periciasAtuais.pericias.map(periciaAtual => ({ idPericia: periciaAtual.refPericia.id, idPatente: periciaAtual.refPatenteAtual.id }))
        }

        if (ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 5)) {
            const rituaisAdicionados = ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 5) as GanhoIndividualNexRitual;

            ganhosNex.dadosFicha.rituais!.push(...rituaisAdicionados.dadosRituais);
        }

        ganhosNex.dadosFicha.detalhes!.idNivel = idNivelFazendoAgora;

        atualizaFichaAposEtapa();
    }

    const atualizaFichaAposEtapa = () => {
        const data = localStorage.getItem('dadosFicha');
        const dadosFichas = data ? JSON.parse(data) : [];

        dadosFichas[indexFichaLocalStorage] = ganhosNex!.dadosFicha;

        localStorage.setItem('dadosFicha', JSON.stringify(dadosFichas));

        if (idNivelFazendoAgora < ganhosNex!.dadosFicha.pendencias.idNivelEsperado) {
            setIdNivelAtual(idNivelFazendoAgora);
        } else {
            navigate('/pagina-interna');
        }
    }

    return (
        <>
            {ganhosNex && ganhosNex.ganhos.length > 0 && (
                <FichaProvider ganhosNex={ganhosNex} atualizarFicha={atualizarFicha}>
                    <div className={style.editando_ficha}>
                        <h1 className={style.titulo_edicao_ficha}>Criando Ficha - NEX {SingletonHelper.getInstance().niveis.find(nivel => nivel.id === idNivelFazendoAgora)?.nomeDisplay}</h1>

                        <div className={style.recipiente_area_edicao}>
                            <div className={style.area_edicao}>
                                {ganhosNex.etapa.id === 1 && (
                                    <EditaAtributos />
                                )}
                                {ganhosNex.etapa.id === 2 && (
                                    <EditaPericias />
                                )}
                                {ganhosNex.etapa.id === 3 && (
                                    <EditaEstatisticas />
                                )}
                                {ganhosNex.etapa.id === 4 && (
                                    <EscolheClasse />
                                )}
                                {ganhosNex.etapa.id === 5 && (
                                    <EditaRituais />
                                )}
                            </div>
                        </div>

                        <div className={style.botoes}>
                            <button onClick={volta} className={style.prosseguir}>{ganhosNex.textoBotaoVoltar}</button>
                            {!ganhosNex.podeAvancarEtapa ? (
                                <div className={`${style.recipiente_botao_desabilitado}`} onMouseEnter={handleAbrirJanelaBotaoDesabilitado}>
                                    <button onClick={proximo} disabled={!ganhosNex.podeAvancarEtapa}>{ganhosNex.textoBotaoProximo}</button>
                                </div>
                            ) : (
                                <button onClick={proximo} disabled={!ganhosNex.podeAvancarEtapa} className={style.prosseguir}>{ganhosNex.textoBotaoProximo}</button>
                            )}
                        </div>
                    </div>

                    <JanelaNotificacao ref={janelaNotificacaoRef}/>
                </FichaProvider>
            )}
        </>
    );
}

export default page;