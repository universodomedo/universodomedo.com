'use client';

import { FichaEmClient, J_DadosFichaEmJogo, ObjetoCache } from 'types-nora-api';

export function remontaFichaDeJogo(JDadosFichaEmJogo: J_DadosFichaEmJogo, cache: ObjetoCache): FichaEmClient {
    return {
        atributos: JDadosFichaEmJogo.atributos.map(atributoJ => {
            const atributo = cache.atributos.find(item => item.id === atributoJ.id);
            if (!atributo) throw new Error(`Atributo ID [${atributoJ.id}] não encontrado no cache`);

            return {
                atributo,
                valor: atributoJ.valor,
                valorTotal: atributoJ.valorTotal,
                detalhesValor: atributoJ.detalhesValor,
            };
        }),
        pericias: JDadosFichaEmJogo.pericias.map(periciaJ => {
            const pericia = cache.pericias.find(item => item.id === periciaJ.id);
            if (!pericia) throw new Error(`Perícia ID [${periciaJ.id}] não encontrada no cache`);

            const patentePericia = cache.patentesPericia.find(item => item.id === periciaJ.idPatente);
            if (!patentePericia) throw new Error(`Patente de Perícia ID [${periciaJ.idPatente}] não encontrada no cache`);

            return {
                pericia,
                patentePericia,
                valorEfeito: periciaJ.valorEfeito,
                valorTotal: periciaJ.valorTotal,
                detalhesValor: periciaJ.detalhesValor,
            };
        }),
        estatisticasDanificaveis: JDadosFichaEmJogo.estatisticasDanificaveis.map(estatisticaJ => {
            const estatisticaDanificavel = cache.estatisticasDanificaveis.find(item => item.id === estatisticaJ.id);
            if (!estatisticaDanificavel) throw new Error(`Estatística Danificável ID [${estatisticaJ.id}] não encontrada no cache`);

            return {
                estatisticaDanificavel,
                valorMaximo: estatisticaJ.valorMaximo,
            };
        }),
        detalhe: JDadosFichaEmJogo.detalhe,
        classe: (() => {
            const classe = cache.classes.find(item => item.id === JDadosFichaEmJogo.classe.id);
            if (!classe) throw new Error(`Classe ID [${JDadosFichaEmJogo.classe.id}] não encontrada no cache`);
            return classe;
        })(),
        detalhesUsoEvolucaoPericiasLivres: JDadosFichaEmJogo.detalhesUsoEvolucaoPericiasLivres,
    };
};