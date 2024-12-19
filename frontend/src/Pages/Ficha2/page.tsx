// #region Imports
import style from "./style.module.css";
import "./style.css";

import { useRef } from 'react';

import { RLJ_Ficha2 } from 'Types/classes/index.ts';

import SubPaginaDetalhes from "Pages/Ficha/SubPaginasFicha/SubPaginaDetalhes/page.tsx";
import SubPaginaEstatisticasDanificaveis from "Pages/Ficha/SubPaginasFicha/SubPaginaEstatisticasDanificaveis/page.tsx";
import SubPaginaAtributosPericias from "Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/page.tsx";
import SubPaginaInventario from "Pages/Ficha/SubPaginasFicha/SubPaginaInventario/page.tsx";
import SubPaginaAcoes from "Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/page.tsx"
import SubPaginaHabilidades from 'Pages/Ficha/SubPaginasFicha/SubPaginaHabilidades/page.tsx';
import SubPaginaRituais from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/page.tsx';
import SubPaginaEfeitos from "Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/page.tsx";

import { ContextoFichaProvider, getPersonagemFromContext, useContextoFicha, useContextBridge } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

import { Abas, ListaAbas, Aba, PainelAbas, ControleAbasExternas } from 'Components/LayoutAbas/page.tsx';
import { ContextoAbaEfeitos, ContextoAbaEfeitosProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/contexto.tsx';
import { ContextoAbaAtributo, ContextoAbaAtributoProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/contexto.tsx';
import { ContextoAbaInventario, ContextoAbaInventarioProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaInventario/contexto.tsx';
import { ContextoAbaAcoes, ContextoAbaAcoesProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/contexto.tsx';
import { ContextoAbaHabilidades, ContextoAbaHabilidadesProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaHabilidades/contexto.tsx';
import { ContextoAbaRituais, ContextoAbaRituaisProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/contexto.tsx';

import { useLocation } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import Log from "Components/Log/page.tsx";
import 'react-toastify/dist/ReactToastify.css';
// #endregion

const page = () => {
    const location = useLocation();

    const indexFicha = location.state?.indexFicha;

    return (
        <ContextoFichaProvider idFichaNoLocalStorage={indexFicha}>
            <PaginaFicha />
        </ContextoFichaProvider>
    );
}

const PaginaFicha = () => {
    const { personagem } = useContextoFicha();
    // const personagem = getPersonagemFromContext();
    const controleRef = useRef<{ abreAba: (idAba: string) => void; fechaAba: (idAba: string) => void; }>(null);

    // useContextBridge();

    return (
        <>
            <ToastContainer />
            <Log />

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
                        <PainelAbas id="aba1"><SubPaginaDetalhes detalhesPersonagem={personagem.detalhes} /></PainelAbas>

                        <PainelAbas id="aba2"><SubPaginaEstatisticasDanificaveis estatisticasDanificaveis={personagem.estatisticasDanificaveis} reducoesDanoPersonage={personagem.reducoesDano} estatisticasBuffaveis={personagem.estatisticasBuffaveis} /></PainelAbas>

                        <ContextoAbaEfeitosProvider>
                            <PainelAbas id="aba3" contextoMenu={ContextoAbaEfeitos}><SubPaginaEfeitos modificadores={personagem.modificadores} abaId={"aba3"} /></PainelAbas>
                        </ContextoAbaEfeitosProvider>

                        <ContextoAbaAtributoProvider>
                            <PainelAbas id="aba4" contextoMenu={ContextoAbaAtributo}><SubPaginaAtributosPericias atributos={personagem.atributos} pericias={personagem.pericias} /></PainelAbas>
                        </ContextoAbaAtributoProvider>

                        <ContextoAbaInventarioProvider>
                            <PainelAbas id="aba5" contextoMenu={ContextoAbaInventario}><SubPaginaInventario abaId={"aba5"} inventarioPersonagem={personagem.inventario} estatisticasBuffaveis={personagem.estatisticasBuffaveis} abrirAbaAcao={() => { controleRef.current?.abreAba("aba6") }} /></PainelAbas>
                        </ContextoAbaInventarioProvider>

                        <ContextoAbaAcoesProvider>
                            <PainelAbas id="aba6" contextoMenu={ContextoAbaAcoes}><SubPaginaAcoes abaId={"aba6"} acoesPersonagem={personagem.acoes} /></PainelAbas>
                        </ContextoAbaAcoesProvider>

                        <ContextoAbaHabilidadesProvider>
                            <PainelAbas id="aba7" contextoMenu={ContextoAbaHabilidades}><SubPaginaHabilidades abaId={"aba7"} habilidadesPersonagem={personagem.habilidades} abrirAbaAcao={() => { controleRef.current?.abreAba("aba6") }} /></PainelAbas>
                        </ContextoAbaHabilidadesProvider>

                        <ContextoAbaRituaisProvider>
                            <PainelAbas id="aba8" contextoMenu={ContextoAbaRituais}><SubPaginaRituais abaId={"aba8"} rituaisPersonagem={personagem.rituais} abrirAbaAcao={() => { controleRef.current?.abreAba("aba6") }} /></PainelAbas>
                        </ContextoAbaRituaisProvider>
                    </div>
                </Abas>
            )}
        </>
    );
}

export default page;