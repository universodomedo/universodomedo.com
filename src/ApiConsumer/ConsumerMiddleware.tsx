import useApi from "./Consumer.tsx";
import { FichaWithRelations } from "udm-types";
import { Atributo, CharacterDetalhes, Estatistica, Pericia } from "Types/classes.tsx";
// import Singleton from "Types/Manager.tsx";

import { Character } from "Types/classes.tsx"

// class CustomApiCall extends Singleton<CustomApiCall> {
class CustomApiCall {
    public async fichaPronta(id: number): Promise<Character> {
        let newCharacter = {} as Character;

        await useApi<FichaWithRelations>("/fichas/getFichaCharacter", { idCharacter: id }).then((data) => {
            const stats:Estatistica[] = [];
            data.stats.forEach((stat) => {
                stats.push(new Estatistica(stat.stat.name_abbre, stat.maxValue, stat.value, 0));
            });

            const detalhes:CharacterDetalhes = new CharacterDetalhes(data.detail.name, data.detail.role.name, data.detail.level);

            const attribs:Atributo[] = [];
            data.attributes.forEach((attrib) => {
                const newAttrib = new Atributo(attrib.attribute.id, attrib.attribute.idBuff, attrib.attribute.name_abbre, attrib.value);
                data.skillsRank.filter(skillRank => skillRank.skill.idAttribute === newAttrib.id).forEach(skillRankAtrib => {
                    newAttrib.addPericia(new Pericia(skillRankAtrib.skill.id, skillRankAtrib.skill.idBuff, skillRankAtrib.skill.name_abbre, (skillRankAtrib.rank.id > 1 ? 5 : 0), newAttrib));
                });
                attribs.push(newAttrib);
            });

            newCharacter = new Character(stats, attribs, detalhes);
        });

        return newCharacter;
    }
}

export default CustomApiCall;