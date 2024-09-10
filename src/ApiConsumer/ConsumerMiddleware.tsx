import useApi from "./Consumer.tsx";
import { MDL_Habilidade, MDL_TipoDano, RLJ_Ficha } from "udm-types";
// import Singleton from "Types/Manager.tsx";

import { Personagem } from "Types/classes.tsx"

// class CustomApiCall extends Singleton<CustomApiCall> {
class CustomApiCall {
    public async obterFichaPersonagem(idPersonagem:number): Promise<Personagem> {
        let personagem = {} as Personagem;

        await useApi<{ficha: RLJ_Ficha, habilidades: MDL_Habilidade[]}>("/fichas/getFichaCharacter", { idCharacter: idPersonagem }).then((data) => {
            personagem = new Personagem(data.ficha);
            // personagem = new Personagem(data.ficha, data.habilidades);
        });

        return personagem;
    }

    public async carregaBuffs(): Promise<void> {
        await useApi<MDL_TipoDano[]>("/fichas/getListaBuffs").then((data) => {
            
        });
    }
    
    public async carregaTiposDano(): Promise<MDL_TipoDano[]> {
        return await useApi<MDL_TipoDano[]>("/fichas/getListaTiposDano");
    }
}

export default CustomApiCall;