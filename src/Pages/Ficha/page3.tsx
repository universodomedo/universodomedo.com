// import "./style2.css";
// import { useEffect, useState } from "react";
// import { Personagem } from "Types/classes.tsx";
// import { useParams } from 'react-router-dom';
// import NewCharacter from "./newCharacter.tsx";
// import BarraEstatisticaDanificavel from "@components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx"
// import { DanoGeral, InstanciaDano, listaTiposDano } from "Types/classes.tsx"

// const Ficha = () => {
//     const [character, setCharacter] = useState<Personagem>({} as Personagem);
//     const { characterId } = useParams<{ characterId: string }>();
//     const [state, setState] = useState({});

//     useEffect(() => {
//         const getCharacter = async () => {
//             if (characterId) {
//                 const characterData = await NewCharacter(parseInt(characterId));
//                 setCharacter(characterData);
//             }
//         }

//         getCharacter();
//         setState({});
//     }, []);

//     return (
//         <>
//         {character.estatisticas ? (
//             <div className="teste">
//                 <main className="main-content">
//                     <button onClick={() => {setState({});}}>Cu</button>
//                     <div className="first-child">
//                         <div className="first-child-left">
//                             <div className="left-child">
//                                 <h1>Pontos de Vida</h1>
//                                 {/* <BarraEstatisticaDanificavel hp={character.controladorPersonagem.pv!.valorAtual} maxHp={character.controladorPersonagem.pv!.valorMaximo} /> */}
//                                 <button onClick={() => {character.receberDanoVital(new DanoGeral([
//                                     new InstanciaDano(4, listaTiposDano.find(tipoDano => tipoDano.id === 4)!),
//                                     new InstanciaDano(2, listaTiposDano.find(tipoDano => tipoDano.id === 7)!),
//                                     new InstanciaDano(3, listaTiposDano.find(tipoDano => tipoDano.id === 13)!)
//                                 ]))}}>Receber Dano</button>
//                                 {/* <button onClick={() => {character.receberDanoVital(new DanoGeral([new InstanciaDano(4, listaTiposDano.find(tipoDano => tipoDano.id === 3)!), new InstanciaDano(1)]))}}>Receber Dano</button> */}
//                             </div>
//                             <div className="left-child">
//                                 <h1>Pontos de Sanidade</h1>
//                                 {/* <p>{character.controladorPersonagem.ps!.valorAtual}/{character.controladorPersonagem.ps!.valorMaximo}</p> */}
//                                 {/* <button onClick={() => {character.receberDanoVital(1)}}>Receber Dano</button> */}
//                             </div>
//                             <div className="left-child">
//                                 <h1>Pontos de Esforço</h1>
//                                 {/* <p>{character.controladorPersonagem.pe!.valorAtual}/{character.controladorPersonagem.pe!.valorMaximo}</p> */}
//                                 {/* <button onClick={() => {character.controladorPersonagem.pe!.aplicarDano(1)}}>Receber Dano</button> */}
//                             </div>
//                         </div>
//                         <div className="first-child-right">
//                             <table>
//                                 <tr><th>Classificação</th><th>Redução</th></tr>
//                                 {character.reducoesDano.map((rd, index) => (
//                                     <tr>
//                                         <td>{rd.tipo.nome}</td>
//                                         <td>{rd.valor}</td>
//                                     </tr>
//                                 ))}
//                             </table>
//                         </div>
//                     </div>
//                     <div className="second-child">
//                         <div className="second-child-child">
//                             <div className="main-child">
//                                 <h1>Nome</h1>
//                                 <p>{character.detalhes.nome}</p>
//                             </div>
//                         </div>
//                         <div className="second-child-child">
//                             <div className="main-child">
//                                 <h1>NEX</h1>
//                                 <p>{character.detalhes.nex}</p>
//                             </div>
//                         </div>
//                         <div className="second-child-child">
//                             <div className="main-child">
//                                 <h1>Classe</h1>
//                                 <p>{character.detalhes.classe}</p>
//                             </div>
//                         </div>
//                         <div className="second-child-child">
//                             <div className="main-child">
//                                 <h1>Espaços de Inventário</h1>
//                             </div>
//                         </div>
//                         <div className="second-child-child">
//                             <div className="main-child">
//                                 <h1>Moedas</h1>
//                             </div>
//                         </div>
//                     </div>
//                     {/* <div className="third-child"></div> */}
//                     <div className="main-child">
//                         <h1>Atributos</h1>
//                     </div>
//                     <div className="main-child">
//                         <h1>Perícias</h1>
//                     </div>
//                     <div className="main-child">
//                         <h1>Espaços de Categoria</h1>
//                     </div>
//                     <div className="main-child">
//                         <h1>Ações</h1>
//                     </div>
//                     <div className="main-child">
//                         <h1>Habilidades</h1>
//                     </div>
//                     <div className="main-child">
//                         <h1>Rituais</h1>
//                     </div>
//                 </main>
//             </div>
//         ) : <></>}
//         </>
//     );
// }

// export default Ficha;