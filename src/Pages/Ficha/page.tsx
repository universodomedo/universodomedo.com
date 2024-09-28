// #region Imports
import style from "./style.module.css";
import "./style.css";
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import { selectPersonagemCarregado } from "Redux/slices/fichaHelperSlice.ts";
import Aba1 from "Pages/Ficha/Abas/Aba1/page.tsx";
import Aba2 from "Pages/Ficha/Abas/Aba2/page.tsx";
import SubPaginaAtributosPericias from "Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/page.tsx";
import Aba4 from "Pages/Ficha/Abas/Aba4/page.tsx";
import Aba5 from "Pages/Ficha/Abas/Aba5/page.tsx";
import SubPaginaAcoes from "Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/page.tsx"
import SubPaginaRituais from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/page.tsx';
import SubPaginaEfeitos from "Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/page.tsx";
import { Abas, ListaAbas, Aba, PainelAbas, ControleAbasExternas } from 'Components/LayoutAbas/page.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Personagem } from "Types/classes.tsx"
// #endregion

const Ficha: React.FC = () => {
    const personagem = useSelector((state: RootState) => state.fichaHelper.fichaHelper.personagem);
    const singleton = useSelector((state: RootState) => state.singletonHelper.singletonHelper);
    const personagemLoaded = useSelector(selectPersonagemCarregado);

    const [state, setState] = useState({});

    const controleRef = useRef<{ abreAba: (idAba: string) => void; fechaAba: (idAba: string) => void; }>(null);

    useEffect(() => {
        if (personagemLoaded && personagem)
            personagem.carregaOnUpdate(() => setState({}));
    }, [personagemLoaded]);

    return (
        <>
            <ToastContainer />

            <div className={style.div_demo_acoes}>
                <h1>Alterar Estatísticas Máximas</h1>
                <div>
                    <select id="estatisticaMaxima">{personagem.estatisticasDanificaveis.map(estatistica_danificavel => (<option key={estatistica_danificavel.refEstatisticaDanificavel.id} value={estatistica_danificavel.refEstatisticaDanificavel.id}> {estatistica_danificavel.refEstatisticaDanificavel.nome} </option>))}</select>
                    Valor Máximo: <input id="valorMaximo" type="number" min={1} />
                    <button onClick={() => {personagem.alterarMaximoEstatistica(parseInt((document.querySelector('#estatisticaMaxima') as HTMLSelectElement).value), parseInt((document.querySelector('#valorMaximo') as HTMLInputElement).value))}}>Alterar</button>
                </div>

                <h1>Adicionar novo Ritual</h1>
                <div>
                    Nome: <input id="nome" type="text" />

                    Elemento: <select id="elemento"> {singleton.elementos.map(elemento => (<option key={elemento.id} value={elemento.id}> {elemento.nome} </option>))} </select>
                    Circulo: <select id="circulo"> {singleton.circulos_ritual.map(circulo_ritual => (<option key={circulo_ritual.id} value={circulo_ritual.id}> {circulo_ritual.nome} </option>))} </select>
                    Nivel: <select id="nivel"> {singleton.niveis_ritual.map(nivel_ritual => (<option key={nivel_ritual.id} value={nivel_ritual.id}> {nivel_ritual.nome} </option>))} </select>
                    <button onClick={() => { personagem.adicionarNovoRitual((document.querySelector('#nome') as HTMLInputElement).value, parseInt((document.querySelector('#elemento') as HTMLSelectElement).value), parseInt((document.querySelector('#circulo') as HTMLSelectElement).value), parseInt((document.querySelector('#nivel') as HTMLSelectElement).value)) }}>Adicionar</button>
                </div>

                <h1>Passar Durações</h1>
                <div>
                    {singleton.duracoes.filter(duracao => duracao.id !== 5).map((duracao, index) => (
                        <button key={index} onClick={() => { personagem.rodaDuracao(duracao.id) }} >{duracao.nome}</button>
                    ))}
                </div>

                <h1>Sofrer Ação</h1>
                <div>

                </div>

                <h1>Recuperar</h1>
                <div>
                    <select id="estatistica">{personagem.estatisticasDanificaveis.map(estatistica_danificavel => (<option key={estatistica_danificavel.refEstatisticaDanificavel.id} value={estatistica_danificavel.refEstatisticaDanificavel.id}> {estatistica_danificavel.refEstatisticaDanificavel.nome} </option>))}</select>
                    <select id="valorRecuperar">{Array.from({length:100}, (_, index) => (index + 1) * 10).map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                    <button onClick={() => {personagem.receptor.teste(parseInt((document.querySelector('#estatistica') as HTMLSelectElement).value), parseInt((document.querySelector('#valorRecuperar') as HTMLSelectElement).value))}}>Recuperar</button>
                </div>

                <h1>Shopping</h1>
                <div>
                    
                </div>
            </div>

            {personagem && (
                <Abas>
                    <ControleAbasExternas ref={controleRef} />

                    <ListaAbas>
                        <Aba id="aba1">Nome</Aba>
                        <Aba id="aba2">Estatísticas</Aba>
                        <Aba id="aba3">Efeitos</Aba>
                        <Aba id="aba4">Atributos</Aba>
                        <Aba id="aba5">Reduções</Aba>
                        <Aba id="aba6">Inventário</Aba>
                        <Aba id="aba7">Ações</Aba>
                        <Aba id="aba8">Rituais</Aba>
                    </ListaAbas>

                    <div className={style.wrapper_conteudo_abas}>
                        <PainelAbas id="aba1"><Aba1 detalhesPersonagem={personagem.detalhes}/></PainelAbas>
                        <PainelAbas id="aba2"><Aba2 estatisticasDanificaveis={personagem.estatisticasDanificaveis}/></PainelAbas>
                        <PainelAbas id="aba3"><SubPaginaEfeitos buffsPersonagem={personagem.buffsAplicados} abaId={"aba3"}/></PainelAbas>
                        <PainelAbas id="aba4"><SubPaginaAtributosPericias atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/></PainelAbas>
                        <PainelAbas id="aba5"><Aba4 reducoesDanoPersonage={personagem.reducoesDano} estatisticasBuffaveis={personagem.estatisticasBuffaveis}/></PainelAbas>
                        <PainelAbas id="aba6"><Aba5 inventarioPersonagem={personagem.inventario} estatisticasBuffaveis={personagem.estatisticasBuffaveis}/></PainelAbas>
                        <PainelAbas id="aba7"><SubPaginaAcoes acoesPersonagem={personagem.acoes} abaId={"aba7"} /></PainelAbas>
                        <PainelAbas id="aba8"><SubPaginaRituais rituaisPersonagem={personagem.rituais} abaId={"aba8"} abrirAbaAcao={() => {controleRef.current?.abreAba("aba7")}}/></PainelAbas>
                    </div>
                </Abas>
            )}
        </>
    );
};

export default Ficha;