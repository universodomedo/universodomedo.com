// // #region Imports
// import "./style3.css";
// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from 'Redux/store';
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
// import Aba1 from "Pages/Ficha/Abas/Aba1/page.tsx";
// import Aba2 from "Pages/Ficha/Abas/Aba2/page.tsx";
// import Aba3 from "Pages/Ficha/Abas/Aba3/page.tsx";
// import Aba4 from "Pages/Ficha/Abas/Aba4/page.tsx";
// import Aba5 from "Pages/Ficha/Abas/Aba5/page.tsx";
// import Aba6 from "Pages/Ficha/Abas/Aba6/page.tsx";
// import Aba7 from "Pages/Ficha/Abas/Aba7/page.tsx";
// // #endregion

// const Ficha: React.FC = () => {
//     const fichaHelper = useSelector((state: RootState) => state.fichaHelper);
//     const personagem = fichaHelper.personagem;
//     const [state, setState] = useState({});

//     return (
//         <div className="divPrincipal">
//             <div className="top"><button onClick={() => {setState({}); console.log(personagem);}}>Cu</button></div>
//             <div className="main">
//                 <div className="left"></div>
//                 <div className="mid">
//                 {personagem ? (
//                     <Tabs defaultIndex={0}>
//                         <TabList>
//                             <Tab>Perícias</Tab>
//                             <Tab>Ações</Tab>
//                             <Tab>Inventário</Tab>
//                             <Tab>Habilidades</Tab>
//                             <Tab>Rituais</Tab>
//                         </TabList>
//                         <Aba1 detalhesPersonagem={personagem.detalhes}/>
//                         <Aba2 estatisticasDanificaveis={personagem.controladorPersonagem.estatisticasDanificaveis}/>
//                         <div className="main-wrapper">
//                             <TabPanel><Aba3 atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/></TabPanel>
//                         </div>
//                     </Tabs>
//                 ) : <></>}
//                 {false ? (
//                     <>
//                         <Aba1 detalhesPersonagem={personagem.detalhes}/>
//                         <Aba2 estatisticasDanificaveis={personagem.controladorPersonagem.estatisticasDanificaveis}/>
//                         <div className="main-wrapper">
//                             <Aba3 atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/>
//                             <Aba3 atributosPersonagem={personagem.atributos} periciasPersonagem={personagem.pericias}/>
//                         </div>
//                     </>
//                 ) : <></>}
//                 </div>
//                 <div className="right"></div>
//             </div>
//         </div>
//     )
// };

// export default Ficha;