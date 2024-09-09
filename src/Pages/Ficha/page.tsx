// #region Imports
import style from "./style.module.css";
import "./style.css";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store';
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { selectPersonagemCarregado } from "Redux/slices/fichaHelperSlice.ts";
import Aba1 from "Pages/Ficha/Abas/Aba1/page.tsx";
import Aba2 from "Pages/Ficha/Abas/Aba2/page.tsx";
import Aba3 from "Pages/Ficha/Abas/Aba3/page.tsx";
import Aba4 from "Pages/Ficha/Abas/Aba4/page.tsx";
import Aba5 from "Pages/Ficha/Abas/Aba5/page.tsx";
import Aba6 from "Pages/Ficha/Abas/Aba6/page.tsx";
import Aba7 from "Pages/Ficha/Abas/Aba7/page.tsx";
import Aba8 from "Pages/Ficha/Abas/Aba8/page.tsx";
import { Abas, ListaAbas, Aba, PainelAbas } from 'Components/LayoutAbas/page.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// #endregion

const Ficha: React.FC = () => {
    const slice = useSelector((state: RootState) => state.fichaHelper);
    const personagemLoaded = useSelector(selectPersonagemCarregado);
    const personagem = slice.fichaHelper.personagem;
    const [state, setState] = useState({});

    useEffect(() => {
        if (personagemLoaded && personagem)
            personagem.carregaOnUpdate(() => setState({}));
    }, [personagemLoaded]);

    return (
        <>
            <ToastContainer />
            {personagem && (
                <Abas>
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
                        <PainelAbas id="aba2"><Aba2 estatisticasDanificaveis={personagem.controladorPersonagem.estatisticasDanificaveis}/></PainelAbas>
                        <PainelAbas id="aba3"><Aba8 buffsPersonagem={personagem.buffs}/></PainelAbas>
                        <PainelAbas id="aba4"><Aba3 atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/></PainelAbas>
                        <PainelAbas id="aba5"><Aba4 reducoesDanoPersonage={personagem.reducoesDano}/></PainelAbas>
                        <PainelAbas id="aba6"><Aba5 inventarioPersonagem={personagem.inventario}/></PainelAbas>
                        <PainelAbas id="aba7"><Aba6 acoesPersonagem={personagem.acoes}/></PainelAbas>
                        <PainelAbas id="aba8"><Aba7 rituaisPersonagem={personagem.rituais}/></PainelAbas>
                    </div>
                </Abas>
            )}
            {/* {personagem ? (
                <Tabs defaultIndex={0}>
                    <TabList>
                        <Tab>Perícias</Tab>
                        <Tab>Ações</Tab>
                        <Tab>Inventário</Tab>
                        <Tab>Habilidades</Tab>
                        <Tab>Rituais</Tab>
                    </TabList>
                    <Aba1 detalhesPersonagem={personagem.detalhes}/>
                    <Aba2 estatisticasDanificaveis={personagem.controladorPersonagem.estatisticasDanificaveis}/>
                    <Aba8 buffsPersonagem={personagem.buffs}/>
                    <div className={style.main_wrapper}>
                        </TabPanel>
                        
                        
                        
                        <TabPanel><Aba7/></TabPanel>
                    </div>
                </Tabs>
            ): <></>} */}

        </>
    );
};

export default Ficha;