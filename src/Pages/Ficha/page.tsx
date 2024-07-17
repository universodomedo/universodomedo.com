import { useEffect, useRef, useState } from "react";
import "./style.css";
import { TestePericia } from "Components/Functions/RollNumber.tsx";

const Ficha = () => {

    class Estatistica {
        public nomeDisplay:string;
        public valorMaximo:number;
        public valorAtual:number;
        public valorTemp:number;
    
        constructor(nomeDisplay:string, valorMaximo:number, valorAtual:number, valorTemp:number) {
          this.nomeDisplay = nomeDisplay;
          this.valorMaximo = valorMaximo;
          this.valorAtual = valorAtual;
          this.valorTemp = valorTemp;
        }
    }

    class Pericia {
        public nome:string;
        public valorPatente:number;
        public valorBonus:number;
        public parentAtributo: Atributo;
    
        constructor(nome:string, valorPatente:number, valorBonus:number, parentAtributo: Atributo) {
            this.nome = nome;
            this.valorPatente = valorPatente;
            this.valorBonus = valorBonus;
            this.parentAtributo = parentAtributo;
        }

        get valorPericia(): number {
          return this.valorPatente + this.valorBonus;
      }
    }

    class Atributo {
      public nome:string;
      public valor:number;
      public color:string;
      public pericias:Pericia[];

      constructor(nome:string, valor:number, color:string) {
        this.nome = nome;
        this.valor = valor;
        this.color = color;
        this.pericias = [];
      }

      addPericia = (nome:string, valorPatente:number, valorBonus:number) => {
        this.pericias.push(new Pericia(nome, valorPatente, valorBonus, this));
      }
    }
    
    class CharacterDetalhes {
        public nome:string;
        public classe:string;
        public nex:number;
    
        constructor(nome:string, classe:string, nex:number) {
            this.nome = nome;
            this.classe = classe;
            this.nex = nex;
        }
    }
    
    class Character {
        public estatisticas:Estatistica[];
        public atributos:Atributo[];
        public detalhes:CharacterDetalhes;
    
        constructor(estatisticas:Estatistica[], atributos:Atributo[], detalhes:CharacterDetalhes) {
          this.estatisticas = estatisticas;
          this.atributos = atributos;
          this.detalhes = detalhes;
        }
    }

    const [characterTeste, setCharacterTeste] = useState<Character>({} as Character);

    useEffect(() => {
      const characterTeste = async () => {
        const testeDetalhes:CharacterDetalhes = new CharacterDetalhes("Teste", "Mundano", 0);
        const testeEstatisticas:Estatistica[] = [new Estatistica("P.V.", 9, 9, 0), new Estatistica("P.S.", 7, 7, 0), new Estatistica("P.E.", 2, 2, 0)];
    
        const atribAgi = new Atributo("Agilidade", 2, "#B6D7A8");
        atribAgi.addPericia("Acrobacia", 0, 0);atribAgi.addPericia("Crime", 0, 0); atribAgi.addPericia("Furtividade", 0, 0); atribAgi.addPericia("Iniciativa", 0, 0); atribAgi.addPericia("Pontaria", 5, 0); atribAgi.addPericia("Reflexo", 0, 0);
    
        const atribFor = new Atributo("Forca", 1, "#EA9999");
        atribFor.addPericia("Atletismo", 0, 0);atribFor.addPericia("Luta", 0, 0);
    
        const atribInt = new Atributo("Inteligencia", 1, "#6D9EEB");
        atribInt.addPericia("Adestramento", 0, 0);atribInt.addPericia("Artes", 0, 0);atribInt.addPericia("Atualidades", 0, 0);atribInt.addPericia("Ciências", 0, 0);atribInt.addPericia("Engenharia", 0, 0);atribInt.addPericia("Investigação", 0, 0);atribInt.addPericia("Medicina", 0, 0);atribInt.addPericia("Ocultismo", 0, 0);atribInt.addPericia("Sobrevivência", 0, 0);atribInt.addPericia("Tatica", 5, 0);atribInt.addPericia("Tecnologia", 0, 0);
    
        const atribPre = new Atributo("Presenca", 2, "#8E7CC3");
        atribPre.addPericia("Diplomacia", 0, 0);atribPre.addPericia("Enganação", 0, 0);atribPre.addPericia("Intimidação", 0, 0);atribPre.addPericia("Intuição", 0, 0);atribPre.addPericia("Percepção", 0, 0);atribPre.addPericia("Vontade", 0, 0);
    
        const atribVig = new Atributo("Vigor", 1, "#FFD966");
        atribVig.addPericia("Fortitude", 0, 0);
    
        const testeAtributos:Atributo[] = [atribAgi, atribFor, atribInt, atribPre, atribVig];

        setCharacterTeste(new Character(testeEstatisticas, testeAtributos, testeDetalhes));
      };

      characterTeste();
    }, []);

    const [element, setElement] = useState([] as string[]);
    const scrollableRef = useRef<HTMLDivElement>(null);

    function realizaTestePericia(pericia:Pericia) {
      const message1 = `Você realizou um teste da Perícia ${pericia.nome}: ${pericia.parentAtributo.valor} dados com ${pericia.valorPericia} de bônus.`;
      let teste = TestePericia(pericia.parentAtributo.valor, pericia.valorPericia);
      setElement([...element, `${message1} ||| Você tirou ${teste}`]);
    }

    useEffect(() => {
      const scrollableDiv = scrollableRef.current;
      if (scrollableDiv) 
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }, [element]);

    return (
        <div className='teste'>
            <aside className="sidebar">
                <input type="checkbox" name="" id="checktest" />
            </aside>
            <main className="main-content">
    
              {characterTeste.detalhes && (
                <div className="character-section div-character-detalhes">
                  <h2>{characterTeste.detalhes.classe}</h2>
                  <h1>{characterTeste.detalhes.nome}</h1>
                  <h2>{characterTeste.detalhes.nex}%</h2>
                </div>
              )}

              {characterTeste.estatisticas && (
                <div className="character-section div-character-estatisticas">
                  {characterTeste.estatisticas.map((estatistica, key) => (
                    <div key={`estatistica-${key}`} className="div-character-estatistica">
                      <h2>{estatistica.nomeDisplay}</h2>
                      <h3>{estatistica.valorAtual}/{estatistica.valorAtual}</h3>
                    </div>
                  ))}
                </div>
              )}
              
              {characterTeste.atributos && (
                <div className="character-section div-character-atributos">
                  {characterTeste.atributos.map((atributo, key) => (
                    <div key={`atributo-${key}`} className="div-character-atributo" style={{backgroundColor:atributo.color}}>
                      <h2>{atributo.nome} [{atributo.valor}]</h2>
                      <div className={`div-character-atributo-pericia ${atributo.nome}`}>
                        {atributo.pericias?.map((pericia, key) => (
                          <div key={`pericia-${key}`} className="div-character-pericia">
                            {/* <h2>{pericia.nome}</h2> */}
                            <button onClick={() => {realizaTestePericia(pericia)}}>{pericia.nome}</button>
                            <h3>{pericia.valorPericia}</h3>
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
    )
}

export default Ficha;