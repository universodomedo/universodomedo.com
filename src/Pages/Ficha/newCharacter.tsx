import { Estatistica, Atributo, CharacterDetalhes, Character } from "./classes.tsx";

const NewCharacter = () => {
    const testeDetalhes:CharacterDetalhes = new CharacterDetalhes("Teste", "Mundano", 0);
    const testeEstatisticas:Estatistica[] = [new Estatistica("P.V.", 9, 9, 0), new Estatistica("P.S.", 7, 7, 0), new Estatistica("P.E.", 2, 2, 0)];

    const atribAgi = new Atributo("Agilidade", 2, "#B6D7A8");
    atribAgi.addPericia("Acrobacia", 0);atribAgi.addPericia("Crime", 0); atribAgi.addPericia("Furtividade", 0); atribAgi.addPericia("Iniciativa", 0); atribAgi.addPericia("Pontaria", 5); atribAgi.addPericia("Reflexo", 0);

    const atribFor = new Atributo("Forca", 1, "#EA9999");
    atribFor.addPericia("Atletismo", 0);atribFor.addPericia("Luta", 0);

    const atribInt = new Atributo("Inteligencia", 1, "#6D9EEB");
    atribInt.addPericia("Adestramento", 0);atribInt.addPericia("Artes", 0);atribInt.addPericia("Atualidades", 0);atribInt.addPericia("Ciências", 0);atribInt.addPericia("Engenharia", 0);atribInt.addPericia("Investigação", 0);atribInt.addPericia("Medicina", 0);atribInt.addPericia("Ocultismo", 0);atribInt.addPericia("Sobrevivência", 0);atribInt.addPericia("Tatica", 5);atribInt.addPericia("Tecnologia", 0);

    const atribPre = new Atributo("Presenca", 2, "#8E7CC3");
    atribPre.addPericia("Diplomacia", 0);atribPre.addPericia("Enganação", 0);atribPre.addPericia("Intimidação", 0);atribPre.addPericia("Intuição", 0);atribPre.addPericia("Percepção", 0);atribPre.addPericia("Vontade", 0);

    const atribVig = new Atributo("Vigor", 1, "#FFD966");
    atribVig.addPericia("Fortitude", 0);

    const testeAtributos:Atributo[] = [atribAgi, atribFor, atribInt, atribPre, atribVig];

    return new Character(testeEstatisticas, testeAtributos, testeDetalhes);
}

export default NewCharacter;