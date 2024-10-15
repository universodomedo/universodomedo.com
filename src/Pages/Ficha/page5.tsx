// #region Imports
import style from "./style.module.css";
import "./style.css";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { selectPersonagemCarregado } from "Redux/slices/fichaHelperSlice.ts";
import Aba1 from "Pages/Ficha/Abas/Aba1/page.tsx";
import Aba2 from "@pages/Ficha/SubPaginasFicha/SubPaginaEstatisticasDanificaveis/page";
import Aba3 from "@pages/Ficha/SubPaginasFicha/SubPaginaAtributoPericia/page";
import Aba4 from "@pages/Ficha/SubPaginasFicha/SubPaginaReducoes/page";
import Aba5 from "Pages/Ficha/Abas/Aba5/page.tsx";
import Aba6 from "Pages/Ficha/Abas/Aba6/page.tsx";
import Aba7 from "Pages/Ficha/Abas/Aba7/page.tsx";

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
                        <TabPanel><Aba5 inventarioPersonagem={personagem.inventario}/></TabPanel>
                    </div>
                </Tabs>
            ): <></>}
        </>
    );
};

export default Ficha;