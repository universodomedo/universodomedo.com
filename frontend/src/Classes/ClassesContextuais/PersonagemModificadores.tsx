// #region Imports
import React, { createContext, useContext } from "react";

import { adicionaSinalEmNumeroParaExibicao, criarValoresEfeito, Duracao, Efeito, LinhaEfeito, Modificador, RegistroValorEfeito, TipoEfeito, ValoresEfeito, ValoresLinhaEfeito, ValoresLinhaEfeitoAgrupados } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas";
// #endregion

interface ClasseContextualPersonagemModificadoresProps {
    modificadores: Modificador[];
    obtemValorTotalComLinhaEfeito: (valorBase: number, idLinhaEfeito: number) => number;
    obterDetalhesPorLinhaEfeito: (idLinhaEfeito: number) => string[];
    valoresEfeitosEDetalhesPorLinhaEfeito: () => ValoresLinhaEfeito[];
};

export const PersonagemModificadores = createContext<ClasseContextualPersonagemModificadoresProps | undefined>(undefined);

export const PersonagemModificadoresProvider = ({ children }: { children: React.ReactNode; }) => {
    // tentar arrumar uma forma de mudar a logia de removeModificador, que atribui um novo valor a essa variavel, ent eu tenho q deixar como let
    const modificadores: Modificador[] = [];

    const agrupamentoDeEfeitosPorLinhaEfeito = (): { idLinhaEfeito: number, listaEfeitosNaLinha: { nomeModificador: string, tipoPaiModificador: string, efeito: Efeito }[] }[] => {
        const agrupados: { idLinhaEfeito: number, listaEfeitosNaLinha: { nomeModificador: string, tipoPaiModificador: string, efeito: Efeito }[] }[] = [];

        modificadores.forEach(modificador => {
            modificador.efeitos.forEach(efeito => {
                const idLinhaEfeito = efeito.refLinhaEfeito.id;

                let grupo = agrupados.find(g => g.idLinhaEfeito === idLinhaEfeito);

                if (!grupo) {
                    grupo = { idLinhaEfeito, listaEfeitosNaLinha: [] };
                    agrupados.push(grupo);
                }

                grupo.listaEfeitosNaLinha.push({ nomeModificador: modificador.nome, tipoPaiModificador: modificador.tipoRefPai, efeito: efeito });
            });
        });

        return agrupados;
    }

    const valoresEfeitosEDetalhesPorLinhaEfeito = (): ValoresLinhaEfeito[] => {
        const valores: ValoresLinhaEfeito[] = [];

        agrupamentoDeEfeitosPorLinhaEfeito().forEach(({ idLinhaEfeito, listaEfeitosNaLinha }) => {
            const listaValorBaseAdicional: RegistroValorEfeito[] = [];
            const listaPorcentagemAdicional: RegistroValorEfeito[] = [];
            const listaValorBonusAdicional: RegistroValorEfeito[] = [];

            [1, 2, 3].forEach(idTipoEfeito => {
                const agrupado = listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === idTipoEfeito);

                if (agrupado.length > 0) {
                    const maiorValorBaseAdicional = agrupado.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorBaseAdicional > maior.efeito.valoresEfeitos.valorBaseAdicional ? atual : maior, agrupado[0]);
                    if (maiorValorBaseAdicional.efeito.valoresEfeitos.valorBaseAdicional > 0) listaValorBaseAdicional.push({ tipoPai: maiorValorBaseAdicional.tipoPaiModificador, nomeRegistro: maiorValorBaseAdicional.nomeModificador, tipoValor: 'aumentando', valor: maiorValorBaseAdicional.efeito.valoresEfeitos.valorBaseAdicional });

                    const maiorPorcentagemAdicional = agrupado.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorPorcentagemAdicional > maior.efeito.valoresEfeitos.valorPorcentagemAdicional ? atual : maior, agrupado[0]);
                    if (maiorPorcentagemAdicional.efeito.valoresEfeitos.valorPorcentagemAdicional !== 0) listaPorcentagemAdicional.push({ tipoPai: maiorPorcentagemAdicional.tipoPaiModificador, nomeRegistro: maiorPorcentagemAdicional.nomeModificador, tipoValor: 'aumentando', valor: maiorPorcentagemAdicional.efeito.valoresEfeitos.valorPorcentagemAdicional });

                    const maiorValorBonusAdicional = agrupado.reduce((maior, atual) => atual.efeito.valoresEfeitos.valorBonusAdicional > maior.efeito.valoresEfeitos.valorBonusAdicional ? atual : maior, agrupado[0]);
                    if (maiorValorBonusAdicional.efeito.valoresEfeitos.valorBonusAdicional > 0) listaValorBonusAdicional.push({ tipoPai: maiorValorBonusAdicional.tipoPaiModificador, nomeRegistro: maiorValorBonusAdicional.nomeModificador, tipoValor: 'aumentando', valor: maiorValorBonusAdicional.efeito.valoresEfeitos.valorBonusAdicional });
                }
            });

            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 4).forEach(efeitos => {
                if (efeitos.efeito.valoresEfeitos.valorBaseAdicional > 0) listaValorBaseAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'aumentando', valor: efeitos.efeito.valoresEfeitos.valorBaseAdicional });

                if (efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional > 0) listaPorcentagemAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'aumentando', valor: efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional });

                if (efeitos.efeito.valoresEfeitos.valorBonusAdicional > 0) listaValorBonusAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'aumentando', valor: efeitos.efeito.valoresEfeitos.valorBonusAdicional });
            });

            listaEfeitosNaLinha.filter(efeitos => efeitos.efeito.refTipoEfeito.id === 5).forEach(efeitos => {
                if (efeitos.efeito.valoresEfeitos.valorBaseAdicional > 0) listaValorBaseAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'reduzindo', valor: efeitos.efeito.valoresEfeitos.valorBaseAdicional });
                if (efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional > 0) listaPorcentagemAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'reduzindo', valor: efeitos.efeito.valoresEfeitos.valorPorcentagemAdicional });
                if (efeitos.efeito.valoresEfeitos.valorBonusAdicional > 0) listaValorBonusAdicional.push({ tipoPai: efeitos.tipoPaiModificador, nomeRegistro: efeitos.nomeModificador, tipoValor: 'reduzindo', valor: efeitos.efeito.valoresEfeitos.valorBonusAdicional });
            });

            valores.push(new ValoresLinhaEfeito(idLinhaEfeito, new ValoresLinhaEfeitoAgrupados({ listaValorBaseAdicional, listaPorcentagemAdicional, listaValorBonusAdicional })));
        });

        return valores;
    }

    // const removeModificador = (modificador: IModificadorService) => { modificadores = modificadores.filter(modEquivalente => modEquivalente.codigoUnico !== modificador.codigoUnico); }
    const valoresEfeitoPorLinhaEfeito = (idLinhaEfeito: number): ValoresEfeito => {
        const valores = valoresEfeitosEDetalhesPorLinhaEfeito().find(info => info.refLinhaEfeito.id === idLinhaEfeito);

        return valores !== undefined ? criarValoresEfeito(valores.valoresEfeitos) : criarValoresEfeito({})
    }
    const detalhesPorLinhaEfeito = (idLinhaEfeito: number): string[] => { return valoresEfeitosEDetalhesPorLinhaEfeito().find(info => info.refLinhaEfeito.id === idLinhaEfeito)?.valoresEfeitos.listaValorBonusAdicional.map(bonus => `${bonus.nomeRegistro}: ${adicionaSinalEmNumeroParaExibicao(bonus.valor)}`) || []; }

    const obtemValorTotalComLinhaEfeito = (valorBase: number, idLinhaEfeito: number): number => {
        const valoresLinhaEfeito = valoresEfeitoPorLinhaEfeito(idLinhaEfeito);
        return Math.floor(valorBase + valoresLinhaEfeito.valorBonusAdicional!);
        // return Math.floor((valorBase + valoresLinhaEfeito.valorBaseAdicional) * (1 + (valoresLinhaEfeito.valorPorcentagemAdicional / 100))) + valoresLinhaEfeito.valorBonusAdicional;
    }

    const obterDetalhesPorLinhaEfeito = (idLinhaEfeito: number): string[] => {
        return detalhesPorLinhaEfeito(idLinhaEfeito);
    }

    return (
        <PersonagemModificadores.Provider value={{ modificadores, obtemValorTotalComLinhaEfeito, obterDetalhesPorLinhaEfeito, valoresEfeitosEDetalhesPorLinhaEfeito }}>
            {children}
        </PersonagemModificadores.Provider>
    );
}

export const useClasseContextualPersonagemModificadores = (): ClasseContextualPersonagemModificadoresProps => {
    const context = useContext(PersonagemModificadores);
    if (!context) throw new Error('useClasseContextualPersonagemModificadores precisa estar dentro de uma ClasseContextual de PersonagemModificadores');
    return context;
};