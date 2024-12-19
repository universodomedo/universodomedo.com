// #region Imports
import style from "./style.module.css";
import "./style.css";
import React, { useState, useEffect, useRef, createContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import SubPaginaDetalhes from "Pages/Ficha/SubPaginasFicha/SubPaginaDetalhes/page.tsx";
import SubPaginaEstatisticasDanificaveis from "Pages/Ficha/SubPaginasFicha/SubPaginaEstatisticasDanificaveis/page.tsx";
import SubPaginaAtributosPericias from "Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/page.tsx";
import SubPaginaInventario from "Pages/Ficha/SubPaginasFicha/SubPaginaInventario/page.tsx";
import SubPaginaAcoes from "Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/page.tsx"
import SubPaginaHabilidades from 'Pages/Ficha/SubPaginasFicha/SubPaginaHabilidades/page.tsx';
import SubPaginaRituais from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/page.tsx';
import SubPaginaEfeitos from "Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/page.tsx";
import { Abas, ListaAbas, Aba, PainelAbas, ControleAbasExternas } from 'Components/LayoutAbas/page.tsx';
import { ToastContainer } from 'react-toastify';
import Log from "Components/Log/page.tsx";
import 'react-toastify/dist/ReactToastify.css';

import { ContextoAbaEfeitos, ContextoAbaEfeitosProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/contexto.tsx';
import { ContextoAbaAtributo, ContextoAbaAtributoProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/contexto.tsx';
import { ContextoAbaInventario, ContextoAbaInventarioProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaInventario/contexto.tsx';
import { ContextoAbaAcoes, ContextoAbaAcoesProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/contexto.tsx';
import { ContextoAbaHabilidades, ContextoAbaHabilidadesProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaHabilidades/contexto.tsx';
import { ContextoAbaRituais, ContextoAbaRituaisProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/contexto.tsx';

import store from 'Redux/store.ts';
// #endregion

const page: React.FC = () => {
    const personagem = useSelector((state: RootState) => state.fichaHelper.fichaHelper.personagem);
    const personagemLoaded = useSelector(selectPersonagemCarregado);

    const [_, setState] = useState({});

    const controleRef = useRef<{ abreAba: (idAba: string) => void; fechaAba: (idAba: string) => void; }>(null);

    useEffect(() => {
        store.dispatch(carregaDemo());
    }, []);

    useEffect(() => {
        if (personagemLoaded && personagem){
            personagem.carregaOnUpdate(() => setState({}));
        }
    }, [personagemLoaded]);

    return (
        <>
            <ToastContainer />
            <Log/>

            {personagem && (
                <>
                    <div className={style.div_demo_acoes}>
                        <div>
                            <h1>Alterar Estatística</h1>
                            <div>
                                <select id="estatistica">{personagem.estatisticasDanificaveis.map(estatistica_danificavel => (<option key={estatistica_danificavel.refEstatisticaDanificavel.id} value={estatistica_danificavel.refEstatisticaDanificavel.id}> {estatistica_danificavel.refEstatisticaDanificavel.nome} </option>))}</select>
                                <select id="valorRecuperar">{Array.from({length:100}, (_, index) => (index + 1)).map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                            </div>
                            <div>
                                <select id="danificarOuRecuperar"><option key={1} value={'Danificar'}>Danificar</option><option key={2} value={'Recuperar'}>Recuperar</option></select>
                                <button onClick={() => {personagem.receptor.teste(
                                    parseInt((document.querySelector('#estatistica') as HTMLSelectElement).value),
                                    parseInt((document.querySelector('#valorRecuperar') as HTMLSelectElement).value),
                                    (document.querySelector('#danificarOuRecuperar') as HTMLSelectElement).selectedIndex+1,
                                );}}>Aplicar</button>
                            </div>
                        </div>
{/* 
                        <div>
                            <h1>Alterar Est. Máxima</h1>
                            <div>
                                <select id="valorMaximo">{Array.from({length:100}, (_, index) => (index + 1) * 10).map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                                <select id="estatisticaMaxima">{personagem.estatisticasDanificaveis.map(estatistica_danificavel => (<option key={estatistica_danificavel.refEstatisticaDanificavel.id} value={estatistica_danificavel.refEstatisticaDanificavel.id}> {estatistica_danificavel.refEstatisticaDanificavel.nome} </option>))}</select>
                            </div>
                            <div><button onClick={() => {personagem.alterarMaximoEstatistica(parseInt((document.querySelector('#estatisticaMaxima') as HTMLSelectElement).value), parseInt((document.querySelector('#valorMaximo') as HTMLInputElement).value))}}>Alterar</button></div>
                        </div> */}

                        {/* <div>
                            <h1>Passar Durações</h1>
                            {singleton.duracoes.filter(duracao => duracao.id !== 5).map((duracao, index) => (
                                <button key={index} onClick={() => { personagem.rodaDuracao(duracao.id) }} >{duracao.nome}</button>
                            ))}
                        </div> */}

                        {/* <div>
                            <h1>Shopping</h1>
                            <button onClick={(e) => { e.preventDefault(); openModal(); }}>Abrir Shopping</button>
                        </div> */}
                    </div>
                </>
            )}

            {personagem && (
                <Abas>
                    <ControleAbasExternas ref={controleRef} />

                    <ListaAbas>
                        <Aba id="aba1">Nome</Aba>
                        <Aba id="aba2">Estatísticas</Aba>
                        <Aba id="aba3">Efeitos</Aba>
                        <Aba id="aba4">Atributos</Aba>
                        <Aba id="aba5">Inventário</Aba>
                        <Aba id="aba6">Ações</Aba>
                        <Aba id="aba7">Habilidades</Aba>
                        <Aba id="aba8">Rituais</Aba>
                    </ListaAbas>

                    <div className={style.wrapper_conteudo_abas}>
                        <PainelAbas id="aba1"><SubPaginaDetalhes detalhesPersonagem={personagem.detalhes}/></PainelAbas>

                        <PainelAbas id="aba2"><SubPaginaEstatisticasDanificaveis estatisticasDanificaveis={personagem.estatisticasDanificaveis} reducoesDanoPersonage={personagem.reducoesDano} estatisticasBuffaveis={personagem.estatisticasBuffaveis}/></PainelAbas>

                        <ContextoAbaEfeitosProvider>
                            <PainelAbas id="aba3" contextoMenu={ContextoAbaEfeitos}><SubPaginaEfeitos modificadores={personagem.modificadores} abaId={"aba3"}/></PainelAbas>
                        </ContextoAbaEfeitosProvider>

                        <ContextoAbaAtributoProvider>
                            <PainelAbas id="aba4" contextoMenu={ContextoAbaAtributo}><SubPaginaAtributosPericias atributos={personagem.atributos} pericias={personagem.pericias}/></PainelAbas>
                        </ContextoAbaAtributoProvider>

                        <ContextoAbaInventarioProvider>
                            <PainelAbas id="aba5" contextoMenu={ContextoAbaInventario}><SubPaginaInventario abaId={"aba5"} inventarioPersonagem={personagem.inventario} estatisticasBuffaveis={personagem.estatisticasBuffaveis} abrirAbaAcao={() => {controleRef.current?.abreAba("aba6")}}/></PainelAbas>
                        </ContextoAbaInventarioProvider>

                        <ContextoAbaAcoesProvider>
                            <PainelAbas id="aba6" contextoMenu={ContextoAbaAcoes}><SubPaginaAcoes abaId={"aba6"} acoesPersonagem={personagem.acoes} /></PainelAbas>
                        </ContextoAbaAcoesProvider>

                        <ContextoAbaHabilidadesProvider>
                            <PainelAbas id="aba7" contextoMenu={ContextoAbaHabilidades}><SubPaginaHabilidades abaId={"aba7"} habilidadesPersonagem={personagem.habilidades} abrirAbaAcao={() => {controleRef.current?.abreAba("aba6")}}/></PainelAbas>
                        </ContextoAbaHabilidadesProvider>

                        <ContextoAbaRituaisProvider>
                            <PainelAbas id="aba8" contextoMenu={ContextoAbaRituais}><SubPaginaRituais abaId={"aba8"} rituaisPersonagem={personagem.rituais} abrirAbaAcao={() => {controleRef.current?.abreAba("aba6")}}/></PainelAbas>
                        </ContextoAbaRituaisProvider>
                    </div>
                </Abas>
            )}
        </>
    );
};

export default page;