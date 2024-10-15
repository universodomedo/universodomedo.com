// #region Imports
import style from "./style.module.css";
import "./style.css";
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import "react-tabs/style/react-tabs.css";
import { selectPersonagemCarregado } from "Redux/slices/fichaHelperSlice.ts";
import Aba2 from "@pages/Ficha/SubPaginasFicha/SubPaginaEstatisticasDanificaveis/page";
import Aba3 from "@pages/Ficha/SubPaginasFicha/SubPaginaAtributoPericia/page";
import Aba6 from "Pages/Ficha/Abas/Aba6/page.tsx";
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
                        <Aba id="aba2">Estatísticas</Aba>
                        <Aba id="aba3">Efeitos</Aba>
                        <Aba id="aba4">Atributos</Aba>
                        <Aba id="aba7">Ações</Aba>
                    </ListaAbas>

                    <div className={style.wrapper_conteudo_abas}>
                        <PainelAbas id="aba2"><Aba2 estatisticasDanificaveis={personagem.controladorPersonagem.estatisticasDanificaveis}/></PainelAbas>
                        <PainelAbas id="aba3"><Aba8 buffsPersonagem={personagem.buffs}/></PainelAbas>
                        <PainelAbas id="aba4"><Aba3 atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/></PainelAbas>
                        <PainelAbas id="aba7"><Aba6 acoesPersonagem={personagem.acoes}/></PainelAbas>
                    </div>
                </Abas>
            )}
        </>
    );
};

export default Ficha;