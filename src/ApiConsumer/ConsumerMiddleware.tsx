import useApi from "./Consumer.tsx";
import { MDL_TipoDano, RLJ_Ficha } from "udm-types";
import { Atributo, CharacterDetalhes, Pericia, Estatisticas, EstatisticaDanificavel, EstatisticaComum, ReducaoDano, TipoDano, listaTiposDano } from "Types/classes.tsx";
// import Singleton from "Types/Manager.tsx";

import { Personagem } from "Types/classes.tsx"

// class CustomApiCall extends Singleton<CustomApiCall> {
class CustomApiCall {
    public async fichaPronta(id: number): Promise<Personagem> {
        let newCharacter = {} as Personagem;

        await useApi<RLJ_Ficha>("/fichas/getFichaCharacter", { idCharacter: id }).then((data) => {
            const stats:Estatisticas = new Estatisticas;
            stats.estatisticasDanificaveis.push(new EstatisticaDanificavel("Pontos de Vida", 9, 9));
            stats.estatisticasDanificaveis.push(new EstatisticaDanificavel("Pontos de Sanidade", 6, 6));
            stats.estatisticasDanificaveis.push(new EstatisticaDanificavel("Pontos de Esforço", 3, 3));
            stats.estatisticasComuns.push(new EstatisticaComum("Defesa", 10));
            // data.dados.forEach((dado) => {
                // stats.push(new Estatistica(dado.dado.nomeAbrev, dado.valorMaximo, dado.valor, 0));
            // });

            const detalhes:CharacterDetalhes = new CharacterDetalhes(data.detalhe.nome, data.detalhe.classe.nome, data.detalhe.nivel.nex);

            const attribs:Atributo[] = [];
            data.atributos.forEach((atrib) => {
                const newAttrib = new Atributo(atrib.atributo.id, atrib.atributo.idBuff, atrib.atributo.nomeAbrev, atrib.valor);
                data.periciasPatentes.filter(periciaPatente => periciaPatente.pericia.idAtributo === newAttrib.id).forEach(patentePericia => {
                    newAttrib.addPericia(new Pericia(patentePericia.pericia.id, patentePericia.pericia.idBuff, patentePericia.pericia.nomeAbrev, (patentePericia.patente.id > 1 ? 5 : 0), newAttrib));
                });
                attribs.push(newAttrib);
            });

            const rds:ReducaoDano[] = [];
            data.reducoesDano.forEach((rd) => {
                const tipoDano = listaTiposDano.find(tipoDano => tipoDano.id === rd.idTipoDano)!;
                rds.push(new ReducaoDano(tipoDano, rd.valor));
            });

            newCharacter = new Personagem(stats, attribs, detalhes, rds);
        });

        return newCharacter;
    }

    public async carregaBuffs(): Promise<void> {
        await useApi<MDL_TipoDano[]>("/fichas/getListaBuffs").then((data) => {
            
        });
    }
    
    public async carregaTiposDano(): Promise<void> {
        await useApi<MDL_TipoDano[]>("/fichas/getListaTiposDano").then((data) => {
            listaTiposDano.length = 0;
            data.map((tipoDano) => {
                listaTiposDano.push(tipoDano);
            })
        });
    }
}

export default CustomApiCall;