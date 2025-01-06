// #region Imports
import { getRandomVariance } from "udm-dice";
// #endregion

export function RollNumber(variancia:number) {
    const rnd = getRandomVariance(variancia);
    // console.log(`você foi prejudicado em ${rnd.variancia}`);
    return rnd;
    // Teste de Pericia -> Roda os valores, pega o maior, soma bonus
    // Aplicações -> Roda os valores, soma os valoes
}