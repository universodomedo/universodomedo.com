// #region Imports
import { RLJ_Ficha2 } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export const geraFicha = (dadosFicha: RLJ_Ficha2): RLJ_Ficha2 => {
    const ficha: RLJ_Ficha2 = {
        detalhes: {
            nome: dadosFicha.detalhes?.nome ?? 'TesteVazio',
            idClasse: dadosFicha.detalhes?.idClasse ?? 3,
            idNivel: dadosFicha.detalhes?.idNivel ?? 3,
        },
        estatisticasDanificaveis: SingletonHelper.getInstance().tipo_estatistica_danificavel.map((estatistica_danificavel) => {
            const estatisticaAtual = dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel_atual => estatistica_danificavel_atual.id === estatistica_danificavel.id);

            return {
                id: estatistica_danificavel.id,
                valorMaximo: Math.floor(estatisticaAtual?.valorMaximo!) ?? 1,
                valor: Math.floor(estatisticaAtual?.valor!) ?? 1,
            };
        }),
        estatisticasBuffaveis: SingletonHelper.getInstance().tipo_estatistica_buffavel.map((estatistica_buffavel) => {
            return {
                id: estatistica_buffavel.id,
                valor: dadosFicha.estatisticasBuffaveis?.find(estatisticaBuffavel => estatisticaBuffavel.id === estatistica_buffavel.id)?.valor ?? 1,
            };
        }),
        atributos: SingletonHelper.getInstance().atributos.map((atributo) => {
            return {
                id: atributo.id,
                valor: dadosFicha.atributos?.find(atributoAtual => atributoAtual.id === atributo.id)?.valor ?? 1,
            };
        }),
        periciasPatentes: SingletonHelper.getInstance().pericias.map((pericia) => {
            const periciaPatenteAtual = dadosFicha.periciasPatentes?.find(pericia_atual => pericia_atual.idPericia === pericia.id);

            return {
                idPericia: pericia.id,
                idPatente: periciaPatenteAtual?.idPatente ?? 1
            };
        }),
        rituais: dadosFicha.rituais ? dadosFicha.rituais : [],
        inventario: dadosFicha.inventario ? dadosFicha.inventario : [],
    };

    return ficha;
};