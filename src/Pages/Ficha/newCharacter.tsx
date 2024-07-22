import { Estatistica, Atributo, CharacterDetalhes, Character } from "Types/classes.tsx";

const NewCharacter = () => {
    const testeDetalhes:CharacterDetalhes = new CharacterDetalhes("Teste", "Mundano", 0);
    const testeEstatisticas:Estatistica[] = [new Estatistica("P.V.", 9, 9, 0), new Estatistica("P.S.", 7, 7, 0), new Estatistica("P.E.", 2, 2, 0)];

    const atribAgi = new Atributo(1, "Agilidade", 2, "#B6D7A8");
    atribAgi.addPericia(6, "Acrobacia", 0);atribAgi.addPericia(12, "Crime", 0); atribAgi.addPericia(17, "Furtividade", 0); atribAgi.addPericia(18, "Iniciativa", 0); atribAgi.addPericia(26, "Pontaria", 5); atribAgi.addPericia(27, "Reflexo", 0);

    const atribFor = new Atributo(2, "Forca", 1, "#EA9999");
    atribFor.addPericia(9, "Atletismo", 0);atribFor.addPericia(22, "Luta", 0);

    const atribInt = new Atributo(3, "Inteligencia", 1, "#6D9EEB");
    atribInt.addPericia(7, "Adestramento", 0);atribInt.addPericia(8, "Artes", 0);atribInt.addPericia(10, "Atualidades", 0);atribInt.addPericia(11, "Ciências", 0);atribInt.addPericia(15, "Engenharia", 0);atribInt.addPericia(21, "Investigação", 0);atribInt.addPericia(23, "Medicina", 0);atribInt.addPericia(24, "Ocultismo", 0);atribInt.addPericia(28, "Sobrevivência", 0);atribInt.addPericia(29, "Tatica", 5);atribInt.addPericia(30, "Tecnologia", 0);

    const atribPre = new Atributo(4, "Presenca", 2, "#8E7CC3");
    atribPre.addPericia(13, "Diplomacia", 0);atribPre.addPericia(14, "Enganação", 0);atribPre.addPericia(19, "Intimidação", 0);atribPre.addPericia(20, "Intuição", 0);atribPre.addPericia(25, "Percepção", 0);atribPre.addPericia(31, "Vontade", 0);

    const atribVig = new Atributo(5, "Vigor", 1, "#FFD966");
    atribVig.addPericia(16, "Fortitude", 0);

    const testeAtributos:Atributo[] = [atribAgi, atribFor, atribInt, atribPre, atribVig];

    return new Character(testeEstatisticas, testeAtributos, testeDetalhes);
}

export default NewCharacter;