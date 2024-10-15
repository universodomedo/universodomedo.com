// #region Imports
import style from "./style.module.css";
import "./style.css";
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import { selectPersonagemCarregado } from "Redux/slices/fichaHelperSlice.ts";
import Aba1 from "Pages/Ficha/Abas/Aba1/page.tsx";
import SubPaginaEstatisticasDanificaveis from "Pages/Ficha/SubPaginasFicha/SubPaginaEstatisticasDanificaveis/page.tsx";
import SubPaginaAtributosPericias from "Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/page.tsx";
import SubPaginaReducoes from "Pages/Ficha/SubPaginasFicha/SubPaginaReducoes/page.tsx";
import SubPaginaInventario from "Pages/Ficha/SubPaginasFicha/SubPaginaInventario/page.tsx";
import SubPaginaAcoes from "Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/page.tsx"
import SubPaginaRituais from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/page.tsx';
import SubPaginaEfeitos from "Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/page.tsx";
import { Abas, ListaAbas, Aba, PainelAbas, ControleAbasExternas } from 'Components/LayoutAbas/page.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Modal from "Components/Modal/page.tsx";
import TesteShop from "Pages/TesteShop/page.tsx";
// #endregion

const Ficha: React.FC = () => {
    const personagem = useSelector((state: RootState) => state.fichaHelper.fichaHelper.personagem);
    const singleton = useSelector((state: RootState) => state.singletonHelper.singletonHelper);
    const personagemLoaded = useSelector(selectPersonagemCarregado);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [state, setState] = useState({});

    const controleRef = useRef<{ abreAba: (idAba: string) => void; fechaAba: (idAba: string) => void; }>(null);

    useEffect(() => {
        if (personagemLoaded && personagem)
            personagem.carregaOnUpdate(() => setState({}));
    }, [personagemLoaded]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <ToastContainer />

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <TesteShop />
            </Modal>

            <div className={style.div_demo_acoes}>
                <div>
                    <h1>Aumentar Máximo</h1>
                    <div>
                        <select id="valorMaximo">{Array.from({length:100}, (_, index) => (index + 1) * 10).map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                        <select id="estatisticaMaxima">{personagem.estatisticasDanificaveis.map(estatistica_danificavel => (<option key={estatistica_danificavel.refEstatisticaDanificavel.id} value={estatistica_danificavel.refEstatisticaDanificavel.id}> {estatistica_danificavel.refEstatisticaDanificavel.nome} </option>))}</select>
                    </div>
                    <div><button onClick={() => {personagem.alterarMaximoEstatistica(parseInt((document.querySelector('#estatisticaMaxima') as HTMLSelectElement).value), parseInt((document.querySelector('#valorMaximo') as HTMLInputElement).value))}}>Alterar</button></div>
                </div>

                <div>
                    <h1>Recuperar</h1>
                    <div>
                        <select id="estatistica">{personagem.estatisticasDanificaveis.map(estatistica_danificavel => (<option key={estatistica_danificavel.refEstatisticaDanificavel.id} value={estatistica_danificavel.refEstatisticaDanificavel.id}> {estatistica_danificavel.refEstatisticaDanificavel.nome} </option>))}</select>
                        <select id="valorRecuperar">{Array.from({length:100}, (_, index) => (index + 1) * 10).map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                    </div>
                    <div>
                        <button onClick={() => {personagem.receptor.teste(parseInt((document.querySelector('#estatistica') as HTMLSelectElement).value), parseInt((document.querySelector('#valorRecuperar') as HTMLSelectElement).value))}}>Recuperar</button>
                    </div>
                </div>


                <div>
                    <h1>Passar Durações</h1>
                    {singleton.duracoes.filter(duracao => duracao.id !== 5).map((duracao, index) => (
                        <button key={index} onClick={() => { personagem.rodaDuracao(duracao.id) }} >{duracao.nome}</button>
                    ))}
                </div>

                <div>
                    <h1>Shopping</h1>
                    <button onClick={(e) => { e.preventDefault(); openModal(); }}>Abrir Shopping</button>
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
                        <PainelAbas id="aba2"><SubPaginaEstatisticasDanificaveis estatisticasDanificaveis={personagem.estatisticasDanificaveis}/></PainelAbas>
                        <PainelAbas id="aba3"><SubPaginaEfeitos buffsPersonagem={personagem.buffsAplicados} abaId={"aba3"}/></PainelAbas>
                        <PainelAbas id="aba4"><SubPaginaAtributosPericias atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/></PainelAbas>
                        <PainelAbas id="aba5"><SubPaginaReducoes reducoesDanoPersonage={personagem.reducoesDano} estatisticasBuffaveis={personagem.estatisticasBuffaveis}/></PainelAbas>
                        <PainelAbas id="aba6"><SubPaginaInventario abaId={"aba6"} inventarioPersonagem={personagem.inventario} estatisticasBuffaveis={personagem.estatisticasBuffaveis} abrirAbaAcao={() => {controleRef.current?.abreAba("aba7")}}/></PainelAbas>
                        <PainelAbas id="aba7"><SubPaginaAcoes abaId={"aba7"} acoesPersonagem={personagem.acoes} /></PainelAbas>
                        <PainelAbas id="aba8"><SubPaginaRituais abaId={"aba8"} rituaisPersonagem={personagem.rituais} abrirAbaAcao={() => {controleRef.current?.abreAba("aba7")}}/></PainelAbas>
                    </div>
                </Abas>
            )}
        </>
    );
};

export default Ficha;