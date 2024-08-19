import "./style.css";
import NewCharacter from "./newCharacter.tsx";
import { useEffect, useState, useRef } from "react";
import { Character, Pericia, BonusConectado, listaBonus, valorBuffavel } from "Types/classes.tsx";
import { TestePericia } from "Components/Functions/RollNumber.tsx";
import Dropdown from 'Components/SubComponents/Dropdown/page.tsx';
import { useParams } from 'react-router-dom';
import TesteGridEfeitos from "Components/SubComponents/TesteGridEfeitos/page.tsx";
import TesteDesenhoMarca from "Components/SubComponents/TesteDesenhoMarca/page.tsx";

const Ficha = () => {
    // #region Variaveis Soltas
    const [character, setCharacter] = useState<Character>({} as Character);
    const [element, setElement] = useState([] as string[]);
    const [state, setState] = useState({});
    const scrollableRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<{ getSelectedOption: () => { id: number; descricao: string } | null }>(null);
    const valorBuffRef = useRef<HTMLSelectElement>(null);
    const descricaoBuffRef = useRef<HTMLInputElement>(null);
    const { characterId } = useParams<{ characterId: string }>();
    // #endregion

    // #region UseEffect
    useEffect(() => {
        const getCharacter = async () => {
            if (characterId) {
                const characterData = await NewCharacter(parseInt(characterId));
                setCharacter(characterData);
            }
        }

        getCharacter();
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
        if (!dropdownRef.current) return;

        const selectedOption = dropdownRef.current.getSelectedOption();

        if (!selectedOption) { console.log("Nenhuma Opção Selecionada"); return; }

        listaBonus.push(new BonusConectado(selectedOption.id, descricaoBuffRef.current!.value, selectedOption.descricao, parseInt(valorBuffRef.current?.value || '0', 10), ));
        setState({});
    }
    // #endregion

    return (
        <div className="teste">
            <aside className="sidebar">
                <div className="left-top">
                    {character.atributos && (
                        <>
                            {listaBonus.map((prop, index) => (
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
                    <div className="buff-refs1">
                        <button onClick={checkCheckboxState}>+</button>
                        <input ref={descricaoBuffRef} type="text" name="" id="" />
                    </div>
                    <div className="buff-refs2">
                        <Dropdown ref={dropdownRef} options={valorBuffavel.map((valor) => ({ id: valor.id, descricao: valor.descricao}))} onSelect={() => {}} />
                        <select ref={valorBuffRef}>
                            {[...Array(10).keys()].map((i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
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
                    <div key={`atributo-${key}`} className={`div-character-atributo ${atributo.nome}`}>
                        <h2>{atributo.nome} [{atributo.valorTotal}]</h2>
                        <div className={`div-character-atributo-pericia`}>
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

                <TesteGridEfeitos lista={listaBonus}/>
                <TesteDesenhoMarca />

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