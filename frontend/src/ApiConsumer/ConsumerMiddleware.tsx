// #region Imports
import { RLJ_Ficha2 } from "Classes/ClassesTipos/index.ts";
import useApi from "./Consumer.tsx";
import { MDL_Habilidade, MDL_TipoDano, RLJ_Ficha } from "udm-types";
// #endregion

class CustomApiCall {
    public async obterFichaPersonagem(idPersonagem: number): Promise<void> {
    // public async obterFichaPersonagem(idPersonagem: number): Promise<RLJ_Ficha2> {
        // anteriormente, eu tava trazendo e passando para Personagem. Como agora eu uso direto o json, tem q testar antes de botar pra funcionar

        // await useApi<{ ficha: RLJ_Ficha, habilidades: MDL_Habilidade[] }>("/fichas/getFichaCharacter", { idCharacter: idPersonagem }).then((data) => {
        //     personagem = new Personagem(data.ficha);
        // });

        return ;
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