import useApi from "./Consumer.tsx";
import { RLJ_Ficha } from "udm-types";
import { Atributo, CharacterDetalhes, Estatistica, Pericia } from "Types/classes.tsx";
// import Singleton from "Types/Manager.tsx";

import { Character } from "Types/classes.tsx"

// class CustomApiCall extends Singleton<CustomApiCall> {
class CustomApiCall {
    public async fichaPronta(id: number): Promise<Character> {
        let newCharacter = {} as Character;

        await useApi<RLJ_Ficha>("/fichas/getFichaCharacter", { idCharacter: id }).then((data) => {
            const stats:Estatistica[] = [];
            data.dados.forEach((dado) => {
                stats.push(new Estatistica(dado.dado.nomeAbrev, dado.valorMaximo, dado.valor, 0));
            });

            const detalhes:CharacterDetalhes = new CharacterDetalhes(data.detalhes[0].nome, data.detalhes[0].classe.nome, data.detalhes[0].nivel);

            const attribs:Atributo[] = [];
            data.atributos.forEach((atrib) => {
                const newAttrib = new Atributo(atrib.atributo.id, atrib.atributo.idBuff, atrib.atributo.nomeAbrev, atrib.valor);
                data.patentesPericias.filter(patentePericia => patentePericia.pericia.idAtributo === newAttrib.id).forEach(patentePericia => {
                    newAttrib.addPericia(new Pericia(patentePericia.pericia.id, patentePericia.pericia.idBuff, patentePericia.pericia.nomeAbrev, (patentePericia.patente.id > 1 ? 5 : 0), newAttrib));
                });
                attribs.push(newAttrib);
            });

            newCharacter = new Character(stats, attribs, detalhes);
        });

        return newCharacter;
    }
}

export default CustomApiCall;