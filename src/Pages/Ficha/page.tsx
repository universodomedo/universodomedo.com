// #region Imports
import style from "./style.module.css";
import "./style.css";
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Aba1 from "Pages/Ficha/Abas/Aba1/page.tsx";
import Aba2 from "Pages/Ficha/Abas/Aba2/page.tsx";
import Aba3 from "Pages/Ficha/Abas/Aba3/page.tsx";
import Aba4 from "Pages/Ficha/Abas/Aba4/page.tsx";
import Aba5 from "Pages/Ficha/Abas/Aba5/page.tsx";
import Aba6 from "Pages/Ficha/Abas/Aba6/page.tsx";
import Aba7 from "Pages/Ficha/Abas/Aba7/page.tsx";
// #endregion

const Ficha: React.FC = () => {
    const fichaHelper = useSelector((state: RootState) => state.fichaHelper);
    const personagem = fichaHelper.personagem;
    const [state, setState] = useState({});

    return (
        <>
            <button onClick={() => {setState({});}}>Cu</button>
            {personagem ? (
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
                    <div className={style.main_wrapper}>
                        <TabPanel><Aba3 atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/></TabPanel>
                        <TabPanel><Aba4 reducoesDanoPersonage={personagem.reducoesDano}/></TabPanel>
                        <TabPanel><Aba5/></TabPanel>
                        <TabPanel><Aba6/></TabPanel>
                        <TabPanel><Aba7/></TabPanel>
                    </div>
                </Tabs>
            ): <></>}
        </>
    );
};

export default Ficha;