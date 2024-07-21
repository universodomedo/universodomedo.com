import "./style.css";
import NewCharacter from "./newCharacter.tsx";
import { useEffect, useState, useRef } from "react";
import { Character, Pericia, BonusConectado } from "./classes.tsx";
import { TestePericia } from "Components/Functions/RollNumber.tsx";
import Dropdown from 'Components/SubComponents/Dropdown/page.tsx';

const Ficha = () => {
    // #region Variaveis Soltas
    const [character, setCharacter] = useState<Character>({} as Character);
    const [element, setElement] = useState([] as string[]);
    const [state, setState] = useState({});
    const scrollableRef = useRef<HTMLDivElement>(null);

    // #endregion

    // #region UseEffect
    useEffect(() => {
        setCharacter(NewCharacter());
    }, []);

    useEffect(() => {
        const scrollableDiv = scrollableRef.current;
        if (scrollableDiv) 
          scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }, [element]);
    // #endregion

    // #region Functions
    function realizaTestePericia(pericia:Pericia) {
      const message1 = `Você realizou um teste da Perícia ${pericia.nome}: ${pericia.parentAtributo.valorTotal} dados com ${pericia.bonus} de bônus.`;
      let teste = TestePericia(pericia.parentAtributo.valorTotal, pericia.valorTotal);
      setElement([...element, `${message1} ||| Você tirou ${teste}`]);
    }

    function checkCheckboxState() {
        character.atributos[1].pericias[1].bonusConectado.push(new BonusConectado(2));
        setState({});
    }

    function checkCheckboxStatea() {
        character.atributos[1].pericias[0].bonusConectado.push(new BonusConectado(2));
        setState({});
    }
  
    // #endregion

    return (
        <div className="teste">
            <aside className="sidebar">
                <div className="left-top">
                    {character.atributos && (
                        <>
                            {character.todosOsBonus.map((prop, index) => (
                            // {character.atributos[1].pericias[1].bonusConectado.map((prop, index) => (
                                <div key={index}>
                                    <prop.componente
                                        onChange={(checked) => {prop.handleCheckboxChange(checked);setState({});}}
                                        checked={prop.checked}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="left-bottom">
                    <button onClick={checkCheckboxState}>Check Checkbox State</button>
                    <button onClick={checkCheckboxStatea}>Check Checkbox State</button>
                    <Dropdown options={["Luta", "Acrobacia"]} onSelect={() => {console.log("oi")}}/>
                </div>
            </aside>

            <main className="main-content">

                {character.detalhes && (
                <div className="character-section div-character-detalhes">
                    <h2>{character.detalhes.classe}</h2>
                    <h1>{character.detalhes.nome}</h1>
                    <h2>{character.detalhes.nex}%</h2>
                </div>
                )}

                {character.estatisticas && (
                <div className="character-section div-character-estatisticas">
                    {character.estatisticas.map((estatistica, key) => (
                    <div key={`estatistica-${key}`} className="div-character-estatistica">
                        <h2>{estatistica.nomeDisplay}</h2>
                        <h3>{estatistica.valorAtual}/{estatistica.valorAtual}</h3>
                    </div>
                    ))}
                </div>
                )}

                {character.atributos && (
                <div className="character-section div-character-atributos">
                    {character.atributos.map((atributo, key) => (
                    <div key={`atributo-${key}`} className="div-character-atributo" style={{backgroundColor:atributo.color}}>
                        <h2>{atributo.nome} [{atributo.valorTotal}]</h2>
                        <div className={`div-character-atributo-pericia ${atributo.nome}`}>
                        {atributo.pericias?.map((pericia, key) => (
                            <div key={`pericia-${key}`} className="div-character-pericia">
                            <button onClick={() => {realizaTestePericia(pericia)}}>{pericia.nome}</button>
                            <h3>{pericia.valorTotal}</h3>
                            </div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
                )}

            </main>

            <aside className="right-sidebar">
                <div ref={scrollableRef}  className="messages">
                    {element.map((e, index) => (
                        <p key={`message-${index}`} className="testeMensagem fade">{e}</p>
                    ))}
                </div>
            </aside>
        </div>
    );
}

export default Ficha;