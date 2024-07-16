import "./style.css";

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
    
    class Atributo {
        public nome:string;
        public valor:number;
    
        constructor(nome:string, valor:number) {
          this.nome = nome;
          this.valor = valor;
        }
    }
    
    class Pericia {
        public nome:string;
        public valorPatente:number;
        public valorBonus:number;
    
        constructor(nome:string, valorPatente:number, valorBonus:number) {
            this.nome = nome;
            this.valorPatente = valorPatente;
            this.valorBonus = valorBonus;
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
        public pericias:Pericia[];
        public detalhes:CharacterDetalhes;
    
        constructor(estatisticas:Estatistica[], atributos:Atributo[], pericias:Pericia[], detalhes:CharacterDetalhes) {
          this.estatisticas = estatisticas;
          this.atributos = atributos;
          this.pericias = pericias;
          this.detalhes = detalhes;
        }
    }
    
    const testeDetalhes:CharacterDetalhes = new CharacterDetalhes("Teste", "Mundano", 0);
    const testeEstatisticas:Estatistica[] = [new Estatistica("P.V.", 9, 9, 0), new Estatistica("P.S.", 7, 7, 0), new Estatistica("P.E.", 2, 2, 0)];
    const testeAtributos:Atributo[] = [new Atributo("Agilidade", 2), new Atributo("Força", 1), new Atributo("Inteligência", 1), new Atributo("Presença", 2), new Atributo("Vigor", 1)];
    const testePericias:Pericia[] = [new Pericia("Acrobacia", 0, 0), new Pericia("Crime", 0, 0), new Pericia("Furtividade", 0, 0), new Pericia("Iniciativa", 0, 0), new Pericia("Pontaria", 5, 0), new Pericia("Reflexo", 0, 0), new Pericia("Atletismo", 0, 0), new Pericia("Luta", 0, 0), new Pericia("Adestramento", 0, 0), new Pericia("Artes", 0, 0), new Pericia("Atualidades", 0, 0), new Pericia("Ciências", 0, 0), new Pericia("Engenharia", 0, 0), new Pericia("Investigação", 0, 0), new Pericia("Medicina", 0, 0), new Pericia("Ocultista", 0, 0), new Pericia("Sobrevivência", 0, 0), new Pericia("Tatica", 5, 0), new Pericia("Tecnologia", 0, 0), new Pericia("Diplomacia", 0, 0), new Pericia("Enganação", 0, 0), new Pericia("Intimidação", 0, 0), new Pericia("Intuição", 0, 0), new Pericia("Percepção", 0, 0), new Pericia("Vontade", 0, 0), new Pericia("Fortitude", 0, 0 )];
    const teste:Character = new Character(testeEstatisticas, testeAtributos, testePericias, testeDetalhes);
    
    return (
        <div className='teste'>
            <aside className="sidebar">
                
            </aside>
            <main className="main-content">
    
              <div className="character-section div-character-detalhes">
                <h1>{teste.detalhes.nome}</h1>
                <h1>{teste.detalhes.classe}</h1>
                <h1>{teste.detalhes.nex}%</h1>
              </div>
    
              <div className="character-section div-character-estatisticas">
                {teste.estatisticas.map((estatistica) => (
                  <div className="div-character-estatistica">
                    <h2>{estatistica.nomeDisplay}</h2>
                    <h3>{estatistica.valorAtual}/{estatistica.valorAtual}</h3>
                  </div>
                ))}
              </div>
    
              <div className="character-section div-character-atributos">
                {teste.atributos.map((atributo) => (
                  <div className="div-character-atributo">
                    <h2>{atributo.nome}</h2>
                    <h3>{atributo.valor}</h3>
                  </div>
                ))}
              </div>
    
              <div className="character-section div-character-pericias">
                {teste.pericias.map((pericia) => (
                  <div className="div-character-pericia">
                    <h2>{pericia.nome}</h2>
                    <h3>{pericia.valorBonus}</h3>
                  </div>
                ))}
              </div>
            </main>
            <aside className="right-sidebar">
    
            </aside>
        </div>
    )
}

export default Ficha;